import Response from '../utils/Response';
import ProductYahooFinishedService from '../services/ProductYahooFinishedService';
import AccountYahooService from '../services/AccountYahooService';
import AuctionYahooService from '../services/AuctionYahooService';
import ProxyService from '../services/ProxyService';

export default class ProductYahooFinishedController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let { yahoo_account_id } = req.params;
            let products = await ProductYahooFinishedService.get(user._id, yahoo_account_id);
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
            let productDelete = await ProductYahooFinishedService.findById(_id);
            if (productDelete) {
                let yahooAccount = await AccountYahooService.findById(productDelete.yahoo_account_id);
                if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        let result = await AuctionYahooService.deleteProductFinished(productDelete.aID, yahooAccount.cookie, proxyResult.data);
                        if (result.status === 'SUCCESS') {
                            await ProductYahooFinishedService.delete(_id);
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
            response.error500(error);
        }
    }

    static async deleteMultipleProduct(req, res) {
        let response = new Response(res);
        try {
            const { ids } = req.body;
            let listaID = [];
            let yahoo_account_id = null;
            for (let index = 0; index < ids.length; index++) {
                let productD = await ProductYahooFinishedService.findById(ids[index]);
                yahoo_account_id = productD.yahoo_account_id;
                listaID.push(productD.aID);
            }

            if (listaID.length > 0) {
                let yahooAccount = await AccountYahooService.findById(yahoo_account_id);
                if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        let result = await AuctionYahooService.deleteProductFinished(listaID, yahooAccount.cookie, proxyResult.data);
                        if (result.status === 'SUCCESS') {
                            for (const id of ids) {
                                await ProductYahooFinishedService.delete(id);
                            }
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
            }

            return response.success200({ success: true });
        } catch (error) {
            response.error500(error);
        }
    }

    static async setNote(req, res) {
        let response = new Response(res);
        try {
            let { note, product_id } = req.body;
            let product = await ProductYahooFinishedService.update(product_id, { note });
            return response.success200({ product });
        } catch (error) {
            response.error500(error);
        }
    }
}
