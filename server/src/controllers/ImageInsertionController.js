import Response from '../utils/Response';
import ImageInsertionService from '../services/ImageInsertionService';
import UploadFile from '../helpers/UploadFile';
import Path from 'path';
import fs from 'fs';

export default class ImageInsertionController {
    static async get(req, res) {
        let response = new Response(res);
        let userId = req.user._id;
        let { yahoo_account_id } = req.query;
        try {
            let imageInsertion = await ImageInsertionService.get(userId, yahoo_account_id);
            return response.success200({ imageInsertion });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async update(req, res) {
        let response = new Response(res);
        try {
            let payload = JSON.parse(req.body.payload);
            let data = { ...payload, user_id: req.user._id };
            if (req.files && payload.images.length) {
                for (let index = 0; index < payload.images.length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'image-insertion/' + req.user._id + '/' });
                    }
                }
            }

            const imageInsertionFolder = 'image-insertion/default/';
            const pathDestFolder = Path.join(__dirname, `../../uploads/${imageInsertionFolder}`);
            let defaultImages = [];

            for (let index = 0; index < data.images.length; index++) {
                if (!data.images[index]) {
                    if (!defaultImages.length) {
                        fs.readdirSync(pathDestFolder).forEach((file) => {
                            defaultImages.push(imageInsertionFolder + file);
                        });
                    }
                    data.images[index] = defaultImages[index];
                }
            }

            let result = await ImageInsertionService.update(data);
            if (result) {
                return response.success200(result);
            }
            return response.success200({});
        } catch (error) {
            response.error500(error);
        }
    }
}
