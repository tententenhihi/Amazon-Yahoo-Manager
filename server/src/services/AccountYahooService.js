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
}
