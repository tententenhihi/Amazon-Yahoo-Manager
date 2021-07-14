// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import indexRouter from './routes/index';
import MongoDB from './services/MongoDB';
import PassportService from './services/PassportService';
import UserService from './services/UserService';
import ProxyService from './services/ProxyService';
import Path from 'path';
import QueueGetProductAmazon from './services/QueueGetProductAmazon';
import QueueLoginYahooAuction from './services/QueueLoginYahooAuction';
import upload from 'express-fileupload';
import BrightDataService from './services/BrightDataService';
import AuctionYahooService from './services/AuctionYahooService';

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
    // getProductYahooAuction.start();
    // ProxyService.getIpProxy();
    console.log('Server Started.!');

    BrightDataService.loadProxyToDB();

    // let check = await ProxyService.checkLiveProxy({
    //     ip: '178.171.80.121',
    //     host: 'zproxy.lum-superproxy.io',
    //     port: 22225,
    //     username: 'lum-customer-c_84db29ae-zone-zone2-ip-178.171.80.121',
    //     password: '7ox35md3j0jm',
    // });
    // console.log(check);

    // ProxyService.updateProxy({ _id: '60eefb57a237603e04af38fe', status: 'die' });

    // let cookie = await AuctionYahooService.getCookie({ yahoo_id: "exffk72575", password: "hPPofa95hg%" }, {
    //     ip: '176.105.250.169',
    //     host: 'zproxy.lum-superproxy.io',
    //     port: 22225,
    //     username: 'lum-customer-c_84db29ae-zone-zone2-ip-194.110.88.54',
    //     password: '7ox35md3j0jm',
    // });
    // console.log(cookie);
};
// Connect mongo DB
MongoDB.connect(initData);

export default app;
