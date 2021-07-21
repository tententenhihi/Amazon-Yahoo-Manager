import express from 'express';
import CategoryController from '../controllers/CategoryController';

var FolderRouter = express.Router();

FolderRouter.route('/get').get(CategoryController.get);
FolderRouter.route('/update/:_id').post(CategoryController.update);

export default FolderRouter;
