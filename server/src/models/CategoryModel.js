var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amazon_cate_id: {
        type: String,
        required: true
    },
    yahoo_cate_id: {
        type: String,
        default: ''
    },
    asin: {
        type: String,
        default: ''
    },
    is_success_yahoo_cate_id: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
