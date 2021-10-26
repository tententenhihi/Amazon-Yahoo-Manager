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
import ProductYahooSellingService from '../services/ProductYahooSellingService';
import AuctionYahooService from '../services/AuctionYahooService';
import BankModel from '../models/BankModel';
import WithDrawMoneyModel from '../models/WithDrawMoneyModel';
const SocketIOService = require('../services/SocketIOService');

const { Worker } = require('worker_threads');

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
        content:
            `商品発送いたしました。到着までしばらくお待ちください。届きましたら、評価よりご連絡ください。\n` +
            `なお、作業円滑化のため、追跡番号連絡や時間指定はできませんのでご了承ください。\n` +
            `1週間過ぎても商品が届かない場合はご連絡ください。\n` +
            `以上、ありがとうございました。\n` +
            `私から製品を購入していただきました方限定で、毎月3万～100万のお小遣いを得る丸秘術を無料でメール配信しております。\n\n` +
            `https://december-ex.com/rg/5218/1/\n` +
            `LINE@:https://line.me/R/ti/p/%40603mwfiu`,
    });

    await RatingTemplateSchema.create({
        user_id,
        yahoo_account_id,
        name: '非常に良い',
        rating: 'veryGood',
        content: 'スムーズに取引できました。ありがとうございました。',
    });

    await AuctionPublicSettingService.create({ user_id, yahoo_account_id });
};
const setLockAccount = async (yahooAccount) => {
    await AuctionPublicSettingService.updateByYahooAccount(yahooAccount._id, {
        new_list_auto: false,
        relist_auto: false,
        auction_delete: false,
        calendar_list_setting: false,
    });
    // Delete product selling
    if (yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS') {
        let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
        if (proxyResult.status === 'SUCCESS') {
            let productSelling = await AuctionYahooService.getProductAuctionSelling(yahooAccount.cookie, proxyResult.data);
            for (const productDelete of productSelling) {
                try {
                    if (productDelete.idBuyer !== '') {
                        await AuctionYahooService.cancelAuction(productDelete.aID, yahooAccount.cookie, proxyResult.data, true);
                    } else {
                        await AuctionYahooService.cancelAuction(productDelete.aID, yahooAccount.cookie, proxyResult.data);
                    }
                } catch (error) {}
                try {
                    await ProductYahooSellingService.delete(productDelete._id);
                } catch (error) {}
            }
        }
    }
};

async function startThread(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('../server/src/services/ServiceRutTien.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

async function startRutTien(listYahoo) {
    for (const yahoo_account_id of listYahoo) {
        let yahooAccount = await AccountYahooService.findById(yahoo_account_id);
        try {
            if (!yahooAccount.is_withdraw_running) {
                yahooAccount.status_withdraw = 'Stop';
            } else {
                if (yahooAccount.bank_id && yahooAccount && yahooAccount.proxy_id && yahooAccount.cookie && yahooAccount.status === 'SUCCESS' && !yahooAccount.is_error && yahooAccount.count_error < 3000) {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        yahooAccount.status_withdraw = 'Running...';
                        await yahooAccount.save();
                        SocketIOService.emitData(yahooAccount.user_id, {
                            type: 'PAYMENT',
                            yahoo_account_id,
                            status: 'Running...',
                            is_withdraw_running: true,
                        });
                        let bankInfo = await BankModel.findById(yahooAccount.bank_id);
                        if (bankInfo) {
                            bankInfo = { ...bankInfo._doc, old_bank_number: yahooAccount.old_bank_number };
                            delete bankInfo._id;
                            delete bankInfo.user_id;
                            delete bankInfo.created;
                            delete bankInfo.__v;
                            let data = { cookie: yahooAccount.cookie, proxy: proxyResult.data._doc, bankInfo };
                            let result = await startThread(data);
                            await WithDrawMoneyModel.create({
                                yahoo_account_id: yahoo_account_id,
                                bankNumber: bankInfo.bkAccountNum,
                                amount: result.amount,
                                created: Date.now(),
                                status: result.status,
                                status_message: result.message,
                            });
                            if (result.status === 'SUCCESS') {
                                yahooAccount.amount = 0;
                            }
                            yahooAccount.status_withdraw = result.message;
                            console.log(' ############## result: ', result);
                        } else {
                            yahooAccount.status_withdraw = 'Bank not found';
                        }
                    } else {
                        yahooAccount.status_withdraw = 'Proxy die';
                    }
                } else {
                    yahooAccount.status_withdraw = 'Account error';
                }
            }
        } catch (error) {
            console.log(' ERROR: ', error);
            yahooAccount.status_withdraw = 'Error: ' + error;
        }

        yahooAccount.is_withdraw_running = false;
        await yahooAccount.save();

        let account = await YahooAccountModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(yahoo_account_id) } }, { $lookup: { from: 'banks', localField: 'bank_id', foreignField: '_id', as: 'bank' } }]);
        let historyWithDraw = await WithDrawMoneyModel.find({ yahoo_account_id: yahoo_account_id });
        account = account[0];
        account.historyWithDraw = historyWithDraw || [];

        SocketIOService.emitData(yahooAccount.user_id, {
            type: 'PAYMENT',
            yahoo_account_id,
            status: yahooAccount.status_withdraw,
            is_withdraw_running: false,
            account,
        });
    }
}

