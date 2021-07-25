var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        required: true,
    },
    folder_id: {
        type: String,
    },
    asin: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    category_id: {
        type: String,
    },
    basecost: {
        type: Number,
    },
    profit: {
        type: Number,
    },
    price: {
        type: Number,
    },
    shipping: {
        type: Number,
        default: 0,
    },
    delivery: {
        type: String,
        default: 'free',
    },
    countProduct: {
        type: Number,
        default: 999,
    },
    images: {
        type: Array,
        default: [],
    },
    description: {
        type: String,
        default: '',
    },
    infoDetail: {
        type: Array,
        require: true,
        trim: true,
    },
    is_convert_yahoo: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        require: true,
        default: 'CREATED',
        enum: ['CREATED'],
    },
    statusMessage: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

Product.statics.STATUS = ['CREATED', 'ERROR', 'SUCCESS'];

var ProductAmazonSchema = mongoose.model('ProductAmazon', Product);
module.exports = ProductAmazonSchema;
