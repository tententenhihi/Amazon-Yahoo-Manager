import Category from '../models/CategoryModel';
import ProductYahooSchema from '../models/ProductYahooModel';
export default class CategoryService {
    static async get(userId) {
        try {
            let result = await Category.find({ user_id: userId, is_success_yahoo_cate_id: false }).sort({ created_at: -1 });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findOne(data) {
        try {
            let result = await Category.findOne(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async create(data) {
        try {
            let cate = await Category.create(data);
            return cate._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update(_id, data) {
        try {
            let cate = await Category.findOneAndUpdate({ _id: _id }, data, { new: true });
            let yahooCateId = cate.yahoo_cate_id;
            let amazonCateId = cate.amazon_cate_id;
            await ProductYahooSchema.updateMany({ user_id: cate.user_id, id_category_amazon: amazonCateId }, { yahoo_auction_category_id: yahooCateId });
            return cate._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async checkData() {
        try {
            let allCalte = await Category.find({});
            let listCateSuccess = await Category.find({ is_success_yahoo_cate_id: true });
            let listCateError = await Category.find({ is_success_yahoo_cate_id: false });
            for (const cateError of listCateError) {
                let checkExist = listCateSuccess.find((item) => item.amazon_cate_id === cateError.amazon_cate_id);
                if (checkExist) {
                    await cateError.remove();
                }
            }

            
            return '';
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
