import AsinAmazonModel from '../models/BlacklistAsinModel';

export default class AsinAmazonService {
    static async getBlackList() {
        try {
            let result = await AsinAmazonModel.find({ type: 'BLACK' });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async findOne(data) {
        try {
            let result = await AsinAmazonModel.findOne(data);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async getWhiteList() {
        try {
            let result = await AsinAmazonModel.find({ type: 'WHITE' });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async create(data) {
        try {
            let result = await AsinAmazonModel.create(data);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async delete(id) {
        try {
            let result = await AsinAmazonModel.findById(id);
            if (result) {
                await result.remove();
                return true;
            } else {
                throw new Error('AsinAmazon not found');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
