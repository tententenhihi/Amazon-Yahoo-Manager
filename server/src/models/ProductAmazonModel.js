var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    image: {
        type: String,
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
        enum: ['CREATED', 'ERROR', 'SUCCESS'],
    },
    statusMessage: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var ProductAmazonSchema = mongoose.model('ProductAmazon', Product);
module.exports = ProductAmazonSchema;
