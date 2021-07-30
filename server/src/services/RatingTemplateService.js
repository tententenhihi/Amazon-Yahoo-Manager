import RatingTemplateSchema from '../models/RatingTemplateModel';

export default class RatingTemplateService {
    static async get(idUser, yahoo_account_id) {
        try {
            let result = await RatingTemplateSchema.find({ user_id: idUser, yahoo_account_id });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('RatingTemplateService-get: ' + error.message);
        }
    }
    static async create (data) {
        try {
            let template = await RatingTemplateSchema.create(data);
            return template._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update (_id, data) {
        try {
            let template = await RatingTemplateSchema.findOneAndUpdate({ _id: _id }, data, { new: true });
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show (Id) {
        try {
            console.log(Id)
            let template = await RatingTemplateSchema.findById(Id);
            if (!template) {
                throw new Error('評価テンプレート見つかりません');
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
            let template = await RatingTemplateSchema.findById(Id);
            if (!template) {
                throw new Error('評価テンプレート見つかりません');
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
