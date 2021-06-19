import express from 'express';
import UserRouter from './UserRouter';
import FileRouter from './FileRouter';
import AmazonRouter from './AmazonRouter';
import SearchCodeRouter from './SearchCodeRouter';

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send('<h1>Server Voice By Bacnt</h1>');
});

router.use('/user', UserRouter);
router.use('/file', FileRouter);
router.use('/api/v1/amazon', AmazonRouter);
router.use('/api/v1/amazon/search-code', SearchCodeRouter);

export default router;
