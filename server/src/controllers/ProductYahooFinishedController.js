import Response from '../utils/Response';
import ProductYahooFinishedService from '../services/ProductYahooFinishedService';

export default class ProductYahooFinishedController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let { yahoo_account_id } = req.params;
            let products = await ProductYahooFinishedService.get(user._id, yahoo_account_id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooFinishedService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async deleteMultipleProduct(req, res) {
        let response = new Response(res);
        try {
            const { ids } = req.body;
            for (let index = 0; index < ids.length; index++) {
                await ProductYahooFinishedService.delete(ids[index]);
            }
            response.success200({ success: true });
        } catch (error) {
            response.error500(error);
        }
    }

    static async setNote(req, res) {
        let response = new Response(res);
        try {
            let { note, product_id } = req.body;
            let product = await ProductYahooFinishedService.update(product_id, { note });
            return response.success200({ product });
        } catch (error) {
            response.error500(error);
        }
    }
}
