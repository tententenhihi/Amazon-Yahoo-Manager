import express from 'express';
import ProductAuctionController from '../controllers/ProductAuctionController';

var ProductAuctionRouter = express.Router();

ProductAuctionRouter.route('/get').get(ProductAuctionController.get);
// ProductAuctionRouter.route('/show/:_id').get(ProductAuctionController.getDetailProduct);
// ProductAuctionRouter.route('/create').post(ProductAuctionController.createProduct);
// ProductAuctionRouter.route('/update/:_id').post(ProductAuctionController.updateProduct);
// ProductAuctionRouter.route('/delete/:_id').post(ProductAuctionController.deleteProduct);

export default ProductAuctionRouter;
