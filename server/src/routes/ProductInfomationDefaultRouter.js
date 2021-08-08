import express from 'express';
import ProductInfomationDefaultController from '../controllers/ProductInfomationDefaultController';

var ProductInfomationDefaultRouter = express.Router();

ProductInfomationDefaultRouter.route('/:yahoo_account_id').get(ProductInfomationDefaultController.get);
ProductInfomationDefaultRouter.route('/update/:_id').post(ProductInfomationDefaultController.update);
ProductInfomationDefaultRouter.route('/delete/:_id').post(ProductInfomationDefaultController.delete);

export default ProductInfomationDefaultRouter;
