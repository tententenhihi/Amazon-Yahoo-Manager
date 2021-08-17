import express from 'express';
import ProductYahooEndedController from '../controllers/ProductYahooEndedController';

var ProductYahooEndedRouter = express.Router();

ProductYahooEndedRouter.route('/get/:yahoo_account_id').get(ProductYahooEndedController.get);
ProductYahooEndedRouter.route('/show/:_id').get(ProductYahooEndedController.showProduct);
ProductYahooEndedRouter.route('/update/:_id').post(ProductYahooEndedController.updateProduct);
ProductYahooEndedRouter.route('/delete/:_id').post(ProductYahooEndedController.deleteProduct);

ProductYahooEndedRouter.route('/delete-buyer').post(ProductYahooEndedController.deleteBuyer);
ProductYahooEndedRouter.route('/cancel-transaction').post(ProductYahooEndedController.cancelTransaction);
ProductYahooEndedRouter.route('/send-message').post(ProductYahooEndedController.sendMessage);
ProductYahooEndedRouter.route('/send-rating').post(ProductYahooEndedController.sendRating);
ProductYahooEndedRouter.route('/set-note').post(ProductYahooEndedController.setNote);
ProductYahooEndedRouter.route('/refresh-data-yahoo').post(ProductYahooEndedController.refreshDataYahoo);


export default ProductYahooEndedRouter;
