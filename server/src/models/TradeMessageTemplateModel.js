var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TradeMessageTemplate = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
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

var TradeMessageTemplateSchema = mongoose.model('TradeMessageTemplate', TradeMessageTemplate);
module.exports = TradeMessageTemplateSchema;
