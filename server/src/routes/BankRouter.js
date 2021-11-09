import express from 'express';
import BankController from '../controllers/BankController';

var BankRouter = express.Router();

BankRouter.route('/get').post(BankController.get);
BankRouter.route('/create').post(BankController.create);
BankRouter.route('/update/:_id').post(BankController.update);
BankRouter.route('/delete/:_id').post(BankController.delete);

export default BankRouter;
