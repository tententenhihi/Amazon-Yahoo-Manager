import ProductYahooModel from '../models/ProductYahooModel';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import AccountYahooService from '../services/AccountYahooService';
import ProxyService from '../services/ProxyService';
import AuctionYahooService from '../services/AuctionYahooService';
import fs from 'fs';
import fsExtra from 'fs-extra';
import mongoose from 'mongoose';
import ProductYahooAuctionService from './ProductYahooAuctionService';
import ProductGlobalSettingService from './ProductGlobalSettingService';
import ProductInfomationDefaultService from './ProductInfomationDefaultService';
import CategoryService from './CategoryService';
import moment from 'moment';
const SellingPartnerAPI = require('amazon-sp-api');
import Utils from '../utils/Utils';
import ProductAmazonService from './ProductAmazonService';
import config from 'config';
import ProductYahooAuctionModel from '../models/ProductYahooAuction';
import ApiKeyController from '../controllers/ApiKeyController';

var isCalendarUploading = false;

const getPriceProductAmazon = async (asin, user_id) => {
    let REFRESH_TOKEN = config.get('REFRESH_TOKEN');
    let SELLING_PARTNER_APP_CLIENT_ID = config.get('SELLING_PARTNER_APP_CLIENT_ID');
    let SELLING_PARTNER_APP_CLIENT_SECRET = config.get('SELLING_PARTNER_APP_CLIENT_SECRET');
    let AWS_SELLING_PARTNER_ROLE = config.get('AWS_SELLING_PARTNER_ROLE');
    let AWS_ACCESS_KEY_ID = config.get('AWS_ACCESS_KEY_ID');
    let AWS_SECRET_ACCESS_KEY = config.get('AWS_SECRET_ACCESS_KEY');
    try {
        try {
            if (user_id) {
                let apiKey = await ApiKeyController.getApiKeyByUser(user_id);
                if (apiKey && apiKey.is_amz && apiKey.REFRESH_TOKEN && apiKey.SELLING_PARTNER_APP_CLIENT_ID && apiKey.SELLING_PARTNER_APP_CLIENT_SECRET && apiKey.AWS_SELLING_PARTNER_ROLE && apiKey.AWS_ACCESS_KEY_ID && apiKey.AWS_SECRET_ACCESS_KEY) {
                    REFRESH_TOKEN = apiKey.REFRESH_TOKEN;
                    SELLING_PARTNER_APP_CLIENT_ID = apiKey.SELLING_PARTNER_APP_CLIENT_ID;
                    SELLING_PARTNER_APP_CLIENT_SECRET = apiKey.SELLING_PARTNER_APP_CLIENT_SECRET;
                    AWS_SELLING_PARTNER_ROLE = apiKey.AWS_SELLING_PARTNER_ROLE;
                    AWS_ACCESS_KEY_ID = apiKey.AWS_ACCESS_KEY_ID;
                    AWS_SECRET_ACCESS_KEY = apiKey.AWS_SECRET_ACCESS_KEY;
                }
            }
        } catch (error) {
            console.log(' ### Keepa ApiKeyController.getApiKeyByUser: ', error);
        }
        let sellingPartner = new SellingPartnerAPI({
            region: 'fe', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
            refresh_token: REFRESH_TOKEN, // The refresh token of your app user
            credentials: {
                SELLING_PARTNER_APP_CLIENT_ID,
                SELLING_PARTNER_APP_CLIENT_SECRET,
                AWS_SELLING_PARTNER_ROLE,
                AWS_ACCESS_KEY_ID,
                AWS_SECRET_ACCESS_KEY,
            },
            options: {
                auto_request_tokens: true,
            },
        });
        let res = await sellingPartner.callAPI({
            operation: 'getItemOffers',
            endpoint: 'productPricing',
            query: {
                MarketplaceId: 'A1VC38T7YXB528',
                ItemCondition: 'New',
            },
            path: {
                Asin: asin,
            },
            options: {
                version: 'v0',
            },
        });
        // console.log(' ######### res: ', res);
        if (res && res.status === 'Success') {
            if (res.Offers && res.Offers.length > 0) {
                let offer = res.Offers[0];
                return {
                    price: offer.ListingPrice.Amount,
                    count: 1,
                    ship_fee: offer.Shipping ? offer.Shipping.Amount : 0,
                };
            } else {
                return {
                    count: 0,
                };
            }
        }
        if (res.Offers && res.Offers.length === 0) {
            return {
                count: 0,
            };
        }
        return null;
        // console.log(res2);
    } catch (error) {
        console.log(' ### Error getPriceProductAmazon: ', error);
        return null;
    }
};
export default class ProductYahooService {
    static async getPriceAndCountByAmazon(asin, user_id) {
        return await getPriceProductAmazon(asin, user_id);
    }
    static async checkStopUpload(productYahooData, defaultSetting) {
        let resultData = {};

        let checkKeepa = false;
        let newProductData = null;
        // Kiểm tra hết hàng
        // 1. Check trong DB
        let productAmazonInDB = await ProductAmazonService.findOne({ asin: productYahooData.asin_amazon });
        if (productAmazonInDB) {
            // checkDate
            let dateProduct = new Date(productAmazonInDB.created);
            let dateNow = new Date();
            dateProduct.setHours(dateProduct.getHours() + 24);
            if (dateProduct < dateNow) {
                checkKeepa = true;
            }
            newProductData = productAmazonInDB;
        }
        // 2. Check Keepa
        if (checkKeepa) {
            newProductData = await getPriceProductAmazon(productYahooData.asin_amazon, defaultSetting.user_id);
            if (newProductData && productAmazonInDB) {
                // update product yahoo
                newProductData = await ProductAmazonService.update(productAmazonInDB._id, { ...newProductData, created: Date.now() });
            }
        }
        if (newProductData) {
            // Update data yahoo
            await ProductYahooService.update(productYahooData._id, { import_price: newProductData.price, amazon_shipping_fee: newProductData.ship_fee, count: newProductData.count });
            if (newProductData.count === 0) {
                resultData = {
                    isStopUpload: true,
                };
                resultData.message = '在庫なし';
                console.log(' ================ Dừng xuất hàng. Sản phẩm đã hết hàng =============== ');
            } else {
                if (productYahooData.is_user_change) {
                    // Giá ship tự set
                    if (productYahooData.ship_fee1) {
                        defaultSetting.yahoo_auction_shipping = productYahooData.ship_fee1;
                    }
                    resultData = await this.checkProfitToStopUpload(defaultSetting, newProductData.price, newProductData.ship_fee, productYahooData.start_price);
                } else {
                    resultData = await this.checkProfitToStopUpload(defaultSetting, newProductData.price, newProductData.ship_fee);
                }

                if (resultData && resultData.import_price) {
                    await ProductYahooService.update(productYahooData._id, resultData);
                }
                if (resultData.isStopUpload) {
                    resultData.message = '低利益';
                    console.log(' ================ Dừng xuất hàng. Sản phẩm lợi nhuận thấp =============== ');
                }
            }
        }
        return resultData;
    }
    static async checkProfitToStopUpload(defaultSetting, import_price, amazon_shipping_fee = 0, start_price_user_input = 0) {
        let dataprofit = await this.calculatorPrice(defaultSetting, import_price, amazon_shipping_fee, start_price_user_input);
        if (dataprofit.actual_profit <= defaultSetting.profit_stop) {
            return {
                isStopUpload: true,
                ...dataprofit,
            };
        }
        return {
            isStopUpload: false,
            ...dataprofit,
        };
    }
    static async calculatorPrice(defaultSetting, import_price = 0, amazon_shipping_fee = 0, start_price_user_input = 0) {
        import_price = parseInt(import_price);
        amazon_shipping_fee = parseInt(amazon_shipping_fee);
        start_price_user_input = parseInt(start_price_user_input);

        //Tỷ suất lơi nhuận
        let profitPersent = '';
        for (let i = 0; i < defaultSetting.list_profit.length; i++) {
            const item_profile = defaultSetting.list_profit[i];
            if (import_price < item_profile.price) {
                if (i == 0) {
                    profitPersent = defaultSetting.list_profit[i].persent_profit;
                    break;
                } else {
                    profitPersent = defaultSetting.list_profit[i - 1].persent_profit;
                    break;
                }
                break;
            }
            if (i === defaultSetting.list_profit.length - 1) {
                profitPersent = defaultSetting.list_profit[i].persent_profit;
                break;
            }
        }
        //Phí gửi ở yahoo
        let ship_fee_yahoo = defaultSetting.yahoo_auction_shipping;
        //Phí giao dịch ở yahoo
        let fee_auction_yahoo = 0.1; // 10% default
        //Giá sản phẩm bán
        let price = 0;
        //Giá khởi điểm (Nếu tính là <= 0 thì để là 1)
        let start_price = 0;
        //Số tiền nhận về
        let amount_received = 0;
        //Lợi nhuận gộp
        let gross_profit = 0;
        //Lợi nhuận thực tế
        let actual_profit = 0;
        //Giá mua luôn
        let bid_or_buy_price = 0;
        // Nguyên giá
        let original_price = import_price + amazon_shipping_fee;

        // Tiền người mua trả
        let amount_buyer_paid = 0;
        // bid_or_buy_price = defaultSetting.yahoo_auction_bid_price;

        if (profitPersent.endsWith('%')) {
            profitPersent = profitPersent.replace('%', '');
            profitPersent = parseFloat(profitPersent.toString().trim());
            profitPersent = profitPersent / 100;
            price = parseInt(import_price / (1 - profitPersent - fee_auction_yahoo));
        } else if (profitPersent.startsWith('\\')) {
            profitPersent = profitPersent.replace('\\', '');
            profitPersent = parseInt(profitPersent.toString().trim());
            price = parseInt((original_price + profitPersent) / (1 - fee_auction_yahoo));
        }

        if (start_price_user_input) {
            start_price = start_price_user_input;
        } else {
            start_price = price - ship_fee_yahoo;
        }

        if (start_price <= 0) {
            start_price = 1;
        }
        amount_buyer_paid = start_price + ship_fee_yahoo;
        amount_received = amount_buyer_paid - parseInt(price * fee_auction_yahoo);
        actual_profit = amount_received - original_price;
        bid_or_buy_price = start_price + defaultSetting.yahoo_auction_bid_price;

        return {
            import_price,
            price,
            start_price,
            bid_or_buy_price,
            amount_received,
            gross_profit,
            actual_profit,
            original_price,
            ship_fee1: ship_fee_yahoo,
        };
    }
    static async find(data) {
        try {
            let result = await ProductYahooModel.find(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async get(idUser, yahoo_account_id) {
        try {
            let result = await ProductYahooModel.find({ user_id: idUser, yahoo_account_id }).sort({ created: -1 });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async create(data) {
        try {
            let product = await ProductYahooModel.create(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findOne(data) {
        try {
            let product = await ProductYahooModel.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductYahooModel.findOneAndUpdate({ _id: _id }, data, { new: true });
            if (product) {
                return product._doc;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductYahooModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            } else {
                return product._doc;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async delete(productId) {
        try {
            let product = await ProductYahooModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            } else {
                if (product.product_amazon_id) {
                    let productAmazon = await ProductAmazonSchema.findById(product.product_amazon_id);
                    if (productAmazon) {
                        productAmazon.folder_id = '';
                        await productAmazon.save();
                    }
                }
                await product.remove();
                for (let index = 0; index < product.imageslength; index++) {
                    const element = product.images[index];
                    try {
                        fs.unlinkSync('uploads/' + element);
                    } catch (error) {
                        console.log(error);
                    }
                }
                return true;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    static async setImageOverlay(ids, selectedImageIndex) {
        try {
            for (let index = 0; index < ids.length; index++) {
                const id = ids[index];
                let product = await ProductYahooModel.findById(id);
                if (!product) {
                    throw new Error('Product not found');
                } else {
                    product.yahoo_account_id = mongoose.Types.ObjectId(product.yahoo_account_id);
                    product.image_overlay_index = selectedImageIndex;
                    await product.save();
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    static async switchWatchOption(ids, type, value) {
        try {
            for (let index = 0; index < ids.length; index++) {
                const id = ids[index];
                let product = await ProductYahooModel.findById(id);
                if (!product) {
                    throw new Error('Product not found');
                } else {
                    product[type] = value;
                    product.yahoo_account_id = mongoose.Types.ObjectId(product.yahoo_account_id);
                    await product.save();
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    static async changeProductFolder(ids, folder_id) {
        try {
            for (let index = 0; index < ids.length; index++) {
                const id = ids[index];
                let product = await ProductYahooModel.findById(id);
                if (!product) {
                    throw new Error('Product not found');
                } else {
                    product.folder_id = mongoose.Types.ObjectId(folder_id);
                    product.yahoo_account_id = mongoose.Types.ObjectId(product.yahoo_account_id);
                    await product.save();
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    static async startUploadProductInListFolderId(user_id, yahoo_account_id, new_list_target_folder) {
        console.log(' ######### Start Cron Upload Sản phẩm trong folder: ', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
        console.log(' ### yahoo_account_id: ', yahoo_account_id);
        console.log(' ### new_list_target_folder: ', new_list_target_folder);
        let totalProduct = 0;
        let result = [];
        let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
        if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS' && !yahooAccount.is_error && yahooAccount.count_error < 3000) {
            let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
            if (proxyResult.status === 'SUCCESS') {
                while (isCalendarUploading) {
                    console.log('  isCalendarUploading: ', isCalendarUploading);
                    await Utils.sleep(5000);
                }

                let defaultSetting = await ProductInfomationDefaultService.findOne({ yahoo_account_id, user_id });

                for (const folder_id of new_list_target_folder) {
                    console.log(' ######## folder_id: ', folder_id);
                    let listProduct = await ProductYahooModel.find({ user_id, yahoo_account_id, folder_id });
                    console.log(' ######## listProduct: ', listProduct.length);
                    totalProduct += listProduct.length;
                    for (let index = 0; index < listProduct.length; index++) {
                        let newResult = null;
                        let productYahooData = listProduct[index];

                        try {
                            let dataUpdate = {};

                            let resultCheckUpload = await this.checkStopUpload(productYahooData, defaultSetting);

                            if (resultCheckUpload.isStopUpload) {
                                newResult = {
                                    product_created: productYahooData.created,
                                    product_id: productYahooData._id,
                                    product_aID: '',
                                    message: resultCheckUpload.message,
                                    created: Date.now(),
                                    success: false,
                                };
                            } else {
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

                                let descrionUpload = await ProductGlobalSettingService.getDescriptionByYahooAccountId(yahooAccount.user_id, yahooAccount._id, yahooAccount.yahoo_id, productYahooData.description, productYahooData.note);

                                let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, productYahooData, proxyResult.data, descrionUpload);
                                console.log(' ### uploadAuctionResult: ', uploadAuctionResult);
                                // console.log(' ### startUploadProductInListFolderId uploadAuctionResult: ', uploadAuctionResult);
                                dataUpdate.upload_status = uploadAuctionResult.status;
                                dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
                                dataUpdate.aID = uploadAuctionResult.aID;

                                if (uploadAuctionResult.status === 'SUCCESS') {
                                    dataUpdate.listing_status = 'UNDER_EXHIBITION';
                                    dataUpdate.thumbnail = uploadAuctionResult.thumbnail;
                                    let newProductYahooAuction = { ...productYahooData._doc, ...dataUpdate };
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
                                    }
                                }
                                newResult = {
                                    product_created: productYahooData.created,
                                    product_id: productYahooData._id,
                                    product_aID: uploadAuctionResult.aID,
                                    message: message,
                                    created: Date.now(),
                                    success: uploadAuctionResult.status === 'SUCCESS',
                                };
                            }
                        } catch (error) {
                            newResult = {
                                product_created: productYahooData.created,
                                product_id: productYahooData._id,
                                product_aID: '',
                                message: error.message,
                                created: Date.now(),
                                success: false,
                            };
                        }

                        result.push(newResult);
                    }
                }
            }
        }
        console.log(' ######## Total product: ', totalProduct);
        return result;
    }

    static async startUploadProductByCalendar(user_id, yahoo_account_id, calendar_target_folder) {
        isCalendarUploading = true;
        try {
            console.log(' ############# Start Cron job Uploa Sản phẩm theo Calendar: ', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
            let result = [];
            //Get day of month
            let today = new Date();
            today = today.getDate();

            if (calendar_target_folder.length >= today) {
                let folder_id = calendar_target_folder[today - 1];
                if (folder_id) {
                    let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
                    if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS' && !yahooAccount.is_error && yahooAccount.count_error < 3000) {
                        let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                        if (proxyResult.status === 'SUCCESS') {
                            let defaultSetting = await ProductInfomationDefaultService.findOne({ yahoo_account_id, user_id });
                            let listProduct = await ProductYahooModel.find({ user_id, yahoo_account_id, folder_id });
                            for (let index = 0; index < listProduct.length; index++) {
                                let productYahooData = listProduct[index];
                                let dataUpdate = {};

                                let resultCheckUpload = await this.checkStopUpload(productYahooData, defaultSetting);

                                if (resultCheckUpload.isStopUpload) {
                                    let newResult = {
                                        product_created: productYahooData.created,
                                        product_id: productYahooData._id,
                                        product_aID: '',
                                        message: resultCheckUpload.message,
                                        created: Date.now(),
                                        success: false,
                                    };
                                    result.push(newResult);
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

                                let descrionUpload = await ProductGlobalSettingService.getDescriptionByYahooAccountId(yahooAccount.user_id, yahooAccount._id, yahooAccount.yahoo_id, productYahooData.description, productYahooData.note);

                                let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, productYahooData, proxyResult.data, descrionUpload);
                                console.log(' ### uploadAuctionResult: ', uploadAuctionResult);

                                // console.log(' ### startUploadProductByCalendar uploadAuctionResult: ', uploadAuctionResult);
                                dataUpdate.upload_status = uploadAuctionResult.status;
                                dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
                                dataUpdate.aID = uploadAuctionResult.aID;
                                if (uploadAuctionResult.status === 'SUCCESS') {
                                    dataUpdate.listing_status = 'UNDER_EXHIBITION';

                                    let newProductYahooAuction = { ...productYahooData._doc, ...dataUpdate };
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
                                    }
                                }
                                let newResult = {
                                    product_created: productYahooData.created,
                                    product_id: productYahooData._id,
                                    product_aID: uploadAuctionResult.aID,
                                    message: message,
                                    created: Date.now(),
                                    success: uploadAuctionResult.status === 'SUCCESS',
                                };
                                result.push(newResult);
                            }
                        }
                    }
                }
            }
            isCalendarUploading = false;
            return result;
        } catch (error) {
            isCalendarUploading = false;
            console.log(' #### Error startUploadProductByCalendar: ', error);
        }
    }

    static async startReSubmitProduct(user_id, yahoo_account_id) {
        console.log(' ######### Start Cron job ReSubmit - Upload lại sản phẩm: ', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
        // console.log(' ### new_list_target_folder: ', listAid);

        let result = [];
        let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
        if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS' && !yahooAccount.is_error && yahooAccount.count_error < 3000) {
            let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
            if (proxyResult.status === 'SUCCESS') {
                let defaultSetting = await ProductInfomationDefaultService.findOne({ yahoo_account_id, user_id });
                let listProductFinished = await AuctionYahooService.getProductAuctionFinished(yahooAccount.cookie, proxyResult.data);
                let listProductEnded = await AuctionYahooService.getProductAuctionEnded('', yahooAccount.cookie, proxyResult.data, true);
                let listProductResubmit = [...listProductFinished, ...listProductEnded];
                listProductResubmit = listProductFinished.filter((item) => {
                    if (!item.idBuyer || item.idBuyer.trim() === '') {
                        return true;
                    }
                    let date = item.time_end.replace('月', '|').replace('日', '|').replace('時', '|').replace('分', '');
                    date = date.split('|');
                    let month = date[0];
                    let day = date[1];
                    let hours = date[2];
                    let minute = date[3];
                    let now = new Date();
                    let dateString = now.getFullYear() + '/' + month + '/' + day + ' ' + hours + ':' + minute;
                    let dateItem = new Date(dateString);
                    now.setDate(now.getDate() - 1);
                    if (dateItem >= now) {
                        return true;
                    }
                    return false;
                });
                console.log(' ########## listProductResubmit: ', listProductResubmit);
                // return;
                for (const product of listProductResubmit) {
                    let newDataUpload = null;
                    let productYahooData = null;
                    let productAuction = await ProductYahooAuctionModel.findOne({ aID: product.aID });
                    if (!productAuction) {
                        let regex = product.title.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
                        productAuction = await ProductYahooAuctionModel.findOne({
                            product_yahoo_title: { $regex: regex },
                        });
                    }
                    if (productAuction) {
                        productYahooData = await ProductYahooModel.findOne({ asin_amazon: productAuction.asin_amazon, yahoo_account_id });
                        if (productYahooData) {
                            let resultCheckUpload = await this.checkStopUpload(productYahooData, defaultSetting);
                            if (resultCheckUpload.isStopUpload) {
                                result.push({
                                    product_created: productYahooData.created,
                                    product_id: productYahooData ? productYahooData._id : null,
                                    product_aID: product.aID,
                                    message: resultCheckUpload.message,
                                    created: Date.now(),
                                    success: false,
                                });
                                continue;
                            } else {
                                let descrionUpload = await ProductGlobalSettingService.getDescriptionByYahooAccountId(yahooAccount.user_id, yahooAccount._id, yahooAccount.yahoo_id, productYahooData.description, productYahooData.note);
                                newDataUpload = {
                                    ...productYahooData._doc,
                                    ...resultCheckUpload,
                                    description: descrionUpload,
                                };
                            }
                        }
                    }
                    let uploadAuctionResult = await AuctionYahooService.reSubmit(yahooAccount.cookie, proxyResult.data, product.aID, newDataUpload);
                    console.log(' ######### uploadAuctionResult: ', uploadAuctionResult);

                    // Đối với sp có người bán. sẽ trả về aID mới nên cần tạo map cho n
                    if (product.idBuyer && uploadAuctionResult.status === 'SUCCESS' && newDataUpload) {
                        delete newDataUpload._id;
                        await ProductYahooAuctionService.create({ ...newDataUpload, aID: uploadAuctionResult.aID });
                    }

                    let message = product.idBuyer ? '再出品に成功しました（落札あり）' : '再出品に成功しました（落札なし）';
                    if (uploadAuctionResult.status === 'ERROR') {
                        message = uploadAuctionResult.statusMessage;
                    }

                    let newResult = {
                        product_created: Date.now(),
                        product_id: productYahooData ? productYahooData._id : null,
                        product_aID: uploadAuctionResult.aID,
                        message: message,
                        created: Date.now(),
                        success: uploadAuctionResult.status === 'SUCCESS',
                    };
                    result.push(newResult);
                }
                console.log(' ======= DONE ======== ');
            }
        }
        return result;
    }

    static async createFromAmazonProduct(productAmazon, user_id, yahoo_account_id) {
        console.log(' ### createFromAmazonProduct: ', productAmazon);
        //Dùng cate amazon Check xem có trong mapping k
        let cateAmazon = await CategoryService.findOne({ amazon_cate_id: productAmazon.category_id, user_id: user_id });
        console.log(' ######## cateAmazon: ', cateAmazon);
        console.log(' ######## productAmazon.category_id: ', productAmazon.category_id);

        if (!cateAmazon) {
            cateAmazon = await CategoryService.create({
                amazon_cate_id: productAmazon.category_id,
                asin: productAmazon.asin,
                user_id: user_id,
            });
        }
        let cate_yahoo = cateAmazon.yahoo_cate_id || null;

        // Cắt title
        let title = productAmazon.name;
        if (title && title.length > 65) {
            title = title.substring(0, 65);
        }

        // Data default
        let defaultSetting = await ProductInfomationDefaultService.findOne({ yahoo_account_id, user_id });

        //Giá sản phẩm gốc
        let import_price = productAmazon.price;

        let dataCalculatorProduct = await this.calculatorPrice(defaultSetting, import_price, productAmazon.ship_fee);
        // console.log(" ########### dataCalculatorProduct: ", dataCalculatorProduct);

        let productYahoo = {
            ...defaultSetting._doc,
            ship_fee1_temp: defaultSetting.yahoo_auction_shipping,
            bid_or_buy_price_temp: dataCalculatorProduct.bid_or_buy_price,
            start_price_temp: dataCalculatorProduct.start_price,
            quantity_temp: defaultSetting.quantity,

            import_price: productAmazon.price,
            ...dataCalculatorProduct,
            id_category_amazon: productAmazon.category_id,
            description: productAmazon.description,
            asin_amazon: productAmazon.asin,
            images: productAmazon.images,
            product_amazon_id: productAmazon._id,
            count: productAmazon.count,
            amazon_shipping_fee: productAmazon.ship_fee,
            // ship_fee1: defaultSetting.yahoo_auction_shipping,
            user_id: user_id,
            product_yahoo_title: title,
            yahoo_account_id: yahoo_account_id,
            product_model: 'AMAZON',
            yahoo_auction_category_id: cate_yahoo,
            created: Date.now(),
            listing_status: 'NOT_LISTED',
            image_overlay_index: null,
        };

        delete productYahoo._id;
        delete productYahoo.ship_fee1;
        delete productYahoo.quantity;
        delete productYahoo.start_price;
        delete productYahoo.bid_or_buy_price;

        let checkExistProductYahoo = await ProductYahooModel.findOne({
            user_id: user_id,
            yahoo_account_id: yahoo_account_id,
            asin_amazon: productAmazon.asin,
        });
        if (checkExistProductYahoo) {
            await ProductYahooModel.findByIdAndUpdate(checkExistProductYahoo._id, {
                import_price: productAmazon.price,
                id_category_amazon: productAmazon.category_id,
                description: productAmazon.description,
                product_amazon_id: productAmazon._id,
                count: productAmazon.count,
                amazon_shipping_fee: productAmazon.ship_fee,
            });
        } else {
            let newProduct = new ProductYahooModel(productYahoo);
            //Download image;
            let newImages = [];
            for (let i = 0; i < productAmazon.images.length; i++) {
                const imageLink = productAmazon.images[i];
                let saveFolder = 'uploads/yahoo-products/' + newProduct._id;
                let saveImage = 'yahoo-products/' + newProduct._id + '/image-' + i + '.jpg';
                await fsExtra.ensureDirSync(saveFolder);
                let check = await Utils.downloadFile(imageLink, 'uploads/' + saveImage);
                if (check) {
                    newImages.push(saveImage);
                }
            }
            newProduct.images = newImages;
            await newProduct.save();
        }

        // await ProductYahooService.create(productYahoo);
    }

    static async UpdateCalculatorPrice(defaultSetting) {
        let listProduct = await ProductYahooModel.find({
            user_id: defaultSetting.user_id,
            yahoo_account_id: defaultSetting.yahoo_account_id,
        });
        for (let productYahoo of listProduct) {
            // Product chưa đc user change
            if (!productYahoo.is_user_change) {
                //Giá sản phẩm gốc
                let import_price = productYahoo.import_price;
                let amazon_shipping_fee = productYahoo.amazon_shipping_fee;

                let dataCalculatorProduct = await this.calculatorPrice(defaultSetting, import_price, amazon_shipping_fee);
                delete defaultSetting._id;

                let dataUpdate = {
                    ...productYahoo._doc,
                    ...defaultSetting,
                    // ...dataCalculatorProduct,
                    _id: productYahoo._id,
                    created: productYahoo.created,
                    ship_fee1_temp: defaultSetting.yahoo_auction_shipping,
                    bid_or_buy_price_temp: dataCalculatorProduct.bid_or_buy_price,
                    start_price_temp: dataCalculatorProduct.start_price,
                    quantity_temp: defaultSetting.quantity,
                };
                delete dataUpdate._id;
                delete dataUpdate.ship_fee1;
                delete dataUpdate.quantity;

                // console.log(' ########## dataUpdate: ', dataUpdate);
                await this.update(productYahoo._id, dataUpdate);
            }
        }
    }
}
