import ImageInsertionModel from '../models/ImageInsertionModel';
import fs from 'fs';
import fse from 'fs-extra';
import Path from 'path'
const imageInsertionFolder = 'image-insertion/default/'
const pathDestFolder = Path.join(__dirname, `../../uploads/${imageInsertionFolder}`);

export default class ImageInsertionService {
    static async initData () {
        try {
            const assetsFolder = Path.join(__dirname, '../assets/image-insertion/');
            if (!fs.existsSync(pathDestFolder)) {
                fs.mkdirSync(pathDestFolder, { recursive: true })
            }
            fse.copySync(assetsFolder, pathDestFolder)
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async get (user_id, yahoo_account_id) {
        try {
            let res = await ImageInsertionModel.find({user_id, yahoo_account_id}).sort({ _id: -1 }).limit(1);
            if (!res.length) {
                let images = [];
                fs.readdirSync(pathDestFolder).forEach(file => {
                    images.push(imageInsertionFolder + file)
                });
                res = await ImageInsertionModel.create({
                    images,
                    user_id,
                    yahoo_account_id
                });
            }
            return Array.isArray(res) ? res[0] : res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async update (data) {
        try {
            let res = await ImageInsertionModel.findOneAndUpdate({ _id: data._id, user_id: data.user_id },
                data, { new: true });
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
