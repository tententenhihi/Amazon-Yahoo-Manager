import Response from '../utils/Response';
import ProductYahooService from '../services/ProductYahooService';
import UploadFile from '../helpers/UploadFile';
import CategoryYahooService from '../services/CategoryYahooService';
import AccountYahooService from '../services/AccountYahooService';
import ProxyService from '../services/ProxyService';
import AuctionYahooService from '../services/AuctionYahooService';
import ProductYahooAuctionService from '../services/ProductYahooAuctionService';
import CronHistoryModel from '../models/CronHistoryModel';
import ProductGlobalSettingService from '../services/ProductGlobalSettingService';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';
import CategoryService from '../services/CategoryService';
import Fs from 'fs';
import Path from 'path';
import SocketIOService from '../services/SocketIOService';


const updateProductWithCaculatorProfit = async (dataUpdate, files, isCreateifNotExist) => {
    let current_product = await ProductYahooService.findOne({
        _id: dataUpdate._id,
        yahoo_account_id: dataUpdate.yahoo_account_id
    });
    if (!current_product && isCreateifNotExist) {
        if (!dataUpdate.import_price) {
            dataUpdate.import_price = 0
        }
        current_product = await ProductYahooService.create(dataUpdate);
        let listImage = [];
        let pathImageSource = Path.join('uploads', 'yahoo-products', dataUpdate.oldId.toString());
        let pathImageDist = Path.join('yahoo-products', current_product._id.toString());
        if (!Fs.existsSync(Path.join('uploads', pathImageDist))) {
            Fs.mkdirSync(Path.join('uploads', pathImageDist), {
                recursive: true
            })
        }
        let countImage = Fs.readdirSync(pathImageSource);
        for (const image of countImage) {
            listImage.push(Path.join(pathImageDist, image));
            Fs.copyFileSync(Path.join(pathImageSource, image), Path.join('uploads', pathImageDist, image))
        }
        current_product.images = listImage;
        await current_product.save();
    }
    // console.log(' #### current_product:', current_product);
    // return;
    let defaultSetting = await ProductInfomationDefaultService.findOne({
        yahoo_account_id: current_product.yahoo_account_id,
        user_id: current_product.user_id,
    });
    let temp_start_price = false;
    let temp_bid_or_buy_price = false;
    let temp_ship_fee1 = false;

    if (defaultSetting) {
        if (!dataUpdate.ship_fee1) {
            dataUpdate.ship_fee1_temp = defaultSetting.quantity;
            dataUpdate.ship_fee1 = null;
            temp_ship_fee1 = true;
        } else {
            defaultSetting.yahoo_auction_shipping = dataUpdate.ship_fee1;
        }
        if (!dataUpdate.quantity) {
            dataUpdate.quantity_temp = defaultSetting.quantity;
            dataUpdate.quantity = null;
        }
        if (!dataUpdate.start_price) {
            dataUpdate.start_price = null;
            temp_start_price = true;
        }
        if (!dataUpdate.bid_or_buy_price) {
            dataUpdate.bid_or_buy_price = null;
            temp_bid_or_buy_price = true;
        }
    }

    if (!dataUpdate.yahoo_auction_category_id) {
        let cateAmazon = await CategoryService.findOne({
            amazon_cate_id: current_product.id_category_amazon
        });
        if (cateAmazon) {
            dataUpdate.yahoo_auction_category_id = cateAmazon.yahoo_cate_id;
        }
    }

    let yahooAccount = await AccountYahooService.findById(current_product.yahoo_account_id);

    if (dataUpdate.quantity && (!yahooAccount || yahooAccount.auction_point <= 10)) {
        dataUpdate.quantity = 1;
    }
    if (files && dataUpdate.image_length) {
        for (let index = 0; index < dataUpdate.image_length; index++) {
            const element = files[`image-` + index];
            if (element) {
                dataUpdate.images[index] = await UploadFile(element, {
                    disk: 'yahoo-products/' + yahooAccount.user_id + '/'
                });
            }
        }
    }

    if (dataUpdate.product_yahoo_title.length && dataUpdate.product_yahoo_title.length > 65) {
        dataUpdate.product_yahoo_title = dataUpdate.product_yahoo_title.substring(0, 65);
    }

    dataUpdate.is_user_change = true;

    let dataPrice = await ProductYahooService.calculatorPrice(
        defaultSetting, current_product.import_price, current_product.amazon_shipping_fee,
        dataUpdate.start_price, dataUpdate.ship_fee1, dataUpdate.bid_or_buy_price
    );

    if (dataUpdate.bid_or_buy_price) {
        dataPrice.bid_or_buy_price = dataUpdate.bid_or_buy_price;
    }
    dataUpdate = {
        ...dataUpdate,
        ...dataPrice,
    };
    if (temp_start_price) {
        dataUpdate.start_price_temp = dataUpdate.start_price;
        dataUpdate.start_price = null;
    }
    if (temp_bid_or_buy_price) {
        dataUpdate.bid_or_buy_price_temp = dataUpdate.bid_or_buy_price;
        dataUpdate.bid_or_buy_price = null;
    }
    if (temp_ship_fee1) {
        dataUpdate.ship_fee1_temp = dataUpdate.ship_fee1;
        dataUpdate.ship_fee1 = null;
    }
    let result = await ProductYahooService.update(current_product._id, dataUpdate);

    return result;
};

