import UserModel from '../models/UserModel';
import Response from '../utils/Response';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY, LIFE_TIME_TOKEN } from '../configs/settings';
import UserService from '../services/UserService';
import Utils from '../utils/Utils';

class UserController {
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
            let username = req.body.username;
            let password = req.body.password;
            console.log(req.body);
            // For the given username fetch user from DB
            if (username && password) {
                let userLogin = await UserModel.findOne({
                    username,
                });
                if (userLogin) {
                    if (userLogin.status === 'LOCKED') {
                        return response.error400({ message: 'Tài khoản của bạn đã bị khóa' });
                    }
                    let checkPassword = userLogin.comparePassword(password);
                    if (checkPassword) {
                        let token = userLogin.token;
                        if (token) {
                            await jwt.verify(token, SECRET_KEY, async (err, decoded) => {
                                if (err) {
                                    token = await jwt.sign(
                                        {
                                            username: username,
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
                                    username: username,
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
                        return response.success200({
                            message: 'Authentication successful!',
                            userData: userLogin,
                        });
                    }
                }
            }

            return response.error400({
                success: false,
                message: 'Username hoặc Password sai.!',
            });
        } catch (error) {
            console.log('===========', error);
            return response.error500(error);
        }
    }
}

export default UserController;
