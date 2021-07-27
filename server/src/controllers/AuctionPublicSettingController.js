import Response from '../utils/Response';
import AuctionPublicSettingService from '../services/AuctionPublicSettingService';

export default class AuctionPublicSettingController {
    static async get(req, res) {
        let response = new Response(res);
        let userId = req.user._id
        let {yahoo_account_id} = req.params
        try {
            let setting = await AuctionPublicSettingService.get(userId, yahoo_account_id);
            return response.success200({ setting });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async update (req, res) {
        let response = new Response(res);
        try {
            let data = { user_id: req.user._id, ...req.body }
            
            let result = await AuctionPublicSettingService.update(data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
