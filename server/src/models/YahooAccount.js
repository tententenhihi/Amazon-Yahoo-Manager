var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var autoIncrement = require('mongoose-auto-increment');

var YahooAccount = new Schema({
    is_error: {
        type: Boolean,
        default: false
    },
    count_error: {
        type: Number,
        default: 0,
    },
    is_lock: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        trim: true,
        lowercase: true,
    },
    auction_point: {
        type: Number,
        default: 0,
    },
    yahoo_id: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    proxy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proxy',
    },
    bank_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    hash_password: {
        type: String,
        trim: true,
    },
    cookie: {
        type: String,
    },
    cookie_aucpay: {
        type: String,
    },
    status: {
        type: String,
        require: true,
        default: 'CREATED',
        enum: ['CREATED', 'ERROR', 'SUCCESS'],
    },
    statusMessage: {
        type: String,
    },
    accountId: { type: Number, default: 1 },
    seq: { type: Number, default: 1 },
    created: {
        type: Date,
        default: Date.now,
    },
});

YahooAccount.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};
autoIncrement.initialize(mongoose.connection);
YahooAccount.plugin(autoIncrement.plugin, {
    model: 'YahooAccount',
    field: 'accountId',
    startAt: 1,
    incrementBy: 1,
});

var YahooAccountSchema = mongoose.model('YahooAccount', YahooAccount);
module.exports = YahooAccountSchema;
