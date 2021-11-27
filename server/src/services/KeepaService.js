import Axios from 'axios';
import ApiKeyController from '../controllers/ApiKeyController';
import ApiKeyModel from '../models/ApiKeyModel';
import AsinAmazonModel from '../models/AsinAmazonModel';
import Utils from '../utils/Utils';
import ProductYahooService from './ProductYahooService';
import lodash from 'lodash';

const getData = async (listAsin, user_id) => {
    let listResult = [];
    try {
        console.log(' getData ====== listAsin: ', listAsin);
        let tokenAdmin = `82stsotg8m0qivjvcbsvn08f1t229kilkljgvi6057buv80631tbtlgdvtinj6e9`;
        let tokenUser = '';
        let apiKey = await ApiKeyController.getApiKeyByUser(user_id);
        if (apiKey && apiKey.is_keepa && apiKey.token_keepa) {
            tokenUser = apiKey.token_keepa;
        }
        let listApiKeyAllUser = await ApiKeyModel.find({ is_keepa: true });
        let listTokenAllUser = listApiKeyAllUser.map((item) => item.token_keepa).filter((x) => x && x.trim() != '' && x.trim() !== tokenUser);
        listTokenAllUser.unshift(tokenUser);
        listTokenAllUser.push(tokenAdmin);

        listTokenAllUser = lodash.uniqBy(listTokenAllUser);

        let newListAsin = [];
        for (let i = 0; i < listAsin.length; i++) {
            const asin = listAsin[i];
            let checkExistAsin = await AsinAmazonModel.findOne({ code: asin });
            if (checkExistAsin) {
                newListAsin.push(asin);
            }
        }
        listAsin = newListAsin;
        if (listAsin.length === 0) {
            return {
                status: 'SUCCESS',
                data: [],
            };
        }
        let res = null;
        var productGetted = false;
        while (!productGetted) {
            console.log(' ============ Keepa running =========== ');
            for (let i = 0; i < listTokenAllUser.length; i++) {
                const token = listTokenAllUser[i];
                try {
                    let url = `https://api.keepa.com/product?key=${token}&domain=5&asin=${listAsin.join(',')}&stock=1&rating=1`;
                    res = await Axios.post(url);
                    if (res && res.status === 200) {
                        productGetted = true;
                        break;
                    }
                } catch (error) {
                    console.log(' ####### KeepaService call api: ', error.message);
                }
            }
            if (productGetted) {
                break;
            }
            await Utils.sleep(10 * 60 * 1000);
        }
        if (res && res.status === 200) {
            for (let i = 0; i < res.data.products.length; i++) {
                const productData = res.data.products[i];
                try {
                    let result = {
                        asin: '',
                        data: '',
                        status: '',
                        message: '',
                    };
                    let priceAndCountData = await ProductYahooService.getPriceAndCountByAmazon(productData.asin, user_id);
                    if (!priceAndCountData) {
                        result = {
                            asin: productData.asin,
                            data: null,
                            status: 'ERROR',
                            message: 'エラー: ASINから商品が見つかりませんでした',
                        };
                    } else {
                        try {
                            let ship_fee = 0;
                            let price = 0;
                            let count = 0;
                            let images = [];
                            let description = '';
                            let title = '';

                            if (priceAndCountData) {
                                count = priceAndCountData.count;
                                price = priceAndCountData.price || 0;
                                ship_fee = priceAndCountData.ship_fee || 0;
                            }

                            if (productData.title) {
                                title = productData.title;
                                if (productData.color) {
                                    title = productData.color + ' ' + title;
                                }
                                if (productData.size) {
                                    title = productData.size + ' ' + title;
                                }
                            }
                            if (title.length > 65) {
                                title = title.substring(0, 65);
                            }
                            if (productData.imagesCSV) {
                                images = productData.imagesCSV.split(',').map((item) => 'https://images-na.ssl-images-amazon.com/images/I/' + item);
                            }
                            if (productData.features) {
                                if (Array.isArray(productData.features)) {
                                    productData.features.map((item) => {
                                        description += '・' + item + '\n';
                                    });
                                } else {
                                    description = productData.features;
                                    description = productData.features.replace(/\n+/g, '\n');
                                    description = description
                                        .split('\n')
                                        .map((item) => '・' + item)
                                        .join('\n');
                                }
                            } else if (productData.description) {
                                description = productData.description.replace(/\n+/g, '\n');
                                description = description
                                    .split('\n')
                                    .map((item) => '・' + item)
                                    .join('\n');
                            }
                            result = {
                                asin: productData.asin,
                                data: {
                                    asin: productData.asin,
                                    name: title,
                                    category_id: productData.categories && productData.categories[0] ? productData.categories[0] : '',
                                    description,
                                    images,
                                    price,
                                    ship_fee,
                                    count,
                                },
                                status: 'SUCCESS',
                                message: '成功',
                            };
                        } catch (error) {
                            console.log(' #### KEEPA ERROR: ', error);
                            result = {
                                asin: productData.asin,
                                data: null,
                                status: 'ERROR',
                                message: 'エラー: ' + error.message,
                            };
                        }
                    }
                    listResult.push(result);
                } catch (error) {
                    console.log(' #### KEEPA ERROR: ', error);
                    result = {
                        asin: productData.asin,
                        data: null,
                        status: 'ERROR',
                        message: 'エラー: ' + error.message,
                    };
                    listResult.push(result);
                }
            }
        } else {
            console.log(' ###### errorRes: ', res);
            return {
                status: 'ERROR',
                message: 'エラー Keepa: ' + errorRes.response.status + '-' + errorRes.response.statusText,
                data: listAsin,
            };
        }
        return {
            status: 'SUCCESS',
            data: listResult,
        };
    } catch (error) {
        console.log(' ####### KeepaService getData: ', error.message);
        return {
            status: 'ERROR',
            message: 'エラー: ' + error.message,
            data: listAsin,
        };
    }
};

export default class KeepaService {
    static async findProduct(listAsin, user_id) {
        return await getData(listAsin, user_id);
    }

    // static async findProduct(listAsin) {
    //     if (listAsin.length > 100) {
    //         let count = 100;
    //         let currentIndex = 0;
    //         let listResult = [];
    //         while (count <= listAsin.length) {
    //             let newListResult = await getData(listAsin.slice(currentIndex, count));
    //             currentIndex += 100;
    //             listResult = listResult.push(newListResult);
    //             let sub = listAsin.length - count;
    //             if (sub > 0) {
    //                 if (sub > 100) {
    //                     count += 100;
    //                 } else {
    //                     count += sub;
    //                 }
    //             } else {
    //                 break;
    //             }
    //         }
    //         return listResult;
    //     } else {
    //         return [await getData(listAsin)];
    //     }
    // }
}
