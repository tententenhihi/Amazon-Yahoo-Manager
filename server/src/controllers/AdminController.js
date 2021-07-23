import bcrypt from 'bcryptjs';
import Utils from '../utils/Utils';
import Response from '../utils/Response';
import UserModel from '../models/UserModel';
import YahooAccountModel from '../models/YahooAccount';
import VerifyCodeSchema from '../models/VerifyCodeModel';
import ProxyModel from '../models/ProxyModel';
import AsinAmazonService from '../services/AsinAmazonService';
import { sendEmail } from '../helpers/sendEmail';

const saltRounds = 10;

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
            const { username, password, name, status, email, expired_at, note, maxYahooAccount } = req.body;
            if (!username || !password || !name || !status || !email || !expired_at) {
                return response.error400({ message: '完全な情報を入力してください。' });
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
                        await user.save();
                        let newCode = new VerifyCodeSchema();
                        newCode.email = user.email;
                        newCode.code = Utils.generateKey();
                        await newCode.save();
                        let body = `
                            <div style="color: black">
                                Please click to link to active your account: <br>
                                ${domain}/login?code=${newCode.code}
                            </div>
                        `;
                        await sendEmail(user.email, body, 'Amazon Yahoo Manager active account');
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
            const { password, name, status, experied_at, note } = req.body;
            const { user_id } = req.params;
            let user = await UserModel.findById(user_id);
            if (user) {
                user.name = name;
                user.status = status;
                user.experied_at = experied_at;
                user.note = note;
                if (password) {
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
            return response.success200({ proxies });
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
            let white_list = await AsinAmazonService.getWhiteList();
            return response.success200({ white_list });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async getBlackListAsin(req, res) {
        let response = new Response(res);
        try {
            let black_list = await AsinAmazonService.getBlackList();
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
            let result = await AsinAmazonService.create(data);
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
            let result = await AsinAmazonService.delete(_id);
            return response.success200({ success: result });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
}

export default AdminController;
