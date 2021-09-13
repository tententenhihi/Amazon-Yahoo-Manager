import Queue from 'better-queue';
import ProductAmazonService from '../services/ProductAmazonService';
import AsinAmazonService from './AsinAmazonService';
import BlacklistAsinService from './BlacklistAsinService';
import ProductYahooService from './ProductYahooService';
import KeepaService from './KeepaService';

let queueGetInfoProduct = null;
const getProductByAsin = async (dataInput, cb) => {
    try {
        let newListAsinModel = dataInput.newAsin;
        let isUpdateAmazonProduct = dataInput.isUpdateAmazonProduct;
        let listAsin = newListAsinModel.map((item) => item.code);

        // console.log(' #### getProductByAsin listAsin: ', listAsin);
        // console.log(listAsin.length);

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
            let result = await KeepaService.findProduct(newListAsin, dataInput.user_id);
            if (result.status === 'SUCCESS') {
                for (const itemData of result.data) {
                    if (itemData.status === 'SUCCESS') {
                        if (isUpdateAmazonProduct) {
                            let checkUpdate = await ProductAmazonService.findOne({ asin: itemData.data.asin });
                            if (checkUpdate) {
                                await ProductAmazonService.update(checkUpdate._id, { ...itemData.data, created: Date.now() });
                            } else {
                                await ProductAmazonService.create(itemData.data);
                            }
                        } else {
                            await ProductAmazonService.create(itemData.data);
                        }
                        await ProductYahooService.createFromAmazonProduct(itemData.data, newListAsinModel[index].idUser, newListAsinModel[index].yahoo_account_id);
                    }
                    newListAsinModel[index].isProductGeted = itemData.status === 'SUCCESS';
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
        console.log(' ==== End ====');
        cb(null, newListAsinModel);
    } catch (error) {
        console.log(error);
        cb({ error });
    }
};
export default class QueueGetProductAmazon {
    constructor() {
        if (!queueGetInfoProduct) {
            queueGetInfoProduct = new Queue(getProductByAsin, { concurrent: 1, autoResume: true, cancelIfRunning: true });
        }
    }

    static async addNew(dataInput) {
        if (!dataInput) {
            return;
        }

        let listAsinModel = dataInput.newAsin;
        let isUpdateAmazonProduct = dataInput.isUpdateAmazonProduct;

        let newListAsinModel = [];

        // Kiểm tra list có product amazon chưa. có rồi ko cần lấy keepa nữa

        console.log(' #### listAsinModel: ', listAsinModel.length);

        for (let asinModel of listAsinModel) {
            //Check Asin Black List
            let checkBlackList = await BlacklistAsinService.findOne({ type: 'BLACK', asin: asinModel.code });
            if (checkBlackList) {
                asinModel.isProductGeted = false;
                asinModel.status = 'ERROR';
                asinModel.statusMessage = 'ブラックリスト';
                await asinModel.save();
            } else {
                // Mode Update thì bỏ qua bước kiểm tra đã có product amazon chưa.
                if (isUpdateAmazonProduct) {
                    newListAsinModel.push(asinModel);
                    continue;
                }
                // kiểm tra đã có product amazon chưa. có rồi thì ko cần tìm trên keepa nữa
                let productAmazon = await ProductAmazonService.findOne({ asin: asinModel.code });
                if (productAmazon) {
                    await ProductYahooService.createFromAmazonProduct(productAmazon, asinModel.idUser, asinModel.yahoo_account_id);
                    asinModel.isProductGeted = true;
                    asinModel.status = 'SUCCESS';
                    asinModel.statusMessage = '成功';
                    await asinModel.save();
                } else {
                    newListAsinModel.push(asinModel);
                }
            }
        }
        queueGetInfoProduct.push({ newAsin: newListAsinModel, isUpdateAmazonProduct, user_id: dataInput.user_id });
    }
}
