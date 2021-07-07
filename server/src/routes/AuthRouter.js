import express from 'express';
import AuthController from '../controllers/AuthController';

var authRouter = express.Router();

// authRouter.route('/register').post(AuthController.register);
authRouter.route('/login').post(AuthController.login);
authRouter.route('/forgot-password').post(AuthController.forgotPassword);

export default authRouter;
