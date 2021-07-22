import Queue from 'better-queue';
import ProductAmazonSchema from '../models/ProductAmazonModel';
import ProductAmazonService from '../services/ProductAmazonService';
import SearchCodeAmazonService from '../services/SearchCodeAmazonService';
import AsinAmazonService from './AsinAmazonService';
import KeepaService from './KeepaService';

let queueGetInfoProduct = null;
const getProductByAsin = async (inputData, cb) => {
    try {
        console.log(' ==== Start getProductByAsin ==== ');

        let checkBlackList = await AsinAmazonService.findOne({ type: 'BLACK', asin: inputData.code });
        if (!checkBlackList) {
            let resultGetProduct = await ProductAmazonService.getProductByAsin(inputData);
            // console.log(' ### resultGetProduct: ', resultGetProduct);
            if (resultGetProduct.type === 'SUCCESS') {
                let product = resultGetProduct.data;
                product.idUser = inputData.idUser;
                product.yahoo_account_id = inputData.yahoo_account_id;
                await ProductAmazonService.create(product);
                await SearchCodeAmazonService.update(inputData._id, inputData.idUser, { isProductGeted: true, status: 'SUCCESS' });
            } else {
                console.log(' #### resultGetProduct: ', resultGetProduct);
                let resultKeep = await KeepaService.findProduct(inputData.code, inputData.idUser);
                console.log(' #### resultKeep: ', resultKeep);
                if (resultKeep.status === 'SUCCESS') {
                    let newProduct = resultKeep.data;
                    newProduct.yahoo_account_id = inputData.yahoo_account_id;
                    newProduct.idUser = inputData.idUser;
                    newProduct.countProduct = 0;
                    await ProductAmazonService.create(resultKeep.data);
                    await SearchCodeAmazonService.update(inputData._id, inputData.idUser, { isProductGeted: true, status: 'SUCCESS', statusMessage: 'keepa' });
                } else {
                    await SearchCodeAmazonService.update(inputData._id, inputData.idUser, {
                        isProductGeted: false,
                        status: 'ERROR',
                        statusMessage: 'Lỗi: ' + resultGetProduct.message,
                    });
                }
            }
        } else {
            await SearchCodeAmazonService.update(inputData._id, inputData.idUser, {
                isProductGeted: false,
                status: 'ERROR',
                statusMessage: 'Black list',
            });
        }
        // console.log(inputData);

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
