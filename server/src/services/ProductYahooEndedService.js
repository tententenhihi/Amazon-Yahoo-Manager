import ProductYahooEndedModel from '../models/ProductYahooEndedModel';
import UserService from './UserService';
import ProxyService from './ProxyService';
import AuctionYahooService from './AuctionYahooService';
import ProductYahooAuctionService from './ProductYahooAuctionService';
import AccountYahooService from './AccountYahooService';

export default class ProductYahooEndedService {
    static async refreshDataYahoo(yahoo_account_id) {
        let listProduct = [];
        try {
            console.log(' ========================= ');
            let accountYahoo = await AccountYahooService.findById(yahoo_account_id);
            let is_lock_user = await UserService.checkUser_Lock_Exprired(accountYahoo.user_id);
            if (!is_lock_user && accountYahoo.status === 'SUCCESS' && accountYahoo.cookie && !accountYahoo.is_lock) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let listProductEnded = await AuctionYahooService.getProductAuctionEnded(accountYahoo.yahoo_id, accountYahoo.cookie, proxyResult.data);
                    let listProductEndedInDB = await ProductYahooEndedService.find({ yahoo_account_id: accountYahoo._id });

                    console.log(' ##### startGetProductYahoo listProductEnded: ', listProductEnded);
                    // tạo , update product
                    for (let j = 0; j < listProductEnded.length; j++) {
                        const product = listProductEnded[j];
                        //Check Xem có trong db chưa.
                        let productExisted = listProductEndedInDB.find((item) => item.aID === product.aID);
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
                                newProductYahooEnded = await ProductYahooEndedService.create(newProductYahooEnded);
                                listProduct.push(newProductYahooEnded);
                            }
                        } else {
                            let newProductYahooEnded = await ProductYahooEndedService.update(productExisted._id, product);
                            listProduct.push(newProductYahooEnded);
                        }
                    }
                    // xóa product trong db
                    for (const productDB of listProductEndedInDB) {
                        let checkDelete = true;
                        for (const productYAHOO of listProductEnded) {
                            if (productDB.aID === productYAHOO.aID) {
                                checkDelete = false;
                                break;
                            }
                        }
                        if (checkDelete) {
                            await ProductYahooEndedService.delete(productDB._id);
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
            let result = await ProductYahooEndedModel.find(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async get(idUser, yahoo_account_id) {
        try {
            let result = await ProductYahooEndedModel.find({ user_id: idUser, yahoo_account_id });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async create(data) {
        try {
            let product = await ProductYahooEndedModel.create(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findById(id) {
        try {
            let product = await ProductYahooEndedModel.findById(id);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findOne(data) {
        try {
            let product = await ProductYahooEndedModel.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductYahooEndedModel.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductYahooEndedModel.findById(productId);
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
            let product = await ProductYahooEndedModel.findById(productId);
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
