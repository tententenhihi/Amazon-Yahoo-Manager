import express from 'express';
import ProductYahooController from '../controllers/ProductYahooController';

var ProductYahooRouter = express.Router();

ProductYahooRouter.route('/get').get(ProductYahooController.get);
ProductYahooRouter.route('/get_photos').post(ProductYahooController.getPhoto);

export default ProductYahooRouter;
