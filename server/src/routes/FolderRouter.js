import express from 'express';
import FolderController from '../controllers/FolderController';

var FolderRouter = express.Router();

FolderRouter.route('/get').get(FolderController.get);
FolderRouter.route('/create').post(FolderController.create);
FolderRouter.route('/update/:_id').post(FolderController.update);
FolderRouter.route('/delete/:_id').post(FolderController.delete);
FolderRouter.route('/sort').post(FolderController.sort);

export default FolderRouter;
