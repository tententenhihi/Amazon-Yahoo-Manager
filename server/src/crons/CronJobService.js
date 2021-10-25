var cron = require('node-cron');
import AuctionYahooService from '../services/AuctionYahooService';
import ProductYahooService from '../services/ProductYahooService';
import AccountYahooService from '../services/AccountYahooService';
import ProductYahooEndedService from '../services/ProductYahooEndedService';
import ProxyService from '../services/ProxyService';
import AuctionPublicSettingModel from '../models/AuctionPublicSettingModel';
import CronHistoryModel from '../models/CronHistoryModel';
import ProductYahooAuctionService from '../services/ProductYahooAuctionService';
import ProductYahooFinishedService from '../services/ProductYahooFinishedService';
import UserService from '../services/UserService';
import KeepaService from '../services/KeepaService';
import ProductInfomationDefaultService from '../services/ProductInfomationDefaultService';
import moment from 'moment';
import AsinAmazonModel from '../models/AsinAmazonModel';
import FolderModel from '../models/FolderModel';
const YahooAccountSchema = require('../models/YahooAccount');

let listCronJob = [];
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;

export default class CronJobService {
    // static async test
    static async startCron() {
        //======================
        CronJobService.startUploadProductYahoo();
        cron.schedule('0 0 0 1 * *', async () => {
            console.log(' ########### CRON JOB Delete Asin ########### ', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
            let listAsin = await AsinAmazonModel.find();
            for (const asin of listAsin) {
                let dateAsin = new Date(asin.created);
                let now = new Date();
                dateAsin.setDate(dateAsin.getDate() + 30);
                if (dateAsin < now) {
                    await AsinAmazonModel.deleteOne({ _id: asin._id });
                }
            }
        });

        cron.schedule('0 0 0 * * *', async () => {
            CronJobService.startGetPointAuctionOfAccount();
            CronJobService.resetYahooAccount();
            CronJobService.cronDeleteAuctionProductFinished();
            CronJobService.checkProductOriginalForAuctionProductSelling();
        });
        cron.schedule('0 0 12 * * *', async () => {
            CronJobService.cronDeleteAuctionProductFinished();
            CronJobService.checkProductOriginalForAuctionProductSelling();
        });
        cron.schedule('0 0 6 * * *', async () => {
            CronJobService.getCookieAllYahoo();
        });
    }
    static async getCookieAllYahoo() {
        console.log(' ========== getCookieAllYahoo ==========', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
        let listYahooAccount = await YahooAccountSchema.find({});
        for (const yahooAccount of listYahooAccount) {
            await AccountYahooService.getCookie(yahooAccount._id);
        }
    }

    static async checkProductOriginalForAuctionProductSelling() {
        console.log(' ====== START CRON Theo dõi product selling ======: ', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
        let listAccountYahoo = await AccountYahooService.find({});
        for (let i = 0; i < listAccountYahoo.length; i++) {
            const accountYahoo = listAccountYahoo[i];
            if (accountYahoo.status === 'SUCCESS' && accountYahoo.cookie && !accountYahoo.is_lock) {
                const proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let defaultSetting = await ProductInfomationDefaultService.findOne({
                        yahoo_account_id: accountYahoo._id,
                        user_id: accountYahoo.user_id,
                    });
                    let listProductSelling = await AuctionYahooService.getProductAuctionSelling(accountYahoo.cookie, proxyResult.data);
                    for (const productSelling of listProductSelling) {
                        if (productSelling.idBuyer === '') {
                            let productYahoo = await ProductYahooAuctionService.findOne({ aID: productSelling.aID });
                            if (!productYahoo && productSelling.title) {
                                productYahoo = await ProductYahooAuctionService.findOne({
                                    product_yahoo_title: { $regex: productSelling.title.replace(/\(/g, '\\(').replace(/\)/g, '\\)') },
                                });
                            }
                            if (productYahoo && productYahoo.asin_amazon) {
                                // Product được tạo sau 18 tiếng mới check
                                let dateProduct = new Date(productYahoo.created);
                                let dateNow = new Date();
                                dateProduct.setHours(dateProduct.getHours() + 18);
                                if (dateNow > dateProduct) {
                                    let productYahooLocal = await ProductYahooService.findOne({ asin_amazon: productYahoo.asin_amazon });
                                    if (productYahooLocal) {
                                        productYahoo = productYahooLocal;
                                    }
                                    let resultCheckUpload = await ProductYahooService.checkStopUpload(productYahoo, defaultSetting);
                                    if (resultCheckUpload.isStopUpload) {
                                        await AuctionYahooService.cancelAuction(productSelling.aID, accountYahoo.cookie, proxyResult.data);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    static async cronDeleteAuctionProductFinished() {
        console.log(' ====== START CRON Xóa Product Finised ko có người mua ======', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
        let listAccountYahoo = await AccountYahooService.find({});
        for (let i = 0; i < listAccountYahoo.length; i++) {
            const accountYahoo = listAccountYahoo[i];
            let scheduleData = await AuctionPublicSettingModel.findOne({ yahoo_account_id: accountYahoo._id });
            if (scheduleData && scheduleData.auction_delete) {
                if (accountYahoo.status === 'SUCCESS' && accountYahoo.cookie && !accountYahoo.is_lock) {
                    let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                    if (proxyResult.status === 'SUCCESS') {
                        let listProductFinished = await AuctionYahooService.getProductAuctionFinished(accountYahoo.cookie, proxyResult.data);
                        let listaID = listProductFinished.map((item) => item.aID);
                        let result = await AuctionYahooService.deleteProductFinished(listaID, accountYahoo.cookie, proxyResult.data);
                    }
                }
            }
        }
    }
    static async resetYahooAccount() {
        console.log(' ========== resetYahooAccount ==========', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
        let listYahooAcount = await AccountYahooService.find({});
        for (const account of listYahooAcount) {
            account.count_error = 0;
            account.is_error = false;
            await account.save();
        }
    }
    static async startGetPointAuctionOfAccount() {
        console.log(' ====== START Get Point yahoo account ======', moment(new Date()).format('DD/MM/YYYY - HH:mm:ss:ms'));
        let listAccountYahoo = await AccountYahooService.find({});
        for (let i = 0; i < listAccountYahoo.length; i++) {
            const accountYahoo = listAccountYahoo[i];
            if (accountYahoo.status === 'SUCCESS' && accountYahoo.cookie && !accountYahoo.is_lock) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    let point = await AuctionYahooService.getPointAuction(accountYahoo.cookie, proxyResult.data);
                    if (point) {
                        await AccountYahooService.update(accountYahoo._id, { auction_point: point });
                    }
                }
            }
        }
    }

    static async startGetProductYahoo() {
        console.log(' ====== START Get Product yahoo ended every 5 minute ======');
        let listAccountYahoo = await AccountYahooService.find({});
        for (let i = 0; i < listAccountYahoo.length; i++) {
            const accountYahoo = listAccountYahoo[i];
            let is_lock_user = await UserService.checkUser_Lock_Exprired(accountYahoo.user_id);
            if (!is_lock_user && accountYahoo.status === 'SUCCESS' && accountYahoo.cookie && !accountYahoo.is_lock) {
                let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
                if (proxyResult.status === 'SUCCESS') {
                    try {
                        let listProductEnded = await AuctionYahooService.getProductAuctionEnded(accountYahoo.yahoo_id, accountYahoo.cookie, proxyResult.data);
                        let listProductEndedInDB = await ProductYahooEndedService.find({ yahoo_account_id: accountYahoo._id });
                        // console.log(' ##### startGetProductYahoo listProductEnded: ', listProductEnded);
                        // tạo , update product
                        for (let j = 0; j < listProductEnded.length; j++) {
                            const product = listProductEnded[j];
                            //Check Xem có trong db chưa.
                            let productExisted = listProductEndedInDB.find((item) => item.aID === product.aID);
                            //chưa có thì tạo mới.
                            if (!productExisted) {
                                let productYahoo = await ProductYahooAuctionService.findOne({ aID: product.aID });
                                if (productYahoo) {
                                    let newProductYahooEnded = {
                                        ...productYahoo._doc,
                                        ...product,
                                    };
                                    delete newProductYahooEnded._id;

                                    newProductYahooEnded = await ProductYahooEndedService.create(newProductYahooEnded);
                                }
                            } else {
                                await ProductYahooEndedService.update(productExisted._id, product);
                            }
                        }
                        // xóa product trong db
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
                    } catch (error) {
                        console.log(' ### getProductAuctionEnded: ', error);
                    }

                    try {
                        let listProductFinished = await AuctionYahooService.getProductAuctionFinished(accountYahoo.cookie, proxyResult.data);
                        let listProductInDB = await ProductYahooFinishedService.find({ yahoo_account_id: accountYahoo._id });
                        // console.log(' ##### startGetProductYahoo getProductAuctionFinished: ', listProductFinished);
                        // tạo , update product
                        for (let j = 0; j < listProductFinished.length; j++) {
                            const product = listProductFinished[j];
                            //Check Xem có trong db chưa.
                            let productExisted = listProductInDB.find((item) => item.aID === product.aID);
                            //chưa có thì tạo mới.
                            if (!productExisted) {
                                let productYahoo = await ProductYahooAuctionService.findOne({ aID: product.aID });
                                if (productYahoo) {
                                    let newProductYahooEnded = {
                                        ...productYahoo._doc,
                                        ...product,
                                    };
                                    delete newProductYahooEnded._id;

                                    newProductYahooEnded = await ProductYahooFinishedService.create(newProductYahooEnded);
                                }
                            } else {
                                await ProductYahooFinishedService.update(productExisted._id, product);
                            }
                        }
                        // xóa product trong db
                        for (const productDB of listProductInDB) {
                            let checkDelete = true;
                            for (const productYAHOO of listProductFinished) {
                                if (productDB.aID === productYAHOO.aID) {
                                    checkDelete = false;
                                    break;
                                }
                            }
                            if (checkDelete) {
                                await ProductYahooFinishedService.delete(productDB._id);
                            }
                        }
                    } catch (error) {
                        console.log(' ### getProductAuctionFinished: ', error);
                    }
                } else {
                }
            }
        }
    }

    static async startUploadProductYahoo() {
        console.log(' ========= startUploadProductYahoo =========');
        let listSchedule = await AuctionPublicSettingModel.find({ $or: [{ new_list_auto: true }, { relist_auto: true }, { calendar_list_setting: true }] });
        for (const schedule of listSchedule) {
            let cronNewListIndex = listCronJob.findIndex((item) => {
                if (item.type === 'new_list' && item.yahoo_account_id.toString() === schedule.yahoo_account_id.toString() && item.user_id.toString() === schedule.user_id.toString()) {
                    return true;
                }
                return false;
            });
            let cronRelistIndex = listCronJob.findIndex((item) => {
                if (item.type === 'relist' && item.yahoo_account_id.toString() === schedule.yahoo_account_id.toString() && item.user_id.toString() === schedule.user_id.toString()) {
                    return true;
                }
                return false;
            });
            let cronCalendarIndex = listCronJob.findIndex((item) => {
                if (item.type === 'calendar' && item.yahoo_account_id.toString() === schedule.yahoo_account_id.toString() && item.user_id.toString() === schedule.user_id.toString()) {
                    return true;
                }
                return false;
            });

            //Cron new list
            if (schedule.new_list_auto && schedule.new_list_target_folder.length > 0) {
                let timeCron = null;
                if (schedule.new_list_interval_per_day) {
                    timeCron = `0 ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} */${schedule.publish_interval} * *`;
                } else {
                    timeCron = `0 ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * ${schedule.new_list_day_of_week - 1}`;
                }
                let newCron = new CronJob(
                    timeCron,
                    async function () {
                        let is_lock_user = await UserService.checkUser_Lock_Exprired(schedule.user_id);
                        let is_lock_account = await AccountYahooService.checkAccountYahoo_Lock(schedule.yahoo_account_id);
                        if (is_lock_account || is_lock_user) {
                            console.log(' ========== cronNewList Locked ==========');
                            return;
                        }
                        console.log(' ######### schedule: ', schedule.new_list_target_folder);
                        let results = await ProductYahooService.startUploadProductInListFolderId(schedule.user_id, schedule.yahoo_account_id, schedule.new_list_target_folder);
                        if (results.length > 0) {
                            let newCronHistory = {
                                success_count: results.filter((item) => item.success).length,
                                error_count: results.length - results.filter((item) => item.success).length,
                                detail: results,
                                user_id: schedule.user_id,
                                yahoo_account_id: schedule.yahoo_account_id,
                            };
                            await AccountYahooService.setUpCountError(schedule.yahoo_account_id, newCronHistory.error_count);
                            await CronHistoryModel.create(newCronHistory);
                        }
                    },
                    null,
                    false
                );
                newCron.start();

                if (cronNewListIndex != -1) {
                    listCronJob[cronNewListIndex].cron.stop();
                    listCronJob[cronNewListIndex].cron = newCron;
                } else {
                    listCronJob.push({
                        type: 'new_list',
                        yahoo_account_id: schedule.yahoo_account_id,
                        user_id: schedule.user_id,
                        cron: newCron,
                    });
                }
            } else {
                if (cronNewListIndex != -1) {
                    listCronJob[cronNewListIndex].cron.stop();
                }
            }

            // Cron relist
            if (schedule.relist_auto) {
                let timeCron = `0 ${schedule.relist_start_time_minute} ${schedule.relist_start_time_hour} * * *`;
                let newCronRelist = new CronJob(
                    timeCron,
                    async function () {
                        let is_lock_user = await UserService.checkUser_Lock_Exprired(schedule.user_id);
                        let is_lock_account = await AccountYahooService.checkAccountYahoo_Lock(schedule.yahoo_account_id);
                        if (is_lock_account || is_lock_user) {
                            console.log(' ========== cronRelist Locked ==========');
                            return;
                        }
                        let results = await ProductYahooService.startReSubmitProduct(schedule.user_id, schedule.yahoo_account_id);
                        if (results.length > 0) {
                            let newCronHistory = {
                                success_count: results.filter((item) => item.success).length,
                                error_count: results.length - results.filter((item) => item.success).length,
                                detail: results,
                                user_id: schedule.user_id,
                                yahoo_account_id: schedule.yahoo_account_id,
                            };
                            await AccountYahooService.setUpCountError(schedule.yahoo_account_id, newCronHistory.error_count);
                            await CronHistoryModel.create(newCronHistory);
                        }
                    },
                    null,
                    false
                );
                newCronRelist.start();
                if (cronRelistIndex != -1) {
                    listCronJob[cronRelistIndex].cron.stop();
                    listCronJob[cronRelistIndex].cron = newCronRelist;
                } else {
                    listCronJob.push({
                        type: 'relist',
                        yahoo_account_id: schedule.yahoo_account_id,
                        user_id: schedule.user_id,
                        cron: newCronRelist,
                    });
                }
            } else {
                if (cronRelistIndex != -1) {
                    listCronJob[cronRelistIndex].cron.stop();
                }
            }

            // Cron calendar
            if (schedule.calendar_list_setting && schedule.new_list_auto && schedule.calendar_target_folder.length > 0) {
                let timeCron = `0 ${schedule.new_list_start_time_minute} ${schedule.new_list_start_time_hour} * * *`;
                let newCronCalendar = new CronJob(
                    timeCron,
                    async function () {
                        let is_lock_user = await UserService.checkUser_Lock_Exprired(schedule.user_id);
                        let is_lock_account = await AccountYahooService.checkAccountYahoo_Lock(schedule.yahoo_account_id);
                        if (is_lock_account || is_lock_user) {
                            console.log(' ========== cronCalendar Locked ==========');
                            return;
                        }
                        let results = await ProductYahooService.startUploadProductByCalendar(schedule.user_id, schedule.yahoo_account_id, schedule.calendar_target_folder);
                        if (results.length > 0) {
                            let newCronHistory = {
                                success_count: results.filter((item) => item.success).length,
                                error_count: results.length - results.filter((item) => item.success).length,
                                detail: results,
                                user_id: schedule.user_id,
                                yahoo_account_id: schedule.yahoo_account_id,
                            };
                            await AccountYahooService.setUpCountError(schedule.yahoo_account_id, newCronHistory.error_count);
                            await CronHistoryModel.create(newCronHistory);
                        }
                    },
                    null,
                    false
                );
                newCronCalendar.start();
                if (cronCalendarIndex != -1) {
                    listCronJob[cronCalendarIndex].cron.stop();
                    listCronJob[cronCalendarIndex].cron = newCronCalendar;
                } else {
                    listCronJob.push({
                        type: 'calendar',
                        yahoo_account_id: schedule.yahoo_account_id,
                        user_id: schedule.user_id,
                        cron: newCronCalendar,
                    });
                }
            } else {
                if (cronCalendarIndex != -1) {
                    listCronJob[cronCalendarIndex].cron.stop();
                }
            }
        }
        // console.log(' #### listCronJob: ', listCronJob);
    }
}
