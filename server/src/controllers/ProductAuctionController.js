import Response from '../utils/Response';
import ProductAuctionService from '../services/ProductAuctionService';

export default class ProductAuctionController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let products = await ProductAuctionService.get(user._id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

}
