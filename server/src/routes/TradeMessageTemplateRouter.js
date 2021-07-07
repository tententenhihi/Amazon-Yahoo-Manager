import express from 'express';
import TradeMessageTemplateController from '../controllers/TradeMessageTemplateController';

var TradeMessageTemplateRouter = express.Router();

TradeMessageTemplateRouter.route('/').get(TradeMessageTemplateController.get);
TradeMessageTemplateRouter.route('/create').post(TradeMessageTemplateController.create);
TradeMessageTemplateRouter.route('/update/:_id').post(TradeMessageTemplateController.update);
TradeMessageTemplateRouter.route('/show/:_id').get(TradeMessageTemplateController.show);
TradeMessageTemplateRouter.route('/delete/:_id').post(TradeMessageTemplateController.delete);

export default TradeMessageTemplateRouter;
