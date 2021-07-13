import YahooAccountModel from '../models/YahooAccount';
import UserModel from '../models/UserModel';
import ProxySchema from '../models/ProxyModel';
import Response from '../utils/Response';
import bcrypt from 'bcryptjs';
import QueueLoginYahooAuction from '../services/QueueLoginYahooAuction'
class YahooAccountController {
    static async getListAccount(req, res) {
        let response = new Response(res);
        let user = req.user;
        try {
            let accounts = await YahooAccountModel.find({user_id: user._id});
            response.success200({accounts});
        } catch (error) {
            response.error500(error);
        }
    }
    static async createNewAccount(req, res) {
        let response = new Response(res);
        const {name, yahoo_id, password } = req.body
        let user = req.user
        try {
            if (name && yahoo_id && password) {
                let quantityAccount = await YahooAccountModel.find({user_id: user._id}).countDocuments()
                user = await UserModel.findById(user._id)
                if (quantityAccount >= user.maxYahooAccount) {
                    return response.error404({...req.body, message: 'Your Account is maximum.You can not create new account'});
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
                        user_id: user._id
                    });
                    let proxy = await ProxySchema.findOne({ status: 'live' });
                    newAccount.proxy_id = proxy._id
                    
                    let result = await newAccount.save();
                    proxy.status = 'used'
                    await proxy.save()
                    
                    QueueLoginYahooAuction.addNew(newAccount)
                    response.success200(result._doc);
                }
            } else {
                return response.error400({message: 'Parameters is required'});
            }
        } catch (error) {
            return response.error500(error);
        }
    }

    static async editAccount(req, res) {
        let response = new Response(res);
        const { name, yahoo_id, password } = req.body
        const { _id } = req.params
        try {
            if (name && yahoo_id && password) {
                let existAccount = await YahooAccountModel.findById(_id);
                if (!existAccount) {
                    return response.error404({...req.body, message: 'Account not found'});
                } else {
                    existAccount.name = name
                    existAccount.yahoo_id = yahoo_id
                    existAccount.password = password
                    existAccount.hash_password = bcrypt.hashSync(password, 10)
                    let result = await existAccount.save();
                    QueueLoginYahooAuction.addNew(existAccount)
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
        const {_id } = req.params
        try {
            if (_id) {
                let existAccount = await YahooAccountModel.findById(_id);
                if (!existAccount) {
                    return response.error404({message: 'Account not found'});
                } else {
                    await existAccount.remove();
                    response.success200({success: true});
                }
            } else {
                response.error400();
            }
        } catch (error) {
            response.error500(error);
        }
    }
}

export default YahooAccountController;
