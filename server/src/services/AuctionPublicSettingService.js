import AuctionPublicSettingModel from '../models/AuctionPublicSettingModel';
import ProductYahooService from './ProductYahooService';
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;
let listCronJob = [];

export default class AuctionPublicSettingService {
    static async startSchedule() {
        let listSchedule = await AuctionPublicSettingModel.find({ $or: [{ new_list_auto: true }, { relist_auto: true }, { calendar_list_setting: true }] });
        for (const schedule of listSchedule) {
            let cronNewList = listCronJob.find((item) => {
                if (
                    item.type === 'new_list' &&
                    item.yahoo_account_id.toString() === schedule.yahoo_account_id.toString() &&
                    item.user_id.toString() === schedule.user_id.toString()
                ) {
                    return true;
                }
                return false;
            });
            let cronRelist = listCronJob.find((item) => {
                if (
                    item.type === 'relist' &&
                    item.yahoo_account_id.toString() === schedule.yahoo_account_id.toString() &&
                    item.user_id.toString() === schedule.user_id.toString()
                ) {
                    return true;
                }
                return false;
            });
            let cronCalendar = listCronJob.find((item) => {
                if (
                    item.type === 'calendar' &&
                    item.yahoo_account_id.toString() === schedule.yahoo_account_id.toString() &&
                    item.user_id.toString() === schedule.user_id.toString()
                ) {
                    return true;
                }
                return false;
            });
            //Cron new list
            if (schedule.new_list_auto && schedule.new_list_target_folder.length > 0) {
                let timeCron = null;
                if (schedule.new_list_interval_per_day) {
                    timeCron = `* ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * *`;
                } else {
                    timeCron = `* ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * ${schedule.new_list_day_of_week - 1}`;
                }
                if (!cronNewList) {
                    cronNewList = new CronJob(
                        timeCron,
                        function () {
                            ProductYahooService.startUploadProductInListFolderId(schedule.user_id, schedule.yahoo_account_id, schedule.new_list_target_folder);
                        },
                        null,
                        false
                    );
                    cronNewList.start();
                    listCronJob.push({
                        type: 'new_list',
                        yahoo_account_id: schedule.yahoo_account_id,
                        user_id: schedule.user_id,
                        cron: cronNewList,
                    });
                } else {
                    cronNewList.cron.setTime(new CronTime(timeCron));
                    if (!cronNewList.cron.running) {
                        cronNewList.cron.start();
                    }
                }
            } else {
                if (cronNewList) {
                    cronNewList.cron.stop();
                }
            }

            // Cron relist
            if (schedule.relist_auto) {
                let timeCron = `* ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * *`;
                if (!cronRelist) {
                    cronRelist = new CronJob(
                        timeCron,
                        function () {
                            ProductYahooService.startReSubmitProduct(schedule.user_id, schedule.yahoo_account_id);
                        },
                        null,
                        false
                    );
                    cronRelist.start();
                    listCronJob.push({
                        type: 'relist',
                        yahoo_account_id: schedule.yahoo_account_id,
                        user_id: schedule.user_id,
                        cron: cronRelist,
                    });
                } else {
                    cronRelist.cron.setTime(new CronTime(timeCron));
                    if (!cronRelist.cron.running) {
                        cronRelist.cron.start();
                    }
                }
            } else {
                if (cronRelist) {
                    cronRelist.cron.stop();
                }
            }

            // Cron calenda
            if (schedule.calendar_list_setting && schedule.new_list_auto && schedule.calendar_target_folder.length > 0) {
                let timeCron = `* ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * *`;
                if (!cronCalendar) {
                    cronCalendar = new CronJob(
                        timeCron,
                        function () {
                            ProductYahooService.startUploadProductByCalendar(schedule.user_id, schedule.yahoo_account_id, schedule.calendar_target_folder);
                        },
                        null,
                        false
                    );
                    cronCalendar.start();
                    listCronJob.push({
                        type: 'calendar',
                        yahoo_account_id: schedule.yahoo_account_id,
                        user_id: schedule.user_id,
                        cron: cronCalendar,
                    });
                } else {
                    cronCalendar.cron.setTime(new CronTime(timeCron));
                    if (!cronCalendar.cron.running) {
                        cronCalendar.cron.start();
                    }
                }
            } else {
                if (cronCalendar) {
                    cronCalendar.cron.stop();
                }
            }
        }
        // console.log(' #### listCronJob: ', listCronJob);
    }

    static async get(userId, yahoo_account_id) {
        try {
            let res = await AuctionPublicSettingModel.find({ user_id: userId, yahoo_account_id: yahoo_account_id }).sort({ _id: -1 }).limit(1);
            if (!res.length) {
                res = await AuctionPublicSettingModel.create({
                    user_id: userId,
                    yahoo_account_id: yahoo_account_id,
                });
            }
            return Array.isArray(res) ? res[0] : res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async create(data) {
        try {
            let res = await AuctionPublicSettingModel.create(data);
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async update(data) {
        try {
            let res = await AuctionPublicSettingModel.findOneAndUpdate({ _id: data._id, user_id: data.user_id }, data, { new: true });
            this.startSchedule();
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
