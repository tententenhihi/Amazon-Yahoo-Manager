import QueueGetProductAmazon from '../services/QueueGetProductAmazon';
import BlacklistAsinService from '../services/BlacklistAsinService';
import AsinAmazonService from '../services/AsinAmazonService';
import Response from '../utils/Response';
import Utils from '../utils/Utils';
import AccountYahooService from '../services/AccountYahooService';
import ProductYahooService from '../services/ProductYahooService';
import ProductYahooModel from '../models/ProductYahooModel';
import SocketIOService from '../services/SocketIOService';
var _ = require('lodash');

export default class AsinAmazonController {
    static async deleteMulti(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            if (req.body.query_keys) {
                for (const query_key of req.body.query_keys) {
                    let result = await AsinAmazonService.deleteMany({
                        query_key
                    }, user._id);
                }
                return response.success200({});
            }
            return response.error400({
                message: 'データエラー'
            });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async getBlackList(req, res) {
        let response = new Response(res);
        try {
            // let user = req.user;
            // let payload = {
            //     ...req.body,
            //     idUser: user._id,
            // };
            // let listAsin = await AsinAmazonService.get(payload);
            return response.success200({
                listAsinBlackList: []
            });
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
            return response.success200({
                listAsin,
                black_list: getBackList
            });
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
            let checkUpdateAsin = req.body.checkUpdateAsin;

            if (!type) {
                type = 'ASIN';
            }
            SocketIOService.emitData(user._id, {
                type: 'ASIN',
                isLoading: true,
            });
            if (listCode && listCode.length > 0) {

                // Kiểm tra giới hạn Product Yahoo
                let countProductYahoo = await ProductYahooModel.find({
                    user_id: user._id,
                    yahoo_account_id
                }).countDocuments();
                if (countProductYahoo >= 6000) {
                    return response.error400({
                        message: 'ヤフオクの仕様上、1アカウントで6000件までしか出品できないので、1アカウントあたり最大6000件まで登録可能',
                    });
                }
                // Kiểm tra trùng trong List
                listCode = _.uniqBy(listCode);

                let listAsinNew = [];
                let queryKey = Utils.generateKey();
                let totalAsin = 0;
                // Tạo List Object Asin

                setTimeout(async () => {
                    try {
                        for (let i = 0; i < listCode.length; i++) {
                            const code = listCode[i];
                            SocketIOService.emitData(user._id, {
                                type: 'ASIN',
                                isLoading: true,
                                progress: i,
                                total: listCode.length,
                            });
                            if (!checkUpdateAsin) {
                                // Kiểm tra đã tồn tại ProductYahoo chưa. có rồi thì bỏ qua Asin
                                let existProductYahoo = await ProductYahooService.findOne({
                                    asin_amazon: code,
                                    yahoo_account_id
                                });
                                if (existProductYahoo) {
                                    await AsinAmazonService.add({
                                        code,
                                        idUser: user._id,
                                        type,
                                        // groupId,
                                        yahoo_account_id,
                                        query_key: queryKey,
                                        status: 'SUCCESS',
                                    });
                                    totalAsin++;
                                    continue;
                                }
                            }

                            let newAsinData = {
                                code,
                                idUser: user._id,
                                type,
                                // groupId,
                                yahoo_account_id,
                                query_key: queryKey,
                            };
                            listAsinNew.push(newAsinData);
                            countProductYahoo++;
                            totalAsin++;
                        }


                        // Add list Object Asin
                        let newAsin = await AsinAmazonService.addMany(listAsinNew);
                        //Add List To Queue

                        QueueGetProductAmazon.addNew({
                            isUpdateAmazonProduct: checkUpdateAsin,
                            newAsin,
                            user_id: user,
                            yahoo_account_id,
                        });

                        // Return List
                        let accountYahoo = await AccountYahooService.findById(yahoo_account_id);
                        SocketIOService.emitData(user._id, {
                            type: 'ASIN',
                            isLoading: false,
                            newAsin: {
                                asins: newAsin,
                                countAsin: totalAsin,
                                countAsinGetProductSuccess: 0,
                                yahoo_account_id: yahoo_account_id,
                                yahoo_id: accountYahoo.yahoo_id,
                            },
                        });
                    } catch (error) {
                        console.log(' ##### error: ', error);
                    }
                }, 1)
                return response.success200()
                // return response.success200({
                //     newAsin: {
                //         asins: newAsin,
                //         countAsin: totalAsin,
                //         countAsinGetProductSuccess: 0,
                //         yahoo_account_id: yahoo_account_id,
                //         yahoo_id: accountYahoo.yahoo_id,
                //     },
                // });
            }
            return response.error400({
                message: 'データエラー'
            });
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
            return response.error400({
                message: 'データエラー'
            });
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
                return response.success200({
                    result
                });
            }
            return response.error400({
                message: 'データエラー'
            });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
}