export default class ProductYahooController {
    static async updateDataCSV(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let {
                listProduct,
                yahoo_account_id
            } = req.body;
            if (listProduct) {
                setTimeout(async () => {
                    let listResult = [];
                    SocketIOService.emitData(user._id, {
                        type: 'LOCAL',
                        isLoading: true,
                    });
                    let index = 1;
                    for (let data of listProduct) {
                        SocketIOService.emitData(user._id, {
                            type: 'LOCAL',
                            isLoading: true,
                            progress: index,
                            total: listProduct.length,
                        });
                        try {
                            let current_product = await ProductYahooService.findByID(data._id);
                            data.yahoo_account_id = yahoo_account_id;
                            if (!current_product || current_product.yahoo_account_id != yahoo_account_id) {
                                data.oldId = data._id;
                                // Data default
                                delete data.user_id;
                                delete data._id;
                                data.user_id = user._id;
                                let newData = await updateProductWithCaculatorProfit(data, null, true);
                                listResult.push(newData);
                            } else {
                                let newData = await updateProductWithCaculatorProfit(data);
                                listResult.push(newData);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                        index++;
                    }

                    SocketIOService.emitData(user._id, {
                        type: 'LOCAL',
                        isLoading: false,
                    });
                }, 1)

                return response.success200({});
            } else {
                return response.error400({
                    message: '更新失敗'
                });
            }
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async uploadProductYahooNow(req, res) {
        let response = new Response(res);
        try {
            let {
                ids,
                yahoo_account_id
            } = req.body;
            let user_id = req.user._id;
            let is_lock_account = await AccountYahooService.checkAccountYahoo_Lock(yahoo_account_id);
            if (is_lock_account) {
                return response.error400({
                    message: 'ヤフーアカウントが機能しない '
                });
            }
            let results = [];
            let yahooAccount = await AccountYahooService.findOne({
                _id: yahoo_account_id
            });
            if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS' && !yahooAccount.is_error && yahooAccount.count_error < 3000) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let defaultSetting = await ProductInfomationDefaultService.findOne({
                        yahoo_account_id,
                        user_id
                    });

                    for (const product_id of ids) {
                        let productYahooData = await ProductYahooService.findOne({
                            _id: product_id
                        });
                        let resultCheckUpload = await ProductYahooService.checkStopUpload(productYahooData, defaultSetting);
                        if (resultCheckUpload.isStopUpload) {
                            let newResult = {
                                product_created: productYahooData.created,
                                product_id: productYahooData._id,
                                product_aID: '',
                                message: resultCheckUpload.message,
                                created: Date.now(),
                                success: false,
                            };
                            results.push(newResult);
                            continue;
                        }

                        if (!productYahooData.start_price) {
                            productYahooData.start_price = resultCheckUpload.start_price;
                        }

                        if (!productYahooData.bid_or_buy_price) {
                            productYahooData.bid_or_buy_price = resultCheckUpload.bid_or_buy_price;
                        }

                        if (!productYahooData.quantity) {
                            productYahooData.quantity = defaultSetting.quantity;
                        }

                        if (!productYahooData.ship_fee1) {
                            productYahooData.ship_fee1 = resultCheckUpload.ship_fee1;
                        }

                        let dataUpdate = {};
                        let descrionUpload = await ProductGlobalSettingService.getDescriptionByYahooAccountId(yahooAccount.user_id, yahooAccount._id, yahooAccount.yahoo_id, productYahooData.description, productYahooData.note);
                        let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, productYahooData, proxyResult.data, descrionUpload);
                        dataUpdate.upload_status = uploadAuctionResult.status;
                        dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
                        dataUpdate.aID = uploadAuctionResult.aID;
                        if (uploadAuctionResult.status === 'SUCCESS') {
                            dataUpdate.listing_status = 'UNDER_EXHIBITION';
                            dataUpdate.thumbnail = uploadAuctionResult.thumbnail;
                            let newProductYahooAuction = {
                                ...productYahooData._doc,
                                ...dataUpdate
                            };
                            delete newProductYahooAuction._id;
                            await ProductYahooAuctionService.create(newProductYahooAuction);
                        }
                        await ProductYahooService.update(productYahooData._id, dataUpdate);

                        let message = '出品に成功しました';
                        if (uploadAuctionResult.status === 'ERROR') {
                            message = uploadAuctionResult.statusMessage;
                            if (message === 'ヤフーアカウントのエラー') {
                                yahooAccount.is_error = true;
                                await yahooAccount.save();
                            } else if (uploadAuctionResult.isBreak) {
                                yahooAccount.count_error = 3000;
                                await yahooAccount.save();
                            }

                        }
                        if (uploadAuctionResult.status === 'SUCCESS' && !uploadAuctionResult.aID) {
                            message = '仮出品とは、出品手続きされたオークションを、Yahoo! JAPANが確認させていただくためのものです。';
                        }
                        let newResult = {
                            product_created: productYahooData.created,
                            product_id: productYahooData._id,
                            product_aID: uploadAuctionResult.aID,
                            message: message,
                            created: Date.now(),
                            success: uploadAuctionResult.status === 'SUCCESS',
                        };
                        results.push(newResult);
                        if (uploadAuctionResult.isBreak) {
                            break;
                        }
                    }
                } else {
                    return response.error400({
                        message: 'プロキシが壊れた',
                    });
                }
            } else {
                return response.error400({
                    message: 'ヤフーアカウントのエラー',
                });
            }

