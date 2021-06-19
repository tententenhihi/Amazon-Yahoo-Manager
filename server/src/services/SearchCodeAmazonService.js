import SearchCodeSchema from '../models/SearchCodeAmazonModel';

export default class SearchCodeAmazonService {
    static async get(filter) {
        try {
            let result = await SearchCodeSchema.find(filter);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-get: ', error.message);
        }
    }
    static async add(addData) {
        try {
            let newSearchCode = new SearchCodeSchema(addData);
            await newSearchCode.save();
            return newSearchCode;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-add: ', error.message);
        }
    }
    static async update(idSearchCode, idUser, updateData) {
        try {
            let result = await SearchCodeSchema.findOneAndUpdate({ _id: idSearchCode, idUser }, updateData, { new: true });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-update: ', error.message);
        }
    }
    static async delete(idSearchCode, idUser) {
        try {
            let result = await SearchCodeSchema.findOneAndDelete({ _id: idSearchCode, idUser });
            return result != null;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-delete: ', error.message);
        }
    }
}
