import mongoose from 'mongoose'
import UserModel from '../models/UserModel';
import YahooAccountModel from '../models/YahooAccount';
import Response from '../utils/Response';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY, LIFE_TIME_TOKEN } from '../configs/settings';
import UserService from '../services/UserService';
import Utils from '../utils/Utils';
import VerifyCodeSchema from '../models/VerifyCodeModel';
const { sendEmail } = require('../helpers/sendEmail');
const saltRounds = 10;

class AuthController {
    static async checkAdmin(req, res, next) {
        let user = req.user;
        if (user.username === 'admin') {
            next();
        } else {
            let respponse = new Response(res);
            return respponse.error400({ message: 'You are not Admin.!' });
        }
    }

    static async register(req, res) {
        let respponse = new Response(res);
        let payload = req.body;
        try {
            if (payload.name && payload.username && payload.password) {
                let checkExistUser = await UserModel.findOne({
                    username: payload.username,
                });
                if (checkExistUser) {
                    return respponse.existed409(payload.username);
                } else {
                    var newUser = await new UserModel(req.body);
                    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
                    let result = await newUser.save();
                    // tạo thư mục user khi login thành công
                    respponse.success200(result);
                }
            } else {
                respponse.error400();
            }
        } catch (error) {
            respponse.error500(error);
        }
    }

    static async login(req, res) {
        let response = new Response(res);
        try {
            let email = req.body.email;
            let password = req.body.password;
            // For the given email fetch user from DB
            if (email && password) {
                let userLogin = await UserModel.findOne({
                    email,
                });
                if (!userLogin) {
                    userLogin = await UserModel.findOne({ username: email });
                }
                if (userLogin) {
                    if (userLogin.status === 'LOCKED') {
                        return response.error400({ message: 'アカウントがロックされました' });
                    }
                    if (!userLogin.verified_at) {
                        return response.error400({ message: 'アカウントの有効化についてはメールを確認してください' });
                    }
                    if (userLogin.expired_at && new Date(userLogin.expired_at).getTime() <= new Date().getTime()) {
                        return response.error400({ message: 'Tài khoản đã hết hạn.Vui lòng liên hệ admin' });
                    }
                    let checkPassword = userLogin.comparePassword(password);
                    if (checkPassword) {
                        let token = userLogin.token;
                        if (token) {
                            await jwt.verify(token, SECRET_KEY, async (err, decoded) => {
                                if (err) {
                                    token = await jwt.sign(
                                        {
                                            email: email,
                                            type: userLogin.type,
                                            _id: userLogin._id,
                                        },
                                        SECRET_KEY,
                                        {
                                            expiresIn: LIFE_TIME_TOKEN,
                                        }
                                    );
                                    userLogin.token = token;
                                    userLogin.save();
                                }
                            });
                        } else {
                            token = await jwt.sign(
                                {
                                    email: email,
                                    type: userLogin.type,
                                    _id: userLogin._id,
                                },
                                SECRET_KEY,
                                {
                                    expiresIn: LIFE_TIME_TOKEN,
                                }
                            );
                            userLogin.token = token;
                            userLogin.save();
                        }
                        let yahooAccount = await YahooAccountModel.aggregate([
                            { $match: { user_id: mongoose.Types.ObjectId(userLogin._id) } },
                            { $lookup: { from: 'proxies', localField: 'proxy_id', foreignField: '_id', as: 'proxy' } },
                        ]);
                        return response.success200({
                            message: 'Authentication successful!',
                            userData: userLogin,
                            yahooAccount: yahooAccount,
                        });
                    }
                }
            }

            return response.error400({
                success: false,
                message: 'ユーザー名かパスワードが間違っています',
            });
        } catch (error) {
            console.log('===========', error);
            return response.error500(error);
        }
    }

    static async forgotPassword(req, res) {
        let response = new Response(res);
        const domain = req.get('origin');

        try {
            const { email } = req.body;
            let user = await UserService.findUser({ email });
            if (user) {
                let newCode = new VerifyCodeSchema();
                newCode.email = user.email;
                newCode.code = Utils.generateKey();
                await newCode.save();
                let body = `
                    <div style="color: black">
                        Please click to link to reset password: <br>
                        ${domain}/reset-password?code=${newCode.code}
                    </div>
                `;
                await sendEmail(user.email, body, 'Amazon Yahoo Manager reset password');
                return response.success200({ status: true });
            } else {
                return response.error400({ message: 'ユーザーが見つかりません。' });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async resetPassword(req, res) {
        let response = new Response(res);
        try {
            const { password, code } = req.body;
            let verifyCode = await VerifyCodeSchema.findOne({ code });
            if (verifyCode) {
                verifyCode.status = 1;
                await verifyCode.save();
                let user = await UserModel.findOne({ email: verifyCode.email });
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        user.password = password;
                        user.hash_password = hash;
                        await user.save();
                        return response.success200({ success: true });
                    });
                });
            } else {
                return response.error400({ message: 'コードが見つかりません。' });
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async verifyAccount(req, res) {
        let response = new Response(res);
        try {
            const { code } = req.body;
            let verifyCode = await VerifyCodeSchema.findOne({ code, status: 0 });
            if (verifyCode && Object.keys(verifyCode).length) {
                verifyCode.status = 1;
                await verifyCode.save();
                let user = await UserModel.findOne({ email: verifyCode.email });
                user.verified_at = new Date();
                await user.save();
                return response.success200(verifyCode._doc);
            } else {
                return response.error400({ message: '間違ったコード' });
            }
        } catch (error) {
            return response.error500(error);
        }
    }

    static async getVerifyCode(req, res) {
        let response = new Response(res);
        try {
            const { code } = req.body;
            let verifyCode = await VerifyCodeSchema.findOne({ code, status: 0 });
            if (verifyCode && Object.keys(verifyCode).length) {
                return response.success200(verifyCode._doc);
            } else {
                return response.error400({ message: '間違ったコード' });
            }
        } catch (error) {
            return response.error500(error);
        }
    }
}

export default AuthController;
