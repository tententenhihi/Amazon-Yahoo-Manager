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

export default adminRouter;
