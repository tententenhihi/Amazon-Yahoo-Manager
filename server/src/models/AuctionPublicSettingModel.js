var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuctionPublicSetting = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    new_list_auto: {
        type: Boolean,
        default: false,
    },
    new_list_target_folder:{
        type: Array,
        default: [],
    },
    new_list_start_time_hour:{
        type: Number,
        default: 0,
    },
    new_list_start_time_minute:{
        type: Number,
        default: 0,
    },
    new_list_interval_per_day:{
        type: Boolean,
        default: true,
    },
    new_list_day_of_week:{
        type: Number,
        default: 1,
    },
    new_list_process_of_skipped_items:{
        type: Number,
        default: '',
    },
    relist_auto:{
        type: Boolean,
        default: false,
    },
    relist_start_time_hour:{
        type: Number,
        default: 0,
    },
    relist_start_time_minute:{
        type: Number,
        default: 0,
    },
    calendar_list_setting:{
        type: Boolean,
        default: false,
    },
    calendar_target_folder: {
        type: Array,
        default: []
    },
    target_folder_list: {
        type: Array,
        default: []
    },
    auction_delete: {
        type: Boolean,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now,
    }
});


var AuctionPublicSettingSchema = mongoose.model('AuctionPublicSetting', AuctionPublicSetting);
module.exports = AuctionPublicSettingSchema;
