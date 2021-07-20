import express from 'express';
import ProductYahooController from '../controllers/ProductYahooController';

var ProductYahooRouter = express.Router();

ProductYahooRouter.route('/get/:yahoo_account_id').get(ProductYahooController.get);
ProductYahooRouter.route('/create').post(ProductYahooController.createProduct);
ProductYahooRouter.route('/show/:_id').get(ProductYahooController.getDetailProduct);
ProductYahooRouter.route('/update/:_id').post(ProductYahooController.updateProduct);
ProductYahooRouter.route('/delete/:_id').post(ProductYahooController.deleteProduct);
ProductYahooRouter.route('/stop-transition/:_id').post(ProductYahooController.stopTransaction);
ProductYahooRouter.route('/send-message/:_id').post(ProductYahooController.sendMessage);
ProductYahooRouter.route('/send-rating/:_id').post(ProductYahooController.sendRating);
ProductYahooRouter.route('/switch-watch-option').post(ProductYahooController.switchWatchOption);
ProductYahooRouter.route('/change-product-folder').post(ProductYahooController.changeProductFolder);
ProductYahooRouter.route('/delete-multiple-product').post(ProductYahooController.deleteMultipleProduct);

export default ProductYahooRouter;
