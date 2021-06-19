var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var User = new Schema({
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
    gender: {
        type: Boolean,
    },
    avatar: {
        type: String,
    },
    address: {
        type: String,
    },
    provider: {
        type: String,
        default: 'local',
        trim: true,
        required: true,
    },
    idSocial: {
        type: String,
    },
    status: {
        type: String,
        default: 'LIVE',
    },
    idGroup: {
        type: String,
        default: '',
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

User.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};

var UserSchema = mongoose.model('User', User);
module.exports = UserSchema;
