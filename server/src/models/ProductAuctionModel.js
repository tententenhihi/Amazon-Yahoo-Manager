var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    yahoo_id: {
        type: String,
        default: ''
    },
    product_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    current_price: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});


var ProductAuctionSchema = mongoose.model('ProductAuction', Product);
module.exports = ProductAuctionSchema;
