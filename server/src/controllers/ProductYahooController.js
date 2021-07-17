import Response from '../utils/Response';
import ProductYahooService from '../services/ProductYahooService';
import AuctionYahooService from '../services/AuctionYahooService';
import UploadFile from '../helpers/UploadFile';
import UserService from '../services/UserService';
import ProxyService from '../services/ProxyService';
import AccountYahooService from '../services/AccountYahooService';

export default class ProductYahooController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let products = await ProductYahooService.get(user._id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async createProduct(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {
                folder_id,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
                image_length,
            } = JSON.parse(req.body.payload);

            if (!folder_id || !product_yahoo_title || !yahoo_auction_category_id || !description || !location || !import_price) {
                return response.error400({ message: '必須フィールドをすべて入力してください' });
            }

            let data = {
                user_id: user._id,
                images: [],
                folder_id,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
            };
            if (req.files && image_length) {
                for (let index = 0; index < image_length; index++) {
                    const element = req.files[`image-` + index];
                    data.images.push(await UploadFile(element, { disk: 'yahoo-products/' + user._id + '/' }));
                }
            } else {
                return response.error400({ message: 'Image is required' });
            }
            let result = await ProductYahooService.create(data);

            setTimeout(async () => {
                //Upload product
                let yahooAccount = await AccountYahooService.findOne({ yahoo_id: 'exffk72575' });
                if (yahooAccount) {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, result, proxyResult.data);
                        console.log(uploadAuctionResult);
                        result.status = uploadAuctionResult.status;
                        result.statusMessage = uploadAuctionResult.statusMessage;
                        result.aID = uploadAuctionResult.aID;
                    } else {
                        result.status = proxyResult.status;
                        result.statusMessage = proxyResult.statusMessage;
                    }
                    await result.save();
                }
            }, 1);

            response.success200({ result });
        } catch (error) {
            console.log(error);
            console.log(error.response);

            response.error500(error);
        }
    }

    static async getDetailProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooService.show(_id);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            const { _id } = req.params;
            let {
                folder_id,
                images,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
                image_length,
            } = JSON.parse(req.body.payload);

            if (!folder_id || !product_yahoo_title || !yahoo_auction_category_id || !description || !location || !import_price) {
                return response.error400({ message: '必須フィールドをすべて入力してください' });
            }

            let data = {
                user_id: user._id,
                images,
                folder_id,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
            };
            if (req.files && image_length) {
                for (let index = 0; index < image_length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'yahoo-products/' + user._id + '/' });
                    }
                }
            }
            let result = await ProductYahooService.update(_id, data);
            response.success200({ result });
        } catch (error) {
            console.log(error);
            console.log(error.response);

            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooService.delete(_id);
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
            const { idYahoo, idProduct, idBuyer, message } = req.params;
            let accountYahoo = await AccountYahooService.findById(idYahoo);
            const cookie = accountYahoo.cookie;
            const idProxy = accountYahoo.proxy_id;
            const resultCheckProxy = await ProxyService.findByIdAndCheckLive(idProxy);
            if (resultCheckProxy.status === 'SUCCESS') {
                let result = await AuctionYahooService.sendMessage(cookie, resultCheckProxy.data, idProduct, accountYahoo.username, idBuyer, message);
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
    static async sendRating(req, res) {
        let response = new Response(res);
        try {
            const { idYahoo, idProduct, idBuyer, rating, message } = req.params;
            let accountYahoo = await AccountYahooService.findById(idYahoo);
            const cookie = accountYahoo.cookie;
            const idProxy = accountYahoo.proxy_id;
            const resultCheckProxy = await ProxyService.findByIdAndCheckLive(idProxy);
            if (resultCheckProxy.status === 'SUCCESS') {
                let result = await AuctionYahooService.sendRating(cookie, resultCheckProxy.data, idProduct, idBuyer, rating, message);
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
}
