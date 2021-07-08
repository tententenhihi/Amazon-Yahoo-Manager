import ProductYahooSchema from '../models/ProductYahooModel';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

export default class ProductYahooService {
    static async getKeys(cookie) {
        try {
            const configs = {
                headers: {
                    cookie: cookie,
                },
            };
            const response = await axios.get('https://auctions.yahoo.co.jp/jp/show/submit', configs);
            const crumbValue = /<input type="hidden" name=".crumb" value="(.*)">/.exec(response.data);
            const imgCrumbValue = /<input type="hidden" id="img_crumb" value="(.*)">/.exec(response.data);
            const md5Value = /<input type="hidden" name="md5" value="(.*)">/.exec(response.data);
            let keys = {};

            if (imgCrumbValue) keys.img_crumb = imgCrumbValue[1];
            if (crumbValue) keys.crumb = crumbValue[1];
            if (md5Value) keys.md5 = md5Value[1];
            return keys;
        } catch (err) {
            console.error(err);
            return {};
        }
    }
    static async uploadPhotoStep1(file, keys, cookie) {
        try {
            const form = new FormData();
            form.append('files[0]', file, 'photo.jpg');
            form.append('.crumb', keys.img_crumb);

            const configs = {
                headers: {
                    ...form.getHeaders(),
                    cookie: cookie,
                },
            };
            const response = await axios.post('https://auctions.yahoo.co.jp/img/images/new', form, configs);
            console.log('UrlPhoto:', response.data.images[0]);

            return response.data.images[0];
        } catch (err) {
            console.log(err);
            return '';
        }
    }
    static async uploadPhotoStep2(path, keys, cookie) {
        try {
            const form = new FormData();
            form.append('path', path);
            form.append('.crumb', keys.img_crumb);

            const configs = {
                headers: {
                    ...form.getHeaders(),
                    cookie: cookie,
                },
            };
            const response = await axios.post('https://auctions.yahoo.co.jp/img/images/new', form, configs);
            console.log('Thumbnail:', response.data.thumbnail);

            return response.data.thumbnail;
        } catch (err) {
            console.log(err);
            return '';
        }
    }
    static async previewBeforeSubmit(params, cookie) {
        try {
            const form = new FormData();

            for (var key in params) {
                var value = params[key];
                form.append(key, value);
            }

            const configs = {
                headers: {
                    cookie: cookie,
                    ...form.getHeaders(),
                },
            };
            const result = await axios.post('https://auctions.yahoo.co.jp/sell/jp/show/preview', form, configs);
            fs.writeFile('./preview.html', result.data, function (err, data) {
                if (err) {
                    return console.log(err);
                }
            });
            const inputs = result.data.match(/<input type="hidden" name="(.*)" value="(.*)">/g);
            let backParams = {};

            inputs.forEach(function (input) {
                let splitInput = /<input type="hidden" name="(.*)" value="(.*)">/.exec(input);
                backParams[splitInput[1]] = splitInput[2];
            });
            console.log(backParams);
            return backParams;
        } catch (err) {
            console.log(err);
            return {};
        }
    }
    static async confirmSubmit(params, cookie) {
        try {
            const form = new FormData();
            console.log('params:', params);
            for (var key in params) {
                var value = params[key];
                form.append(key, value);
            }

            const configs = {
                headers: {
                    cookie: cookie,
                    ...form.getHeaders(),
                },
            };
            const result = await axios.post('https://auctions.yahoo.co.jp/sell/jp/show/submit', form, configs);

            fs.writeFile('./result.html', result.data, function (err, data) {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
            });

            return result.data;
        } catch (err) {
            console.log(err);
            return {};
        }
    }
    static async get(idUser) {
        try {
            let result = await ProductYahooSchema.find({ user_id: idUser });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Product Yahoo Service-get: ' + error.message);
        }
    }
    static async create(data) {
        try {
            let product = await ProductYahooSchema.create(data);
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async update(_id, data) {
        try {
            let product = await ProductYahooSchema.findOneAndUpdate({ _id: _id }, data, { new: true });
            return product._doc;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    static async show(productId) {
        try {
            let product = await ProductYahooSchema.findById(productId);
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
            let product = await ProductYahooSchema.findById(productId);
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
