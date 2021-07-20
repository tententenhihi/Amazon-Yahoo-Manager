import Response from '../utils/Response';
import ProductYahooEndedService from '../services/ProductYahooEndedService';
import AuctionYahooService from '../services/AuctionYahooService';
import UploadFile from '../helpers/UploadFile';

export default class ProductYahooController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {yahoo_account_id} = req.params
            let products = await ProductYahooEndedService.get(user._id, yahoo_account_id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }


    static async showProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let product = await ProductYahooEndedService.show(_id);
            if (product) {
                response.success200({product});
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let data = req.body
            let product = await ProductYahooEndedService.update(_id, data);
            response.success200({ product });
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooEndedService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    
}
