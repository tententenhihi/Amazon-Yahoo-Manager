import Axios from 'axios';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import Utils from '../utils/Utils';
const cheerio = require('cheerio');
export default class ProductAmazonService {
    static async get(idUser) {
        try {
            let result = await ProductAmazonSchema.find({ idUser });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(' Error ProductAmazonService-get: ', error.message);
        }
    }
    static async getProductByAsin(asin) {
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
                // "cookie": `session-id=355-9411992-8927462; sp-cdn="L5Z9:VN"; ubid-acbjp=358-2559061-1954248; _msuuid_jniwozxj70=20FE642B-44E7-472D-8572-AC7BF6C52ABB; session-token=nvdAoDrZdOtjlljJ9yLwkOTYeB+gtG2KKf/QOKdbRyA4y3n/US4TH6+OfF69aAnY4ktvuF3zJ1fozIFDNikNq+1/SJ6JKsNo/cqI8BxZEs2E6GiyiJ8ewY+Lm03DmAp8JSeRyO/Rx/hPIv81xzEyjF3crZYzDCBtdEdZ4onx1pgqR/zy4TSkUnt+TZ8PIYm9; skin=noskin; s_cc=true; s_nr=1624111718283-New; s_vnum=2056111718284%26vn%3D1; s_invisit=true; s_dslv=1624111718285; s_dslv_s=First%20Visit; s_c27=GSUNWNFT2ALMPR3L; s_sq=%5B%5BB%5D%5D; s_ppv=80; lc-acbjp=ja_JP; i18n-prefs=JPY; session-id-time=2082787201l`,
                // "Connection": "keep",
                // "Connection": "keep",
                // "Connection": "keep",
                // "Connection": "keep",
            };
            let requestAmazon = await Axios.get(`https://www.amazon.co.jp/s?k=${asin}`, { headers });
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
                                let product = {
                                    url,
                                    asin,
                                    name: nameProduct,
                                    price: priceProduct,
                                    image: imageProduct,
                                    infoDetail: productInfo,
                                };
                                listProductResult.push(product);
                            }
                        }
                    }
                }
                if (!listProductResult || listProductResult.length == 0) {
                    return {
                        type: 'error',
                        message: 'Not found any product',
                    };
                }
                return {
                    type: 'success',
                    data: listProductResult,
                };
            } else {
                return {
                    type: 'error',
                    message: 'Lỗi không load được Amazon: ' + requestAmazon,
                };
            }
        } catch (error) {
            throw 'Error ProductAmazonService.getProductByAsin: ' + error.message;
        }
    }
}
