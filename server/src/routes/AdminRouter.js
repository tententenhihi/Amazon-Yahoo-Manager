import express from 'express';
import AdminController from '../controllers/AdminController';

var adminRouter = express.Router();

adminRouter.route('/users').get(AdminController.getAllUsers);
adminRouter.route('/users/create').post(AdminController.createUser);
adminRouter.route('/users/update/:user_id').post(AdminController.updateUser);
adminRouter.route('/users/delete/:user_id').post(AdminController.deleteUser);
adminRouter.route('/proxies').get(AdminController.getProxies);
adminRouter.route('/yahoo-accounts').get(AdminController.getYahooAccount);
adminRouter.route('/set-proxy-to-yahoo-account').post(AdminController.setProxyToYahooAccount);
// asin
adminRouter.route('/get-white-list-asin').get(AdminController.getWhiteListAsin);
adminRouter.route('/get-black-list-asin').get(AdminController.getBlackListAsin);
adminRouter.route('/create-asin').post(AdminController.createAsinAmazon);
adminRouter.route('/delete-asin/:_id').post(AdminController.deleteAsinAmazon);
adminRouter.route('/unlock-proxy/:_id').post(AdminController.unLockProxy);


export default adminRouter;
