var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductInfomationDefault = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        default: 'used',
    },
    status_comment: {
        type: String,
        default: ''
    },
    offer: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 1,
    },
    duration: {
        type: Number,
        default: 0
    },
    closing_time: {
        type: Number,
        default: 0,
    },
    retpolicy: {
        type: String,
        default: 'no'
    },
    retpolicy_comment: {
        type: String,
        default: ''
    },
    min_bid_rating: {
        type: String,
        default: ''
    },
    bad_rating_ratio: {
        type: String,
        default: ''
    },
    bid_credit_limit: {
        type: String,
        default: ''
    },
    auto_extension: {
        type: String,
        default: ''
    },
    close_early: {
        type: String,
        default: ''
    },
    num_resubmit: {
        type: Number,
        default: 0,
    },
    ship_time: {
        type: String,
        default: 'after'
    },
    shipping: {
        type: String,
        default: 'buyer'
    },
    location: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    ship_name1: {
        type: String,
        default: ''
    },
    ship_fee1: {
        type: String,
        default: ''
    },
    ship_name2: {
        type: String,
        default: ''
    },
    ship_fee2: {
        type: String,
        default: ''
    },
    ship_name3: {
        type: String,
        default: ''
    },
    ship_fee3: {
        type: String,
        default: ''
    },
    foreign_check: {
        type: String,
        default: 'no'
    },
    ship_schedule: {
        type: Number,
        default: 1
    },
    featured_amount: {
        type: String,
        default: '',
    },
    bold: {
        type: String,
        default: 'no',
    },
    highlight: {
        type: String,
        default: 'no',
    },
    gift: {
        type: Number,
        default: 1
    },
    wrapping: {
        type: Number,
        default: 1,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});


var ProductInfomationDefaultSchema = mongoose.model('ProductInfomationDefault', ProductInfomationDefault);
module.exports = ProductInfomationDefaultSchema;
