import ProductYahooEndedModel from '../models/ProductYahooEndedModel';
import UserService from './UserService';
import ProxyService from './ProxyService';
import AuctionYahooService from './AuctionYahooService';
import ProductYahooAuctionService from './ProductYahooAuctionService';
import AccountYahooService from './AccountYahooService';
import SocketIOService from './SocketIOService';

export default class ProductYahooEndedService {
    static async refreshDataYahoo(yahoo_account_id) {
        let listProduct = [];
        let accountYahoo = await AccountYahooService.findById(yahoo_account_id);
        try {
            let is_lock_user = await UserService.checkUser_Lock_Exprired(accountYahoo.user_id);
            if (!is_lock_user && accountYahoo.status === 'SUCCESS' && accountYahoo.cookie) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let listProductEnded = await AuctionYahooService.getProductAuctionEnded(
                        accountYahoo.yahoo_id,
                        accountYahoo.cookie,
                        proxyResult.data,
                        false,
                        accountYahoo,
                        true
                    );
                    listProductEnded = listProductEnded.reverse();
                    SocketIOService.emitData(accountYahoo.user_id, {
                        type: 'ENDED',
                        isLoading: true,
                        progress: listProductEnded.length / 2,
                        total: listProductEnded.length,
                    });

                    let listProductEndedInDB = await ProductYahooEndedService.find({ yahoo_account_id: accountYahoo._id });

                    // tạo , update product
                    for (let j = 0; j < listProductEnded.length; j++) {
                        const product = listProductEnded[j];

                        //amount_actual
                        //Check Xem có trong db chưa.
                        let productExisted = listProductEndedInDB.find(
                            (item) => item.aID === product.aID || item.product_yahoo_title.includes(product.title)
                        );
                        //chưa có thì tạo mới.
                        if (!productExisted) {
                            let productYahoo = await ProductYahooAuctionService.findOne({ aID: product.aID });
                            if (!productYahoo && product.title) {
                                let regex = product.title.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
                                productYahoo = await ProductYahooAuctionService.findOne({
                                    product_yahoo_title: { $regex: regex },
                                });
                            }
                            if (productYahoo) {
                                let newProductYahooEnded = {
                                    ...productYahoo._doc,
                                    ...product,
                                    yahoo_account_id,
                                    user_id: accountYahoo.user_id,
                                    created: Date.now(),
                                };
                                delete newProductYahooEnded._id;
                                newProductYahooEnded = await ProductYahooEndedService.create(newProductYahooEnded);
                                listProduct.push(newProductYahooEnded);
                            } else {
                                let infoProductEnded = await AuctionYahooService.getDetailInfoProductEnded(product.aID, accountYahoo.cookie, proxyResult.data);
                                if (infoProductEnded) {
                                    infoProductEnded = {
                                        ...infoProductEnded,
                                        ...product,
                                        yahoo_auction_category_id: '',
                                        product_yahoo_title: product.title,
                                        yahoo_account_id,
                                        user_id: accountYahoo.user_id,
                                    };

                                    let newProductYahooEnded = await ProductYahooEndedService.create(infoProductEnded);
                                    listProduct.push(newProductYahooEnded);
                                }
                            }
                        } else {
                            let newProductYahooEnded = await ProductYahooEndedService.update(productExisted._id, { ...product, created: Date.now() });
                            listProduct.push(newProductYahooEnded);
                        }
                        SocketIOService.emitData(accountYahoo.user_id, {
                            type: 'ENDED',
                            isLoading: true,
                            progress: (listProductEnded.length + j + 1) / 2,
                            total: listProductEnded.length,
                        });
                    }

                    // xóa product trong db
                    for (const productDB of listProductEndedInDB) {
                        let checkDelete = true;
                        for (const productYAHOO of listProductEnded) {
                            if (productDB.aID === productYAHOO.aID || productDB.product_yahoo_title.includes(productYAHOO.title)) {
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
        listProduct = listProduct.reverse();
        SocketIOService.emitData(accountYahoo.user_id, {
            type: 'ENDED',
            isLoading: false,
            progress: 0,
            total: 0,
            listProduct: listProduct.reverse(),
        });
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
            let result = await ProductYahooEndedModel.find({ user_id: idUser, yahoo_account_id }).sort({ created: -1 });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async create(data) {
        try {
            let new_product = new ProductYahooEndedModel(data);
            await new_product.save();
            return new_product;
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
