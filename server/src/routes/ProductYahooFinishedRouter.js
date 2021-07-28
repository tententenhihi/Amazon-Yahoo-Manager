import express from 'express';
import ProductYahooFinishedController from '../controllers/ProductYahooFinishedController';

var ProductYahooFinishedRouter = express.Router();

ProductYahooFinishedRouter.route('/get/:yahoo_account_id').get(ProductYahooFinishedController.get);
ProductYahooFinishedRouter.route('/delete/:_id').post(ProductYahooFinishedController.deleteProduct);
ProductYahooFinishedRouter.route('/delete-multiple/').post(ProductYahooFinishedController.deleteMultipleProduct);
ProductYahooFinishedRouter.route('/set-note').post(ProductYahooFinishedController.setNote);

export default ProductYahooFinishedRouter;
