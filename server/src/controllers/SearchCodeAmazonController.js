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
            let payload = {
                ...req.body,
                idUser: user._id,
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
            let type = req.body.type;
            if (!type) {
                type = 'ASIN';
            }
            if (listCode && listCode.length > 0) {
                let listSearchCodeNew = [];
                for (let i = 0; i < listCode.length; i++) {
                    const code = listCode[i];
                    let newSearchCodeData = { code, idUser: user._id, type };
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
