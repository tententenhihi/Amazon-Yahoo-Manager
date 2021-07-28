var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageInsertionSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    images: {
        type: Array,
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

var ImageInsertion = mongoose.model('ImageInsertion', ImageInsertionSchema);
module.exports = ImageInsertion;
