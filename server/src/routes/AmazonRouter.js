import express from 'express';
import AmazonController from '../controllers/AmazonController';

var amazonRouter = express.Router();

amazonRouter.route('/get-info-product-by-asin').post(AmazonController.getInfoProductByASIN);

export default amazonRouter;
