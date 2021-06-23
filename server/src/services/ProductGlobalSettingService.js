import ProductGlobalSettingModel from '../models/ProductGlobalSettingModel';

export default class ProductGlobalSettingService {
    static async get () {
        try {
            let res = await ProductGlobalSettingModel.find().sort({ _id: -1 }).limit(1);
            if (!res.length) {
                res = await ProductGlobalSettingModel.create({
                    template: 1
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
            let res = await ProductGlobalSettingModel.findOneAndUpdate({ _id: data._id }, data, { new: true });
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
