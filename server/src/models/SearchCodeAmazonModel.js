var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchCode = new Schema({
    code: {
        type: String,
        require: true,
        trim: true,
    },
    groupId: {
        type: String,
        require: true,
        trim: true,
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        require: true,
    },
    isProductGeted: {
        type: Boolean,
        require: true,
        default: false,
    },
    type: {
        type: String,
        require: true,
        default: 'ASIN',
        enum: ['ASIN', 'KEYWORD'],
    },
    status: {
        type: String,
        require: true,
        default: 'CREATED',
        enum: ['CREATED', 'ERROR', 'SUCCESS'],
    },
    statusMessage: {
        type: String,
    },
    query_key: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var SearchCodeSchema = mongoose.model('SearchCode', SearchCode);
module.exports = SearchCodeSchema;
