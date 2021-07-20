import express from 'express';
import ProductYahooEndedController from '../controllers/ProductYahooEndedController';

var ProductYahooEndedRouter = express.Router();

ProductYahooEndedRouter.route('/get/:yahoo_account_id').get(ProductYahooEndedController.get);
ProductYahooEndedRouter.route('/show/:_id').get(ProductYahooEndedController.showProduct);
ProductYahooEndedRouter.route('/update/:_id').post(ProductYahooEndedController.updateProduct);
ProductYahooEndedRouter.route('/delete/:_id').post(ProductYahooEndedController.deleteProduct);

export default ProductYahooEndedRouter;
