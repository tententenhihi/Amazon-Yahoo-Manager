import UserModel from '../models/UserModel';
import YahooAccountModel from '../models/YahooAccount';
import Response from '../utils/Response';
import bcrypt from 'bcryptjs'
const { sendEmail } = require('../helpers/sendEmail')

const saltRounds = 10

class AdminController {
  static async getAllUsers (req, res) {
    let response = new Response(res);
    try {
      let users = await UserModel.find({
        type: 'member',
      })
      users = [...users]
      for (let index = 0; index < users.length; index++) {
        let countAccount = await YahooAccountModel.find({user_id: users[index]._id}).countDocuments();
        console.log('countAccountcountAccountcountAccount: ', countAccount);
        users[index]['used_account'] = countAccount;
        console.log('abc: ', users[index]);
      }
      console.log('usersusers: ', users);
      return response.success200({users});
    } catch (error) {
      console.log(error);
      return response.error500(error)
    }
  }
  static async createUser (req, res) {
    let response = new Response(res);
    try {
      console.log(process.env.GMAIL_SERVICE_NAME);
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
            let body = `
              <div style="color: black">${user.email}</div>
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
}

export default AdminController;
