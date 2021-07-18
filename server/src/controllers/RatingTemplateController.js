import Response from '../utils/Response';
import RatingTemplateService from '../services/RatingTemplateService';

export default class RatingTemplateController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {yahoo_account_id} = req.params
            let templates = await RatingTemplateService.get(user._id, yahoo_account_id);
            return response.success200({ templates });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async create (req, res) {
        let response = new Response(res);
        try {
            let { name, content, rating, yahoo_account_id } = req.body
            if (!name || !content) {
                return response.error400({message: '完全な情報を入力してください。'})
            }
            let user = req.user
            let data = {
                user_id: user._id,
                name,
                content,
                rating,
                yahoo_account_id
            }
            let result = await RatingTemplateService.create(data);
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
            const {_id} = req.params;
            let user = req.user
            let { name, content, rating } = req.body
            if (!name || !content) {
                return response.error400({message: '完全な情報を入力してください。'})
            }
            let data = {
                user_id: user._id,
                name,
                content,
                rating
            }

            let result = await RatingTemplateService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async show (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let result = await RatingTemplateService.show(_id);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }
    
    static async delete (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let result = await RatingTemplateService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
