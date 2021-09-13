import ApiKeyModel from '../models/ApiKeyModel';
import Response from '../utils/Response';

export default class ApiKeyController {
    static async getApiKeyByUser(user_id) {
        try {
            let apiKey = await ApiKeyModel.findOne({ user_id });
            return apiKey;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let apiKey = await ApiKeyModel.findOne({ user_id: user._id });
            if (!apiKey) {
                apiKey = await ApiKeyModel.create({ user_id: user._id });
            }
            return response.success200({ apiKey });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async update(req, res) {
        let response = new Response(res);
        try {
            let payload = req.body;
            if (payload.token_keepa.trim() !== '') {
                payload.is_keepa = true;
            } else {
                payload.is_keepa = false;
            }
            if (payload.REFRESH_TOKEN.trim() !== '' && payload.SELLING_PARTNER_APP_CLIENT_ID.trim() !== '' && payload.SELLING_PARTNER_APP_CLIENT_SECRET.trim() !== '' && payload.AWS_SELLING_PARTNER_ROLE.trim() !== '' && payload.AWS_ACCESS_KEY_ID.trim() !== '' && payload.AWS_SECRET_ACCESS_KEY.trim() !== '') {
                payload.is_amz = true;
            } else {
                payload.is_amz = false;
            }
            let newApi = await ApiKeyModel.findByIdAndUpdate(payload._id, { ...payload }, { new: true });
            return response.success200({ apiKey: newApi });
        } catch (error) {
            response.error500(error);
        }
    }
}
