import YahooAccountModel from '../models/YahooAccount';
import UserModel from '../models/UserModel';
import ProxySchema from '../models/ProxyModel';
import Response from '../utils/Response';
import bcrypt from 'bcryptjs';
import QueueLoginYahooAuction from '../services/QueueLoginYahooAuction';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';
import mongoose from 'mongoose';

import ProductInfomationDefaultSchema from '../models/ProductInfomationDefaultModel';
import AuctionPublicSettingSchema from '../models/AuctionPublicSettingModel';
import ProductGlobalSettingSchema from '../models/ProductGlobalSettingModel';
import TradeMessageTemplateSchema from '../models/TradeMessageTemplateModel';
import RatingTemplateSchema from '../models/RatingTemplateModel';
import AuctionPublicSettingService from '../services/AuctionPublicSettingService';
import ProductGlobalSettingService from '../services/ProductGlobalSettingService';
import TradeMessageTemplateService from '../services/TradeMessageTemplateService';
import RatingTemplateService from '../services/RatingTemplateService';

class YahooAccountController {
    static async getListAccount(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let accounts = await YahooAccountModel.aggregate([
                { $match: { user_id: mongoose.Types.ObjectId(user._id) } },
                { $lookup: { from: 'proxies', localField: 'proxy_id', foreignField: '_id', as: 'proxy' } },
            ]);
            response.success200({ accounts });
        } catch (error) {
            response.error500(error);
        }
    }
    static async createNewAccount(req, res) {
        let response = new Response(res);
        const { name, yahoo_id, password } = req.body;
        let user = req.user;
        try {
            if (name && yahoo_id && password) {
                let quantityAccount = await YahooAccountModel.find({ user_id: user._id }).countDocuments();
                user = await UserModel.findById(user._id);
                if (quantityAccount >= user.maxYahooAccount) {
                    return response.error404({ ...req.body, message: 'Your Account is maximum.You can not create new account' });
                }
                let isExistAccount = await YahooAccountModel.findOne({
                    yahoo_id: yahoo_id,
                });
                if (isExistAccount) {
                    return response.existed409(yahoo_id);
                } else {
                    var newAccount = await new YahooAccountModel({
                        name,
                        yahoo_id,
                        password,
                        hash_password: bcrypt.hashSync(password, 10),
                        user_id: user._id,
                    });
                    let proxy = await ProxySchema.findOne({ status: 'live' });
                    newAccount.proxy_id = proxy._id;

                    let result = await newAccount.save();
                    proxy.status = 'used';
                    await proxy.save();

                    await ProductInfomationDefaultService.get(user._id, result._doc._id);

                    QueueLoginYahooAuction.addNew(newAccount);
                    response.success200(result._doc);
                }
            } else {
                return response.error400({ message: 'パラメータが必要です。' });
            }
        } catch (error) {
            return response.error500(error);
        }
    }

    static async editAccount(req, res) {
        let response = new Response(res);
        const { name, yahoo_id, password } = req.body;
        const { _id } = req.params;
        try {
            if (name && yahoo_id && password) {
                let existAccount = await YahooAccountModel.findById(_id);
                if (!existAccount) {
                    return response.error404({ ...req.body, message: 'Account not found' });
                } else {
                    existAccount.name = name;
                    existAccount.yahoo_id = yahoo_id;
                    existAccount.password = password;
                    existAccount.hash_password = bcrypt.hashSync(password, 10);
                    let result = await existAccount.save();
                    QueueLoginYahooAuction.addNew(existAccount);
                    response.success200(result._doc);
                }
            } else {
                response.error400();
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async deleteAccount(req, res) {
        let response = new Response(res);
        const { _id } = req.params;
        try {
            if (_id) {
                let existAccount = await YahooAccountModel.findById(_id);
                if (!existAccount) {
                    return response.error404({ message: 'Account not found' });
                } else {
                    await existAccount.remove();
                    response.success200({ success: true });
                }
            } else {
                response.error400();
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async copyDefaultSetting(req, res) {
        let response = new Response(res);
        try {
            const { yahoo_account_id, account_id_selected } = req.body;

            console.log('yahoo_account_id: ', yahoo_account_id);
            console.log('account_id_selected: ', account_id_selected);

            let user = req.user;
            let existAccount = await YahooAccountModel.findById(yahoo_account_id);
            if (!existAccount) {
                return response.error404({ message: 'Account not found' });
            }

            let productInfomationDefault = await ProductInfomationDefaultSchema.findOne({ user_id: user._id, yahoo_account_id });
            productInfomationDefault = { ...productInfomationDefault._doc };
            productInfomationDefault.yahoo_account_id = account_id_selected;

            let dataExist1 = await ProductInfomationDefaultSchema.findOne({ user_id: user._id, yahoo_account_id: account_id_selected });
            if (dataExist1) {
                productInfomationDefault._id = dataExist1._id;
                await ProductInfomationDefaultService.update(dataExist1._id, productInfomationDefault);
            } else {
                productInfomationDefault._id = null;
                await ProductInfomationDefaultSchema.create(productInfomationDefault);
            }

            let auctionPublicSetting = await AuctionPublicSettingSchema.findOne({ user_id: user._id, yahoo_account_id });
            auctionPublicSetting = { ...auctionPublicSetting._doc };
            auctionPublicSetting.yahoo_account_id = account_id_selected;

            let dataExist2 = await AuctionPublicSettingSchema.findOne({ user_id: user._id, yahoo_account_id: account_id_selected });
            if (dataExist2) {
                auctionPublicSetting._id = dataExist2._id;
                await AuctionPublicSettingService.update(auctionPublicSetting);
            } else {
                auctionPublicSetting._id = null;
                await AuctionPublicSettingSchema.create(auctionPublicSetting);
            }

            let productGlobalSetting = await ProductGlobalSettingSchema.findOne({ user_id: user._id, yahoo_account_id });
            productGlobalSetting = { ...productGlobalSetting._doc };
            productGlobalSetting.yahoo_account_id = account_id_selected;

            let dataExist3 = await ProductGlobalSettingSchema.findOne({ user_id: user._id, yahoo_account_id: account_id_selected });
            if (dataExist3) {
                productGlobalSetting._id = dataExist3._id;
                await ProductGlobalSettingService.update(productGlobalSetting);
            } else {
                productGlobalSetting._id = null;
                await ProductGlobalSettingSchema.create(productGlobalSetting);
            }

            let listTradeMessageTemplate = await TradeMessageTemplateSchema.find({ user_id: user._id, yahoo_account_id });
            await TradeMessageTemplateSchema.deleteMany({ user_id: user._id, yahoo_account_id: account_id_selected });

            for (const tradeMessageTemplate of listTradeMessageTemplate) {
                tradeMessageTemplate = { ...tradeMessageTemplate._doc };
                tradeMessageTemplate._id = null;
                tradeMessageTemplate.yahoo_account_id = account_id_selected;
                await TradeMessageTemplateSchema.create(tradeMessageTemplate);
            }

            let listRatingTemplate = await RatingTemplateSchema.find({ user_id: user._id, yahoo_account_id });
            await RatingTemplateSchema.deleteMany({ user_id: user._id, yahoo_account_id: account_id_selected });

            for (const ratingTemplate of listRatingTemplate) {
                ratingTemplate = { ...ratingTemplate._doc };
                ratingTemplate._id = null;
                ratingTemplate.yahoo_account_id = account_id_selected;
                await RatingTemplateSchema.create(ratingTemplate);
            }
            return response.success200({ success: true });
        } catch (error) {
            console.log(' ### error: ', error);
            response.error500(error);
        }
    }
}

export default YahooAccountController;
