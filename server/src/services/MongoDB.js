import mongoose from 'mongoose';
import config from 'config';
import Fs from 'fs';

class MongoDB {
    static connect(callback) {
        // var mongoOptions = {
        //     keepAlive: 1,
        //     connectTimeoutMS: 30000,
        //     // reconnectTries: 30,
        //     // reconnectInterval: 2000,
        //     useNewUrlParser: true,
        //     useFindAndModify: false,
        //     useUnifiedTopology: true,
        //     // user: MONGODB_USER,
        //     // pass: MONGODB_PASSWORD,
        //     // authSource:  'admin'
        // };
        // let MONGODB_CONNECTION_STRING = config.get('MONGODB_HOST') + config.get('MONGODB_DATABASE_NAME');

        var mongoOptions = {
            keepAlive: 1,
            connectTimeoutMS: 30000,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            user: 'usermaster',
            pass: '123456789',
            ssl: true,
            sslValidate: false,
            sslCA: 'mongodb.pem',
        };
        let MONGODB_CONNECTION_STRING = 'mongodb://yahoo-auctions-mongo-db.cluster-cw3mf6t08xn4.ap-northeast-1.docdb.amazonaws.com:27017/Amazon-yahoo-manager';

        // ====================
        mongoose.connect(MONGODB_CONNECTION_STRING, mongoOptions);
        mongoose.Promise = global.Promise;
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log(' MongoDB Connected');
            callback();
        });
    }
}

export default MongoDB;
