import Response from '../utils/Response';
import ProductAmazonService from '../services/ProductAmazonService';

export default class AmazonController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let listProduct = await ProductAmazonService.get(user._id);
            return response.success200({ listProduct });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async getInfoProductByASIN(req, res) {
        let response = new Response(res);
        try {
            let asin = req.body.asin;
            let productInfo = await ProductAmazonService.getProductByAsin(asin);
            return response.success200({ productInfo });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
}
