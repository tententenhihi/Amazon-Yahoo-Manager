var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VerifyCode = new Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

var VerifyCodeSchema = mongoose.model('VerifyCode', VerifyCode);
module.exports = VerifyCodeSchema;
