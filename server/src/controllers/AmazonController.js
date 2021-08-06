import Response from '../utils/Response';
import ProductAmazonService from '../services/ProductAmazonService';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';
import ProductYahooService from '../services/ProductYahooService';
import CategoryService from '../services/CategoryService';
const UploadFile = require('../helpers/UploadFile');

export default class AmazonController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let { yahoo_account_id } = req.params;
            let listProduct = await ProductAmazonService.get(user._id, yahoo_account_id);
            return response.success200({ listProduct });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async getInfoProductByASIN(req, res) {
        let response = new Response(res);
        try {
            let asin = req.body.asin;
            let productInfo = await ProductAmazonService.getProductByAsin(asin);
            return response.success200({ productInfo });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async createProduct(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;

            let data = JSON.parse(req.body.payload);
            data.url = 'https://www.amazon.co.jp/dp/' + data.asin;
            data.idUser = user._id;
            data.images = [];

            if (!data.asin) {
                response.error400({ message: 'ASINは必須です' });
            }
            if (!data.name) {
                response.error400({ message: '名は必須です' });
            }
            if (!data.basecost) {
                response.error400({ message: '価格は必須です' });
            }
            if (!data.delivery) {
                response.error400({ message: '配達は必須です' });
            }
            if (!data.countProduct) {
                response.error400({ message: '品数は必須です' });
            }
            if (!data.description) {
                response.error400({ message: '説明は必須です' });
            }
            console.log(data);
            if (req.files && data.image_length) {
                for (let index = 0; index < data.image_length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'products/' + user._id + '/' });
                    }
                }
            } else {
                return response.error400({ message: '画像は必須です' });
            }
            console.log(' ============== ');
            // profit
            let infoProfitDefault = await ProductInfomationDefaultService.findOne({ yahoo_account_id: data.yahoo_account_id });
            // giá gốc
            let basecost = parseFloat(data.basecost.toString());
            if (!basecost) {
                basecost = 0;
            }
            let profit = 0;
            let price = 0;

            if (infoProfitDefault && basecost) {
                if (infoProfitDefault.yahoo_auction_profit_type == 0) {
                    profit = (basecost * infoProfitDefault.yahoo_auction_price_profit) / 100;
                } else {
                    profit = infoProfitDefault.yahoo_auction_static_profit;
                }
                price = basecost + profit + infoProfitDefault.amazon_shipping;
                price = price / (1 - infoProfitDefault.yahoo_auction_fee / 100);
                price = Math.ceil(price);
                profit = Math.ceil(profit);
            } else {
                price = basecost;
            }

            if (data.shipping) {
                price += parseFloat(data.shipping.toString());
            }
            data = { ...data, basecost, profit, price };
            let result = await ProductAmazonService.create(data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let user = req.user;

            let data = JSON.parse(req.body.payload);
            data.url = 'https://www.amazon.co.jp/dp/' + data.asin;

            if (!data.asin) {
                response.error400({ message: 'ASINは必須です' });
            }
            if (!data.name) {
                response.error400({ message: '名は必須です' });
            }
            if (!data.basecost) {
                response.error400({ message: '価格は必須です' });
            }
            if (!data.delivery) {
                response.error400({ message: '配達は必須です' });
            }
            if (!data.countProduct) {
                response.error400({ message: '品数は必須です' });
            }
            if (!data.description) {
                response.error400({ message: '説明は必須です' });
            }

            if (req.files && req.files.image) {
                data.image = await UploadFile(req.files.image, { disk: 'products/' + user._id });
            }

            if (req.files && data.image_length) {
                for (let index = 0; index < data.image_length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'products/' + user._id + '/' });
                    }
                }
            } else if (!data.images.length) {
                return response.error400({ message: '画像は必須です' });
            }

            // profit
            let infoProfitDefault = await ProductInfomationDefaultService.findOne({ yahoo_account_id: data.yahoo_account_id });
            // giá gốc
            let basecost = parseFloat(data.basecost.toString());
            if (!basecost) {
                basecost = 0;
            }
            let profit = 0;
            let price = 0;

            if (infoProfitDefault && basecost) {
                if (infoProfitDefault.yahoo_auction_profit_type == 0) {
                    profit = (basecost * infoProfitDefault.yahoo_auction_price_profit) / 100;
                } else {
                    profit = infoProfitDefault.yahoo_auction_static_profit;
                }
                price = basecost + profit + infoProfitDefault.amazon_shipping;
                price = price / (1 - infoProfitDefault.yahoo_auction_fee / 100);
                price = Math.ceil(price);
                profit = Math.ceil(profit);
            } else {
                price = basecost;
            }
            if (data.shipping) {
                price += parseFloat(data.shipping.toString());
            }
            data = { ...data, basecost, profit, price };
            let result = await ProductAmazonService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async getDetailProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductAmazonService.show(_id);
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
            let result = await ProductAmazonService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async createProductByCSV(req, res) {
        let response = new Response(res);
        try {
            let data = req.body;
            const user = req.user;
            data = data.map((item) => {
                item.idUser = user._id;
                item.infoDetail = [];
                return item;
            });
            let result = await ProductAmazonService.createByCsv(data);
            if (result) {
                response.success200({ products: result });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async convertToYahooProduct(req, res) {
        let response = new Response(res);
        try {
            const user = req.user;
            const { amazon_product_ids, folder_id } = req.body;

            for (let index = 0; index < amazon_product_ids.length; index++) {
                let product_amazon_id = amazon_product_ids[index];
                let productAmazon = await ProductAmazonService.findOne({ _id: product_amazon_id });
                if (!productAmazon) {
                    return response.error400({ message: 'Not found amazon product.!' });
                }
                productAmazon.folder_id = folder_id;
                productAmazon.is_convert_yahoo = true;
                productAmazon.basecost = parseInt(productAmazon.basecost) || 0;
                productAmazon.profit = parseInt(productAmazon.profit) || 0;
                productAmazon.price = parseInt(productAmazon.price) || 0;
                productAmazon.shipping = parseInt(productAmazon.shipping) || 0;

                await productAmazon.save();
                // let existProductYahoo = await ProductYahooService.findOne({
                //     user_id: user._id,
                //     yahoo_account_id: productAmazon.yahoo_account_id,
                //     product_amazon_id,
                // });
                // if (existProductYahoo) {
                //     existProductYahoo.folder_id = folder_id;
                //     existProductYahoo.yahoo_account_id = productAmazon.yahoo_account_id;
                //     await existProductYahoo.save();
                // } else {
                let defaultSetting = await ProductInfomationDefaultService.findOne({ yahoo_account_id: productAmazon.yahoo_account_id, user_id: user._id });
                let cateAmazon = await CategoryService.findOne({ amazon_cate_id: productAmazon.category_id });
                if (!cateAmazon) {
                    cateAmazon = await CategoryService.create({
                        user_id: user._id,
                        amazon_cate_id: productAmazon.category_id,
                        asin: productAmazon.asin,
                    });
                }
                let cate_yahoo = cateAmazon.yahoo_cate_id || '0';
                //Dùng cate amazon Check xem có trong mapping k
                if (defaultSetting.extra_stock > 0) {
                    defaultSetting.extra_stock = 0;
                }
                let productYahoo = {
                    ...defaultSetting._doc,
                    id_category_amazon: productAmazon.category_id,
                    ship_fee1: defaultSetting.yahoo_auction_shipping,
                    extra_stock: defaultSetting.extra_stock,
                    asin_amazon: productAmazon.asin,
                    images: productAmazon.images,
                    user_id: productAmazon.idUser,
                    foreign_key: productAmazon._id,
                    product_yahoo_title: productAmazon.name,
                    yahoo_account_id: productAmazon.yahoo_account_id,
                    start_price: parseInt(productAmazon.price) || 0,
                    import_price: parseInt(productAmazon.basecost) || 0,
                    profit: productAmazon.profit,
                    description: productAmazon.description,
                    folder_id,
                    product_model: 'AMAZON',
                    yahoo_auction_category_id: cate_yahoo,
                    bid_or_buy_price: 0,
                    product_amazon_id: productAmazon._id,
                    created: Date.now(),
                    listing_status: 'NOT_LISTED',
                    count_product: productAmazon.countProduct && productAmazon.countProduct > 1 ? productAmazon.countProduct : 1,
                    amazon_shipping_fee: productAmazon.shipping,
                    yahooAuctionFee: defaultSetting.yahoo_auction_fee || 10,
                    _id: null,
                };
                await ProductYahooService.create(productYahoo);
                // }
            }

            return response.success200({ success: true });
        } catch (error) {
            console.log(' #### AmazonController -> convertToYahooProduct: ', error);
            response.error500(error);
        }
    }
    static async setShippingProduct(req, res) {
        let response = new Response(res);
        try {
            let { shipping } = req.body;
            let { _id } = req.params;
            let product = await ProductAmazonService.setShippingProduct(_id, shipping);
            if (product) {
                response.success200({ product });
            }
        } catch (error) {
            response.error500(error);
        }
    }
    static async deleteMultipleProduct(req, res) {
        let response = new Response(res);
        try {
            const { ids } = req.body;
            let result = null;
            for (let index = 0; index < ids.length; index++) {
                const element = ids[index];
                result = await ProductAmazonService.delete(element);
            }
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }
    static async deleteAllProduct(req, res) {
        let response = new Response(res);
        try {
            const { yahoo_account_id } = req.body;
            let result = await ProductAmazonService.deleteMultiple(yahoo_account_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }
}
