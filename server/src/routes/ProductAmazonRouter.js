import express from 'express';
import AmazonController from '../controllers/AmazonController';

var ProductAmazonRouter = express.Router();

ProductAmazonRouter.route('/get').get(AmazonController.get);
ProductAmazonRouter.route('/show/:_id').get(AmazonController.getDetailProduct);
ProductAmazonRouter.route('/create').post(AmazonController.createProduct);
ProductAmazonRouter.route('/update/:_id').post(AmazonController.updateProduct);
ProductAmazonRouter.route('/delete/:_id').post(AmazonController.deleteProduct);
ProductAmazonRouter.route('/create-by-csv').post(AmazonController.createProductByCSV);

export default ProductAmazonRouter;