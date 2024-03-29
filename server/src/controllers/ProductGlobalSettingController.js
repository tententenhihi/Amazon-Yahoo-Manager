import Response from '../utils/Response';
import ProductGlobalSettingService from '../services/ProductGlobalSettingService';

export default class ProductGlobalSettingController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user
            let {yahoo_account_id} = req.params
            let setting = await ProductGlobalSettingService.get(user._id, yahoo_account_id);
            return response.success200({ setting });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async create (req, res) {
        let response = new Response(res);
        try {
            let user = req.user
            let data = {
                user_id: user._id,
                ...req.body
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
            let userId = req.user._id
            let data = {
                user_id: userId,
                ...req.body
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
