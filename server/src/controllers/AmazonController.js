import Response from '../utils/Response';
import ProductAmazonService from '../services/ProductAmazonService';
import ProductAmazonSchema from '../models/ProductAmazonModel';
const UploadFile = require('../helpers/uploadFile')

export default class AmazonController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let listProduct = await ProductAmazonService.get(user._id);
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

    static async createProduct (req, res) {
        let response = new Response(res);
        try {
            let { asin, url, name, price, delivery, countProduct, infoDetail, type, status } = JSON.parse(req.body.payload)
            let user = req.user

            if (!asin) {
                response.error400({message: 'Asin is required'})
            }
            if (!url) {
                response.error400({message: 'Url is required'})
            }
            if (!name) {
                response.error400({message: 'Name is required'})
            }
            if (!price) {
                response.error400({message: 'Price is required'})
            }
            if (!delivery) {
                response.error400({message: 'Delivery is required'})
            }
            if (!countProduct) {
                response.error400({message: 'Count product is required'})
            }
            if (!infoDetail) {
                response.error400({message: 'Info detail is required'})
            }
            if (!ProductAmazonSchema.TYPE.includes(type)) {
                response.error400({message: 'Type is required'})
            }
            if (!ProductAmazonSchema.STATUS.includes(status)) {
                response.error400({message: 'Status is required'})
            }

            let data = {
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
            }

            if (req.files && req.files.image) {
                data.image = await UploadFile(req.files.image, { disk: 'products/' + user._id + '/' })
            } else {
                response.error400({message: 'Image is required'})
            }

            let result = await ProductAmazonService.create(data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async updateProduct (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let { asin, url, name, price, delivery, countProduct, infoDetail, type, status } = JSON.parse(req.body.payload)
            let user = req.user

            if (!asin) {
                response.error400({message: 'Asin is required'})
            }
            if (!url) {
                response.error400({message: 'Url is required'})
            }
            if (!name) {
                response.error400({message: 'Name is required'})
            }
            if (!price) {
                response.error400({message: 'Price is required'})
            }
            if (!delivery) {
                response.error400({message: 'Delivery is required'})
            }
            if (!countProduct) {
                response.error400({message: 'Count product is required'})
            }
            if (!infoDetail) {
                response.error400({message: 'Info detail is required'})
            }
            if (!ProductAmazonSchema.TYPE.includes(type)) {
                response.error400({message: 'Type is required'})
            }
            if (!ProductAmazonSchema.STATUS.includes(status)) {
                response.error400({message: 'Status is required'})
            }

            let data = {
                asin,
                name,
                url,
                price,
                delivery,
                countProduct,
                infoDetail,
                type,
                status,
            }

            if (req.files && req.files.image) {
                data.image = await UploadFile(req.files.image, { disk: 'products/' + user._id })
            }

            let result = await ProductAmazonService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async getDetailProduct (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let result = await ProductAmazonService.show(_id);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }
    
    static async deleteProduct (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let result = await ProductAmazonService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error)
        }
    }
    static async createProductByCSV (req, res) {
        let response = new Response(res);
        try {
            let data = req.body;
            const user = req.user
            data = data.map(item => {
                item.idUser = user._id
                item.infoDetail = []
                return item;
            })
            let result = await ProductAmazonService.createByCsv(data);
            if (result) {
                response.success200({products: result});
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
