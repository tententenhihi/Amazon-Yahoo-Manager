var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bank = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    name: {
        type: String,
        require: true,
    },

    branch: {
        type: String,
        require: true,
    },
    number: {
        type: String,
        require: true,
    },
    first_name: {
        type: String,
        require: true,
    },
    last_name: {
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
