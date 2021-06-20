import SearchCodeSchema from '../models/SearchCodeAmazonModel';
var _ = require('lodash');

export default class SearchCodeAmazonService {
    static async get(filter) {
        try {
            let listSearchCode = await SearchCodeSchema.find(filter);
            //group
            let listGroup = _.groupBy(listSearchCode, function (item) {
                return item.groupId;
            });
            let newList = [];
            for (const key in listGroup) {
                let item = {
                    groupId: key,
                    countAsin: 0,
                    countAsinGetProductSuccess: 0,
                };
                if (Object.hasOwnProperty.call(listGroup, key)) {
                    const element = listGroup[key];
                    item.asins = element;
                    item.countAsin = element.length;
                    for (const ele of element) {
                        if (ele.isProductGeted) {
                            item.countAsinGetProductSuccess++;
                        }
                    }
                }
                newList.push(item);
            }
            return newList;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-get: ' + error.message);
        }
    }
    static async add(addData) {
        try {
            let newSearchCode = new SearchCodeSchema(addData);
            await newSearchCode.save();
            return newSearchCode;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-add: ' + error.message);
        }
    }
    static async update(idSearchCode, idUser, updateData) {
        try {
            let result = await SearchCodeSchema.findOneAndUpdate({ _id: idSearchCode, idUser }, updateData, { new: true });
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-update: ' + error.message);
        }
    }
    static async delete(idSearchCode, idUser) {
        try {
            let result = await SearchCodeSchema.findOneAndDelete({ _id: idSearchCode, idUser });
            return result != null;
        } catch (error) {
            console.log(error);
            throw new Error(' Error SearchCodeAmazonService-delete: ' + error.message);
        }
    }
}
