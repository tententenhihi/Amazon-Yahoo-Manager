import express from 'express';
import ImageInsertionController from '../controllers/ImageInsertionController';

var ImageInsertionRouter = express.Router();

ImageInsertionRouter.route('/get').get(ImageInsertionController.get);
ImageInsertionRouter.route('/update').post(ImageInsertionController.update);

export default ImageInsertionRouter;
