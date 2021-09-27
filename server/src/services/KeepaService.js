import Axios from 'axios';
import ApiKeyController from '../controllers/ApiKeyController';
import AsinAmazonModel from '../models/AsinAmazonModel';
import Utils from '../utils/Utils';
import ProductYahooService from './ProductYahooService';

const getData = async (listAsin, user_id) => {
    let listResult = [];
    try {
        let token = `82stsotg8m0qivjvcbsvn08f1t229kilkljgvi6057buv80631tbtlgdvtinj6e9`;
        try {
            let apiKey = await ApiKeyController.getApiKeyByUser(user_id);
            if (apiKey && apiKey.is_keepa && apiKey.token_keepa) {
                token = apiKey.token_keepa;
            }
        } catch (error) {
            console.log(' ### Keepa ApiKeyController.getApiKeyByUser: ', error);
        }
        let res = null;
        let errorRes = null;
        do {
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
            let url = `https://api.keepa.com/product?key=${token}&domain=5&asin=${listAsin.join(',')}&stock=1&rating=1`;
            if (errorRes && errorRes.response && errorRes.response.status === 429) {
                console.log(' ======== Sleep 429 ============ ');
                console.log(' tokensLeft: ', errorRes.response.data.tokensLeft);
                await Utils.sleep(60 * 1000);
            }
            try {
                res = await Axios.post(url);
            } catch (error) {
                console.log(' ####### KeepaService call api: ', error.message);
                errorRes = error;
            }
        } while (errorRes && errorRes.response && errorRes.response.status === 429);

        if (res && res.status === 200) {
            for (const productData of res.data.products) {
                let priceAndCountData = await ProductYahooService.getPriceAndCountByAmazon(productData.asin, user_id);
                console.log(' ############# priceAndCountData: ', priceAndCountData);

                let result = {
                    asin: '',
                    data: '',
                    status: '',
                    message: '',
                };
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
                    // if (productData.liveOffersOrder && productData.liveOffersOrder.length > 0 && productData.offers && productData.offers.length > 0) {
                    //     let liveOffersOrder = productData.liveOffersOrder[0];
                    //     let offer = productData.offers[liveOffersOrder];
                    //     price = offer.offerCSV[offer.offerCSV.length - 2];
                    //     ship_fee = offer.offerCSV[offer.offerCSV.length - 1];
                    //     if (offer.isShippable) {
                    //         count = 1;
                    //     }
                    // }
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
                            category_id: productData.categories[0],
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
                    console.log(' #### KEEPA ERROR: ', error.message);
                    result = {
                        asin: productData.asin,
                        data: null,
                        status: 'ERROR',
                        message: 'エラー: ' + error.message,
                    };
                }
                listResult.push(result);
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
