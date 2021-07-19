import FolderModel from '../models/FolderModel'
import ProductYahooSchema from '../models/ProductYahooModel'
import ProductAmazonModel from '../models/ProductAmazonModel'
import mongoose from 'mongoose'
export default class FolderService {
  static async get (user_id, yahoo_account_id) {
    try {
      let userId = mongoose.Types.ObjectId(user_id)
      let yahooAccountId = mongoose.Types.ObjectId(yahoo_account_id)
      let result = await FolderModel.aggregate([
        { $match: { user_id: userId, yahoo_account_id: yahooAccountId }},
        { $lookup: { from: 'productyahoos', localField: '_id', foreignField: 'folder_id', as: 'productyahoos'}},
        { $lookup: { from: 'productamazons', localField: '_id', foreignField: 'folder_id', as: 'productamazons'}},
      ]);
      result.sort((a, b) => a.position - b.position)
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async create (data) {
    try {
      let result = await FolderModel.create(data);
      return result._doc
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async update (id, data) {
    try {
      let result = await FolderModel.findOneAndUpdate({ _id: id }, data, { new: true });
      if (result) {
        return result._doc
      } else {
        throw new Error('Folder not found')
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async delete (id) {
    try {
      let result = await FolderModel.findById(id);
      if (result) {
        await result.remove()
        return true
      } else {
        throw new Error('Folder not found')
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async sort (data) {
    try {
      let loop = data.length
      for (let index = 0; index < loop; index++) {
        const element = data[index];
        await FolderModel.findOneAndUpdate({_id: element._id}, {position: index + 1})
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async move (folder_ids, destination_folder) {
    try {
      let loop = folder_ids.length
      for (let index = 0; index < loop; index++) {
        const element = folder_ids[index];
        await ProductAmazonModel.updateMany({folder_id: element}, {folder_id: destination_folder})
        await ProductYahooSchema.updateMany({folder_id: element}, {folder_id: destination_folder})
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
