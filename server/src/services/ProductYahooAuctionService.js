import ProductYahooAuction from '../models/ProductYahooAuction';

export default class ProductYahooAuctionService {
    static async find(data) {
        try {
            let result = await ProductYahooAuction.find(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async update(_id, data) {
        try {
            let newData = await ProductYahooAuction.findByIdAndUpdate(_id, data, { new: true });
            return newData;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async create(data) {
        try {
            data._id = null;
            let newData = new ProductYahooAuction(data);
            await newData.save();
            return newData;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    static async findOne(data) {
        try {
            let product = await ProductYahooAuction.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
