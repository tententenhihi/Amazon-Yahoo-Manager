var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchCode = new Schema({
    code: {
        type: String,
        require: true,
        trim: true,
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    isBlackList: {
        type: Boolean,
        require: true,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var SearchCodeSchema = mongoose.model('SearchCode', SearchCode);
module.exports = SearchCodeSchema;
