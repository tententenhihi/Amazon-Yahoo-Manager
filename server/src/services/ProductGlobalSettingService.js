import ProductGlobalSettingModel from '../models/ProductGlobalSettingModel';

export default class ProductGlobalSettingService {
    static async get (userId, yahoo_account_id) {
        try {
            let res = await ProductGlobalSettingModel.find({user_id: userId, yahoo_account_id}).sort({ _id: -1 }).limit(1);
            if (!res.length) {
                res = await ProductGlobalSettingModel.create({
                    template: 1,
                    user_id: userId,
                    yahoo_account_id
                });
            }
            return Array.isArray(res) ? res[0] : res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async create (data) {
        try {
            let res = await ProductGlobalSettingModel.create(data);
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async update (data) {
        try {
            let res = await ProductGlobalSettingModel.findOneAndUpdate({ _id: data._id, user_id: data.user_id }, data, { new: true });
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
