// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import indexRouter from './routes/index';
import MongoDB from './services/MongoDB';
import PassportService from './services/PassportService';
import UserService from './services/UserService';
import ProxyService from './services/ProxyService'
import Path from 'path';
import QueueGetProductAmazon from './services/QueueGetProductAmazon';
import QueueLoginYahooAuction from './services/QueueLoginYahooAuction';
import upload from 'express-fileupload';
import BrightDataService from './services/BrightDataService';
require('dotenv').config()

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

let initData = async () => {
    UserService.addUser({
        username: 'admin', password: 'admin', type: 'admin', name: 'admin',
        email: "admin@gmail.com", verified_at: new Date()
    });
    new QueueGetProductAmazon();
    new QueueLoginYahooAuction();
    // getProductYahooAuction.start();
    // ProxyService.getIpProxy();
    console.log('Server Started.!');

    BrightDataService.getAllIp();

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    // require('axios-https-proxy-fix').get('http://lumtest.com/myip.json',
    //     {
    //         proxy: {
    //             host: 'zproxy.lum-superproxy.io',
    //             port: '22225',
    //             auth: {
    //                 username: 'lum-customer-c_84db29ae-zone-zone2-ip-178.171.80.121',
    //                 password: '7ox35md3j0jm'
    //             }
    //         }
    //     }
    // )
    //     .then(function (data) { console.log(data); },
    //         function (err) { console.error(err); });

};
// Connect mongo DB
MongoDB.connect(initData);

export default app;
