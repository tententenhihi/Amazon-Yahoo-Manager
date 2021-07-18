import ProductInfomationDefaultSchema from '../models/ProductInfomationDefaultModel';

export default class ProductInfomationDefaultService {
    static async get(userId, yahoo_account_id) {
        try {
            let res = await ProductInfomationDefaultSchema.find({ user_id: userId, yahoo_account_id }).sort({ _id: -1 }).limit(1);
            if (!res.length) {
                res = await ProductInfomationDefaultSchema.create({
                    user_id: userId,
                    yahoo_account_id,
                });
            }
            return Array.isArray(res) ? res[0]._doc : res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('ProductInfomationDefaultService-get: ' + error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductInfomationDefaultSchema.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findOne(data) {
        try {
            let product = await ProductInfomationDefaultSchema.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductInfomationDefaultSchema.findById(productId);
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
            let product = await ProductInfomationDefaultSchema.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            } else {
                await product.remove();
                return true;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
