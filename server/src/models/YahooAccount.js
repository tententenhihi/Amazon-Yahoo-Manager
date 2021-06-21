var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var YahooAccount = new Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
    },
    yahoo_id: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    hash_password: {
        type: String,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

YahooAccount.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};

var YahooAccountSchema = mongoose.model('YahooAccount', YahooAccount);
module.exports = YahooAccountSchema;
