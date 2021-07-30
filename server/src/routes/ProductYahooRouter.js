import express from 'express';
import ProductYahooController from '../controllers/ProductYahooController';

var ProductYahooRouter = express.Router();
ProductYahooRouter.route('/check-category').post(ProductYahooController.checkCategory);
ProductYahooRouter.route('/get/:yahoo_account_id').get(ProductYahooController.get);
ProductYahooRouter.route('/create').post(ProductYahooController.createProduct);
ProductYahooRouter.route('/show/:_id').get(ProductYahooController.getDetailProduct);
ProductYahooRouter.route('/update/:_id').post(ProductYahooController.updateProduct);
ProductYahooRouter.route('/delete/:_id').post(ProductYahooController.deleteProduct);
ProductYahooRouter.route('/switch-watch-option').post(ProductYahooController.switchWatchOption);
ProductYahooRouter.route('/change-product-folder').post(ProductYahooController.changeProductFolder);
ProductYahooRouter.route('/delete-multiple-product').post(ProductYahooController.deleteMultipleProduct);
ProductYahooRouter.route('/set-image-overlay').post(ProductYahooController.setImageOverlay);



export default ProductYahooRouter;
