import express from 'express';
import SearchCodeAmazonController from '../controllers/SearchCodeAmazonController';

var SearchCodeRouter = express.Router();

SearchCodeRouter.route('/get').get(SearchCodeAmazonController.get);
SearchCodeRouter.route('/get-blacklist').get(SearchCodeAmazonController.getBlackList);
SearchCodeRouter.route('/add').post(SearchCodeAmazonController.add);
SearchCodeRouter.route('/update').post(SearchCodeAmazonController.update);
SearchCodeRouter.route('/delete').post(SearchCodeAmazonController.delete);

export default SearchCodeRouter;
