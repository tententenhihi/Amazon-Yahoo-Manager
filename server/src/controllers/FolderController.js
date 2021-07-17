import Response from '../utils/Response';
import FolderService from '../services/FolderService';

export default class FolderController {
    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let folders = await FolderService.get(user._id);
            return response.success200({ folders });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async create (req, res) {
        let response = new Response(res);
        try {
            let { name } = req.body
            let user = req.user
            if (!name) {
                return response.error400({message: '完全な情報を入力してください。'})
            }
            let folders = await FolderService.get(user._id)
            let data = {
                user_id: user._id,
                name,
                position: folders.length + 1
            }
            let result = await FolderService.create(data);
            if (result) {
                response.success200({folder: result});
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async update (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let { name } = req.body
            if (!name) {
                return response.error400({message: '完全な情報を入力してください。'})
            }
            let data = {
                name,
            }

            let result = await FolderService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async delete (req, res) {
        let response = new Response(res);
        try {
            const {folders} = req.body;
            for (let index = 0; index < folders.length; index++) {
                const element = folders[index];
                let result = await FolderService.delete(element._id);
            }
            return response.success200({ success: true });
        } catch (error) {
            response.error500(error)
        }
    }

    static async sort (req, res) {
        let response = new Response(res);
        try {
            const {folders} = req.body;
            let result = await FolderService.sort(folders);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
