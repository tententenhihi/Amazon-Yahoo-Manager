import Response from '../utils/Response';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';

export default class ProductInfomationDefaultController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {yahoo_account_id} = req.params
            let product = await ProductInfomationDefaultService.get(user._id, yahoo_account_id);
            return response.success200(product);
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let user = req.user;

            let data = {
                user_id: user._id,
                ...req.body
            };

            let result = await ProductInfomationDefaultService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductInfomationDefaultService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }
}
