import ProductYahooSellingModel from '../models/ProductYahooSellingModel';
import UserService from './UserService';
import ProxyService from './ProxyService';
import AuctionYahooService from './AuctionYahooService';
import ProductYahooAuctionService from './ProductYahooAuctionService';
import AccountYahooService from './AccountYahooService';
import SocketIOService from './SocketIOService';
import Utils from '../utils/Utils';

export default class ProductYahooSellingService {
    static async refreshDataYahoo(yahoo_account_id) {
        let listProduct = [];
        let accountYahoo = await AccountYahooService.findById(yahoo_account_id);

        try {
            let is_lock_user = await UserService.checkUser_Lock_Exprired(accountYahoo.user_id);
            if (!is_lock_user && accountYahoo.status === 'SUCCESS' && accountYahoo.cookie) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let listProductSelling = await AuctionYahooService.getProductAuctionSelling(accountYahoo.cookie, proxyResult.data);
                    SocketIOService.emitData(accountYahoo.user_id, {
                        type: 'SELLING',
                        isLoading: true,
                        progress: 0,
                        total: listProductSelling.length,
                    });
                    await Utils.sleep(1000);
                    listProductSelling = listProductSelling.reverse();
                    let listProductInDB = await ProductYahooSellingService.find({ yahoo_account_id: accountYahoo._id });
                    // console.log(' ##### startGetProductYahoo listProductSelling: ', listProductSelling);
                    // tạo , update product
                    for (let j = 0; j < listProductSelling.length; j++) {
                        const product = listProductSelling[j];
                        //Check Xem có trong db chưa.
                        let productExisted = listProductInDB.find((item) => item.aID === product.aID);
                        //chưa có thì tạo mới.
                        if (!productExisted) {
                            let productYahoo = await ProductYahooAuctionService.findOne({ aID: product.aID });
                            if (!productYahoo && product.title) {
                                productYahoo = await ProductYahooAuctionService.findOne({
                                    product_yahoo_title: { $regex: product.title.replace(/\(/g, '\\(').replace(/\)/g, '\\)') },
                                });
                            }
                            if (productYahoo) {
                                let newProductYahooEnded = {
                                    ...productYahoo._doc,
                                    ...product,
                                };
                                delete newProductYahooEnded._id;
                                newProductYahooEnded = await ProductYahooSellingService.create(newProductYahooEnded);
                                listProduct.push(newProductYahooEnded);
                            }
                        } else {
                            let newProductYahooEnded = await ProductYahooSellingService.update(productExisted._id, { ...product, created: Date.now() });
                            listProduct.push(newProductYahooEnded);
                        }

                        SocketIOService.emitData(accountYahoo.user_id, {
                            type: 'SELLING',
                            isLoading: true,
                            progress: j + 1,
                            total: listProductSelling.length,
                        });
                        await Utils.sleep(1000);
                    }
                    // xóa product trong db
                    for (const productDB of listProductInDB) {
                        let checkDelete = true;
                        for (const productYAHOO of listProductSelling) {
                            if (productDB.aID === productYAHOO.aID || productDB.product_yahoo_title.includes(productYAHOO.title)) {
                                checkDelete = false;
                                break;
                            }
                        }
                        if (checkDelete) {
                            await ProductYahooSellingService.delete(productDB._id);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(' ### refreshDataYahoo: ', error);
        }

        SocketIOService.emitData(accountYahoo.user_id, {
            type: 'SELLING',
            isLoading: false,
            progress: 0,
            total: 0,
            listProduct: listProduct.reverse(),
        });
        await Utils.sleep(1000);
    }

    static async find(data) {
        try {
            let result = await ProductYahooSellingModel.find(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async get(idUser, yahoo_account_id) {
        try {
            let result = await ProductYahooSellingModel.find({ user_id: idUser, yahoo_account_id }).sort({ created: -1 });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async create(data) {
        try {
            let product = await ProductYahooSellingModel.create(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findById(id) {
        try {
            let product = await ProductYahooSellingModel.findById(id);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async findOne(data) {
        try {
            let product = await ProductYahooSellingModel.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductYahooSellingModel.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductYahooSellingModel.findById(productId);
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
            let product = await ProductYahooSellingModel.findById(productId);
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
