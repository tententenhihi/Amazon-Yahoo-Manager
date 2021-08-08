import express from 'express';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';
import FileRouter from './FileRouter';
import AmazonRouter from './AmazonRouter';
import AsinRouter from './AsinRouter';
import ProductAmazonRouter from './ProductAmazonRouter';
import YahooAccountRouter from './YahooAccountRouter';
import ProductGlobalSettingRouter from './ProductGlobalSettingRouter';
import AuctionPublicSettingRouter from './AuctionPublicSettingRouter';
import ProductYahooRouter from './ProductYahooRouter';
import ProductInfomationDefaultRouter from './ProductInfomationDefaultRouter';
import TradeMessageTemplateRouter from './TradeMessageTemplateRouter';
import RatingTemplateRouter from './RatingTemplateRouter';
import AdminRouter from './AdminRouter';
import FolderRouter from './FolderRouter';
import ProductYahooEndedRouter from './ProductYahooEndedRouter';
import CategoryRouter from './CategoryRouter';
import CronHistoryRouter from './CronHistoryRouter';
import ImageInsertionRouter from './ImageInsertionRouter';
import ProductYahooSellingRouter from './ProductYahooSellingRouter';
import ProductYahooFinishedRouter from './ProductYahooFinishedRouter';

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send('<h1>Amazon-Yahoo-Manager By Bacnt - bacnt2412@gmail.com </h1>');
});

router.use('/auth', AuthRouter);
router.use('/file', FileRouter);
router.use('/api/v1/amazon', AmazonRouter);
router.use('/api/v1/amazon/asin', AsinRouter);
router.use('/api/v1/amazon/product', ProductAmazonRouter);
router.use('/api/v1/yahoo-account', YahooAccountRouter);
router.use('/api/v1/product-global-setting', ProductGlobalSettingRouter);
router.use('/api/v1/auction-global-setting', AuctionPublicSettingRouter);
router.use('/api/v1/product-yahoo', ProductYahooRouter);
router.use('/api/v1/product-yahoo-ended', ProductYahooEndedRouter);
router.use('/api/v1/product-info-default', ProductInfomationDefaultRouter);
router.use('/api/v1/trade-message-template', TradeMessageTemplateRouter);
router.use('/api/v1/rating-template', RatingTemplateRouter);
router.use('/api/v1/user', UserRouter);
router.use('/api/v1/admin', AdminRouter);
router.use('/api/v1/folder', FolderRouter);
router.use('/api/v1/category', CategoryRouter);
router.use('/api/v1/cron', CronHistoryRouter);
router.use('/api/v1/image-insertion', ImageInsertionRouter);
router.use('/api/v1/product-yahoo-selling', ProductYahooSellingRouter);
router.use('/api/v1/product-yahoo-finished', ProductYahooFinishedRouter);

export default router;
