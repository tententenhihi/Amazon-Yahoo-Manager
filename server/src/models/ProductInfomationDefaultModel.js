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
        default: 'new',
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
        default: 23,
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
        default: 'yes',
    },
    close_early: {
        type: String,
        default: 'yes',
    },
    num_resubmit: {
        type: Number,
        default: 1,
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
        type: Number,
        default: 23,
    },
    city: {
        type: String,
        default: '千代田区',
    },
    ship_name1: {
        type: String,
        default: 'ヤマト運輸',
    },
    ship_fee1: {
        type: Number,
        default: 1300,
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
        default: 7,
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

    // caculate profit
    list_profit: {
        type: Array,
        default: [
            {
                price: 1,
                persent_profit: '20%',
            },
            {
                price: 5000,
                persent_profit: '20%',
            },
            {
                price: 7000,
                persent_profit: '20%',
            },
            {
                price: 10000,
                persent_profit: '20%',
            },
            {
                price: 999999,
                persent_profit: '20%',
            },
        ],
    },
    yahoo_auction_shipping: {
        type: Number,
        default: 1300,
    },
    yahoo_auction_fee: {
        type: Number,
        default: 10,
    },
    profit_stop: {
        type: Number,
        default: 200,
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
