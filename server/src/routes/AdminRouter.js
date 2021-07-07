import express from 'express';
import AdminController from '../controllers/AdminController';

var adminRouter = express.Router();

adminRouter.route('/users').get(AdminController.getAllUsers);
adminRouter.route('/users/create').post(AdminController.createUser);
adminRouter.route('/users/update/:user_id').post(AdminController.updateUser);
adminRouter.route('/users/delete/:user_id').post(AdminController.deleteUser);

export default adminRouter;
