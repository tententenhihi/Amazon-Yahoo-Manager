import TradeMessageTemplateSchema from '../models/TradeMessageTemplateModel';

export default class TradeMessageTemplateService {
    static async get(idUser) {
        try {
            let result = await TradeMessageTemplateSchema.find({ user_id: idUser });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('TradeMessageTemplateService-get: ' + error.message);
        }
    }
    static async create (data) {
        try {
            let template = await TradeMessageTemplateSchema.create(data);
            return template._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update (_id, data) {
        try {
            let template = await TradeMessageTemplateSchema.findOneAndUpdate({ _id: _id }, data, { new: true });
            return template._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show (Id) {
        try {
            console.log(Id)
            let template = await TradeMessageTemplateSchema.findById(Id);
            if (!template) {
                throw new Error('取引ナビテンプレート見つかりません');
            } else {
                return template._doc;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async delete (Id) {
        try {
            let template = await TradeMessageTemplateSchema.findById(Id);
            if (!template) {
                throw new Error('取引ナビテンプレート見つかりません');
            } else {
                await template.remove();
                return true;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
