var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    asin: {
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
    price: {
        type: Number,
        default: 0,
    },
    ship_fee: {
        type: Number,
        default: 0,
    },
    count: {
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
    created: {
        type: Date,
        default: Date.now,
    },
});

Product.statics.STATUS = ['CREATED', 'ERROR', 'SUCCESS'];

var ProductAmazonSchema = mongoose.model('ProductAmazon', Product);
module.exports = ProductAmazonSchema;