            if (results && results.length > 0) {
                let newCronHistory = {
                    success_count: results.filter((item) => item.success).length,
                    error_count: results.length - results.filter((item) => item.success).length,
                    detail: results,
                    user_id: user_id,
                    yahoo_account_id: yahoo_account_id,
                };
                await AccountYahooService.setUpCountError(yahoo_account_id, newCronHistory.error_count);
                await CronHistoryModel.create(newCronHistory);
            }

            return response.success200({
                results
            });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async checkCategory(req, res) {
        let response = new Response(res);
        try {
            let {
                category_id
            } = req.body;
            let category = await CategoryYahooService.findOne({
                id: category_id
            });
            return response.success200({
                category
            });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {
                yahoo_account_id
            } = req.params;
            let products = await ProductYahooService.get(user._id, yahoo_account_id);
            return response.success200({
                products
            });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async createProduct(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let payload = JSON.parse(req.body.payload);

            if (!payload.folder_id || !payload.product_yahoo_title || !payload.yahoo_auction_category_id || !payload.description || !payload.location || !payload.import_price) {
                return response.error400({
                    message: '必須フィールドをすべて入力してください'
                });
            }

            let yahooAccount = await AccountYahooService.findById(payload.yahoo_account_id);
            if (!yahooAccount || yahooAccount.auction_point <= 10) {
                payload.quantity = 1;
            }

            let data = {
                ...payload,
                user_id: user._id,
                images: [],
                created: Date.now(),
            };
            delete data._id;

            if (req.files && payload.image_length) {
                for (let index = 0; index < payload.image_length; index++) {
                    const element = req.files[`image-` + index];
                    data.images.push(await UploadFile(element, {
                        disk: 'yahoo-products/' + user._id + '/'
                    }));
                }
            } else {
                return response.error400({
                    message: '画像は必須です'
                });
            }

            let defaultSetting = await ProductInfomationDefaultService.findOne({
                yahoo_account_id: payload.yahoo_account_id,
                user_id: user._id,
            });

            if (defaultSetting) {
                if (!data.ship_fee1) {
                    data.ship_fee1 = defaultSetting.yahoo_auction_shipping;
                }
                if (!data.quantity) {
                    data.quantity = defaultSetting.quantity;
                }
                if (!data.start_price) {
                    data.start_price = 0;
                }
                if (!data.bid_or_buy_price) {
                    data.bid_or_buy_price = 0;
                }
            }

            if (data.product_yahoo_title.length && data.product_yahoo_title.length > 65) {
                data.product_yahoo_title = product_yahoo_title.substring(0, 65);
            }
            let dataPrice = await ProductYahooService.calculatorPrice(defaultSetting, data.import_price, data.amazon_shipping_fee, data.start_price);
            if (data.bid_or_buy_price) {
                dataPrice.bid_or_buy_price = data.bid_or_buy_price;
            }
            data = {
                ...data,
                ...dataPrice
            };
            let result = await ProductYahooService.create(data);
            response.success200({
                result
            });
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async getDetailProduct(req, res) {
        let response = new Response(res);
        try {
            const {
                _id
            } = req.params;
            let result = await ProductYahooService.show(_id);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            const {
                _id
            } = req.params;
            let payload = JSON.parse(req.body.payload);
            if (payload.yahoo_auction_category_id) {
                let checkCateRight = await CategoryYahooService.findOne({
                    id: payload.yahoo_auction_category_id
                });
                if (!checkCateRight) {
                    return response.error400({
                        message: 'カテゴリーのエラー'
                    });
                }
            }
            let result = await updateProductWithCaculatorProfit({
                _id,
                ...payload
            }, req.files);
            response.success200({
                result
            });
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const {
                _id
            } = req.params;
            let result = await ProductYahooService.delete(_id);
            if (result) {
                response.success200({
                    success: true
                });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async switchWatchOption(req, res) {
        let response = new Response(res);
        try {
            const {
                ids,
                type,
                value
            } = req.body;
            const TYPES = ['watch_stock', 'watch_profit', 'watch_only_prime'];
            const VALUES = ['0', '1'];
            if (!TYPES.includes(type) || !VALUES.includes(value)) {
                return response.error400('更新失敗!');
            }
            let res = await ProductYahooService.switchWatchOption(ids, type, value);
            if (res) {
                return response.success200({
                    success: res
                });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async setImageOverlay(req, res) {
        let response = new Response(res);
        try {
            const {
                ids,
                selectedImageIndex
            } = req.body;
            let res = await ProductYahooService.setImageOverlay(ids, selectedImageIndex);
            if (res) {
                return response.success200({
                    success: res
                });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async changeProductFolder(req, res) {
        let response = new Response(res);
        try {
            const {
                ids,
                folder_id
            } = req.body;
            let res = await ProductYahooService.changeProductFolder(ids, folder_id);
            if (res) {
                return response.success200({
                    success: res
                });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async deleteMultipleProduct(req, res) {
        let response = new Response(res);
        try {
            const {
                ids
            } = req.body;
            for (let index = 0; index < ids.length; index++) {
                const _id = ids[index];
                try {
                    await ProductYahooService.delete(_id);
                } catch (error) { }
            }
            return response.success200({
                success: true
            });
        } catch (error) {
            response.error500(error);
        }
    }
}