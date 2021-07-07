import express from 'express';
import RatingTemplateController from '../controllers/RatingTemplateController';

var RatingTemplateRouter = express.Router();

RatingTemplateRouter.route('/').get(RatingTemplateController.get);
RatingTemplateRouter.route('/create').post(RatingTemplateController.create);
RatingTemplateRouter.route('/update/:_id').post(RatingTemplateController.update);
RatingTemplateRouter.route('/show/:_id').get(RatingTemplateController.show);
RatingTemplateRouter.route('/delete/:_id').post(RatingTemplateController.delete);

export default RatingTemplateRouter;
