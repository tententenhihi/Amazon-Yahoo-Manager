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

export default class ProductYahooController {
    static async uploadProductYahooNow(req, res) {
        let response = new Response(res);
        try {
            let { ids, yahoo_account_id } = req.body;
            let user_id = req.user._id;

            let results = [];
            let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
            if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
                let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    for (const product_id of ids) {
                        let productYahooData = await ProductYahooService.findOne({ _id: product_id });
                        let dataUpdate = {};
                        let descrionUpload = await ProductGlobalSettingService.getDescriptionByYahooAccountId(
                            yahooAccount.user_id,
                            yahooAccount._id,
                            yahooAccount.yahoo_id,
                            productYahooData.description,
                            productYahooData.note
                        );
                        let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(
                            yahooAccount.cookie,
                            productYahooData,
                            proxyResult.data,
                            descrionUpload
                        );
                        console.log(' ###  uploadAuctionResult: ', uploadAuctionResult);
                        dataUpdate.upload_status = uploadAuctionResult.status;
                        dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
                        dataUpdate.aID = uploadAuctionResult.aID;
                        if (uploadAuctionResult.status === 'SUCCESS') {
                            dataUpdate.listing_status = 'UNDER_EXHIBITION';
                            dataUpdate.thumbnail = uploadAuctionResult.thumbnail;
                            await ProductYahooAuctionService.create({ ...productYahooData._doc, ...dataUpdate });
                        }
                        await ProductYahooService.update(productYahooData._id, dataUpdate);

                        let message = '出品に成功しました';
                        if (uploadAuctionResult.status === 'ERROR') {
                            message = uploadAuctionResult.statusMessage;
                        }
                        let newResult = {
                            product_created: productYahooData.created,
                            product_id: productYahooData._id,
                            product_aID: uploadAuctionResult.aID,
                            message,
                            created: Date.now(),
                            success: uploadAuctionResult.status === 'SUCCESS',
                        };
                        results.push(newResult);
                    }
                } else {
                    return response.error400({
                        message: 'Proxy die',
                    });
                }
            }

            if (results && results.length > 0) {
                let newCronHistory = {
                    success_count: results.filter((item) => item.success).length,
                    error_count: results.length - results.filter((item) => item.success).length,
                    detail: results,
                    user_id: user_id,
                    yahoo_account_id: yahoo_account_id,
                };
                await CronHistoryModel.create(newCronHistory);
            }

            return response.success200({ results });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async checkCategory(req, res) {
        let response = new Response(res);
        try {
            let { category_id } = req.body;
            let category = await CategoryYahooService.findOne({ id: category_id });
            return response.success200({ category });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let { yahoo_account_id } = req.params;
            let products = await ProductYahooService.get(user._id, yahoo_account_id);
            return response.success200({ products });
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

            if (
                !payload.folder_id ||
                !payload.product_yahoo_title ||
                !payload.yahoo_auction_category_id ||
                !payload.description ||
                !payload.location ||
                !payload.import_price
            ) {
                return response.error400({ message: '必須フィールドをすべて入力してください' });
            }

            let yahooAccount = await AccountYahooService.findById(payload.yahoo_account_id);
            if (!yahooAccount || yahooAccount.auction_point <= 10) {
                payload.quantity = 1;
            }

            let data = {
                user_id: user._id,
                images: [],
                ...payload,
            };

            if (req.files && payload.image_length) {
                for (let index = 0; index < payload.image_length; index++) {
                    const element = req.files[`image-` + index];
                    data.images.push(await UploadFile(element, { disk: 'yahoo-products/' + user._id + '/' }));
                }
            } else {
                return response.error400({ message: '画像は必須です' });
            }
            let result = await ProductYahooService.create(data);
            response.success200({ result });
        } catch (error) {
            console.log(error);
            console.log(error.response);

            response.error500(error);
        }
    }

    static async getDetailProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
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
            const { _id } = req.params;
            let payload = JSON.parse(req.body.payload);

            let yahooAccount = await AccountYahooService.findById(payload.yahoo_account_id);
            if (!yahooAccount || yahooAccount.auction_point <= 10) {
                payload.quantity = 1;
            }

            let data = {
                user_id: user._id,
                ...payload,
            };
            if (req.files && payload.image_length) {
                for (let index = 0; index < payload.image_length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'yahoo-products/' + user._id + '/' });
                    }
                }
            }
            let result = await ProductYahooService.update(_id, data);
            response.success200({ result });
        } catch (error) {
            console.log(error);
            console.log(error.response);

            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async switchWatchOption(req, res) {
        let response = new Response(res);
        try {
            const { ids, type, value } = req.body;
            const TYPES = ['watch_stock', 'watch_profit', 'watch_only_prime'];
            const VALUES = ['0', '1'];
            if (!TYPES.includes(type) || !VALUES.includes(value)) {
                return response.error400('更新失敗!');
            }
            let res = await ProductYahooService.switchWatchOption(ids, type, value);
            if (res) {
                return response.success200({ success: res });
            }
        } catch (error) {
            response.error500(error);
        }
    }
    static async setImageOverlay(req, res) {
        let response = new Response(res);
        try {
            const { ids, selectedImageIndex } = req.body;
            let res = await ProductYahooService.setImageOverlay(ids, selectedImageIndex);
            if (res) {
                return response.success200({ success: res });
            }
        } catch (error) {
            response.error500(error);
        }
    }
    static async changeProductFolder(req, res) {
        let response = new Response(res);
        try {
            const { ids, folder_id } = req.body;
            let res = await ProductYahooService.changeProductFolder(ids, folder_id);
            if (res) {
                return response.success200({ success: res });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async deleteMultipleProduct(req, res) {
        let response = new Response(res);
        try {
            const { ids } = req.body;
            for (let index = 0; index < ids.length; index++) {
                const _id = ids[index];
                await ProductYahooService.delete(_id);
            }
            return response.success200({ success: true });
        } catch (error) {
            response.error500(error);
        }
    }
}
