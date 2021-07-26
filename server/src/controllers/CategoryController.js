import Response from '../utils/Response';
import CategoryService from '../services/CategoryService';

export default class FolderController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let categories = await CategoryService.get(user._id);
            return response.success200({ categories });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async update (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let { yahoo_cate_id } = req.body

            let result = await CategoryService.update(_id, {yahoo_cate_id, is_success_yahoo_cate_id: true});
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
