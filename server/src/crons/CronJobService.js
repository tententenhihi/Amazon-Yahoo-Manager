var cron = require('node-cron');
import AuctionYahooService from '../services/AuctionYahooService';
import ProductYahooService from '../services/ProductYahooService';
import AccountYahooService from '../services/AccountYahooService';
import ProductYahooEndedService from '../services/ProductYahooEndedService';
import ProxyService from '../services/ProxyService';

export default class CronJobService {
    constructor() {
        cron.schedule('*/5 * * * *', async () => {
            console.log(' ====== Get Product yahoo ended every 5 minute ======');
            let listAccountYahoo = await AccountYahooService.find({});
            for (let i = 0; i < listAccountYahoo.length; i++) {
                const accountYahoo = listAccountYahoo[i];
                if (accountYahoo.status === 'SUCCESS' && accountYahoo.cookie) {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        let listProductEnded = await AuctionYahooService.getProductAuctionEnded(accountYahoo.cookie, proxyResult.data);
                        console.log(listProductEnded);
                        for (let j = 0; j < listProductEnded.length; j++) {
                            const product = listProductEnded[j];
                            let checkExistProductInDB = await ProductYahooEndedService.findOne({ aID: product.aID });
                            if (!checkExistProductInDB) {
                                let productYahoo = await ProductYahooService.findOne({ aID: product.aID });
                                if (productYahoo) {
                                    let newProductYahooEnded = {
                                        ...productYahoo._doc,
                                        ...product,
                                        _id: null,
                                    };
                                    newProductYahooEnded = await ProductYahooEndedService.create(newProductYahooEnded);
                                }
                            }
                        }
                    } else {
                        console.log(proxyResult);
                    }
                }
            }
        });
    }
}
