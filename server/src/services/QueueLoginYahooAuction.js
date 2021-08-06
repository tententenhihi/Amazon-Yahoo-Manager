import Queue from 'better-queue';
import AuctionYahooService from './AuctionYahooService';
import ProxyService from './ProxyService';
let queueLogin = null;

const autoLoginYahoo = async (inputData, cb) => {
    try {
        let proxyResult = await ProxyService.findByIdAndCheckLive(inputData.proxy_id);
        if (proxyResult.status === 'SUCCESS') {
            let proxy = proxyResult.data;
            let cookie = await AuctionYahooService.getCookie(inputData, proxy);
            let point = await AuctionYahooService.getPointAuction(cookie, proxy);
            point = point.replace(/\D+/g, '');
            inputData.cookie = cookie;
            inputData.auction_point = point;
            inputData.status = 'SUCCESS';
        } else {
            inputData.status = proxyResult.status;
            inputData.statusMessage = proxyResult.statusMessage;
        }
        await inputData.save();
        cb();
    } catch (error) {
        console.log(' ### Error Queue autoLoginYahoo: ', error);
        inputData.status = 'ERROR';
        inputData.statusMessage = 'Error: ' + error.message;
        await inputData.save();
        cb({ error });
    }
};
export default class QueueLoginYahooAuction {
    constructor() {
        if (!queueLogin) {
            queueLogin = new Queue(autoLoginYahoo, { concurrent: 5, autoResume: true, cancelIfRunning: true });
        }
    }

    static async addNew(data) {
        if (!data) {
            return;
        }
        queueLogin.push(data);
    }
}
