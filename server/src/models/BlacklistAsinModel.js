var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var BlacklistAsin = new Schema({
    asin: {
        type: String,
        required: true,
    },
    asin_id: {
        type: Number,
        default: 1,
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

autoIncrement.initialize(mongoose.connection);
BlacklistAsin.plugin(autoIncrement.plugin, {
    model: 'BlacklistAsin',
    field: 'asin_id',
    startAt: 1,
    incrementBy: 1,
});

var AsinAmazon = mongoose.model('BlacklistAsin', BlacklistAsin);
module.exports = AsinAmazon;
