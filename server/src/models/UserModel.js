var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var autoIncrement = require('mongoose-auto-increment');

var User = new Schema({
    email: {
        type: String,
        required: true,
    },
    expired_at: {
        type: Date,
        default: '',
    },
    note: {
        type: String,
        default: '',
    },
    verified_at: {
        type: Date,
        default: '',
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
    type: {
        type: String,
        required: true,
        enum: ['admin', 'member'],
        default: 'member',
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
    },
    token: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
    },
    provider: {
        type: String,
        default: 'local',
        trim: true,
        required: true,
    },
    status: {
        type: String,
        default: 'LIVE',
    },
    maxYahooAccount: {
        type: Number,
        default: 1,
    },
    userId: { type: Number, default: 1 },
    seq: { type: Number, default: 1 },
    created: {
        type: Date,
        default: Date.now,
    },
});

User.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};
autoIncrement.initialize(mongoose.connection);
User.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userId',
    startAt: 1,
    incrementBy: 1,
});
var UserSchema = mongoose.model('User', User);
module.exports = UserSchema;
