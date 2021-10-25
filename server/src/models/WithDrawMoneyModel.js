var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WithDrawMoney = new Schema({
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        require: true,
    },
    bankNumber: {
        type: String,
        require: true,
    },
    amount: {
        type: String,
        require: true,
    },
    status: {
        type: String,
    },
    status_message: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});
var WithDrawMoneyModel = mongoose.model('WithDrawMoney', WithDrawMoney);
module.exports = WithDrawMoneyModel;
