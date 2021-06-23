// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import indexRouter from './routes/index';
import MongoDB from './services/MongoDB';
import PassportService from './services/PassportService';
import UserService from './services/UserService';

import Path from 'path';
import QueueGetProductAmazon from './services/QueueGetProductAmazon';
import SearchCodeSchema from './models/SearchCodeAmazonModel';
import upload from 'express-fileupload'

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
app.use(upload())
app.use('/uploads', express.static('uploads'));
app.use('/', indexRouter);

let initData = async () => {
    UserService.addUser({ username: 'admin', password: 'admin', type: 'admin', name: 'admin' });
    new QueueGetProductAmazon();
    console.log('Server Started.!');
    
    // let listCode = await SearchCodeSchema.find({});
    // for (let i = 0; i < listCode.length; i++) {
    //     const element = listCode[i];
    //     await element.remove();
    // }
};
// Connect mongo DB
MongoDB.connect(initData);

export default app;
