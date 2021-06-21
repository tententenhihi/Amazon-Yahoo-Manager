import express from 'express';
import YahooAccountController from '../controllers/YahooAccountController';

var YahooAccountRouter = express.Router();

YahooAccountRouter.route('/get-list').get(YahooAccountController.getListAccount);
YahooAccountRouter.route('/create-new').post(YahooAccountController.createNewAccount);
YahooAccountRouter.route('/edit/:_id').post(YahooAccountController.editAccount);
YahooAccountRouter.route('/delete/:_id').post(YahooAccountController.deleteAccount);

export default YahooAccountRouter;
