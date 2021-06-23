import express from 'express';
import UserRouter from './UserRouter';
import FileRouter from './FileRouter';
import AmazonRouter from './AmazonRouter';
import SearchCodeRouter from './SearchCodeRouter';
import ProductAmazonRouter from './ProductAmazonRouter';
import YahooAccountRouter from './YahooAccountRouter';
import ProductGlobalSettingRouter from './ProductGlobalSettingRouter';

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
router.use('/api/v1/yahoo-account', YahooAccountRouter);
router.use('/api/v1/product-global-setting', ProductGlobalSettingRouter);

export default router;
