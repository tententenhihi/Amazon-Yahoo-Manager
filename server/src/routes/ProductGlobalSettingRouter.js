import express from 'express';
import ProductGlobalSettingController from '../controllers/ProductGlobalSettingController';

var ProductGlobalSettingRouter = express.Router();

ProductGlobalSettingRouter.route('/get/:yahoo_account_id').get(ProductGlobalSettingController.get);
ProductGlobalSettingRouter.route('/create').post(ProductGlobalSettingController.create);
ProductGlobalSettingRouter.route('/update').post(ProductGlobalSettingController.update);

export default ProductGlobalSettingRouter;
