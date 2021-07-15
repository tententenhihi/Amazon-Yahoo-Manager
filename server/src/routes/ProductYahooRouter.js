import express from 'express';
import ProductYahooController from '../controllers/ProductYahooController';

var ProductYahooRouter = express.Router();

ProductYahooRouter.route('/get').get(ProductYahooController.get);
ProductYahooRouter.route('/create').post(ProductYahooController.createProduct);
ProductYahooRouter.route('/show/:_id').get(ProductYahooController.getDetailProduct);
ProductYahooRouter.route('/update/:_id').post(ProductYahooController.updateProduct);
ProductYahooRouter.route('/delete/:_id').post(ProductYahooController.deleteProduct);

export default ProductYahooRouter;
