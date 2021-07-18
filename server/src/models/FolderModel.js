var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var FolderSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    name: {
        type: String,
        trim: true,
        lowercase: true,
    },
    position: {
        type: Number,
        required: true,
    },
    folder_id: {
        type: Number,
        default: 1
    },
    seq: { 
        type: Number,
        default: 1 
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

autoIncrement.initialize(mongoose.connection);
FolderSchema.plugin(autoIncrement.plugin, {
    model: 'FolderSchema',
    field: 'folder_id',
    startAt: 1,
    incrementBy: 1
});

var Folder = mongoose.model('Folder', FolderSchema);
module.exports = Folder;
