import Queue from 'better-queue';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import ProductAmazonService from '../services/ProductAmazonService';
import SearchCodeAmazonService from '../services/SearchCodeAmazonService';

let queueGetInfoProduct = null;
const getProductByAsin = async (inputData, cb) => {
    try {
        console.log(' ==== Start getProductByAsin ==== ');
        let resultGetProduct = await ProductAmazonService.getProductByAsin(inputData);
        if (resultGetProduct.type === 'SUCCESS') {
            let listProduct = resultGetProduct.data;
            for (let i = 0; i < listProduct.length; i++) {
                let product = listProduct[i];
                try {
                    product.idUser = inputData.idUser;
                    product.yahoo_account_id = inputData.yahoo_account_id
                    let newProduct = ProductAmazonSchema(product);
                    await newProduct.save();
                    if (product.asin === inputData.code) {
                        await SearchCodeAmazonService.update(inputData._id, inputData.idUser, { isProductGeted: true, status: 'SUCCESS' });
                    }
                } catch (error) {
                    if (product.asin === inputData.code) {
                        await SearchCodeAmazonService.update(inputData._id, inputData.idUser, {
                            isProductGeted: false,
                            status: 'ERROR',
                            statusMessage: 'Lỗi: ' + error.message,
                        });
                    }
                }
            }
        } else {
            await SearchCodeAmazonService.update(inputData._id, inputData.idUser, {
                isProductGeted: false,
                status: 'ERROR',
                statusMessage: 'Lỗi: ' + resultGetProduct.message,
            });
        }
        console.log(' ==== End ====');
        cb(null, inputData);
    } catch (error) {
        console.log(' ### Error Queue getProductByAsin: ', error);
        await SearchCodeAmazonService.update(inputData._id, inputData.idUser, {
            isProductGeted: false,
            status: 'ERROR',
            statusMessage: 'Lỗi: ' + error.message,
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
