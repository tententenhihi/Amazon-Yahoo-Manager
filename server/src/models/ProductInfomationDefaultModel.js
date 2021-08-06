var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductInfomationDefault = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    status: {
        type: String,
        default: 'used',
    },
    status_comment: {
        type: String,
        default: '',
    },
    offer: {
        type: String,
        default: 'no',
    },
    quantity: {
        type: Number,
        default: 1,
    },
    duration: {
        type: Number,
        default: 0,
    },
    closing_time: {
        type: Number,
        default: 0,
    },
    retpolicy: {
        type: String,
        default: 'no',
    },
    retpolicy_comment: {
        type: String,
        default: '',
    },
    min_bid_rating: {
        type: String,
        default: 'no',
    },
    bad_rating_ratio: {
        type: String,
        default: 'no',
    },
    bid_credit_limit: {
        type: String,
        default: 'no',
    },
    auto_extension: {
        type: String,
        default: 'no',
    },
    close_early: {
        type: String,
        default: 'no',
    },
    num_resubmit: {
        type: Number,
        default: 0,
    },
    ship_time: {
        type: String,
        default: 'after',
    },
    shipping: {
        type: String,
        default: 'buyer',
    },
    location: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    ship_name1: {
        type: String,
        default: '',
    },
    ship_fee1: {
        type: String,
        default: '',
    },
    ship_name2: {
        type: String,
        default: '',
    },
    ship_fee2: {
        type: String,
        default: '',
    },
    ship_name3: {
        type: String,
        default: '',
    },
    ship_fee3: {
        type: String,
        default: '',
    },
    foreign_check: {
        type: String,
        default: 'no',
    },
    ship_schedule: {
        type: Number,
        default: 1,
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
        default: 0,
    },
    wrapping: {
        type: String,
        default: 'no',
    },
    extra_stock: {
        type: Number,
        default: 0,
    },

    // caculate profit
    profit: {
        type: Number,
        default: 0,
    },
    yahoo_auction_shipping: {
        type: Number,
        default: 0,
    },
    makeshop_shipping: {
        type: Number,
        default: 0,
    },
    amazon_shipping: {
        type: Number,
        default: 0,
    },
    yahoo_auction_fee: {
        type: Number,
        default: 0,
    },
    yahoo_auction_profit_type: {
        type: Number,
        default: 0,
    },
    yahoo_auction_price_profit: {
        type: Number,
        default: 0,
    },
    yahoo_auction_static_profit: {
        type: Number,
        default: 0,
    },
    yahoo_auction_bid_price: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var ProductInfomationDefaultSchema = mongoose.model('ProductInfomationDefault', ProductInfomationDefault);
module.exports = ProductInfomationDefaultSchema;
