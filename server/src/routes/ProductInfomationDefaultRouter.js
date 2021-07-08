import express from 'express';
import ProductInfomationDefaultController from '../controllers/ProductInfomationDefaultController';

var ProductInfomationDefaultRouter = express.Router();

ProductInfomationDefaultRouter.route('/').get(ProductInfomationDefaultController.get);
ProductInfomationDefaultRouter.route('/update/:_id').post(ProductInfomationDefaultController.updateProduct);
ProductInfomationDefaultRouter.route('/delete/:_id').post(ProductInfomationDefaultController.deleteProduct);

export default ProductInfomationDefaultRouter;
