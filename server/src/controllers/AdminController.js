import UserModel from '../models/UserModel';
import YahooAccountModel from '../models/YahooAccount';
import VerifyCodeSchema from '../models/VerifyCodeModel'
import Response from '../utils/Response';
import Utils from '../utils/Utils'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../helpers/sendEmail'
import ProxyModel from '../models/ProxyModel'

const saltRounds = 10

class AdminController {
  static async getAllUsers (req, res) {
    let response = new Response(res);
    try {
      let users = await UserModel.find({
        type: 'member',
      })
      let countYahoo = [];
      for (let index = 0; index < users.length; index++) {
        let countAccount = await YahooAccountModel.find({user_id: users[index]._id}).countDocuments();
        countYahoo.push({
          user_id: users[index]._id,
          count: countAccount
        })
      }
      return response.success200({users, countYahoo});
    } catch (error) {
      console.log(error);
      return response.error500(error)
    }
  }
  static async createUser (req, res) {
    let response = new Response(res);
    try {
      const {username, password, name, status, email, expired_at, note} = req.body;
      if (!username || !password || !name || !status || !email || !expired_at) {
        return response.error400({message: '完全な情報を入力してください。'})
      }
      let existUsers = await UserModel.find({email});
      if (existUsers.length) {
        return response.error400({message: 'ユーザー名は既に存在します'})
      } else {
        let user = new UserModel();
        user.username = username;
        user.name = name;
        user.email = email;
        user.expired_at = expired_at;
        user.status = status;
        user.note = note
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(password, salt, async function (err, hash) {
            user.password = password;
            user.hash_password = hash
            await user.save();
            let newCode = new VerifyCodeSchema();
            newCode.email = user.email
            newCode.code = Utils.generateKey()
            await newCode.save();
            let body = `
              <div style="color: black">
                Please click to link to active your account: <br>
                http://${process.env.WEB_SERVER_HOST}/login?code=${newCode.code}
              </div>
            `
            await sendEmail(user.email, body, 'Amazon Yahoo Manager active account')
            return response.success200({user});
          });
        });
      }
    } catch (error) {
      console.log(error);
      return response.error500(error)
    }
  }

  static async updateUser (req, res) {
    let response = new Response(res);
    try {
      const {password, name, status, experied_at, note} = req.body;
      const {user_id} = req.params
      let user = await UserModel.findById(user_id);
      if (user) {
        user.name = name;
        user.status = status;
        user.experied_at = experied_at;
        user.note = note;
        if (password) {
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
              user.password = password;
              user.hash_password = hash
              await user.save()
              return response.success200({user});
            });
          });
        } else {
          await user.save()
          return response.success200({user});
        }
      } else {
        return response.error400({message: 'ユーザーが見つかりません。'})
      }
    } catch (error) {
      console.log(error);
      return response.error500(error)
    }
  }

  static async deleteUser (req, res) {
    let response = new Response(res);
    try {
      const {user_id} = req.params
      let user = await UserModel.findById(user_id);
      if (user) {
        await user.remove()
        return response.success200({user});
      } else {
        return response.error400({message: 'ユーザーが見つかりません。'})
      }
    } catch (error) {
      console.log(error);
      return response.error500(error)
    }
  }
  static async getProxies (req, res) {
    let response = new Response(res);
    try {
      let proxies = await ProxyModel.find();
      return response.success200({proxies})
    } catch {
      return response.error500(res)
    }
  }
  static async getYahooAccount (req, res) {
    let response = new Response(res)
    try {
      let yahooAccount = await YahooAccountModel.aggregate([
          { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'users'}},
          { $lookup: { from: 'proxies', localField: 'proxy_id', foreignField: '_id', as: 'proxies'}},
        ]);
      let proxies = await ProxyModel.find({status: 'live'});

      return response.success200({accounts: yahooAccount, proxies})
    } catch (error) {
      return response.error500(error)
    }
  }

  static async setProxyToYahooAccount (req, res) {
    let response = new Response(res)
    try {
      const {proxy_id, yahoo_account_id} = req.body;
      let yahooAccount = await YahooAccountModel.findById(yahoo_account_id);
      if (!yahooAccount) {
        return response.error400({message: 'アカウントが存在しません。'})
      }
      let proxy = await ProxyModel.findById(proxy_id);
      if (!proxy) {
        return response.error400({message: 'プロキシが存在しません。'})
      }

      yahooAccount.proxy_id = proxy._id;
      await yahooAccount.save();

      proxy.status = 'used';
      await proxy.save();

      return response.success200({account: yahooAccount})
    } catch (error) {
      return response.error500(error)
    }
  }
}

export default AdminController;
