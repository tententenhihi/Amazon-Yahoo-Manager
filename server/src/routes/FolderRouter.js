import express from 'express';
import FolderController from '../controllers/FolderController';

var FolderRouter = express.Router();

FolderRouter.route('/get/:yahoo_account_id').get(FolderController.get);
FolderRouter.route('/create').post(FolderController.create);
FolderRouter.route('/update/:_id').post(FolderController.update);
FolderRouter.route('/delete').post(FolderController.delete);
FolderRouter.route('/sort').post(FolderController.sort);
FolderRouter.route('/move').post(FolderController.move);

export default FolderRouter;
