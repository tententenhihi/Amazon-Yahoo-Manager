import express from 'express';
import UserController from '../controllers/UserController';

var userRouter = express.Router();

// userRouter.route('/register').post(UserController.register);
userRouter.route('/login').post(UserController.login);
// userRouter.route('/loginSocial').post(UserController.loginSocial);

export default userRouter;
