import express from 'express';
import YahooAccountController from '../controllers/YahooAccountController';

var YahooAccountRouter = express.Router();

YahooAccountRouter.route('/get-list').get(YahooAccountController.getListAccount);
YahooAccountRouter.route('/create-new').post(YahooAccountController.createNewAccount);
YahooAccountRouter.route('/edit/:_id').post(YahooAccountController.editAccount);
YahooAccountRouter.route('/delete/:_id').post(YahooAccountController.deleteAccount);
YahooAccountRouter.route('/copy-data').post(YahooAccountController.copyDefaultSetting);
YahooAccountRouter.route('/get-account-bank').post(YahooAccountController.getAccountBank);
YahooAccountRouter.route('/set-bank-to-account').post(YahooAccountController.setBankToAccount);
YahooAccountRouter.route('/get-account-history-withdraw').get(YahooAccountController.getAccountAndHistoryWithRraw);
YahooAccountRouter.route('/with-draw-money').post(YahooAccountController.withDrawMoney);
YahooAccountRouter.route('/stop-with-draw-money').post(YahooAccountController.stopWithDrawMoney);
YahooAccountRouter.route('/set_old_bank_number').post(YahooAccountController.setOldBankNumber);
YahooAccountRouter.route('/refresh-account-payment').get(YahooAccountController.refreshAccountPayment);

export default YahooAccountRouter;