class YahooAccountController {
    static async refreshAccountPayment(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let listYahoooAccount = await AccountYahooService.updateAmount(user._id);
            return response.success200({});
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
    static async withDrawMoney(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let listAccountYahoo = req.body.listAccountSelected;
            for (const yahoo_account_id of listAccountYahoo) {
                await AccountYahooService.update(yahoo_account_id, { is_withdraw_running: true, status_withdraw: 'Watting...' });
            }
            startRutTien(listAccountYahoo);
            return response.success200({});
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
    static async setOldBankNumber(req, res) {
        let response = new Response(res);
        try {
            let yahoo_account_id = req.body.yahoo_account_id;
            let old_bank_number = req.body.old_bank_number;
            await AccountYahooService.update(yahoo_account_id, { old_bank_number, is_withdraw_running: true, status_withdraw: 'Watting...' });
            startRutTien([yahoo_account_id]);
            return response.success200({});
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
    static async stopWithDrawMoney(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let listAccountYahoo = req.body.listAccountSelected;
            for (const yahoo_account_id of listAccountYahoo) {
                await AccountYahooService.update(yahoo_account_id, { is_withdraw_running: false, status_withdraw: 'Stop' });
            }
            return response.success200({});
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
    static async getAccountAndHistoryWithRraw(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let accounts = await YahooAccountModel.aggregate([{ $match: { user_id: mongoose.Types.ObjectId(user._id) } }, { $lookup: { from: 'banks', localField: 'bank_id', foreignField: '_id', as: 'bank' } }]);
            for (let i = 0; i < accounts.length; i++) {
                let historyWithDraw = await WithDrawMoneyModel.find({ yahoo_account_id: accounts[i]._id });
                accounts[i].historyWithDraw = historyWithDraw || [];
            }
            console.log(' ############ accounts: ', accounts.length);
            response.success200({ accounts });
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }
    static async setBankToAccount(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let data = req.body;
            console.log(data);

            if (!data._id || !data.bank_id) {
                return response.error400({ message: '完全な情報を入力してください。' });
            }
            let newAccount = await YahooAccountModel.findByIdAndUpdate(data._id, { bank_id: data.bank_id });
            response.success200({ newAccount });
        } catch (error) {
            console.log(error);
            response.error500(error);
        }
    }

    static async getAccountBank(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let accounts = await YahooAccountModel.aggregate([{ $match: { user_id: mongoose.Types.ObjectId(user._id) } }, { $lookup: { from: 'banks', localField: 'bank_id', foreignField: '_id', as: 'bank' } }]);
            let listBank = await BankModel.find({ user_id: mongoose.Types.ObjectId(user._id) });
            response.success200({ accounts, listBank });
        } catch (error) {
            response.error500(error);
        }
    }

    static async getListAccount(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let accounts = await YahooAccountModel.aggregate([{ $match: { user_id: mongoose.Types.ObjectId(user._id) } }, { $lookup: { from: 'proxies', localField: 'proxy_id', foreignField: '_id', as: 'proxy' } }]).sort({ created: 1 });
            let infoUser = await UserModel.findById(user._id, { password: 0, hash_password: 0 });
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
                        if (is_lock) {
                            setLockAccount(existAccount);
                        }
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
