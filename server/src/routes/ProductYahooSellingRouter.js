import express from 'express';
import ProductYahooSellingController from '../controllers/ProductYahooSellingController';

var ProductYahooSellingRouter = express.Router();

ProductYahooSellingRouter.route('/get/:yahoo_account_id').get(ProductYahooSellingController.get);
ProductYahooSellingRouter.route('/delete/:_id').post(ProductYahooSellingController.deleteProduct);
ProductYahooSellingRouter.route('/delete-multiple/').post(ProductYahooSellingController.deleteMultipleProduct);
ProductYahooSellingRouter.route('/set-note').post(ProductYahooSellingController.setNote);

export default ProductYahooSellingRouter;
