import Axios from 'axios';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';
import Utils from '../utils/Utils';
import Path from 'path';
import FsExtra from 'fs-extra';
const cheerio = require('cheerio');

const parseDataProductHTML = async (html, yahoo_account_id) => {
    let productInfo = [];
    let $ = cheerio.load(html);

    // let category = $('#wayfinding-breadcrumbs_container > #wayfinding-breadcrumbs_feature_div > ul');
    let category = '';
    try {
        let categoryNode = $('.a-link-normal.a-color-tertiary');
        category = categoryNode[categoryNode.length - 1].attribs['href'].split('&node=')[1].trim();
    } catch (error) {}
    let nameProduct = $('#productTitle').text().trim();
    let priceProduct = $('#priceblock_ourprice').text().trim();
    if (!priceProduct) {
        priceProduct = $('#price_inside_buybox').text().trim();
    }
    if (!priceProduct) {
        priceProduct = $('#priceblock_dealprice').text().trim();
    }
    if (!priceProduct) {
        priceProduct = $('#price').text().trim();
    }
    let countProduct = $('#availability').text().trim();
    if (countProduct && countProduct.includes('点 ご注文はお早めに')) {
        countProduct = countProduct.replace(/\D+/g, '').trim();
    } else {
        countProduct = 999;
    }
    let delivery = $($('#mir-layout-DELIVERY_BLOCK-slot-DELIVERY_MESSAGE')['0']).text().replace(/\n/g, '').trim();
    if (!delivery) {
        // delivery = $('#x').text().trim();
    }
    //#main-image-container > ul > li.image.item.itemNo1.maintain-height.selected > span > span > div > img
    let imageProduct = [];
    let images = $('.item');

    if (images && images.length > 0) {
        for (const image of images) {
            let url = $(image).find('img').attr('src');
            let base_name = Path.basename(url).split('.')[0];
            let ext = Path.extname(url);
            url = url.split('/images/I/')[0];
            url += '/images/I/' + base_name + ext;
            if (url && url.trim !== '') {
                imageProduct.push(url);
            }
        }
    }
    if (imageProduct.length === 0) {
        let image = $('#img-canvas > img');
        let url = image.attr('src');
        let base_name = Path.basename(url).split('.')[0];
        let ext = Path.extname(url);
        url = url.split('/images/I/')[0];
        url += '/images/I/' + base_name + ext;
        if (url && url.trim !== '') {
            imageProduct.push(url);
        }
    }
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

    let infoProfitDefault = await ProductInfomationDefaultService.findOne({ yahoo_account_id });

    priceProduct = priceProduct.replace(/\D+/g, '').trim();
    // giá gốc
    let basecost = parseFloat(priceProduct);
    if (!basecost) {
        basecost = 0;
    }
    let profit = 0;
    let price = 0;

    if (infoProfitDefault && basecost) {
        if (infoProfitDefault.yahoo_auction_profit_type == 0) {
            profit = (basecost * infoProfitDefault.yahoo_auction_price_profit) / 100;
        } else {
            profit = infoProfitDefault.yahoo_auction_static_profit;
        }
        //infoProfitDefault.yahoo_auction_shipping +
        price = basecost + profit + infoProfitDefault.amazon_shipping;
        price = price / (1 - infoProfitDefault.yahoo_auction_fee / 100);
        price = Math.ceil(price);
        profit = Math.ceil(profit);
    }

    let description = '';
    productInfo.map((item) => {
        description += item.name + ': ' + item.value + '\n';
    });

    let product = {
        asin,
        category_id: category,
        name: nameProduct,
        basecost,
        profit,
        price,
        delivery,
        images: imageProduct,
        description,
        countProduct,
    };
    return product;
};
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
                cookie: 'session-id=355-9411992-8927462; ubid-acbjp=358-2559061-1954248; _msuuid_jniwozxj70=20FE642B-44E7-472D-8572-AC7BF6C52ABB; s_nr=1626597474251-Repeat; s_vnum=2056111718284%26vn%3D3; s_dslv=1626597474252; session-token=bINct6PryD+mpdo6GUl9K+W8kUDIB6lsVDli8b2X/k3yxm11VQaIVJzeequ4GP1nbXYIVYM79oFfLUZ3yCu3gxc7gnVai0SLkx89B3xLqDpgX7UT1BMiz9eNnwiofJguAfeiBNX+dwwr5T4JEFWGO3/hGB9tPZPklhpbvKb1lQaSLa1lok+8LyK98hQrrobt; lc-acbjp=ja_JP; i18n-prefs=JPY; session-id-time=2082726001l; csm-hit=tb:s-89X7M97HHF6DW8Z8YC3D|1626670418895&t:1626670420277&adb:adblk_yes',
            };
            let requestAmazon = await Axios.get(`https://www.amazon.co.jp/dp/${asinModel.code}`, { headers });

            let product = await parseDataProductHTML(requestAmazon.data, asinModel.yahoo_account_id);
            if (!product) {
                return {
                    type: 'ERROR',
                    message: 'Not found any product',
                };
            }
            product.url = `https://www.amazon.co.jp/dp/${asinModel.code}`;
            return {
                type: 'SUCCESS',
                data: product,
            };
        } catch (error) {
            // console.log(' #### ERROR ProductAmazonService getProductByAsin: ', error);
            return {
                type: 'ERROR',
                message: error.message,
            };
        }
    }
    static async create(data) {
        try {
            let newProduct = await ProductAmazonSchema(data);
            let listImage = [];
            for (let i = 0; i < data.images.length; i++) {
                const image = data.images[i];
                console.log(image);
                if (image.startsWith('http')) {
                    let folderSave = 'amazon-product/' + newProduct._id + '/';
                    await FsExtra.ensureDirSync('uploads/' + folderSave);
                    let saveImage = folderSave + 'image' + i + '.jpg';
                    let check = Utils.downloadFile(image, 'uploads/' + saveImage);
                    if (check) {
                        saveImage = listImage.push(saveImage);
                    }
                } else {
                    listImage.push(image);
                }
            }
            newProduct.images = listImage;
            await newProduct.save();
            console.log(newProduct);
            return newProduct;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async findOne(data) {
        try {
            let product = await ProductAmazonSchema.findOne(data);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async find(data) {
        try {
            let products = await ProductAmazonSchema.find(data);
            return products;
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
                throw new Error('エラー：商品が見つかりません');
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
                throw new Error('エラー：商品が見つかりません');
            } else {
                await product.remove();
                return true;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async deleteMultiple(yahooAccountId) {
        try {
            await ProductAmazonSchema.deleteMany({ yahoo_account_id: yahooAccountId });
            return true;
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
    static async setShippingProduct(_id, shipping) {
        try {
            let product = await ProductAmazonSchema.findById(_id);
            if (!product) {
                throw new Error('エラー：商品が見つかりません');
            } else {
                shipping = parseFloat(shipping);
                let newPrice = product.price - product.shipping + shipping;
                product.price = newPrice;
                product.shipping = shipping;
                await product.save();
                return product;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
