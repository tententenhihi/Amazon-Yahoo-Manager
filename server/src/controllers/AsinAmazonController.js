import QueueGetProductAmazon from '../services/QueueGetProductAmazon';
import BlacklistAsinService from '../services/BlacklistAsinService';
import AsinAmazonService from '../services/AsinAmazonService';
import Response from '../utils/Response';
import Utils from '../utils/Utils';
import AccountYahooService from '../services/AccountYahooService';

export default class AsinAmazonController {
    static async getBlackList(req, res) {
        let response = new Response(res);
        try {
            // let user = req.user;
            // let payload = {
            //     ...req.body,
            //     idUser: user._id,
            // };
            // let listAsin = await AsinAmazonService.get(payload);
            return response.success200({ listAsinBlackList: [] });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            // let { yahoo_account_id } = req.params;
            let payload = {
                ...req.body,
                idUser: user._id,
                // yahoo_account_id,
            };
            let listAsin = await AsinAmazonService.get(payload, user._id);
            let getBackList = await BlacklistAsinService.getBlackList();
            return response.success200({ listAsin, black_list: getBackList });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async add(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let listCode = req.body.listCode;
            // let groupId = req.body.groupId;
            let type = req.body.type;
            let yahoo_account_id = req.body.yahoo_account_id;
            if (!type) {
                type = 'ASIN';
            }
            if (
                listCode &&
                listCode.length > 0
                // && groupId
            ) {
                let listAsinNew = [];
                let queryKey = Utils.generateKey();
                for (let i = 0; i < listCode.length; i++) {
                    const code = listCode[i];
                    let newAsinData = {
                        code,
                        idUser: user._id,
                        type,
                        // groupId,
                        yahoo_account_id,
                        query_key: queryKey,
                    };
                    listAsinNew.push(newAsinData);
                }
                let newAsin = await AsinAmazonService.addMany(listAsinNew);
                QueueGetProductAmazon.addNew(newAsin);
                let accountYahoo = await AccountYahooService.findById(yahoo_account_id);
                return response.success200({
                    newAsin: {
                        asins: newAsin,
                        countAsin: newAsin.length,
                        countAsinGetProductSuccess: 0,
                        yahoo_account_id: yahoo_account_id,
                        yahoo_id: accountYahoo.yahoo_id,
                    },
                });
            }
            return response.error400({ message: 'データエラー' });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async update(req, res) {
        let response = new Response(res);
        try {
            if (req.body) {
                return response.success200({});
            }
            return response.error400({ message: 'データエラー' });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async delete(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            if (req.body.idAsin) {
                let result = await AsinAmazonService.delete(req.body.idAsin, user._id);
                return response.success200({ result });
            }
            return response.error400({ message: 'データエラー' });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
}
