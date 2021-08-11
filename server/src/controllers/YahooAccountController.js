import YahooAccountModel from '../models/YahooAccount';
import UserModel from '../models/UserModel';
import ProxySchema from '../models/ProxyModel';
import Response from '../utils/Response';
import bcrypt from 'bcryptjs';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';
import mongoose from 'mongoose';
import ProductInfomationDefaultSchema from '../models/ProductInfomationDefaultModel';
import AuctionPublicSettingSchema from '../models/AuctionPublicSettingModel';
import ProductGlobalSettingSchema from '../models/ProductGlobalSettingModel';
import TradeMessageTemplateSchema from '../models/TradeMessageTemplateModel';
import RatingTemplateSchema from '../models/RatingTemplateModel';
import AuctionPublicSettingService from '../services/AuctionPublicSettingService';
import ProductGlobalSettingService from '../services/ProductGlobalSettingService';
import AccountYahooService from '../services/AccountYahooService';
import ProxyService from '../services/ProxyService';

const createDataDefault = async (user_id, yahoo_account_id) => {
    await ProductInfomationDefaultSchema.create({
        user_id,
        yahoo_account_id,
    });
    await ProductGlobalSettingSchema.create({
        user_id,
        yahoo_account_id,
    });
    await TradeMessageTemplateSchema.create({
        user_id,
        yahoo_account_id,
        name: '発送しました',
        content: `商品発送いたしました。到着までしばらくお待ちください。届きましたら、評価よりご連絡ください。
        なお、作業円滑化のため、追跡番号連絡や時間指定はできませんのでご了承ください。
        1週間過ぎても商品が届かない場合はご連絡ください。
        以上、ありがとうございました。
        私から製品を購入していただきました方限定で、毎月3万～100万のお小遣いを得る丸秘術を無料でメール配信しております。
        
        https://december-ex.com/rg/5218/1/
        LINE@:https://line.me/R/ti/p/%40603mwfiu`,
    });

    await RatingTemplateSchema.create({
        user_id,
        yahoo_account_id,
        name: '非常に良い',
        rating: '非常に良い',
        content: 'スムーズに取引できました。ありがとうございました。',
    });
};

class YahooAccountController {
    static async getListAccount(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let accounts = await YahooAccountModel.aggregate([
                { $match: { user_id: mongoose.Types.ObjectId(user._id) } },
                { $lookup: { from: 'proxies', localField: 'proxy_id', foreignField: '_id', as: 'proxy' } },
            ]);
            let infoUser = await UserModel.findById(user._id);
            response.success200({ accounts, infoUser });
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
                let quantityAccount = await YahooAccountModel.find({ user_id: user._id, is_lock: false }).countDocuments();
                user = await UserModel.findById(user._id);
                if (quantityAccount >= user.maxYahooAccount) {
                    return response.error404({ ...req.body, message: 'アカウントは最大です。新しいアカウントを作成することはできません。 ' });
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

                    await newAccount.save();
                    proxy.status = 'used';
                    await proxy.save();

                    await createDataDefault(user._id, newAccount._doc._id);

                    let result = await AccountYahooService.getCookie(newAccount._id);
                    if (result.status === 'ERROR') {
                        return response.error400({ message: result.message });
                    } else {
                        return response.success200({ account: result.data });
                    }
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
        const { name, yahoo_id, password, type, is_lock } = req.body;
        const { _id } = req.params;
        let user = req.user;

        try {
            if (type === 'RE_AUTH') {
                let result = await AccountYahooService.getCookie(_id);
                if (result.status === 'ERROR') {
                    return response.error400({ message: result.message });
                } else {
                    return response.success200({ account: result.data });
                }
            } else {
                if (name && yahoo_id && password) {
                    let existAccount = await YahooAccountModel.findById(_id);
                    if (!existAccount) {
                        return response.error404({ ...req.body, message: 'アカウントが見つかりませんでした' });
                    } else {
                        if (!is_lock) {
                            let quantityAccount = await YahooAccountModel.find({ user_id: user._id, is_lock: false }).countDocuments();
                            user = await UserModel.findById(user._id);
                            if (quantityAccount >= user.maxYahooAccount) {
                                return response.error400({
                                    ...req.body,
                                    message: '枠を解除すると契約数をオーバーします。アカウント枠を追加購入してください。',
                                });
                            }
                        }
                        existAccount.name = name;
                        existAccount.is_lock = is_lock;
                        if (existAccount.yahoo_id !== yahoo_id.trim() || existAccount.password !== password.trim()) {
                            existAccount.yahoo_id = yahoo_id;
                            existAccount.password = password;
                            existAccount.hash_password = bcrypt.hashSync(password, 10);
                            await existAccount.save();
                            let result = await AccountYahooService.getCookie(existAccount._id);
                            if (result.status === 'ERROR') {
                                return response.error400({ message: result.message });
                            } else {
                                return response.success200({ account: result.data });
                            }
                        } else {
                            let result = await existAccount.save();
                            return response.success200({ account: result._doc });
                        }
                    }
                } else {
                    return response.error400();
                }
            }
        } catch (error) {
            return response.error500(error);
        }
    }

    static async deleteAccount(req, res) {
        let response = new Response(res);
        const { _id } = req.params;
        try {
            if (_id) {
                let existAccount = await YahooAccountModel.findById(_id);
                if (existAccount.proxy_id) {
                    await ProxyService.updateProxy(existAccount.proxy_id, { status: 'lock' });
                }
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
