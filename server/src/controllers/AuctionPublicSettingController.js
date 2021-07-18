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
            let { new_list_auto, new_list_target_folder, new_list_start_time_hour, new_list_start_time_minute,
                new_list_interval_per_day, new_list_day_of_week, new_list_process_of_skipped_items,
                relist_auto, relist_start_time_hour, relist_start_time_minute,
                calendar_list_setting, calendar_target_folder, target_folder_list, auction_delete, _id } = req.body
            let userId = req.user._id
            let data = {
                user_id: userId,
                _id,
                new_list_auto,
                new_list_target_folder,
                new_list_start_time_hour,
                new_list_start_time_minute,
                new_list_interval_per_day,
                new_list_day_of_week,
                new_list_process_of_skipped_items,
                relist_auto,
                relist_start_time_hour,
                relist_start_time_minute,
                calendar_list_setting,
                calendar_target_folder,
                target_folder_list,
                auction_delete
            }
            
            let result = await AuctionPublicSettingService.update(data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
