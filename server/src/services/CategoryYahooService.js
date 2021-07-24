import CategoryYahooModel from '../models/CategoryYahooModel';
export default class CategoryYahooService {
    static async findOne(data) {
        try {
            let result = await CategoryYahooModel.findOne(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async create(data) {
        try {
            let cate = await CategoryYahooModel.create(data);
            return cate;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
