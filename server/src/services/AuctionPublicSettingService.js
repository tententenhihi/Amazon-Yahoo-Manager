import AuctionPublicSettingModel from '../models/AuctionPublicSettingModel';

export default class AuctionPublicSettingService {
    static async get (userId) {
        try {
            let res = await AuctionPublicSettingModel.find({user_id: userId}).sort({ _id: -1 }).limit(1);
            if (!res.length) {
                res = await AuctionPublicSettingModel.create({
                    user_id: userId
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
            let res = await AuctionPublicSettingModel.create(data);
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async update (data) {
        try {
            let res = await AuctionPublicSettingModel.findOneAndUpdate({ _id: data._id, user_id: data.user_id }, data, { new: true });
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
