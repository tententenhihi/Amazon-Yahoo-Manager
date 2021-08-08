import Queue from 'better-queue';
import ProductAmazonService from '../services/ProductAmazonService';
import AsinAmazonService from './AsinAmazonService';
import BlacklistAsinService from './BlacklistAsinService';
import ProductYahooService from './ProductYahooService';
import KeepaService from './KeepaService';

let queueGetInfoProduct = null;
const getProductByAsin = async (inputData, cb) => {
    try {
        console.log(' ==== Start getProductByAsin ==== ');

        let checkBlackList = await BlacklistAsinService.findOne({ type: 'BLACK', asin: inputData.code });
        if (!checkBlackList) {
            let asin = inputData.code;
            // Check Exist Product
            let productAmazon = await ProductAmazonService.findOne({ asin });
            if (!productAmazon) {
                let amazonData = await ProductAmazonService.getProductByAsin(asin);
                let keepaData = await KeepaService.findProduct(asin);
                keepaData = keepaData.data;

                let productData = {
                    ...amazonData,
                    ...keepaData,
                    description: amazonData.description || keepaData.description,
                    price: amazonData.price || keepaData.price,
                    category_id: (keepaData && keepaData.category_id) || amazonData.category_id,
                    name: (keepaData && keepaData.name) || amazonData.name,
                };
                console.log(productData);
                productAmazon = await ProductAmazonService.create(productData);
            }
            // Create Product Yahoo
            await ProductYahooService.createFromAmazonProduct(productAmazon, inputData.idUser, inputData.yahoo_account_id);
            await AsinAmazonService.update(inputData._id, inputData.idUser, { isProductGeted: true, status: 'SUCCESS' });
        } else {
            await AsinAmazonService.update(inputData._id, inputData.idUser, {
                isProductGeted: false,
                status: 'ERROR',
                statusMessage: 'ブラックリスト',
            });
        }
        console.log(' ==== End ====');
        cb(null, inputData);
    } catch (error) {
        console.log(' ### Error Queue getProductByAsin: ', error);
        await AsinAmazonService.update(inputData._id, inputData.idUser, {
            isProductGeted: false,
            status: 'ERROR',
            statusMessage: 'エラー: ' + error.message,
        });
        cb({ error });
    }
};
export default class QueueGetProductAmazon {
    constructor() {
        if (!queueGetInfoProduct) {
            queueGetInfoProduct = new Queue(getProductByAsin, { concurrent: 5, autoResume: true, cancelIfRunning: true });
        }
    }

    static async addNew(data) {
        if (!data) {
            return;
        }
        queueGetInfoProduct.push(data);
    }
}
