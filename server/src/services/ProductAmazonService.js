import Axios from 'axios';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';
import Utils from '../utils/Utils';
const cheerio = require('cheerio');

export default class ProductAmazonService {
    static async get(idUser, yahoo_account_id) {
        try {
            let result = await ProductAmazonSchema.find({ idUser, yahoo_account_id });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(' Error ProductAmazonService-get: ' + error.message);
        }
    }
    static async getProductByAsin(asinModel) {
        try {
            let headers = {
                Connection: 'keep-alive',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'max-age=0',
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36 Edg/91.0.864.48',
                'upgrade-insecure-requests': '1',
                'sec-ch-ua': `Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91`,
                authority: 'www.amazon.co.jp',
                origin: 'https://www.amazon.co.jp',
                referer: 'https://www.amazon.co.jp/',
            };
            let requestAmazon = await Axios.get(`https://www.amazon.co.jp/s?k=${asinModel.code}`, { headers });
            if (requestAmazon && requestAmazon.status === 200) {
                let html = requestAmazon.data;
                let $ = cheerio.load(html);
                let listItemProduct = $(
                    '#search > div.s-desktop-width-max.s-opposite-dir > div > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div'
                );

                if (!listItemProduct || listItemProduct.length == 0) {
                    return {
                        type: 'error',
                        message: 'Not found any product',
                    };
                }
                let listProductResult = [];
                for (let i = 0; i < listItemProduct.length; i++) {
                    const item = listItemProduct[i];
                    let asinItem = $(item).attr('data-asin');
                    if (asinItem && asinItem != '') {
                        let aTag = $(item).find('.a-link-normal.s-no-outline');
                        if (aTag && aTag.attr('href')) {
                            let url = `https://www.amazon.co.jp/` + aTag.attr('href').trim();
                            let requestProductAmazon = await Axios.get(url, { headers });
                            if (requestAmazon && requestAmazon.status === 200) {
                                let productInfo = [];
                                $ = cheerio.load(requestProductAmazon.data);
                                let nameProduct = $('#productTitle').text().trim();
                                let priceProduct = $('#priceblock_ourprice').text().trim();
                                if (!priceProduct) {
                                    priceProduct = $('#price_inside_buybox').text().trim();
                                }
                                if (!priceProduct) {
                                    priceProduct = $('#priceblock_dealprice').text().trim();
                                }
                                let delivery = $($('#mir-layout-DELIVERY_BLOCK-slot-DELIVERY_MESSAGE')['0']).text().replace(/\n/g, '').trim();
                                if (!delivery) {
                                    // delivery = $('#x').text().trim();
                                }

                                let imageProduct = $('#landingImage').attr('src');
                                let containerProductInfo = $('#prodDetails');
                                let listTableInfo = containerProductInfo.find('table');
                                let asin = null;
                                if (listTableInfo && listTableInfo.length > 0) {
                                    for (const tableInfo of listTableInfo) {
                                        let listRowOfTable = $(tableInfo).find('tr');
                                        for (const rowTable of listRowOfTable) {
                                            let title = $(rowTable).find('th').text().replace(/\n/g, '').trim();
                                            let value = $(rowTable).find('td').text().replace(/\n/g, '').trim();
                                            if (Utils.toString(title.toLowerCase()) === 'asin') {
                                                asin = value;
                                            }
                                            productInfo.push({
                                                name: title,
                                                value,
                                            });
                                        }
                                    }
                                } else {
                                    let containerDetailBullets = $('#detailBulletsWrapper_feature_div');
                                    let listULInfo = containerDetailBullets.find('ul');
                                    for (const ulInfo of listULInfo) {
                                        let infoRows = $(ulInfo).find('li');
                                        for (const infoRow of infoRows) {
                                            let title = $(infoRow).find('span > span.a-text-bold').text().replace(/\n/g, '').replace(':', '').trim();
                                            let value = $(infoRow).find('span > span:nth-child(2)').text().replace(/\n/g, '').replace(/:/g, '').trim();
                                            if (title && !value) {
                                                value = $(infoRow).find('span > a').text().replace(/\n/g, '').replace(/:/g, '').trim();
                                            }
                                            if (title || value) {
                                                if (Utils.toString(title.toLowerCase()) == 'asin') {
                                                    console.log(' =============================');
                                                    asin = value;
                                                }
                                                productInfo.push({
                                                    name: title,
                                                    value,
                                                });
                                            }
                                        }
                                    }
                                }

                                if (!asin) {
                                    asin = asinModel.code;
                                }

                                let infomationDefault = await ProductInfomationDefaultService.findOne({ yahoo_account_id: asinModel.yahoo_account_id });

                                priceProduct = priceProduct.replace(/\D+/g, '').trim();
                                // giá gốc
                                let basecost = parseFloat(priceProduct);
                                let profit = 0;
                                let price = 0;

                                if (infomationDefault) {
                                    if (infomationDefault.yahoo_auction_profit_type == 0) {
                                        profit = (basecost * infomationDefault.yahoo_auction_price_profit) / 100;
                                    } else {
                                        profit = infomationDefault.yahoo_auction_static_profit;
                                    }

                                    price = basecost + profit + infomationDefault.yahoo_auction_shipping + infomationDefault.amazon_shipping;
                                    price = price / (1 - infomationDefault.yahoo_auction_fee / 100);
                                    price = Math.ceil(price);
                                    profit = Math.ceil(profit);
                                }
                                let product = {
                                    url,
                                    asin,
                                    name: nameProduct,
                                    basecost,
                                    profit,
                                    price,
                                    delivery,
                                    images: [imageProduct],
                                    infoDetail: productInfo,
                                    countProduct: 1,
                                };
                                listProductResult.push(product);
                            }
                        }
                    }
                }
                if (!listProductResult || listProductResult.length == 0) {
                    return {
                        type: 'ERROR',
                        message: 'Not found any product',
                    };
                }
                return {
                    type: 'SUCCESS',
                    data: listProductResult,
                };
            } else {
                return {
                    type: 'ERROR',
                    message: 'Lỗi không load được Amazon: ' + requestAmazon,
                };
            }
        } catch (error) {
            throw 'Error ProductAmazonService.getProductByAsin: ' + error.message;
        }
    }
    static async create(data) {
        try {
            let product = await ProductAmazonSchema.create(data);
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductAmazonSchema.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductAmazonSchema.findById(productId);
            if (!product) {
                throw new Error('Error: Product not found');
            } else {
                return product._doc;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async delete(productId) {
        try {
            let product = await ProductAmazonSchema.findById(productId);
            if (!product) {
                throw new Error('Error: Product not found');
            } else {
                await product.remove();
                return true;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async createByCsv(data) {
        try {
            let result = await ProductAmazonSchema.insertMany(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
