import Category from "../models/CateroryModel";

export default class CategoryService {
  static async get (userId) {
    try {
      let result = await Category.find({user_id: userId});
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  static async create (data) {
    try {
        let cate = await Category.create(data);
        return cate._doc;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}
static async update (_id, data) {
    try {
        let cate = await Category.findOneAndUpdate({ _id: _id }, data, { new: true });
        let yahooCateId = cate.yahoo_cate_id;
        let 
        return cate._doc;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}
}
