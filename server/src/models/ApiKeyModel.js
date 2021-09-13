var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiKey = new Schema({
    token_keepa: {
        type: String,
        trim: true,
    },
    REFRESH_TOKEN: {
        type: String,
        trim: true,
    },
    SELLING_PARTNER_APP_CLIENT_ID: {
        type: String,
        trim: true,
    },
    SELLING_PARTNER_APP_CLIENT_SECRET: {
        type: String,
        trim: true,
    },
    AWS_SELLING_PARTNER_ROLE: {
        type: String,
        trim: true,
    },
    AWS_ACCESS_KEY_ID: {
        type: String,
        trim: true,
    },
    AWS_SECRET_ACCESS_KEY: {
        type: String,
        trim: true,
    },
    is_keepa: {
        type: Boolean,
        default: false,
    },
    is_amz: {
        type: Boolean,
        default: false,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var ApiKeyModel = mongoose.model('ApiKey', ApiKey);
module.exports = ApiKeyModel;
