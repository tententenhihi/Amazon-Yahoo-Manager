import express from 'express';
import CronHistoryModel from '../models/CronHistoryModel';
import Response from '../utils/Response';

const get = async (req, res) => {
    let response = new Response(res);
    try {
        let user = req.user;
        let { yahoo_account_id } = req.body;
        let crons = await CronHistoryModel.find({ user_id: user._id, yahoo_account_id });
        return response.success200({ crons });
    } catch (error) {
        console.log(error);
        return response.error500(error);
    }
};
var authRouter = express.Router();

authRouter.route('/get').post(get);

export default authRouter;
