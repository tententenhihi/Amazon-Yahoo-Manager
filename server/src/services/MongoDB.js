import mongoose from 'mongoose';
import config from 'config';

class MongoDB {
    static connect(callback) {
        var mongoOptions = {
            keepAlive: 1,
            connectTimeoutMS: 30000,
            // reconnectTries: 30,
            // reconnectInterval: 2000,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            // user: MONGODB_USER,
            // pass: MONGODB_PASSWORD,
            // authSource:  'admin'
        };
        const MONGODB_CONNECTION_STRING = config.get('MONGODB_HOST') + config.get('MONGODB_DATABASE_NAME');
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
