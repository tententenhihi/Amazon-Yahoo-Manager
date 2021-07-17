import FolderModel from '../models/FolderModel'

export default class FolderService {
  static async get (user_id) {
    try {
      let result = await FolderModel.find({user_id});
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
}
