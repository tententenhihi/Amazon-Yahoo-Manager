import express from 'express';
import AmazonController from '../controllers/AmazonController';

var ProductAmazonRouter = express.Router();

ProductAmazonRouter.route('/get/:yahoo_account_id').get(AmazonController.get);
ProductAmazonRouter.route('/show/:_id').get(AmazonController.getDetailProduct);
ProductAmazonRouter.route('/create').post(AmazonController.createProduct);
ProductAmazonRouter.route('/update/:_id').post(AmazonController.updateProduct);
ProductAmazonRouter.route('/delete/:_id').post(AmazonController.deleteProduct);
ProductAmazonRouter.route('/create-by-csv').post(AmazonController.createProductByCSV);
ProductAmazonRouter.route('/set-shipping-product/:_id').post(AmazonController.setShippingProduct);
ProductAmazonRouter.route('/convert-yahoo-product').post(AmazonController.convertToYahooProduct);
ProductAmazonRouter.route('/delete-multiple-product').post(AmazonController.deleteMultipleProduct);
ProductAmazonRouter.route('/delete-all-product').post(AmazonController.deleteAllProduct);

export default ProductAmazonRouter;