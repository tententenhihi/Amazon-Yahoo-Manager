import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';

class UserService {
    static async checkUserLive(userId) {
        try {
            let user = await UserModel.findById(userId);
            return user && user.status === 'LIVE';
        } catch (error) {
            return false;
        }
    }
    static async findUser(filter) {
        try {
            let user = await UserModel.findOne(filter);
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async addUser(newUser) {
        try {
            let checkExist = await UserModel.findOne({ username: newUser.username });
            if (!checkExist) {
                let userModel = new UserModel(newUser);
                userModel.hash_password = bcrypt.hashSync(newUser.password, 10);
                await userModel.save();
                return userModel;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async updateUser(idUser, dataUpdate) {
        try {
            let userUpdate = UserModel.findByIdAndUpdate(idUser, { $set: dataUpdate }, { new: true });
            return userUpdate;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default UserService;
