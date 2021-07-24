var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoryYahooModel = new Schema({
    id: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

var CategoryYahoo = mongoose.model('CategoryYahoo', CategoryYahooModel);
module.exports = CategoryYahoo;
