var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bank = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    bkCode: {
        type: String,
        require: true,
    },
    bkName: {
        type: String,
        require: true,
    },
    bkSubCode: {
        type: String,
        require: true,
    },
    bkSubName: {
        type: String,
        require: true,
    },
    bkAccountNum: {
        type: String,
        require: true,
    },
    bkAccountKanaLast: {
        type: String,
        require: true,
    },
    bkAccountKanaFirst: {
        type: String,
        require: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});
var BankModel = mongoose.model('Bank', Bank);
module.exports = BankModel;
