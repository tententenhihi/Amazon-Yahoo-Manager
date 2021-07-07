import Response from "../utils/Response";
import bcrypt from 'bcryptjs'
import UserSchema from "../models/UserModel";
const saltRounds = 10;
class UserController {
  static async changePassword (req, res) {
    let response = new Response(res);
    try {
      let user = req.user;
      console.log(req.body);
      user = await UserSchema.findById(user._id)
      console.log(user);
      bcrypt.compare(req.body.current_password, user.hash_password, function(err, res) {
        if (err){
          throw err;
        }
        if (res) {
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
              user.password = req.body.password;
              user.hash_password = hash
              await user.save()
              return response.success200({success: true});
            });
          });
        } else {
          return response.error400({message: '現在のパスワードが正しくありません'});
        }
      });
    } catch (error) {
      console.log(error);
      return response.error500(error);
    }
  }
}

export default UserController;
