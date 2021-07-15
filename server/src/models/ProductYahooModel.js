var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    images: {
        type: Array,
        default: [],
    },
    folder_id: {
        type: String,
        required: true,
    },
    product_model: {
        type: String,
        default: '',
    },
    foreign_key: {
        type: String,
        default: '',
    },
    product_yahoo_title: {
        type: String,
        required: true,
    },
    yahoo_auction_category_id: {
        type: String,
        required: true,
    },
    start_price: {
        type: String,
        required: false,
    },
    bid_or_buy_price: {
        type: String,
        required: false,
    },
    import_price: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: 'CREATED',
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
    reserve_price: {
        type: Number,
        defaul: 0,
    },
    description: {
        type: String,
        default: '',
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
    created: {
        type: Date,
        default: Date.now,
    },
});

var ProductYahooSchema = mongoose.model('ProductYahoo', Product);
module.exports = ProductYahooSchema;
