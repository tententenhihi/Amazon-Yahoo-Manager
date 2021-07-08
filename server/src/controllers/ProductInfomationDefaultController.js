import Response from '../utils/Response';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';

export default class ProductInfomationDefaultController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let products = await ProductInfomationDefaultService.get(user._id);
            return response.success200({ products });
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
                product_status,
                product_status_des,
                price_cut_negotiations,
                quantity,
                holding_period,
                ending_time,
                returnAbility,
                remarks_for_returns,
                bid_limit,
                automatic_extension,
                early_termination,
                auto_relisting,
                paid_type,
                shipping_cost,
                prefecture,
                address,
                shipping_method_1,
                shipping_rate_1,
                shipping_method_2,
                shipping_rate_2,
                shipping_method_3,
                shipping_rate_3,
                overseas_shipping,
                ship_schedule,
                featured_auction,
                bold_text,
                bg_color,
                conspicuous_icon,
                gift_icon,
            } = req.body;
            let user = req.user;

            // if (!product_status || !price_cut_negotiations || !quantity || !holding_period || !ending_time || !returnAbility ||
            //     !auto_relisting || !paid_type ||  !shipping_cost || !prefecture || !address || !ship_schedule) {
            //     response.error400({ message: 'Please input all required fields'})
            // }

            let data = {
                user_id: user._id,
                product_status,
                product_status_des,
                price_cut_negotiations,
                quantity,
                holding_period,
                ending_time,
                returnAbility,
                remarks_for_returns,
                bid_limit,
                automatic_extension,
                early_termination,
                auto_relisting,
                paid_type,
                shipping_cost,
                prefecture,
                address,
                shipping_method_1,
                shipping_rate_1,
                shipping_method_2,
                shipping_rate_2,
                shipping_method_3,
                shipping_rate_3,
                overseas_shipping,
                ship_schedule,
                featured_auction,
                bold_text,
                bg_color,
                conspicuous_icon,
                gift_icon,
            };

            let result = await ProductInfomationDefaultService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async getDetailProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            console.log(_id);
            let result = await ProductInfomationDefaultService.show(_id);
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
