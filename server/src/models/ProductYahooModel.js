var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductYahoo = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product_status: {
        type: Number,
        required: true,
    },
    product_status_des: {
        type: String,
        default: ''
    },
    price_cut_negotiations: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        default: 1,
    },
    holding_period: {
        type: Number,
        default: 0
    },
    ending_time: {
        type: Number,
        default: 0,
    },
    returnAbility: {
        type: Boolean,
        default: false
    },
    remarks_for_returns: {
        type: String,
        default: ''
    },
    bid_limit: {
        type: Array,
        default: []
    },
    automatic_extension: {
        type: Boolean,
        default: false
    },
    early_termination: {
        type: Boolean,
        default: false
    },
    auto_relisting: {
        type: Number,
        default: 0,
    },
    paid_type: {
        type: Boolean,
        default: 0
    },
    shipping_cost: {
        type: Boolean,
        default: 0
    },
    prefecture: {
        type: String,
        require: true
    },
    address: {
        type: String,
        default: ''
    },
    shipping_method_1: {
        type: String,
        default: ''
    },
    shipping_rate_1: {
        type: String,
        default: ''
    },
    shipping_method_2: {
        type: String,
        default: ''
    },
    shipping_rate_2: {
        type: String,
        default: ''
    },
    shipping_method_3: {
        type: String,
        default: ''
    },
    shipping_rate_3: {
        type: String,
        default: ''
    },
    overseas_shipping: {
        type: Boolean,
        default: false
    },
    featured_auction: {
        type: Number,
        default: 0,
    },
    bold_text: {
        type: Number,
        default: 0,
    },
    bg_color: {
        type: Number,
        default: 0,
    },
    conspicuous_icon: {
        type: Number,
        default: 1,
    },
    gift_icon: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now,
    },
});


var ProductYahooSchema = mongoose.model('ProductYahoo', ProductYahoo);
module.exports = ProductYahooSchema;
