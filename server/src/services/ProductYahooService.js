import ProductYahooSchema from '../models/ProductYahooModel';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import AccountYahooService from '../services/AccountYahooService';
import ProxyService from '../services/ProxyService';
import AuctionYahooService from '../services/AuctionYahooService';
import fs from 'fs';
import mongoose from 'mongoose';

export default class ProductYahooService {
    static async find(data) {
        try {
            let result = await ProductYahooSchema.find(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async get(idUser, yahoo_account_id) {
        try {
            let result = await ProductYahooSchema.find({ user_id: idUser, yahoo_account_id });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async create(data) {
        try {
            let product = await ProductYahooSchema.create(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findOne(data) {
        try {
            let product = await ProductYahooSchema.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductYahooSchema.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductYahooSchema.findById(productId);
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
            let product = await ProductYahooSchema.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            } else {
                if (product.product_amazon_id) {
                    let productAmazon = await ProductAmazonSchema.findById(product.product_amazon_id);
                    if (!product) {
                        throw new Error('Product amazon not found');
                    } else {
                        productAmazon.folder_id = '';
                        productAmazon.is_convert_yahoo = false;
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

    static async switchWatchOption(ids, type, value) {
        try {
            for (let index = 0; index < ids.length; index++) {
                const id = ids[index];
                let product = await ProductYahooSchema.findById(id);
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
                let product = await ProductYahooSchema.findById(id);
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
        console.log(' ######### Start Cron job: startUploadProductInListFolderId ');
        console.log(' ### yahoo_account_id: ', yahoo_account_id);
        console.log(' ### new_list_target_folder: ', new_list_target_folder);

        let result = [];
        let yahooAccount = await AccountYahooService.findOne({ _id: yahoo_account_id });
        if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
            let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
            if (proxyResult.status === 'SUCCESS') {
                for (const folder_id of new_list_target_folder) {
                    let listProduct = await ProductYahooSchema.find({ user_id, yahoo_account_id, folder_id, listing_status: 'NOT_LISTED' });
                    for (let index = 0; index < listProduct.length; index++) {
                        const productYahooData = listProduct[index];
                        let dataUpdate = {};
                        let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, productYahooData, proxyResult.data);
                        console.log(' ### startUploadProductInListFolderId uploadAuctionResult: ', uploadAuctionResult);
                        if (uploadAuctionResult.status === 'SUCCESS') {
                            dataUpdate.listing_status = 'UNDER_EXHIBITION';
                        }
                        dataUpdate.upload_status = uploadAuctionResult.status;
                        dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
                        dataUpdate.aID = uploadAuctionResult.aID;
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

    static async startReSubmitProduct(user_id, yahoo_account_id) {
        console.log(' ######### Start Cron job: startReSubmitProduct ');
    }
    static async startUploadProductByCalendar(user_id, yahoo_account_id, calendar_target_folder) {
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
                        let listProduct = await ProductYahooSchema.find({ user_id, yahoo_account_id, folder_id, listing_status: 'NOT_LISTED' });
                        for (let index = 0; index < listProduct.length; index++) {
                            const productYahooData = listProduct[index];
                            let dataUpdate = {};
                            let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, productYahooData, proxyResult.data);
                            console.log(' ### startUploadProductByCalendar uploadAuctionResult: ', uploadAuctionResult);
                            if (uploadAuctionResult.status === 'SUCCESS') {
                                dataUpdate.listing_status = 'UNDER_EXHIBITION';
                            }
                            dataUpdate.upload_status = uploadAuctionResult.status;
                            dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
                            dataUpdate.aID = uploadAuctionResult.aID;
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
        return result;
    }
}
