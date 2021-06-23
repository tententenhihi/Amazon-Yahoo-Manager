import Response from '../utils/Response';
import ProductGlobalSettingService from '../services/ProductGlobalSettingService';

export default class ProductGlobalSettingController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let setting = await ProductGlobalSettingService.get();
            return response.success200({ setting });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async create (req, res) {
        let response = new Response(res);
        try {
            let { product_detail, payment_detail, delivery_detail, precaution_detail } = req.body

            let data = {
                product_detail,
                payment_detail,
                delivery_detail,
                precaution_detail,
            }

            let result = await ProductGlobalSettingService.create(data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async update (req, res) {
        let response = new Response(res);
        try {
            let { product_detail, payment_detail, delivery_detail, precaution_detail, template, _id } = req.body

            let data = {
                _id,
                product_detail,
                payment_detail,
                delivery_detail,
                precaution_detail,
                template
            }
            
            let result = await ProductGlobalSettingService.update(data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
