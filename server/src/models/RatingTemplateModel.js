var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingTemplate = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

var RatingTemplateSchema = mongoose.model('RatingTemplate', RatingTemplate);
module.exports = RatingTemplateSchema;
