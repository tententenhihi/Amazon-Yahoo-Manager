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
    quantity: {
        type: Number,
        default: 1,
    },
    ship_name1: {
        type: String,
        default: '',
    },
    ship_fee1: {
        type: Number,
        default: 0,
    },
    ship_fee2: {
        type: Number,
        default: 0,
    },
    ship_fee3: {
        type: Number,
        default: 0,
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

var ProductYahooFinishedModel = mongoose.model('ProductYahooFinished', Product);
module.exports = ProductYahooFinishedModel;
