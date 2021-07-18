import express from 'express';
import AuctionPublicSettingController from '../controllers/AuctionPublicSettingController';

var AuctionPublicSettingRouter = express.Router();

AuctionPublicSettingRouter.route('/get/:yahoo_account_id').get(AuctionPublicSettingController.get);
AuctionPublicSettingRouter.route('/update').post(AuctionPublicSettingController.update);

export default AuctionPublicSettingRouter;
