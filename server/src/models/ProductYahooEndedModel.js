var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    aID: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    oldAID: {
        type: String,
    },
    idBuyer: {
        type: String,
    },
    time_end: {
        type: String,
    },
    price_end: {
        type: Number,
    },
    buyer_count: {
        type: Number,
        default: 1,
    },
    yahooAuctionFee: {
        type: Number,
        default: 10,
    },
    product_buy_count: {
        type: Number,
        default: 1,
    },
    amazon_shipping_fee: {
        type: Number,
        default: 0,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    images: {
        type: Array,
        default: [],
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    folder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
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
        type: Number,
        required: false,
    },
    bid_or_buy_price: {
        type: Number,
        required: false,
    },
    import_price: {
        type: Number,
        required: false,
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
        type: Number,
        default: 0,
    },
    ship_name2: {
        type: String,
        default: '',
    },
    ship_fee2: {
        type: Number,
        default: 0,
    },
    ship_name3: {
        type: String,
        default: '',
    },
    ship_fee3: {
        type: Number,
        default: 0,
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
    note: {
        type: String,
        default: '',
    },
    asin_amazon: {
        type: String,
    },
    id_category_amazon: {
        type: String,
    },
    count_product: {
        type: Number,
        default: 3,
    },
    ship_info: {
        type: String,
    },
    profit: {
        type: String,
    },
    progress: {
        type: String,
        enum: ['address_inputing', 'postage_inputing', 'bundle_requested', 'bundle_accepted',
            'money_received', 'preparation_for_shipment', 'shipping', 'complete'],
        default: 'address_inputing',
    },
    message_list: {
        type: Array,
        default: [],
    },
    rating_list: {
        type: Array,
        default: [],
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var ProductYahooEndedModel = mongoose.model('ProductYahooEnded', Product);
module.exports = ProductYahooEndedModel;
