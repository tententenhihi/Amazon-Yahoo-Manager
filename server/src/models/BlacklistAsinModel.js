var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlacklistAsin = new Schema({
    asin: {
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        default: 1,
    },
    type: {
        type: String,
        require: true,
        default: 'BLACK',
        enum: ['BLACK', 'WHITE'],
    },
    reason_for_prohibition: {
        type: String,
        default: '',
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var AsinAmazon = mongoose.model('BlacklistAsin', BlacklistAsin);
module.exports = AsinAmazon;
