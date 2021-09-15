import bcrypt from 'bcryptjs';
import Response from '../utils/Response';
import UserModel from '../models/UserModel';
import VerifyCodeSchema from '../models/VerifyCodeModel';
import ProxyModel from '../models/ProxyModel';
import BlacklistAsinService from '../services/BlacklistAsinService';
import YahooAccountModel from '../models/YahooAccount';
import AuctionPublicSettingModel from '../models/AuctionPublicSettingModel';
import CategoryModel from '../models/CategoryModel';
import FolderModel from '../models/FolderModel';
import ProductGlobalSettingModel from '../models/ProductGlobalSettingModel';
import ProductInfomationDefaultModel from '../models/ProductInfomationDefaultModel';
import ProductYahooEndedModel from '../models/ProductYahooEndedModel';
import ProductYahooModel from '../models/ProductYahooModel';
import RatingTemplateModel from '../models/RatingTemplateModel';
import TradeMessageTemplateModel from '../models/TradeMessageTemplateModel';
import AsinModel from '../models/BlacklistAsinModel';
import BrightDataService from '../services/BrightDataService';
import { sendEmail } from '../helpers/sendEmail';

const saltRounds = 10;

const deleteUserData = async (userId) => {
    try {
        await YahooAccountModel.deleteMany({ user_id: userId });
        await AuctionPublicSettingModel.deleteMany({ user_id: userId });
        await CategoryModel.deleteMany({ user_id: userId });
        await FolderModel.deleteMany({ user_id: userId });
        await ProductGlobalSettingModel.deleteMany({ user_id: userId });
        await ProductInfomationDefaultModel.deleteMany({ user_id: userId });
        await ProductYahooEndedModel.deleteMany({ user_id: userId });
        await ProductYahooModel.deleteMany({ user_id: userId });
        await RatingTemplateModel.deleteMany({ user_id: userId });
        await TradeMessageTemplateModel.deleteMany({ user_id: userId });
        await AsinModel.deleteMany({ idUser: userId });
    } catch (error) {
        throw new Error(error.message);
    }
};
class AdminController {
    static async getAllUsers(req, res) {
        let response = new Response(res);
        try {
            let users = await UserModel.aggregate([
                { $match: { type: 'member' } },
                { $lookup: { from: 'yahooaccounts', localField: '_id', foreignField: 'user_id', as: 'yahooaccounts' } },
            ]);
            return response.success200({ users });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async createUser(req, res) {
        let response = new Response(res);
        try {
            const domain = req.get('origin');
            const { username, password, re_password, name, status, email, expired_at, note, maxYahooAccount } = req.body;
            if (!username || !password || !name || !status || !email || !expired_at) {
                return response.error400({ message: '完全な情報を入力してください。' });
            }
            if (password != re_password) {
                return response.error400({ message: 'パスワード（確認）に一貫性がありません' });
            }
            let existUsers = await UserModel.findOne({ email });
            if (!existUsers) {
                existUsers = await UserModel.findOne({ username });
            }
            if (existUsers) {
                return response.error400({ message: 'ユーザー名は既に存在します' });
            } else {
                let user = new UserModel();
                user.username = username;
                user.name = name;
                user.email = email;
                user.expired_at = expired_at;
                user.status = status;
                user.note = note;
                user.maxYahooAccount = parseInt(maxYahooAccount);
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        user.password = password;
                        user.hash_password = hash;
                        user.verified_at = new Date();
                        await user.save();
                        // let newCode = new VerifyCodeSchema();
                        // newCode.email = user.email;
                        // newCode.code = Utils.generateKey();
                        // await newCode.save();
                        // let body = `
                        //     <div style="color: black">
                        //         Please click to link to active your account: <br>
                        //         ${domain}/login?code=${newCode.code}
                        //     </div>
                        // `;
                        // await sendEmail(user.email, body, 'Amazon Yahoo Manager active account');
                        return response.success200({ user });
                    });
                });
            }
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async updateUser(req, res) {
        let response = new Response(res);
        try {
            const { password, name, status, expired_at, note, re_password, maxYahooAccount } = req.body;
            const { user_id } = req.params;
            let user = await UserModel.findById(user_id);
            if (user) {
                user.name = name;
                user.status = status;
                user.expired_at = expired_at;
                user.note = note;
                user.maxYahooAccount = maxYahooAccount;
                if (password) {
                    if (password != re_password) {
                        return response.error400({ message: 'パスワード（確認）に一貫性がありません' });
                    }
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        bcrypt.hash(password, salt, async function (err, hash) {
                            user.password = password;
                            user.hash_password = hash;
                            await user.save();
                            return response.success200({ user });
                        });
                    });
                } else {
                    await user.save();
                    return response.success200({ user });
                }
            } else {
                return response.error400({ message: 'ユーザーが見つかりません。' });
            }
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async deleteUser(req, res) {
        let response = new Response(res);
        try {
            const { user_id } = req.params;
            let user = await UserModel.findById(user_id);
            if (user) {
                await user.remove();
                await deleteUserData(user._id);

                return response.success200({ user });
            } else {
                return response.error400({ message: 'ユーザーが見つかりません。' });
            }
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async getProxies(req, res) {
        let response = new Response(res);
        try {
            let proxies = await ProxyModel.find();
            let listYahooAccount = await YahooAccountModel.find({});

            return response.success200({ proxies, listYahooAccount });
        } catch {
            return response.error500(res);
        }
    }

    static async getYahooAccount(req, res) {
        let response = new Response(res);
        try {
            let yahooAccount = await YahooAccountModel.aggregate([
                { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'users' } },
                { $lookup: { from: 'proxies', localField: 'proxy_id', foreignField: '_id', as: 'proxies' } },
            ]);
            let proxies = await ProxyModel.find({ status: 'live' });

            return response.success200({ accounts: yahooAccount, proxies });
        } catch (error) {
            return response.error500(error);
        }
    }

    static async setProxyToYahooAccount(req, res) {
        let response = new Response(res);
        try {
            const { proxy_id, yahoo_account_id } = req.body;
            let yahooAccount = await YahooAccountModel.findById(yahoo_account_id);
            if (!yahooAccount) {
                return response.error400({ message: 'アカウントが存在しません。' });
            }
            let proxy = await ProxyModel.findById(proxy_id);
            if (!proxy) {
                return response.error400({ message: 'プロキシが存在しません。' });
            }
            yahooAccount.proxy_id = proxy._id;
            await yahooAccount.save();

            proxy.status = 'used';
            await proxy.save();

            return response.success200({ account: yahooAccount });
        } catch (error) {
            return response.error500(error);
        }
    }

    static async getWhiteListAsin(req, res) {
        let response = new Response(res);
        try {
            let white_list = await BlacklistAsinService.getWhiteList();
            return response.success200({ white_list });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async getBlackListAsin(req, res) {
        let response = new Response(res);
        try {
            let black_list = await BlacklistAsinService.getBlackList();
            return response.success200({ black_list });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async createAsinAmazon(req, res) {
        let response = new Response(res);
        try {
            let { asin, type, reason_for_prohibition } = req.body;
            let data = { asin, type, reason_for_prohibition };
            let result = await BlacklistAsinService.create(data);
            return response.success200({ asin: result });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async deleteAsinAmazon(req, res) {
        let response = new Response(res);
        try {
            let { _id } = req.params;
            let result = await BlacklistAsinService.delete(_id);
            return response.success200({ success: result });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async unLockProxy(req, res) {
        let response = new Response(res);
        try {
            let { _id } = req.params;
            if (_id === 'all') {
                let result = await ProxyModel.updateMany({ status: 'lock' }, { status: 'live' });
                let listAccountYahoo = await YahooAccountModel.find({});
                let listProxyUsed = await ProxyModel.find({ status: 'used' });
                let listProxyAccountYahoo = listAccountYahoo.map((item) => item.proxy_id.toString());
                for (const proxyUsed of listProxyUsed) {
                    if (!listProxyAccountYahoo.includes(proxyUsed._id.toString())) {
                        await ProxyModel.findByIdAndUpdate(proxyUsed._id, { status: 'live' });
                    }
                }
                let proxies = await ProxyModel.find();
                return response.success200({ proxies });
            } else {
                let result = await ProxyModel.findByIdAndUpdate(_id, { status: 'live' });
                await YahooAccountModel.findOneAndUpdate({ proxy_id: _id }, { proxy_id: null });
                return response.success200({ proxies: result });
            }
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async reloadProxy(req, res) {
        let response = new Response(res);
        try {
            let listProxyNew = await BrightDataService.getAllProxy();
            let listProxyOld = await ProxyModel.find({});

            for (let i = 0; i < listProxyOld.length; i++) {
                const proxyOld = listProxyOld[i];
                let findProxy = await listProxyNew.find((item) => item.ip == proxyOld.ip);
                if (findProxy) {
                    listProxyNew = listProxyNew.filter((item) => item.ip !== findProxy.ip);
                    //update proxy hiện tại
                    await ProxyModel.findByIdAndUpdate(proxyOld._id, findProxy);
                } else {
                    // Xóa proxy cũ
                    await ProxyModel.findByIdAndDelete(proxyOld._id);
                    await YahooAccountModel.findOneAndUpdate({ proxy_id: proxyOld._id }, { proxy_id: null });
                }
            }
            for (let i = 0; i < listProxyNew.length; i++) {
                const element = listProxyNew[i];
                await ProxyModel.create(element);
            }
            let proxies = await ProxyModel.find({});

            return response.success200({ proxies });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
}

export default AdminController;
