var cron = require('node-cron');
import AuctionYahooService from '../services/AuctionYahooService';
import ProductYahooService from '../services/ProductYahooService';
import AccountYahooService from '../services/AccountYahooService';
import ProductYahooEndedService from '../services/ProductYahooEndedService';
import ProxyService from '../services/ProxyService';
import AuctionPublicSettingModel from '../models/AuctionPublicSettingModel';
import CronHistoryModel from '../models/CronHistoryModel';
let listCronJob = [];
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;

export default class CronJobService {
    static async startCron() {
        CronJobService.startUploadProductYahoo();
        CronJobService.startGetProductYahooEnded();
        cron.schedule('*/5 * * * *', async () => {
            CronJobService.startGetProductYahooEnded();
        });
        cron.schedule('0 0 0 * * *', async () => {
            CronJobService.startGetPointAuctionOfAccount();
        });
    }
    static async startGetPointAuctionOfAccount() {
        console.log(' ====== START Get Point yahoo account ======');

        let listAccountYahoo = await AccountYahooService.find({});
        for (let i = 0; i < listAccountYahoo.length; i++) {
            const accountYahoo = listAccountYahoo[i];
            if (accountYahoo.status === 'SUCCESS' && accountYahoo.cookie) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let point = await AuctionYahooService.getPointAuction(accountYahoo.cookie, proxyResult.data);
                    if (point != null && point.trim() !== '') {
                        await AccountYahooService.update(accountYahoo._id, { auction_point: point });
                    }
                }
            }
        }
    }

    static async startGetProductYahooEnded() {
        console.log(' ====== START Get Product yahoo ended every 5 minute ======');
        let listAccountYahoo = await AccountYahooService.find({});
        for (let i = 0; i < listAccountYahoo.length; i++) {
            const accountYahoo = listAccountYahoo[i];
            if (accountYahoo.status === 'SUCCESS' && accountYahoo.cookie) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let listProductEnded = await AuctionYahooService.getProductAuctionEnded(accountYahoo.yahoo_id, accountYahoo.cookie, proxyResult.data);
                    let listProductEndedInDB = await ProductYahooEndedService.find({ yahoo_account_id: accountYahoo._id });
                    // console.log(' ##### startGetProductYahooEnded listProductEnded: ', listProductEnded);
                    // tạo , update product
                    for (let j = 0; j < listProductEnded.length; j++) {
                        const product = listProductEnded[j];
                        //Check Xem có trong db chưa.
                        let productExisted = listProductEndedInDB.find((item) => item.aID === product.aID);
                        //chưa có thì tạo mới.
                        if (!productExisted) {
                            let productYahoo = await ProductYahooService.findOne({ aID: product.aID });
                            if (productYahoo) {
                                let newProductYahooEnded = {
                                    ...productYahoo._doc,
                                    ...product,
                                    _id: null,
                                };
                                newProductYahooEnded = await ProductYahooEndedService.create(newProductYahooEnded);
                            }
                        } else {
                            await ProductYahooEndedService.update(productExisted._id, product);
                        }
                    }
                    // xóa product
                    for (const productDB of listProductEndedInDB) {
                        let checkDelete = true;
                        for (const productYAHOO of listProductEnded) {
                            if (productDB.aID === productYAHOO.aID) {
                                checkDelete = false;
                                break;
                            }
                        }
                        if (checkDelete) {
                            await ProductYahooEndedService.delete(productDB._id);
                        }
                    }
                } else {
                    console.log(proxyResult);
                }
            }
        }
    }

    static async startUploadProductYahoo() {
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
                    timeCron = `0 ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * *`;
                } else {
                    timeCron = `0 ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * ${schedule.new_list_day_of_week - 1}`;
                }
                if (!cronNewList) {
                    cronNewList = new CronJob(
                        timeCron,
                        async function () {
                            let results = await ProductYahooService.startUploadProductInListFolderId(
                                schedule.user_id,
                                schedule.yahoo_account_id,
                                schedule.new_list_target_folder
                            );
                            let newCronHistory = {
                                success_count: results.filter((item) => item.success).length,
                                error_count: results.length - results.filter((item) => item.success).length,
                                detail: results,
                                user_id: schedule.user_id,
                                yahoo_account_id: schedule.yahoo_account_id,
                            };
                            await CronHistoryModel.create(newCronHistory);
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
                let timeCron = `0 ${schedule.relist_start_time_minute} ${schedule.relist_start_time_hour} * * *`;
                if (!cronRelist) {
                    cronRelist = new CronJob(
                        timeCron,
                        async function () {
                            let results = await ProductYahooService.startReSubmitProduct(schedule.user_id, schedule.yahoo_account_id);
                            let newCronHistory = {
                                success_count: results.filter((item) => item.success).length,
                                error_count: results.length - results.filter((item) => item.success).length,
                                detail: results,
                                user_id: schedule.user_id,
                                yahoo_account_id: schedule.yahoo_account_id,
                            };

                            await CronHistoryModel.create(newCronHistory);
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
                let timeCron = `0 ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * *`;
                if (!cronCalendar) {
                    cronCalendar = new CronJob(
                        timeCron,
                        async function () {
                            let results = await ProductYahooService.startUploadProductByCalendar(
                                schedule.user_id,
                                schedule.yahoo_account_id,
                                schedule.calendar_target_folder
                            );
                            let newCronHistory = {
                                success_count: results.filter((item) => item.success).length,
                                error_count: results.length - results.filter((item) => item.success).length,
                                detail: results,
                                user_id: schedule.user_id,
                                yahoo_account_id: schedule.yahoo_account_id,
                            };
                            await CronHistoryModel.create(newCronHistory);
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
}
