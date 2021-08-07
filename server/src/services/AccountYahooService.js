import YahooAccountSchema from '../models/YahooAccount';
import ProxyService from './ProxyService';
import AuctionYahooService from './AuctionYahooService';

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

    static async getCookie(id) {
        let accountData = await YahooAccountSchema.findById(id);
        let proxyResult = await ProxyService.findByIdAndCheckLive(accountData.proxy_id);
        if (proxyResult.status === 'SUCCESS') {
            let proxy = proxyResult.data;
            let resultGetCookie = await AuctionYahooService.getCookie(accountData, proxy);
            if (resultGetCookie.status === 'SUCCESS') {
                accountData.cookie = resultGetCookie.cookie;
                accountData.status = 'SUCCESS';
                await accountData.save();
                setTimeout(async () => {
                    let point = await AuctionYahooService.getPointAuction(resultGetCookie.cookie, proxy);
                    point = point.replace(/\D+/g, '');
                    accountData.auction_point = point;
                    await accountData.save();
                    console.log(' === Get point success === ');
                }, 1);
                return {
                    status: 'SUCCESS',
                    data: accountData,
                };
            } else {
                return {
                    status: 'ERROR',
                    message: resultGetCookie.message,
                };
            }
        } else {
            accountData.status = proxyResult.status;
            accountData.statusMessage = proxyResult.statusMessage;
            return {
                status: 'ERROR',
                message: proxyResult.statusMessage,
            };
        }
    }
}
