var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductYahoo = new Schema({
    // Giá gốc
    import_price: {
        type: Number,
        required: false,
    },
    // Nguyên giá
    original_price: {
        type: Number,
        required: false,
    },
    //Giá sản phẩm bán
    price: {
        type: Number,
        required: false,
    },
    //Giá khởi điểm (Nếu tính là <= 0 thì để là 1) = Xuất hàng
    start_price: {
        type: Number,
        required: false,
    },

    //Giá mua luôn
    bid_or_buy_price: {
        type: Number,
        required: false,
    },

    //Số tiền nhận về
    amount_received: {
        type: Number,
        required: false,
    },
    //Lợi nhuận gộp
    gross_profit: {
        type: Number,
        required: false,
    },
    //Lợi nhuận thực tế
    actual_profit: {
        type: Number,
        required: false,
    },
    // phí ship amazon
    amazon_shipping_fee: {
        type: Number,
    },
    //Temp
    start_price_temp: {
        type: Number,
    },
    bid_or_buy_price_temp: {
        type: Number,
    },
    ship_fee1_temp: {
        type: Number,
    },
    quantity_temp: {
        type: Number,
    },
    //============
    profit_stop: {
        type: Number,
    },
    is_user_change: {
        type: Boolean,
        default: false,
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
    },
    product_amazon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductAmazon',
    },
    product_model: {
        type: String,
        default: '',
    },

    product_yahoo_title: {
        type: String,
        required: true,
    },
    yahoo_auction_category_id: {
        type: String,
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
    },
    quantity_check: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    closing_time: {
        type: Number,
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
        type: Number,
        default: 18,
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
    },
    ship_name2: {
        type: String,
        default: '',
    },
    ship_fee2: {
        type: Number,
    },
    ship_name3: {
        type: String,
        default: '',
    },
    ship_fee3: {
        type: Number,
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
    },
    wrapping: {
        type: String,
        default: 'no',
    },
    aID: {
        type: String,
    },
    oldAID: {
        type: String,
    },
    idBuyer: {
        type: String,
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
    count: {
        type: Number,
        default: 1,
    },
    listing_status: {
        type: String,
        enum: ['NOT_LISTED', 'UNDER_EXHIBITION'],
        default: 'NOT_LISTED',
    },
    upload_status: {
        type: String,
        enum: ['NEW', 'ERROR', 'SUCCESS'],
        default: 'NEW',
    },
    upload_status_message: {
        type: String,
    },
    watch_stock: {
        type: String,
        enum: ['0', '1'],
        default: '0',
    },
    watch_profit: {
        type: String,
        enum: ['0', '1'],
        default: '0',
    },
    watch_only_prime: {
        type: String,
        enum: ['0', '1'],
        default: '0',
    },
    extra_stock: {
        type: Number,
    },
    image_overlay_index: {
        type: Number,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var ProductYahooSchema = mongoose.model('ProductYahoo', ProductYahoo);
module.exports = ProductYahooSchema;
