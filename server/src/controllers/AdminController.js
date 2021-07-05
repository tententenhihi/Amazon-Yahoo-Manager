import UserModel from '../models/UserModel';
import Response from '../utils/Response';

class AdminController {
  static async getAllUsers (req, res) {
    let response = new Response(res);
    try {
      let userLogin = req.user
      if (userLogin.type === 'admin') {
        let users = await UserModel.find({
          type: 'member',
        })
        return response.success200({users});
      } else {
        return response.error400({message: 'アクセスできません。'})
      }
    } catch (error) {
      console.log(error);
      return response.error500(error)
    }
  }
  static async createUser (req, res) {
    let response = new Response(res);
    try {
      let userLogin = req.user
      if (userLogin.type === 'admin') {
        let users = await UserModel.find({
          type: 'member',
        })
        return response.success200({users});
      } else {
        return response.error400({message: 'アクセスできません。'})
      }
    } catch (error) {
      console.log(error);
      return response.error500(error)
    }
  } 
}

export default AdminController;