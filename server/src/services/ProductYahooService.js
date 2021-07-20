import ProductYahooSchema from '../models/ProductYahooModel';
import ProductAmazonSchema from '../models/ProductAmazonModel';
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
                    let productAmazon = await ProductAmazonSchema.findById(product.product_amazon_id)
                    if (!product) {
                        throw new Error('Product amazon not found');
                    } else {
                        productAmazon.folder_id = ''
                        productAmazon.is_convert_yahoo = false
                        await productAmazon.save()
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
    }
    static async startReSubmitProduct(user_id, yahoo_account_id) {
        console.log(' ######### Start Cron job: startReSubmitProduct ');
    }
    static async startUploadProductByCalendar(user_id, yahoo_account_id, calendar_target_folder) {
        console.log(' ######### Start Cron job: startUploadProductByCalendar ');
    }
}
