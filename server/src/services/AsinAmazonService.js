import AsinAmazonModel from '../models/AsinAmazonModel';
import AccountYahooService from './AccountYahooService';

var _ = require('lodash');

export default class AsinAmazonService {
    static async get(filter, user_id) {
        try {
            let listAsin = await AsinAmazonModel.find(filter).sort({ created: -1 });
            //group
            let listGroup = _.groupBy(listAsin, function (item) {
                return item.query_key;
            });
            let newList = [];
            for (const key in listGroup) {
                let item = {
                    countAsin: 0,
                    countAsinGetProductSuccess: 0,
                };
                if (Object.hasOwnProperty.call(listGroup, key)) {
                    const element = listGroup[key];
                    // item.groupId = element[0].groupId
                    item.yahoo_account_id = element[0].yahoo_account_id;
                    item.asins = element;
                    item.countAsin = element.length;
                    item.query_key = (element.length > 0 && element[0].query_key) || 0;
                    for (const ele of element) {
                        if (ele.status === 'SUCCESS') {
                            item.countAsinGetProductSuccess++;
                        }
                    }
                }
                newList.push(item);
            }
            let listYahooAccount = await AccountYahooService.find({ user_id });

            newList = newList.map((item) => {
                let user_name = '';
                listYahooAccount.map((itemYahoo) => {
                    if (itemYahoo._id.toString() == item.yahoo_account_id.toString()) {
                        user_name = itemYahoo.yahoo_id;
                    }
                });
                return {
                    ...item,
                    yahoo_id: user_name,
                };
            });
            return newList;
        } catch (error) {
            console.log(error);
            throw new Error(' Error AsinAmazonService-get: ' + error.message);
        }
    }
    static async add(addData) {
        try {
            let newAsin = new AsinAmazonModel(addData);
            await newAsin.save();
            return newAsin;
        } catch (error) {
            console.log(error);
            throw new Error(' Error AsinAmazonService-add: ' + error.message);
        }
    }
    static async addMany(listData) {
        try {
            let newAsin = await AsinAmazonModel.insertMany(listData);
            return newAsin;
        } catch (error) {
            console.log(error);
            throw new Error(' Error AsinAmazonService-add: ' + error.message);
        }
    }

    static async deleteMany(filter) {
        try {
            let newAsin = await AsinAmazonModel.deleteMany(filter);
            return newAsin;
        } catch (error) {
            console.log(error);
            throw new Error(' Error AsinAmazonService-add: ' + error.message);
        }
    }

    static async update(idAsin, idUser, updateData) {
        try {
            let result = await AsinAmazonModel.findOneAndUpdate({ _id: idAsin, idUser }, updateData, { new: true });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(' Error AsinAmazonService-update: ' + error.message);
        }
    }
    static async delete(idAsin, idUser) {
        try {
            let result = await AsinAmazonModel.findOneAndDelete({ _id: idAsin, idUser });
            return result != null;
        } catch (error) {
            console.log(error);
            throw new Error(' Error AsinAmazonService-delete: ' + error.message);
        }
    }
}
