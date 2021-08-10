import Queue from 'better-queue';
import ProductAmazonService from '../services/ProductAmazonService';
import AsinAmazonService from './AsinAmazonService';
import BlacklistAsinService from './BlacklistAsinService';
import ProductYahooService from './ProductYahooService';
import KeepaService from './KeepaService';

let queueGetInfoProduct = null;
const getProductByAsin = async (listAsinModel, cb) => {
    try {
        console.log(' ==== Start getProductByAsin ==== ');
        let newListAsinModel = [];
        let listAsin = [];
        for (let asinModel of listAsinModel) {
            let checkBlackList = await BlacklistAsinService.findOne({ type: 'BLACK', asin: asinModel.code });

            if (checkBlackList) {
                asinModel.isProductGeted = false;
                asinModel.status = 'ERROR';
                asinModel.statusMessage = 'ブラックリスト';
                await asinModel.save();
            } else {
                let productAmazon = await ProductAmazonService.findOne({ asin: asinModel.code });
                if (productAmazon) {
                    await ProductYahooService.createFromAmazonProduct(productAmazon, asinModel.idUser, asinModel.yahoo_account_id);
                    asinModel.isProductGeted = true;
                    asinModel.status = 'SUCCESS';
                    asinModel.statusMessage = 'プロキシ変更';
                    await asinModel.save();
                } else {
                    listAsin.push(asinModel.code);
                    newListAsinModel.push(asinModel);
                }
            }
        }

        let count = 0;
        let currentIndex = 0;

        if (listAsin.length > 100) {
            count = 100;
        } else {
            count = listAsin.length;
        }
        let index = 0;
        while (listAsin && listAsin.length > 0 && count <= listAsin.length) {
            let newListAsin = listAsin.slice(currentIndex, count);
            let result = await KeepaService.findProduct(newListAsin);
            if (result.status === 'SUCCESS') {
                for (const itemData of result.data) {
                    if (itemData.status === 'SUCCESS') {
                        await ProductAmazonService.create(itemData.data);
                        await ProductYahooService.createFromAmazonProduct(
                            itemData.data,
                            newListAsinModel[index].idUser,
                            newListAsinModel[index].yahoo_account_id
                        );
                    }
                    newListAsinModel[index].status = itemData.status;
                    newListAsinModel[index].statusMessage = itemData.message;
                    await newListAsinModel[index].save();

                    index++;
                }
            } else {
                for (const item of newListAsin) {
                    newListAsinModel[index].status = 'ERROR';
                    newListAsinModel[index].statusMessage = result.message;
                    await newListAsinModel[index].save();
                    index++;
                }
            }
            currentIndex = count;
            let sub = listAsin.length - count;
            if (sub > 0) {
                if (sub > 100) {
                    count += 100;
                } else {
                    count += sub;
                }
            } else {
                console.log(' ============== break ===============');

                break;
            }
        }

        // let listResultKeepa = await KeepaService.findProduct(listAsin);
        // let listDataAsinResult = [];

        // for (const result of listResultKeepa) {
        //     if (result.status === 'ERROR') {
        //         for (const itemData of result.data) {
        //             listDataAsinResult.push({
        //                 status: result.status,
        //                 message: result.message,
        //                 asin: itemData.asin,
        //             });
        //         }
        //     } else {
        //         for (const itemData of result.data) {
        //             listDataAsinResult.push({
        //                 status: itemData.status,
        //                 message: itemData.message,
        //                 asin: itemData.asin,
        //                 data: itemData.data,
        //             });
        //         }
        //     }
        // }

        // console.log(' ######### listDataAsinResult: ', listDataAsinResult);
        // console.log(' ######### listDataAsinResult: ', listDataAsinResult.length);

        console.log(' ==== End ====');
        cb(null, listAsinModel);
    } catch (error) {
        cb({ error });
    }
};
export default class QueueGetProductAmazon {
    constructor() {
        if (!queueGetInfoProduct) {
            queueGetInfoProduct = new Queue(getProductByAsin, { concurrent: 1, autoResume: true, cancelIfRunning: true });
        }
    }

    static async addNew(listAsinModel) {
        if (!listAsinModel) {
            return;
        }
        queueGetInfoProduct.push(listAsinModel);
    }
}
