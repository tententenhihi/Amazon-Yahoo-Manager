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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
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
    basecost: {
        type: String,
    },
    profit: {
        type: String,
    },
    price: {
        type: String,
    },
    delivery: {
        type: String,
        required: true,
    },
    countProduct: {
        type: Number,
        required: true,
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
    type: {
        type: String,
        require: true,
        default: 'AMAZON',
        enum: ['AMAZON', 'YAHOO'],
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

Product.statics.TYPE = ['AMAZON', 'YAHOO'];
Product.statics.STATUS = ['CREATED', 'ERROR', 'SUCCESS'];

var ProductAmazonSchema = mongoose.model('ProductAmazon', Product);
module.exports = ProductAmazonSchema;
