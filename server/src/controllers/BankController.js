import Response from '../utils/Response';
import BankModel from '../models/BankModel';

export default class BankController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let listBank = await BankModel.find({ user_id: user._id });
            return response.success200({ listBank });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async create(req, res) {
        let response = new Response(res);
        try {
            let { name, branch, number, first_name, last_name } = req.body;
            if (!name || !branch || !number || !first_name || !last_name) {
                return response.error400({ message: '完全な情報を入力してください。' });
            }

            let user = req.user;
            let newBank = new BankModel({ ...req.body, user_id: user._id });
            await newBank.save();
            if (newBank) {
                return response.success200({ newBank });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async update(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await BankModel.findByIdAndUpdate(_id, { ...req.body });
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async delete(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await BankModel.findByIdAndDelete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }
}
