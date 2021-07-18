import QueueGetProductAmazon from '../services/QueueGetProductAmazon';
import CodeSearchAmazonService from '../services/SearchCodeAmazonService';
import Response from '../utils/Response';

export default class CodeSearchAmazonController {
    static async getBlackList(req, res) {
        let response = new Response(res);
        try {
            // let user = req.user;
            // let payload = {
            //     ...req.body,
            //     idUser: user._id,
            // };
            // let listSearchCode = await CodeSearchAmazonService.get(payload);
            return response.success200({ listSearchCodeBlackList: [] });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {yahoo_account_id} = req.params
            let payload = {
                ...req.body,
                idUser: user._id,
                yahoo_account_id
            };
            let listSearchCode = await CodeSearchAmazonService.get(payload);
            return response.success200({ listSearchCode });
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
            let groupId = req.body.groupId;
            let type = req.body.type;
            let yahoo_account_id = req.body.yahoo_account_id
            if (!type) {
                type = 'ASIN';
            }
            if (listCode && listCode.length > 0 && groupId) {
                let listSearchCodeNew = [];
                for (let i = 0; i < listCode.length; i++) {
                    const code = listCode[i];
                    let newSearchCodeData = { code, idUser: user._id, type, groupId, yahoo_account_id };
                    let newSearchCode = await CodeSearchAmazonService.add(newSearchCodeData);
                    QueueGetProductAmazon.addNew(newSearchCode);
                    listSearchCodeNew.push(newSearchCode);
                }
                return response.success200({ listSearchCodeNew });
            }
            return response.error400({ message: 'data sai.!' });
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
            return response.error400({ message: 'data sai.!' });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async delete(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            if (req.body.idSearchCode) {
                let result = await CodeSearchAmazonService.delete(req.body.idSearchCode, user._id);
                return response.success200({ result });
            }
            return response.error400({ message: 'data sai.!' });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
}
