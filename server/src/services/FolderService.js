import FolderModel from '../models/FolderModel'

export default class FolderService {
  static async get (user_id) {
    try {
      let result = await FolderModel.find({user_id});
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
        return result
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
        await FolderModel.findOneAndUpdate({_id: element._id}, {position: element.position})
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
