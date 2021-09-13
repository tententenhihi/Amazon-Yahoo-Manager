import express from 'express';
import ApiKeyController from '../controllers/ApiKeyController';

var ApiKeyRouter = express.Router();

ApiKeyRouter.route('/get').get(ApiKeyController.get);
ApiKeyRouter.route('/update').post(ApiKeyController.update);

export default ApiKeyRouter;
