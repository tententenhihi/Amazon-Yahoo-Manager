import Response from '../utils/Response';
import ProductYahooSellingService from '../services/ProductYahooSellingService';
import AuctionYahooService from '../services/AuctionYahooService';
import AccountYahooService from '../services/AccountYahooService';
import ProxyService from '../services/ProxyService';

export default class ProductYahooSellingController {
    static async refreshDataYahoo(req, res) {
        let response = new Response(res);
        try {
            let { yahoo_account_id } = req.body;
            let products = await ProductYahooSellingService.refreshDataYahoo(yahoo_account_id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let { yahoo_account_id } = req.params;
            let products = await ProductYahooSellingService.get(user._id, yahoo_account_id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let productDelete = await ProductYahooSellingService.findById(_id);
            if (productDelete) {
                let yahooAccount = await AccountYahooService.findById(productDelete.yahoo_account_id);
                if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        let result = null;
                        if (productDelete.buyer_count > 0) {
                            // Xoa khi co ng đấu thầu
                            result = await AuctionYahooService.cancelAuction(productDelete.aID, yahooAccount.cookie, proxyResult.data, true);
                        } else {
                            result = await AuctionYahooService.cancelAuction(productDelete.aID, yahooAccount.cookie, proxyResult.data);
                        }
                        console.log(' ########## result: ', result);
                        if (result.status === 'SUCCESS') {
                            await ProductYahooSellingService.delete(_id);
                            return response.success200({ success: true });
                        } else {
                            return response.error400({ message: result.message });
                        }
                    } else {
                        return response.error400({ message: 'Proxy Error.!' });
                    }
                } else {
                    return response.error400({ message: 'Yahoo Account Error.!' });
                }
            } else {
                return response.error400({ message: 'Product not found.!' });
            }
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async deleteMultipleProduct(req, res) {
        let response = new Response(res);
        try {
            const { ids } = req.body;
            if (ids && ids.length > 0) {
                let productDelete = await ProductYahooSellingService.findById(ids[0]);
                let yahooAccount = await AccountYahooService.findById(productDelete.yahoo_account_id);
                if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        let result = [];

                        for (const id of ids) {
                            try {
                                productDelete = await ProductYahooSellingService.findById(id);
                                let resultDelete = null;
                                if (!productDelete.buyer_count || productDelete.buyer_count === 0) {
                                    resultDelete = await AuctionYahooService.cancelAuction(productDelete.aID, yahooAccount.cookie, proxyResult.data);
                                }

                                if (resultDelete.status === 'SUCCESS') {
                                    await ProductYahooSellingService.delete(_id);
                                }
                                result.push(resultDelete);
                            } catch (error) {
                                result.push({ type: 'ERROR', message: error.message });
                            }
                        }
                        return response.success200({ result });
                    } else {
                        return response.error400({ message: 'Proxy Error.!' });
                    }
                } else {
                    return response.error400({ message: 'Yahoo Account Error.!' });
                }
            } else {
                return response.success200({});
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async setNote(req, res) {
        let response = new Response(res);
        try {
            let { note, product_id } = req.body;
            let product = await ProductYahooSellingService.update(product_id, { note });
            return response.success200({ product });
        } catch (error) {
            response.error500(error);
        }
    }
}
