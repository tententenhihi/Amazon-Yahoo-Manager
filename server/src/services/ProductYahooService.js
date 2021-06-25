import ProductYahooSchema from '../models/ProductYahooModel';
export default class ProductYahooService {
    static async get(idUser) {
        try {
            let result = await ProductYahooSchema.find({ idUser });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(' Error ProductYahooService-get: ' + error.message);
        }
    }
    static async create (data) {
        try {
            let product = await ProductYahooSchema.create(data);
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async update (_id, data) {
        try {
            let product = await ProductYahooSchema.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async show (productId) {
        try {
            let product = await ProductYahooSchema.findById(productId);
            if (!product) {
                throw new Error('Error: Product not found');
            } else {
                return product._doc;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async delete (productId) {
        try {
            let product = await ProductYahooSchema.findById(productId);
            if (!product) {
                throw new Error('Error: Product not found');
            } else {
                await product.remove();
                return true;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
