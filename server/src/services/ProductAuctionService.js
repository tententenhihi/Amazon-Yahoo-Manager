import ProductAuctionSchema from '../models/ProductAuctionModel';
export default class ProductAuctionService {
    static async get(idUser) {
        try {
            let result = await ProductAuctionSchema.find({ user_id: idUser });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('ProductAuctionService-get: ' + error.message);
        }
    }
}
