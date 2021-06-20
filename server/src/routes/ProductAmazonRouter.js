import express from 'express';
import AmazonController from '../controllers/AmazonController';

var ProductAmazonRouter = express.Router();

ProductAmazonRouter.route('/get').get(AmazonController.get);

export default ProductAmazonRouter;
