var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CronHistory = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    success_count: {
        type: Number,
        default: 0,
    },
    error_count: {
        type: Number,
        default: 0,
    },
    detail: {
        type: Array,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var CronHistoryModel = mongoose.model('CronHistory', CronHistory);
module.exports = CronHistoryModel;
