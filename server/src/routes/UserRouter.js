import express from 'express';
import UserController from '../controllers/UserController';

var userRouter = express.Router();

userRouter.route('/change-password').post(UserController.changePassword);

export default userRouter;
