import ProductYahooSchema from '../models/ProductYahooModel';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

export default class ProductYahooService {
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
                await product.remove();
                for (let index = 0; index < product.images.length; index++) {
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
}
