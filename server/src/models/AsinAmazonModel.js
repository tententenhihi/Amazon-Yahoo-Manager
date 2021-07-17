var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var AsinAmazonSchema = new Schema({
    asin: {
        type: String,
        required: true,
    },
    asin_id: {
        type: Number,
        default: 1
    },
    seq: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
        require: true,
        default: 'BLACK',
        enum: ['BLACK', 'WHITE'],
    },
    created: {
        type: Date,
        default: Date.now,
    }
});


autoIncrement.initialize(mongoose.connection);
AsinAmazonSchema.plugin(autoIncrement.plugin, {
    model: 'AsinAmazonSchema',
    field: 'asin_id',
    startAt: 1,
    incrementBy: 1
});

var AsinAmazon = mongoose.model('AsinAmazon', AsinAmazonSchema);
module.exports = AsinAmazon;
