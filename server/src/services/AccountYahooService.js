import YahooAccountSchema from '../models/YahooAccount';

export default class AccountYahooService {
    static async findById(id) {
        try {
            let account = await YahooAccountSchema.findById(id);
            return account;
        } catch (error) {
            console.log(' Error AccountYahooService findById: ', error);
            return null;
        }
    }
    static async findOne(data) {
        try {
            let account = await YahooAccountSchema.findOne(data);
            return account;
        } catch (error) {
            console.log(' Error AccountYahooService findById: ', error);
            return null;
        }
    }
    static async find(data) {
        try {
            let accounts = await YahooAccountSchema.find(data);
            return accounts;
        } catch (error) {
            console.log(' Error AccountYahooService findById: ', error);
            return null;
        }
    }
    static async update(id, data) {
        try {
            let accounts = await YahooAccountSchema.findByIdAndUpdate(id, data);
            return accounts;
        } catch (error) {
            console.log(' Error AccountYahooService findById: ', error);
            return null;
        }
    }
}
