import Response from '../utils/Response';
import TradeMessageTemplateService from '../services/TradeMessageTemplateService';

export default class TradeMessageTemplateController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {yahoo_account_id} = req.params
            let templates = await TradeMessageTemplateService.get(user._id, yahoo_account_id);
            return response.success200({ templates });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async create (req, res) {
        let response = new Response(res);
        try {
            let { name, content, yahoo_account_id } = req.body
            if (!name || !content) {
                return response.error400({message: '完全な情報を入力してください。'})
            }
            let user = req.user
            let data = {
                user_id: user._id,
                yahoo_account_id,
                name,
                content
            }
            let result = await TradeMessageTemplateService.create(data);
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
            let { name, content } = req.body
            if (!name || !content) {
                return response.error400({message: '完全な情報を入力してください。'})
            }
            let data = {
                user_id: user._id,
                name,
                content
            }

            let result = await TradeMessageTemplateService.update(_id, data);
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
            let result = await TradeMessageTemplateService.show(_id);
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
            let result = await TradeMessageTemplateService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
