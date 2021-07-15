import Response from '../utils/Response';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';

export default class ProductInfomationDefaultController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let product = await ProductInfomationDefaultService.get(user._id);
            return response.success200(product);
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let {
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
                extra_stock,
                profit,
                yahoo_auction_shipping,
                makeshop_shipping,
                amazon_shipping,
                yahoo_auction_fee,
                yahoo_auction_profit_type,
                yahoo_auction_price_profit,
                yahoo_auction_static_profit,
                yahoo_auction_bid_price
            } = req.body;
            let user = req.user;

            let data = {
                user_id: user._id,
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
                extra_stock,
                profit,
                yahoo_auction_shipping,
                makeshop_shipping,
                amazon_shipping,
                yahoo_auction_fee,
                yahoo_auction_profit_type,
                yahoo_auction_price_profit,
                yahoo_auction_static_profit,
                yahoo_auction_bid_price
            };

            let result = await ProductInfomationDefaultService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductInfomationDefaultService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }
}
