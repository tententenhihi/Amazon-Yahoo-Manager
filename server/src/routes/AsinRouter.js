import express from 'express';
import AsinAmazonController from '../controllers/AsinAmazonController';

var AsinRouter = express.Router();

AsinRouter.route('/get/:yahoo_account_id').get(AsinAmazonController.get);
AsinRouter.route('/get-blacklist').get(AsinAmazonController.getBlackList);
AsinRouter.route('/add').post(AsinAmazonController.add);
AsinRouter.route('/update').post(AsinAmazonController.update);
AsinRouter.route('/delete').post(AsinAmazonController.delete);
AsinRouter.route('/delete-multi').post(AsinAmazonController.deleteMulti);


export default AsinRouter;
