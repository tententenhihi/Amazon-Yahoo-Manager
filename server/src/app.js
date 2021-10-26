// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import Fs from 'fs';
import indexRouter from './routes/index';
import MongoDB from './services/MongoDB';
import PassportService from './services/PassportService';
import UserService from './services/UserService';
import Path from 'path';
import QueueGetProductAmazon from './services/QueueGetProductAmazon';
import QueueLoginYahooAuction from './services/QueueLoginYahooAuction';
import upload from 'express-fileupload';
import BrightDataService from './services/BrightDataService';
import CategoryService from './services/CategoryService';
import CronJobService from './crons/CronJobService';
import Category from './models/CategoryModel';
import BankModel from './models/BankModel';

require('dotenv').config();

const app = express();
// Fix Cross
var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
};
app.use(cors(corsOptions));

// ================ use passport and jwt ================
var passport = PassportService.init();
app.use(passport.initialize());
app.use('/api', passport.authenticate('jwt', { session: false }));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ imit: '50mb', extended: false }));

app.use(cookieParser());
app.use('/public', express.static(Path.join(__dirname, '../public')));
app.use(upload());
app.use('/uploads', express.static('uploads'));
app.use('/', indexRouter);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
let initData = async () => {
    UserService.addUser({
        username: 'admin',
        password: 'admin',
        type: 'admin',
        name: 'admin',
        email: 'admin@gmail.com',
        verified_at: new Date(),
    });
    new QueueGetProductAmazon();
    new QueueLoginYahooAuction();
    BrightDataService.loadProxyToDB();
    CronJobService.startCron();
    if (!Fs.existsSync('uploads')) {
        Fs.mkdirSync('uploads');
    }
    if (!Fs.existsSync('uploads/products')) {
        Fs.mkdirSync('uploads/products');
    }
    if (!Fs.existsSync('uploads/yahoo-products')) {
        Fs.mkdirSync('uploads/yahoo-products');
    }
    console.log('Server Started.!');

    let countCateMap = await Category.find({}).countDocuments();
    if (countCateMap < 14000) {
        console.log(' ====== Import Category Default ======');
        let listCate = Fs.readFileSync('category-map-default.txt', 'utf8');
        listCate = listCate
            .split('\n')
            .map((item) => item.trim())
            .filter((item) => item.trim() !== '')
            .map((item) => {
                return {
                    amazon_cate_id: item.split('|')[0],
                    yahoo_cate_id: item.split('|')[1],
                    is_success_yahoo_cate_id: true,
                };
            });
        await Category.insertMany(listCate);
        console.log(' ====== Import Category Success ======');
    }
    // await CategoryService.checkData();

    // await BankModel.remove({})
};

// Connect mongo DB
MongoDB.connect(initData);

export default app;
