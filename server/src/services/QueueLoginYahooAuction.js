import Queue from 'better-queue';
import AuctionYahooService from './AuctionYahooService';
import ProxyService from './ProxyService';
let queueLogin = null;

const autoLoginYahoo = async (inputData, cb) => {
    try {
        let proxy = await ProxyService.getProxyById(inputData.proxy_id);
        if (proxy) {
            let cookie = await AuctionYahooService.getCookie(inputData, proxy);
            inputData.cookie = cookie;
            inputData.status = 'SUCCESS';
            await inputData.save();
            console.log('done get product yahoo auction');
        } else {
            throw new Error('Proxy not found.!')
        }
        cb();
    } catch (error) {
        console.log(' ### Error Queue autoLoginYahoo: ', error);
        inputData.status = 'ERROR'
        inputData.statusMessage = 'Error: ' + error.message,
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
