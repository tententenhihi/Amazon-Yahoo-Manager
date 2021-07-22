import Response from '../utils/Response';
import ProductYahooEndedService from '../services/ProductYahooEndedService';
import AuctionYahooService from '../services/AuctionYahooService';
import UploadFile from '../helpers/UploadFile';
import AccountYahooService from '../services/AccountYahooService';
import ProxyService from '../services/ProxyService';

export default class ProductYahooEndedController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let { yahoo_account_id } = req.params;
            let products = await ProductYahooEndedService.get(user._id, yahoo_account_id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async showProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let product = await ProductYahooEndedService.show(_id);
            if (product) {
                response.success200({ product });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let data = req.body;
            let product = await ProductYahooEndedService.update(_id, data);
            response.success200({ product });
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooEndedService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async stopTransaction(req, res) {
        let response = new Response(res);
        try {
            const { idYahoo, idProduct, idBuyer, reason } = req.params;
            let accountYahoo = await AccountYahooService.findById(idYahoo);
            const cookie = accountYahoo.cookie;
            const idProxy = accountYahoo.proxy_id;
            const resultCheckProxy = await ProxyService.findByIdAndCheckLive(idProxy);
            if (resultCheckProxy.status === 'SUCCESS') {
                let result = await AuctionYahooService.stopTransaction(cookie, resultCheckProxy.data, idProduct, idBuyer, reason);
                if (result.status === 'SUCCESS') {
                    return response.success200(result);
                } else {
                    return response.error400(result);
                }
            } else {
                return response.error400(resultCheckProxy);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async sendMessage(req, res) {
        let response = new Response(res);
        try {
            let { message, product_id } = req.body;
            let productEnded = await ProductYahooEndedService.findById(product_id);
            if (!productEnded) {
                return response.error400({ message: 'Product Yahoo not found..!' });
            }
            //Send Message
            let yahooAccount = await AccountYahooService.findById(productEnded.yahoo_account_id);
            if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
                let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let resultSendMessage = await AuctionYahooService.sendMessage(
                        yahooAccount.cookie,
                        proxyResult.data,
                        productEnded.aID,
                        yahooAccount.yahoo_id,
                        productEnded.idBuyer,
                        message
                    );
                    if (resultSendMessage.status === 'SUCCESS') {
                        let message_list = [
                            {
                                yahoo_id: yahooAccount.yahoo_id,
                                comment: message,
                                created_at: Date.now(),
                                type: 'seller',
                            },
                            ...productEnded.message_list,
                        ];
                        let product = await ProductYahooEndedService.update(productEnded._id, { message_list });
                        return response.success200({ product });
                    } else {
                        return response.error400({ message: resultSendMessage.message });
                    }
                } else {
                    return response.error400({ message: proxyResult.statusMessage });
                }
            } else {
                return response.error400({ message: 'User is Failse.!' });
            }
        } catch (error) {
            response.error500(error);
        }
    }
    static async sendRating(req, res) {
        let response = new Response(res);
        try {
            let { rating, product_id } = req.body;
            let productEnded = await ProductYahooEndedService.findById(product_id);
            if (!productEnded) {
                return response.error400({ message: 'Product Yahoo not found..!' });
            }
            let accountYahoo = await AccountYahooService.findById(productEnded.yahoo_account_id);
            const cookie = accountYahoo.cookie;
            const idProxy = accountYahoo.proxy_id;
            const resultCheckProxy = await ProxyService.findByIdAndCheckLive(idProxy);
            if (resultCheckProxy.status === 'SUCCESS') {
                let result = await AuctionYahooService.sendRating(cookie, resultCheckProxy.data, productEnded.aID, productEnded.idBuyer, rating);
                if (result.status === 'SUCCESS') {
                    let rating_list = [...productEnded.rating_list, rating];
                    let product = await ProductYahooEndedService.update(productEnded._id, { rating_list });
                    return response.success200({ product });
                } else {
                    return response.error400(result);
                }
            } else {
                return response.error400(resultCheckProxy);
            }
        } catch (error) {
            response.error500(error);
        }
    }
    static async setNote(req, res) {
        let response = new Response(res);
        try {
            let { note, product_id } = req.body;
            let product = await ProductYahooEndedService.update(product_id, { note });
            return response.success200({ product });
        } catch (error) {
            response.error500(error);
        }
    }
}
