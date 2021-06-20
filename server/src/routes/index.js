import express from 'express';
import UserRouter from './UserRouter';
import FileRouter from './FileRouter';
import AmazonRouter from './AmazonRouter';
import SearchCodeRouter from './SearchCodeRouter';
import ProductAmazonRouter from './ProductAmazonRouter';

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send('<h1>Amazon-Yahoo-Manager By Bacnt - bacnt2412@gmail.com </h1>');
});

router.use('/user', UserRouter);
router.use('/file', FileRouter);
router.use('/api/v1/amazon', AmazonRouter);
router.use('/api/v1/amazon/search-code', SearchCodeRouter);
router.use('/api/v1/amazon/product', ProductAmazonRouter);

export default router;
