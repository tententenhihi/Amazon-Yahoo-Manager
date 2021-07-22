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
            let { asin, url, name, price, delivery, countProduct, infoDetail, type, status, description, image_length, folder_id, yahoo_account_id } =
                JSON.parse(req.body.payload);
            let user = req.user;

            if (!asin) {
                response.error400({ message: 'Asin is required' });
            }
            if (!url) {
                response.error400({ message: 'Url is required' });
            }
            if (!name) {
                response.error400({ message: 'Name is required' });
            }
            if (!price) {
                response.error400({ message: 'Price is required' });
            }
            if (!delivery) {
                response.error400({ message: 'Delivery is required' });
            }
            if (!countProduct) {
                response.error400({ message: 'Count product is required' });
            }
            if (!infoDetail) {
                response.error400({ message: 'Info detail is required' });
            }
            // if (!ProductAmazonSchema.TYPE.includes(type)) {
            //     response.error400({ message: 'Type is required' });
            // }
            // if (!ProductAmazonSchema.STATUS.includes(status)) {
            //     response.error400({ message: 'Status is required' });
            // }
            if (!folder_id) {
                response.error400({ message: 'Folder is required' });
            }

            let data = {
                images: [],
                idUser: user._id,
                asin,
                name,
                url,
                price,
                delivery,
                countProduct,
                infoDetail,
                type,
                status,
                description,
                folder_id,
                yahoo_account_id,
            };

            if (req.files && image_length) {
                for (let index = 0; index < image_length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'products/' + user._id + '/' });
                    }
                }
            } else {
                return response.error400({ message: 'Image is required' });
            }

            let result = await ProductAmazonService.create(data);
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
            const { _id } = req.params;
            let { asin, url, name, price, delivery, countProduct, infoDetail, type, status, description, folder_id, images, image_length } = JSON.parse(
                req.body.payload
            );
            let user = req.user;

            if (!asin) {
                response.error400({ message: 'Asin is required' });
            }
            if (!url) {
                response.error400({ message: 'Url is required' });
            }
            if (!name) {
                response.error400({ message: 'Name is required' });
            }
            if (!price) {
                response.error400({ message: 'Price is required' });
            }
            if (!delivery) {
                response.error400({ message: 'Delivery is required' });
            }
            if (!countProduct) {
                response.error400({ message: 'Count product is required' });
            }
            if (!infoDetail) {
                response.error400({ message: 'Info detail is required' });
            }
            // if (!ProductAmazonSchema.TYPE.includes(type)) {
            //     response.error400({ message: 'Type is required' });
            // }
            // if (!ProductAmazonSchema.STATUS.includes(status)) {
            //     response.error400({ message: 'Status is required' });
            // }
            if (!folder_id) {
                response.error400({ message: 'Folder is required' });
            }

            let data = {
                images,
                asin,
                name,
                url,
                price,
                delivery,
                countProduct,
                infoDetail,
                type,
                status,
                description,
                folder_id,
            };

            if (req.files && req.files.image) {
                data.image = await UploadFile(req.files.image, { disk: 'products/' + user._id });
            }

            if (req.files && image_length) {
                for (let index = 0; index < image_length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'products/' + user._id + '/' });
                    }
                }
            } else if (!data.images.length) {
                return response.error400({ message: 'Image is required' });
            }

            let result = await ProductAmazonService.update(_id, data);
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
                let existProductYahoo = await ProductYahooService.findOne({
                    user_id: user._id,
                    yahoo_account_id: productAmazon.yahoo_account_id,
                    product_amazon_id,
                });
                if (existProductYahoo) {
                    existProductYahoo.folder_id = folder_id;
                    existProductYahoo.yahoo_account_id = productAmazon.yahoo_account_id;
                    await existProductYahoo.save();
                } else {
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
                        _id: null
                    };
                    await ProductYahooService.create(productYahoo);
                }
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
}
