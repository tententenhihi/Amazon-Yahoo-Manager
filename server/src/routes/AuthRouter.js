import express from 'express';
import AuthController from '../controllers/AuthController';

var authRouter = express.Router();

// authRouter.route('/register').post(AuthController.register);
authRouter.route('/login').post(AuthController.login);
authRouter.route('/forgot-password').post(AuthController.forgotPassword);
authRouter.route('/reset-password').post(AuthController.resetPassword);
authRouter.route('/verify-account').post(AuthController.verifyAccount);
authRouter.route('/get-verify-code').post(AuthController.getVerifyCode);

export default authRouter;
