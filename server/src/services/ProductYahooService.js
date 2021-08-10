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

import Utils from '../utils/Utils';
var isCalendarUploading = false;

export default class ProductYahooService {
    static async checkProfitToStopUpload(defaultSetting, import_price, amazon_shipping_fee) {
        let dataprofit = await this.calculatorPrice(defaultSetting, import_price, amazon_shipping_fee);
        if (dataprofit.actual_profit <= defaultSetting.profit_stop) {
            return true;
        }
        return false;
    }
    static async calculatorPrice(defaultSetting, import_price, amazon_shipping_fee) {
        //Tỷ suất lơi nhuận
        let profitPersent = '';
        for (let i = 0; i < defaultSetting.list_profit.length; i++) {
            const item_profile = defaultSetting.list_profit[i];
            if (item_profile.price < import_price) {
                if (i == 0) {
                    profitPersent = defaultSetting.list_profit[i].persent_profit;
                } else {
                    profitPersent = defaultSetting.list_profit[i - 1].persent_profit;
                }
                break;
            }
            if (i === defaultSetting.list_profit.length - 1) {
                profitPersent = defaultSetting.list_profit[i].persent_profit;
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
        if (profitPersent.endsWith('%')) {
            profitPersent = profitPersent.replace('%', '');
            profitPersent = parseFloat(profitPersent.toString().trim());
            profitPersent = profitPersent / 100;
            price = parseInt(import_price / (1 - profitPersent - fee_auction_yahoo));

            start_price = price - ship_fee_yahoo;
            if (start_price <= 0) {
                start_price = 1;
            }

            amount_received = price - parseInt(price * fee_auction_yahoo);

            gross_profit = price - original_price;

            actual_profit = gross_profit - parseInt(price * fee_auction_yahoo);

            bid_or_buy_price = price + defaultSetting.yahoo_auction_bid_price;
        } else if (profitPersent.startsWith('\\')) {
            profitPersent = profitPersent.replace('\\', '');
            profitPersent = parseInt(profitPersent.toString().trim());

            price = parseInt((import_price + profitPersent + amazon_shipping_fee + ship_fee_yahoo) * (1 + fee_auction_yahoo));

            start_price = price - ship_fee_yahoo;
            if (start_price <= 0) {
                start_price = 1;
            }

            amount_received = price - parseInt((import_price + profitPersent + amazon_shipping_fee + ship_fee_yahoo) * fee_auction_yahoo);

            gross_profit = price - original_price;

            actual_profit = gross_profit - ship_fee_yahoo - parseInt((import_price + profitPersent + amazon_shipping_fee + ship_fee_yahoo) * fee_auction_yahoo);

            bid_or_buy_price = price + defaultSetting.yahoo_auction_bid_price;
        }

        return {
            import_price,
            price,
            start_price,
            bid_or_buy_price,
            amount_received,
            gross_profit,
            actual_profit,
            original_price,
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
            let result = await ProductYahooModel.find({ user_id: idUser, yahoo_account_id });
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
            return product._doc;
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
        console.log(Date.now());

        console.log(' ######### Start Cron job: startUploadProductInListFolderId ');
        console.log(' ### yahoo_account_id: ', yahoo_account_id);
        console.log(' ### new_list_target_folder: ', new_list_target_folder);

        let result = [];
        let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
        if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
            let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
            if (proxyResult.status === 'SUCCESS') {
                while (isCalendarUploading) {
                    console.log('  isCalendarUploading: ', isCalendarUploading);
                    await Utils.sleep(5000);
                }

                let defaultSetting = await ProductInfomationDefaultService.findOne({ yahoo_account_id, user_id });

                for (const folder_id of new_list_target_folder) {
                    let listProduct = await ProductYahooModel.find({ user_id, yahoo_account_id, folder_id, listing_status: 'NOT_LISTED' });

                    for (let index = 0; index < listProduct.length; index++) {
                        const productYahooData = listProduct[index];
                        let dataUpdate = {};

                        let isStopUpload = false;

                        if (productYahooData.is_user_change) {
                            let price = productYahooData.start_price + defaultSetting.yahoo_auction_shipping;
                            let gross_profit = price - productYahooData.original_price;
                            let actual_profit = gross_profit - defaultSetting.yahoo_auction_shipping;
                            console.log(' ############# actual_profit: ', actual_profit);
                            if (actual_profit <= defaultSetting.profit_stop) {
                                isStopUpload = true;
                            }
                        } else {
                            isStopUpload = await ProductYahooService.checkProfitToStopUpload(
                                defaultSetting,
                                productYahooData.import_price,
                                productYahooData.amazon_shipping_fee
                            );
                        }
                        console.log(' ==================== isStopUpload =========================== ');
                        if (isStopUpload) {
                            let newResult = {
                                product_created: productYahooData.created,
                                product_id: productYahooData._id,
                                product_aID: '',
                                message: '低利益',
                                created: Date.now(),
                                success: 'ERROR',
                            };
                            result.push(newResult);
                            console.log(' ================ isStopUpload LOW PROFIT =============== ');
                            continue;
                        }
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
                        console.log(' ### startUploadProductInListFolderId uploadAuctionResult: ', uploadAuctionResult);
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
                        result.push(newResult);
                    }
                }
            }
        }
        return result;
    }

    static async startUploadProductByCalendar(user_id, yahoo_account_id, calendar_target_folder) {
        isCalendarUploading = true;
        try {
            console.log(Date.now());
            console.log(' ######### Start Cron job: startUploadProductByCalendar ');
            let result = [];
            //Get day of month
            let today = new Date();
            today = today.getDate();

            if (calendar_target_folder.length >= today) {
                let folder_id = calendar_target_folder[today - 1];
                if (folder_id) {
                    let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
                    if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
                        let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                        if (proxyResult.status === 'SUCCESS') {
                            let listProduct = await ProductYahooModel.find({ user_id, yahoo_account_id, folder_id, listing_status: 'NOT_LISTED' });
                            for (let index = 0; index < listProduct.length; index++) {
                                const productYahooData = listProduct[index];
                                let dataUpdate = {};

                                let isStopUpload = await ProductYahooService.checkProfitToStopUpload(
                                    user_id,
                                    yahoo_account_id,
                                    productYahooData.import_price,
                                    productYahooData.amazon_shipping_fee
                                );

                                if (isStopUpload) {
                                    let newResult = {
                                        product_created: productYahooData.created,
                                        product_id: productYahooData._id,
                                        product_aID: '',
                                        message: '低利益',
                                        created: Date.now(),
                                        success: 'ERROR',
                                    };
                                    result.push(newResult);
                                    console.log(' ================ isStopUpload LOW PROFIT =============== ');
                                    continue;
                                }

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
                                console.log(' ### startUploadProductByCalendar uploadAuctionResult: ', uploadAuctionResult);
                                dataUpdate.upload_status = uploadAuctionResult.status;
                                dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
                                dataUpdate.aID = uploadAuctionResult.aID;
                                if (uploadAuctionResult.status === 'SUCCESS') {
                                    dataUpdate.listing_status = 'UNDER_EXHIBITION';
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
        console.log(Date.now());
        console.log(' ######### Start Cron job: startReSubmitProduct ');
        console.log(' ### yahoo_account_id: ', yahoo_account_id);
        // console.log(' ### new_list_target_folder: ', listAid);

        let result = [];
        let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
        if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
            let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
            if (proxyResult.status === 'SUCCESS') {
                let listProductFinished = await AuctionYahooService.getProductAuctionFinished(yahooAccount.cookie, proxyResult.data);
                let listProductEnded = await AuctionYahooService.getProductAuctionEnded('', yahooAccount.cookie, proxyResult.data, true);
                listProductFinished = [...listProductFinished, ...listProductEnded];
                console.log(' ###### listProductFinished: ', listProductFinished);

                for (const aID of listProductFinished) {
                    let listProduct = await ProductYahooAuctionService.find({ user_id, yahoo_account_id, aID });
                    for (let index = 0; index < listProduct.length; index++) {
                        const productYahooData = listProduct[index];
                        let dataUpdate = {};

                        let isStopUpload = await ProductYahooService.checkProfitToStopUpload(
                            user_id,
                            yahoo_account_id,
                            productYahooData.import_price,
                            productYahooData.amazon_shipping_fee
                        );
                        if (isStopUpload) {
                            let newResult = {
                                product_created: productYahooData.created,
                                product_id: productYahooData._id,
                                product_aID: '',
                                message: '低利益',
                                created: Date.now(),
                                success: 'ERROR',
                            };
                            result.push(newResult);
                            console.log(' ================ isStopUpload LOW PROFIT =============== ');
                            continue;
                        }

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
                        result.push(newResult);
                    }
                }
            }
        }
        return result;
    }

    static async createFromAmazonProduct(productAmazon, user_id, yahoo_account_id) {
        //Dùng cate amazon Check xem có trong mapping k
        let cateAmazon = await CategoryService.findOne({ amazon_cate_id: productAmazon.category_id });
        if (!cateAmazon) {
            cateAmazon = await CategoryService.create({
                user_id,
                amazon_cate_id: productAmazon.category_id,
                asin: productAmazon.asin,
            });
        }
        let cate_yahoo = cateAmazon.yahoo_cate_id || '0';

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
        console.log(' #### dataCalculatorProduct: ', dataCalculatorProduct);
        let productYahoo = {
            ...defaultSetting._doc,
            ...dataCalculatorProduct,
            id_category_amazon: productAmazon.category_id,
            description: productAmazon.description,
            asin_amazon: productAmazon.asin,
            images: productAmazon.images,
            product_amazon_id: productAmazon._id,
            count: productAmazon.count,
            amazon_shipping_fee: productAmazon.ship_fee,
            ship_fee1: defaultSetting.yahoo_auction_shipping,
            user_id: user_id,
            product_yahoo_title: title,
            yahoo_account_id: yahoo_account_id,
            product_model: 'AMAZON',
            yahoo_auction_category_id: cate_yahoo,
            created: Date.now(),
            listing_status: 'NOT_LISTED',
            _id: null,
        };
        delete productYahoo._id;
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
        // await ProductYahooService.create(productYahoo);
    }
    static async UpdateCalculatorPrice(productInfomationDefault) {
        let listProduct = await ProductYahooModel.find({
            user_id: productInfomationDefault.user_id,
            yahoo_account_id: productInfomationDefault.yahoo_account_id,
        });
        for (let productYahoo of listProduct) {
            // Product chưa đc user change
            if (!productYahoo.is_user_change) {
                //Giá sản phẩm gốc
                let import_price = productYahoo.import_price;
                let amazon_shipping_fee = productYahoo.amazon_shipping_fee;
                let dataCalculatorProduct = await this.calculatorPrice(productInfomationDefault, import_price, amazon_shipping_fee);

                delete productInfomationDefault._id;
                let dataUpdate = {
                    ...productYahoo._doc,
                    ...productInfomationDefault,
                    ...dataCalculatorProduct,
                    _id: productYahoo._id,
                    created: productYahoo.created,
                };
                await this.update(productYahoo._id, dataUpdate);
            }
        }
    }
}
