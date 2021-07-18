var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductGlobalSetting = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    template: {
        type: Number,
        required: true,
        default: 1
    },
    product_detail: {
        type: String,
        default: ''
    },
    payment_detail: {
        type: String,
        default: ''
    },
    delivery_detail: {
        type: String,
        default: ''
    },
    precaution_detail: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now,
    }
});


var ProductGlobalSettingSchema = mongoose.model('ProductGlobalSetting', ProductGlobalSetting);
module.exports = ProductGlobalSettingSchema;
