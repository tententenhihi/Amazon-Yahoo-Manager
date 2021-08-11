import ProductYahooFinishedModel from '../models/ProductYahooFinishedModel';
import UserService from './UserService';
import ProxyService from './ProxyService';
import AuctionYahooService from './AuctionYahooService';
import ProductYahooAuctionService from './ProductYahooAuctionService';
import AccountYahooService from './AccountYahooService';

export default class ProductYahooFinishedService {
    static async refreshDataYahoo(yahoo_account_id) {
        let listProduct = [];
        try {
            let accountYahoo = await AccountYahooService.findById(yahoo_account_id);
            let is_lock_user = await UserService.checkUser_Lock_Exprired(accountYahoo.user_id);
            if (!is_lock_user && accountYahoo.status === 'SUCCESS' && accountYahoo.cookie && !accountYahoo.is_lock) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let listProductFinished = await AuctionYahooService.getProductAuctionFinished(accountYahoo.cookie, proxyResult.data);
                    let listProductInDB = await ProductYahooFinishedService.find({ yahoo_account_id: accountYahoo._id });
                    console.log(' ##### startGetProductYahoo getProductAuctionFinished: ', listProductFinished);
                    // tạo , update product
                    for (let j = 0; j < listProductFinished.length; j++) {
                        const product = listProductFinished[j];
                        //Check Xem có trong db chưa.
                        let productExisted = listProductInDB.find((item) => item.aID === product.aID);
                        //chưa có thì tạo mới.
                        if (!productExisted) {
                            let productYahoo = await ProductYahooAuctionService.findOne({ aID: product.aID });
                            if (!productYahoo && product.title) {
                                productYahoo = await ProductYahooAuctionService.findOne({ product_yahoo_title: { $regex: product.title } });
                            }
                            if (productYahoo) {
                                let newProductYahooEnded = {
                                    ...productYahoo._doc,
                                    ...product,
                                    _id: null,
                                };
                                newProductYahooEnded = await ProductYahooFinishedService.create(newProductYahooEnded);
                                listProduct.push(newProductYahooEnded);
                            }
                        } else {
                            let newProductYahooEnded = await ProductYahooFinishedService.update(productExisted._id, product);
                            listProduct.push(newProductYahooEnded);
                        }
                    }
                    // xóa product trong db
                    for (const productDB of listProductInDB) {
                        let checkDelete = true;
                        for (const productYAHOO of listProductFinished) {
                            if (productDB.aID === productYAHOO.aID) {
                                checkDelete = false;
                                break;
                            }
                        }
                        if (checkDelete) {
                            await ProductYahooFinishedService.delete(productDB._id);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(' ### refreshDataYahoo: ', error);
        }
        return listProduct;
    }

    static async find(data) {
        try {
            let result = await ProductYahooFinishedModel.find(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async get(idUser, yahoo_account_id) {
        try {
            let result = await ProductYahooFinishedModel.find({ user_id: idUser, yahoo_account_id }).sort({ created: -1 });;
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async create(data) {
        try {
            let product = await ProductYahooFinishedModel.create(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findById(id) {
        try {
            let product = await ProductYahooFinishedModel.findById(id);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findOne(data) {
        try {
            let product = await ProductYahooFinishedModel.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductYahooFinishedModel.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductYahooFinishedModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            } else {
                return product._doc;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async delete(productId) {
        try {
            let product = await ProductYahooFinishedModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            } else {
                await product.remove();
                return true;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
