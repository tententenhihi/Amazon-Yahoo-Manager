import FormData from 'form-data';
import axios from 'axios-https-proxy-fix';
import Fs from 'fs';
import cheerio from 'cheerio';
import Qs from 'query-string';
import moment from 'moment';
import constants from '../constants';
import puppeteer from 'puppeteer';
import proxyChain from 'proxy-chain';
import Utils from '../utils/Utils';
import ImageInsertionService from './ImageInsertionService';
import path from 'path';
import config from 'config';
import SocketIOService from './SocketIOService';

const Jimp = require('jimp');

async function waterMark(input, overlay, outputFolder) {
    let watermark = await Jimp.read(overlay);
    watermark = watermark.resize(300, 300);
    const image = await Jimp.read(input);
    watermark = await watermark;
    await image.resize(300, 300);
    image.composite(watermark, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        // opacityDest: 1,
        // opacitySource: 0.5,
    });
    await image.writeAsync(outputFolder);
}

async function getHtmlWithPuppeteer(url, proxy, cookie) {
    let sock5 = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
    const newProxyUrl = await proxyChain.anonymizeProxy(sock5);
    let args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--window-position=0,0', '--ignore-certifcate-errors', '--ignore-certifcate-errors-spki-list', '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"', `--proxy-server=${newProxyUrl}`];

    if (config.get('env') === 'development') {
        args.pop();
    }
    const options = {
        args,
        headless: true,
        ignoreHTTPSErrors: true,
    };
    const cookies = [];
    cookie = cookie.split(';');

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setCookie(...cookies);

    let timeout = 5 * 60 * 1000;
    await page.goto(url, { waitUntil: 'load', timeout: timeout });

    page.setDefaultNavigationTimeout(0);
}
export default class AuctionYahooService {
    static async getPointAuction(cookie, proxy) {
        try {
            let headers = {
                cookie,
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
                origin: 'https://auctions.yahoo.co.jp',
                authority: 'auctions.yahoo.co.jp',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            if (config.get('env') === 'development') {
                proxyConfig = null;
            }
            let res = await axios.get(`https://auctions.yahoo.co.jp/user/jp/show/mystatus`, {
                headers,
                proxy: proxyConfig,
            });
            let $ = cheerio.load(res.data);
            let textPoints = $('dl > dd > div.decStatusList.cf');
            if (textPoints && textPoints.length > 0) {
                for (const nodeP of textPoints) {
                    if ($(nodeP).text().includes('現在の評価ポイント')) {
                        let point = $(nodeP).text().replace('現在の評価ポイント', '').trim();
                        point = point.replace(/\D+/g, '');
                        return point;
                    }
                }
            }
        } catch (error) {
            console.log(' ####### getPointAuction: ', error);
            throw error;
        }
        return 0;
    }

    static async getAllCategory(cateId) {
        let listCateId = [];
        try {
            if (!cateId || cateId.trim() === '') {
                return [];
            }

            let urlGetFirstCate = `https://auctions.yahooapis.jp/AuctionWebService/V2/categoryTree?callback=jQuery21103066853671302485_1627142482060&output=json&eappid=Ke3w9B2tmbwE1JyLv0Jtc_hSm91oOrgzL5Mz0hMSaDDuMrxkCE7NPkzVig1w4ceDE6D7uyFL5jBor5I_t2JcPquSTajwz3slNX5f6o9HgjPErLE-&adf=1&category=${cateId}&_=${Date.now()}`;
            let res = await axios.get(urlGetFirstCate);
            if (res && res.status === 200) {
                const parseText = (data) => {
                    try {
                        data = data.replace('/**/jQuery21103066853671302485_1627142482060(', '');
                        data = data.substring(0, data.length - 1);

                        return JSON.parse(data).ResultSet.Result;
                    } catch (error) {
                        return null;
                    }
                };
                let cate = parseText(res.data);
                let listCate = [];
                if (cate && cate.ChildCategory) {
                    listCate = cate.ChildCategory;
                } else {
                    if (cate && cate.IsLeaf === 'true') {
                        listCateId.push({
                            ID: cate.CategoryId,
                            path: cate.CategoryPath,
                        });
                    }
                }
                try {
                    for (const cateItem of listCate) {
                        if (cateItem.IsLeaf === 'true') {
                            listCateId.push({
                                id: cateItem.CategoryId,
                                path: cateItem.CategoryPath,
                            });
                        } else if (cateItem.IsLeaf === 'false' && cateItem.IsLink === 'false') {
                            let l = await AuctionYahooService.getAllCategory(cateItem.CategoryId);
                            listCateId = [...listCateId, ...l];
                        }
                    }
                } catch (error) {
                    if (listCate && listCate.IsLeaf === 'true') {
                        listCateId.push({
                            id: listCate.CategoryId,
                            path: listCate.CategoryPath,
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        return listCateId;
    }

    static async uploadNewProduct(cookie, productData, proxy, descrionUpload, aID_resubmit) {
        try {
            console.log(' ========= START UPLOAD YAHOO ========= ');
            // Check Data
            if (!productData.yahoo_auction_category_id || productData.yahoo_auction_category_id === '0') {
                return {
                    status: 'ERROR',
                    statusMessage: 'カテゴリ未設定',
                };
            }
            if (!productData.start_price) {
                return {
                    status: 'ERROR',
                    statusMessage: '開始価格は必須です',
                };
            }
            if (!productData.images || productData.images.length == 0) {
                return {
                    status: 'ERROR',
                    statusMessage: '画像は必須です',
                };
            }

            let listImage = [];
            if (productData.images[0].startsWith('http')) {
                let folderSaveImage = 'uploads/yahoo-products/' + productData._id;
                if (!Fs.existsSync(folderSaveImage)) {
                    Fs.mkdirSync(folderSaveImage);
                }
                for (let i = 0; i < productData.images.length; i++) {
                    const urlImage = productData.images[i];
                    let saveImage = folderSaveImage + '/image_' + i + '.jpg';
                    let chekDownload = await Utils.downloadFile(urlImage, saveImage);
                    if (chekDownload) {
                        listImage.push(saveImage);
                    }
                }
            } else {
                listImage = productData.images.map((item) => {
                    return 'uploads/' + item;
                });
            }

            let listImageOverlay = [];
            if (productData.image_overlay_index != null) {
                let listImageOverlayOfAccountYahoo = await ImageInsertionService.get(productData.user_id, productData.yahoo_account_id);
                if (productData.image_overlay_index > 0 && productData.image_overlay_index <= listImageOverlayOfAccountYahoo.images.length) {
                    listImageOverlayOfAccountYahoo = listImageOverlayOfAccountYahoo.images;
                    let imageOverlay = 'uploads/' + listImageOverlayOfAccountYahoo[productData.image_overlay_index - 1];
                    for (const imageInput of listImage) {
                        let saveImage = 'uploads/yahoo-products/' + productData._id + '/' + path.basename(imageInput).replace(path.extname(imageInput), '') + '_' + `overlay_500x500.jpg`;
                        await waterMark(imageInput, imageOverlay, saveImage);
                        listImageOverlay.push(saveImage);
                    }
                    listImage = listImageOverlay;
                }
            }

            if (listImage.length === 0) {
                throw new Error('画像は必須です');
            }

            let thumbnail = listImage[0].replace('uploads/', '');

            let headers = {
                cookie,
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
                origin: 'https://auctions.yahoo.co.jp',
                referer: 'https://auctions.yahoo.co.jp/sell/jp/show/submit',
                authority: 'auctions.yahoo.co.jp',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            if (config.get('env') === 'development') {
                proxyConfig = null;
            }
            const getKeys = async (cookie) => {
                try {
                    const configs = {
                        headers: {
                            cookie: cookie,
                        },
                        proxy: proxyConfig,
                    };
                    const response = await axios.get('https://auctions.yahoo.co.jp/jp/show/submit', configs);
                    const crumbValue = /<input type="hidden" name=".crumb" value="(.*)">/.exec(response.data);
                    const imgCrumbValue = /<input type="hidden" id="img_crumb" value="(.*)">/.exec(response.data);
                    const md5Value = /<input type="hidden" name="md5" value="(.*)">/.exec(response.data);
                    let keys = {};

                    if (imgCrumbValue) keys.img_crumb = imgCrumbValue[1];
                    if (crumbValue) keys.crumb = crumbValue[1];
                    if (md5Value) keys.md5 = md5Value[1];
                    return keys;
                } catch (err) {
                    console.log(' ### AuctionYahooService -> uploadNewProduct -> getKeys: ', err);
                    return {
                        status: 'ERROR',
                        statusMessage: 'Lỗi get key',
                    };
                }
            };

            let keys = await getKeys(cookie);

            if (keys && keys.status === 'ERROR') {
                return keys;
            }
            if (keys && !keys.img_crumb) {
                return {
                    status: 'ERROR',
                    statusMessage: 'ヤフーアカウントのエラー',
                };
            }
            // Upload Image and get thumbnail
            let payloadImage = {};
            for (let i = 0; i < listImage.length; i++) {
                try {
                    const formData = new FormData();
                    const buffer = Fs.createReadStream(listImage[i]);

                    formData.append('files[0]', buffer, `photo${i}.jpg`);
                    formData.append('.crumb', keys.img_crumb);
                    const resImage = await axios.post(`https://auctions.yahoo.co.jp/img/images/new`, formData, {
                        headers: {
                            ...headers,
                            ...formData.getHeaders(),
                        },
                        // proxy: proxyConfig,
                    });
                    payloadImage[`image_comment${i + 1}`] = '';
                    payloadImage[`ImageFullPath${i + 1}`] = resImage.data.images[0].url;
                    payloadImage[`ImageWidth${i + 1}`] = resImage.data.images[0].width;
                    payloadImage[`ImageHeight${i + 1}`] = resImage.data.images[0].height;

                    // Set Thumbnail is first image
                    if (!payloadImage.thumbNail && payloadImage.thumbNail !== '') {
                        let urlImage = resImage.data.images[0].url;
                        const form = new FormData();
                        form.append('path', urlImage);
                        form.append('.crumb', keys.img_crumb);

                        const configs = {
                            headers: {
                                ...form.getHeaders(),
                                cookie: cookie,
                            },
                            proxy: proxyConfig,
                        };
                        const resThumbnail = await axios.post('https://auctions.yahoo.co.jp/img/images/new', form, configs);
                        payloadImage = { ...payloadImage, thumbNail: resThumbnail.data.thumbnail };
                    }
                } catch (error) {}
            }

            if (payloadImage.length < 0) {
                return {
                    status: 'ERROR',
                    statusMessage: 'エラー画像 ',
                };
            }

            let now = new Date();
            now.setDate(now.getDate() + productData.duration);
            let tmpClosingYMD = moment(now).format('yyyy-MM-DD');

            let location = constants.PREFECTURE.find((x) => x.value === productData.location);
            if (!location) {
                location = '';
            } else {
                location = location.display;
            }
            // if (productData.bid_or_buy_price) {
            //     productData.sales_mode = 'salesmode_buynow';
            // } else {
            // }
            productData.sales_mode = 'auction';

            // PREVIEW
            let previewParams = {
                aID: aID_resubmit || '',
                oldAID: '',
                mode: aID_resubmit ? 'oresubmit' : 'submit',
                encode: 'utf-8',
                md5: keys.md5,
                '.crumb': keys.crumb,
                tos: 'yes',
                CloseEarly: 'yes',
                fnavi: 1,
                pagetype: 'form',
                submitTipsDisp: 0,
                saveIndex: 0,
                newsubmitform: 1,
                info01: -420,
                info02: 3,
                info03: 'Chrome PDF Plugin|Chrome PDF Viewer|Native Client',
                auction_server: 'https://auctions.yahoo.co.jp/sell/jp',
                uploadserver: 'sell.auctions.yahoo.co.jp',
                ImageCntMax: 10,
                ypoint: 0,
                submit_description: 'html',
                dskPayment: 'ypmOK',
                shippinginput: 'now',
                is_yahuneko_nekoposu_ship: '',
                is_yahuneko_taqbin_compact_ship: '',
                is_yahuneko_taqbin_ship: '',
                is_jp_yupacket_official_ship: '',
                is_jp_yupack_official_ship: '',
                hokkaidoshipping1: '',
                okinawashipping1: '',
                isolatedislandshipping1: '',
                shipmethod: 'other',

                is_other_ship: 'yes',
                submitUnixtime: Date.now(),
                markdown_ratio: 0,
                promoteCtoOfficial_shipMethod: 'クリックポスト',
                shippingSize: 60,
                promoteTAQBINtoOfficial_shipMethod: '現在の配送方法',
                promoteYumailtoOfficial_shipMethod: 'ゆうメール',
                promoteNon_STANDARDtoOfficial_shipMethod: '定形外郵便',

                ...payloadImage,
                Title: productData.product_yahoo_title,
                category: productData.yahoo_auction_category_id,
                salesmode: productData.sales_mode,
                StartPrice: productData.start_price,
                BidOrBuyPrice: productData.bid_or_buy_price != '0' ? productData.bid_or_buy_price : '',
                istatus: productData.status,
                istatus_comment: productData.status_comment,
                Quantity: productData.quantity,
                Duration: productData.duration,
                ClosingTime: productData.closing_time,
                // Tạo ra từ Duration + ngày hiện tại
                tmpClosingYMD: tmpClosingYMD,
                ClosingYMD: tmpClosingYMD,
                //====
                retpolicy: productData.retpolicy,
                retpolicy_comment: productData.retpolicy_comment,
                minBidRating: productData.min_bid_rating, // 0 or 1
                badRatingRatio: productData.bad_rating_ratio,
                bidCreditLimit: productData.bid_credit_limit,
                AutoExtension: productData.auto_extension,
                numResubmit: productData.num_resubmit,
                // ReservePrice: productData.reserve_price,

                Description: descrionUpload || productData.description,
                Description_rte: descrionUpload || productData.description,

                // Ship
                shiptime: productData.ship_time,
                shipping: productData.shipping,
                loc_cd: productData.location,
                location: location,

                shipname1: productData.ship_name1,
                shipfee1: productData.ship_fee1,
                shipname2: productData.ship_name2,
                shipfee2: productData.ship_fee2,
                shipname3: productData.ship_name3,
                shipfee3: productData.ship_fee3,
                shipschedule: productData.ship_schedule,

                // Amount
                featuredAmount: productData.featured_amount,
                BoldFaceCharge: productData.bold,
                HighlightListingCharge: productData.highlight,
                GiftIconName: productData.gift,
                WrappingIconCharge: productData.wrapping,
            };
            let payload = Qs.stringify(previewParams);
            headers = {
                ...headers,
                referer: 'https://auctions.yahoo.co.jp/sell/jp/show/preview',
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            let resPreview = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/show/preview`, payload, {
                headers,
                proxy: proxyConfig,
            });

            // Fs.writeFileSync('preview.html', resPreview.data);
            let mgc = /<input type="hidden" name="mgc" value="(.*)">/.exec(resPreview.data);
            if (mgc == null) {
                let $Preview = cheerio.load(resPreview.data);
                let message = $Preview('.decErrorBox__title').text().split('\n')[0];
                return {
                    status: 'ERROR',
                    statusMessage: message,
                };
            }
            if (mgc) mgc = mgc[1];

            // SUBMIT
            previewParams = {
                ...previewParams,
                Description_disp: productData.Description,
                comefrprv: 1,
                catalog_no_applicable: 0,
                ypmOK: 1,
                browserAcceptLanguage: 'en-us',
                ipCountryCode: 'ot',
                JpYPayAllowed: 'true',
                allowPayPay: 'true',
                Offer: 0,
                intlOK: 0,
                affiliate: 0,
                mgc: mgc,
                SpecificFeeOnly: '0',
                insertionFeeTotal: '0',
                totalCharges: '0',
                ManualStartTime: '1970-01-01T09:00:00+09:00',
                markdown: 0,
                SalesContract: 'false',
                isYahunekoPack: 'true',
                '.crumb': keys.crumb,
                is_paypay_fleamarket_cross_listing: 0,
            };
            payload = Qs.stringify(previewParams);
            let resSubmit = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/config/submit`, payload, {
                headers,
                proxy: proxyConfig,
            });
            // Fs.writeFileSync('submit.html', resSubmit.data);

            console.log(' =========== Upload Product Auction DONE ============= ');
            let $ = cheerio.load(resSubmit.data);

            if (resSubmit.data.includes('以下の商品の出品手続きが完了しました。ご利用ありがとうございました。')) {
                let aTag = $('#modInfoTxt > div.untBody > ul > li:nth-child(1) > a');
                let href = aTag.attr('href');
                let aID = href.split('/')[href.split('/').length - 1];
                return {
                    status: 'SUCCESS',
                    aID,
                    thumbnail,
                };
            } else if (resSubmit.data.includes('仮出品とは、出品手続きされたオークションを、Yahoo! JAPANが確認させていただくためのものです。')) {
                return {
                    status: 'SUCCESS',
                    aID: '',
                    thumbnail,
                };
            } else {
                let message = $('strong').text();
                return {
                    status: 'ERROR',
                    statusMessage: message,
                };
            }
        } catch (error) {
            console.log(' =========== Upload Product Auction Error ============= ');
            console.log(error);
            return {
                status: 'ERROR',
                statusMessage: error.message,
            };
        }
    }

    static async reSubmit(cookie, proxy, aID, productData) {
        try {
            console.log(' ========= START UPLOAD YAHOO ========= ');

            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            if (config.get('env') === 'development') {
                proxyConfig = null;
            }

            let res = await axios.get(`https://auctions.yahoo.co.jp/sell/jp/show/resubmit?aID=` + aID, {
                headers: {
                    cookie,
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                proxy: proxyConfig,
            });

            // Fs.writeFileSync('step1.html', res.data);

            let $ = cheerio.load(res.data);

            let select_node = $('#auction').find('input');
            let previewParams = {};
            for (const nodeInput of select_node) {
                let name = nodeInput.attribs['name'];
                let value = nodeInput.attribs['value'];
                if (name) {
                    previewParams[name] = value;
                }
            }
            let istatus = $('select[name="istatus"]');
            let shipschedule = $('select[name="shipschedule"]');
            let loc_cd = $('select[name="loc_cd"]');
            let Quantity = $('select[name="Quantity"]');
            if (Quantity && Quantity.val()) {
                previewParams['Quantity'] = Quantity.val();
            }
            if (!previewParams['Quantity']) {
                previewParams['Quantity'] = 1;
            }
            previewParams['info01'] = -420;
            previewParams['info02'] = 3;
            previewParams['info03'] = 'Chrome PDF Plugin|Chrome PDF Viewer|Native Client';
            previewParams['istatus'] = istatus.val();
            previewParams['shipschedule'] = shipschedule.val();
            previewParams['loc_cd'] = loc_cd.val();
            previewParams['promoteCtoOfficial_shipMethod'] = 'クリックポスト';
            previewParams['shippingSize'] = 60;
            previewParams['promoteTAQBINtoOfficial_shipMethod'] = '現在の配送方法';
            previewParams['promoteYumailtoOfficial_shipMethod'] = 'ゆうメール';
            previewParams['promoteNon_STANDARDtoOfficial_shipMethod'] = '定形外郵便';
            previewParams['promoteNon_STANDARDtoOfficial_shipMethod'] = '定形外郵便';
            previewParams['retpolicy'] = 0;
            previewParams['markdown_ratio'] = 0;
            previewParams['tmpClosingTime'] = '';
            previewParams['retpolicy'] = 0;

            delete previewParams.salesContract;
            delete previewParams.bidCreditLimit;
            delete previewParams.badRatingRatio;
            delete previewParams.minBidRating;
            delete previewParams.markdown;

            if (productData) {
                if (config.get('env') === 'development') {
                    proxyConfig = null;
                }

                let now = new Date();
                now.setDate(now.getDate() + productData.duration);
                let tmpClosingYMD = moment(now).format('yyyy-MM-DD');

                let location = constants.PREFECTURE.find((x) => x.value === productData.location);
                if (!location) {
                    location = '';
                } else {
                    location = location.display;
                }
                // PREVIEW
                previewParams = {
                    ...previewParams,
                    Title: productData.product_yahoo_title,
                    category: productData.yahoo_auction_category_id,
                    salesmode: productData.sales_mode,
                    StartPrice: productData.start_price,
                    BidOrBuyPrice: productData.bid_or_buy_price != '0' ? productData.bid_or_buy_price : '',
                    istatus: productData.status,
                    istatus_comment: productData.status_comment,
                    Quantity: productData.quantity,
                    Duration: productData.duration,
                    ClosingTime: productData.closing_time,
                    // Tạo ra từ Duration + ngày hiện tại
                    tmpClosingYMD: tmpClosingYMD,
                    ClosingYMD: tmpClosingYMD,
                    //====
                    retpolicy: productData.retpolicy,
                    retpolicy_comment: productData.retpolicy_comment,
                    minBidRating: productData.min_bid_rating, // 0 or 1
                    badRatingRatio: productData.bad_rating_ratio,
                    bidCreditLimit: productData.bid_credit_limit,
                    AutoExtension: productData.auto_extension,
                    numResubmit: productData.num_resubmit,
                    // ReservePrice: productData.reserve_price,

                    Description: productData.description,
                    Description_rte: productData.description,

                    // Ship
                    shiptime: productData.ship_time,
                    shipping: productData.shipping,
                    loc_cd: productData.location,
                    location: location,

                    shipname1: productData.ship_name1,
                    shipfee1: productData.ship_fee1,
                    shipname2: productData.ship_name2,
                    shipfee2: productData.ship_fee2,
                    shipname3: productData.ship_name3,
                    shipfee3: productData.ship_fee3,
                    shipschedule: productData.ship_schedule,

                    // Amount
                    featuredAmount: productData.featured_amount,
                    BoldFaceCharge: productData.bold,
                    HighlightListingCharge: productData.highlight,
                    GiftIconName: productData.gift,
                    WrappingIconCharge: productData.wrapping,
                };
            }
            // salesContract
            // bidCreditLimit
            // badRatingRatio
            // minBidRating
            // markdown

            let headers = {
                cookie,
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
                origin: 'https://auctions.yahoo.co.jp',
                referer: 'https://auctions.yahoo.co.jp/sell/jp/show/resubmit?aID=' + aID,
                authority: 'auctions.yahoo.co.jp',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            let payload = Qs.stringify(previewParams);

            let resPreview = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/show/preview`, payload, {
                headers,
                proxy: proxyConfig,
            });

            // Fs.writeFileSync('step2.html', resPreview.data);

            // Fs.writeFileSync('preview-resubmit.html', resPreview.data);
            let mgc = /<input type="hidden" name="mgc" value="(.*)">/.exec(resPreview.data);
            if (mgc == null) {
                console.log(' ========== ERROR =========');
                let $Preview = cheerio.load(resPreview.data);
                let message = $Preview('.decErrorBox__title').text().split('\n')[0];
                return {
                    status: 'ERROR',
                    statusMessage: message,
                };
            }

            $ = cheerio.load(resPreview.data);
            let form_node_submit = $('form[name="auction"]').find('input');
            let submitParams = {};
            for (const nodeInput of form_node_submit) {
                let name = nodeInput.attribs['name'];
                let value = nodeInput.attribs['value'];
                if (name) {
                    submitParams[name] = value;
                }
            }
            submitParams.ClosingTime = previewParams.tmpClosingTime;
            payload = Qs.stringify(submitParams);
            let resSubmit = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/config/submit`, payload, {
                headers,
                proxy: proxyConfig,
            });
            // Fs.writeFileSync('submit-resubmit.html', resSubmit.data);
            // Fs.writeFileSync('step3.html', resSubmit.data);

            $ = cheerio.load(resSubmit.data);
            if (resSubmit.data.includes('以下の商品の出品手続きが完了しました。ご利用ありがとうございました。')) {
                console.log(' =========== Upload Product Auction SUCCESS ============= ');
                return {
                    status: 'SUCCESS',
                    aID: submitParams.aID,
                    thumbnail: submitParams.ImageFullPath1,
                };
            } else if (resSubmit.data.includes('仮出品とは、出品手続きされたオークションを、Yahoo! JAPANが確認させていただくためのものです。')) {
                console.log(' =========== Upload Product Auction SUCCESS ============= ');
                return {
                    status: 'SUCCESS',
                    aID: submitParams.aID,
                    thumbnail: submitParams.ImageFullPath1,
                };
            } else {
                console.log(' =========== Upload Product Auction ERROR ============= ');
                let message = $('strong').text();
                console.log(message);
                return {
                    status: 'ERROR',
                    statusMessage: message,
                };
            }
        } catch (error) {
            return {
                status: 'ERROR',
                statusMessage: error.message,
            };
        }
    }

    static async getProductAuctionEnded(usernameYahoo, cookie, proxy, getAidOnly, accountYahoo, isEmit) {
        let listProduct = [];
        try {
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            if (config.get('env') === 'development') {
                proxyConfig = null;
            }
            let response = await axios.get('https://auctions.yahoo.co.jp/closeduser/jp/show/mystatus?select=closed&hasWinner=1', {
                headers: {
                    cookie,
                },
                proxy: proxyConfig,
                timeout: 60 * 1000,
            });

            // Fs.writeFileSync(usernameYahoo + ' - preview.html', response.data);
            let $ = cheerio.load(response.data);

            let rowTable = $('#acWrContents > div > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table:nth-child(6) > tbody > tr');
            for (const row of rowTable) {
                let aID = $(row).find('td:nth-child(2)').text().trim();
                let title = $(row).find('td:nth-child(3)').text().replace('未使用', '').replace('...', '').trim();
                let idBuyer = $(row).find('td:nth-child(6)').text().trim().replace('-', '');
                let time_end = $(row).find('td:nth-child(5)').text().trim();
                let price_end = $(row).find('td:nth-child(4)').text().trim().replace(/\D+/g, '').replace('-', '');
                let progress_message = $(row).find('td:nth-child(7)').text();
                let check_progress = $(row).find('td:nth-child(7) > p > img');
                if (check_progress.length > 0) {
                    progress_message = `<img src="https://s.yimg.jp/images/auct/template/ui/auc_mod/ic_6002.gif" alt="落札者" width="16" height="16">` + progress_message;
                }
                if (aID && aID !== '商品ID' && aID.trim() !== '' && aID.length > 5) {
                    listProduct.push({ aID, idBuyer, time_end, price_end, title, progress_message });
                }
            }
            if (getAidOnly) {
                return listProduct;
            }
            if (isEmit) {
                SocketIOService.emitData(accountYahoo.user_id, {
                    type: 'ENDED',
                    isLoading: true,
                    progress: 0,
                    total: listProduct.length,
                });
            }

            // Get detail info
            for (let i = 0; i < listProduct.length; i++) {
                try {
                    let product = listProduct[i];
                    let url = `https://contact.auctions.yahoo.co.jp/seller/top?aid=${product.aID}&syid=${usernameYahoo}&bid=${product.idBuyer}`;
                    response = await axios.get(url, {
                        headers: {
                            cookie,
                        },
                        proxy: proxyConfig,
                        timeout: 30 * 1000,
                    });
                    $ = cheerio.load(response.data);
                    //message
                    try {
                        let listMessage = [];
                        let container = $('#messagelist');
                        if (container && container[0] && container[0].children && container[0].children.length > 0) {
                            for (const children of container[0].children) {
                                let classx = $(children).attr('class');
                                let dataM = null;
                                if (classx === 'ptsPartner') {
                                    dataM = {
                                        type: 'buyer',
                                        comment: $(children).find('#body').text().trim(),
                                        yahoo_id: $(children).find('#buyerid').text().trim(),
                                        created_at: $(children).find('.decTime').text().trim(),
                                    };
                                    listMessage.push(dataM);
                                } else if (classx === 'ptsOwn') {
                                    dataM = {
                                        type: 'seller',
                                        comment: $(children).find('#body').text().trim(),
                                        yahoo_id: $(children).find('#sellerid').text().trim(),
                                        created_at: $(children).find('.decTime').text().trim(),
                                    };
                                    listMessage.push(dataM);
                                }
                            }
                        }
                        product.message_list = listMessage;
                    } catch (error) {}
                    // Ship address
                    try {
                        let shipInfo = '';
                        //td.decInTblCel > div. > table > tbody > tr:nth-child(1)
                        let shipInfoNode = $('div.acMdTradeInfo > div > div.libJsExpandBody.ptsMsgWr.mL10.mR10.mB10 > div.libTableCnfTop.decTableCnfBod > table > tbody > tr > td > div > table > tbody > tr');
                        if (shipInfoNode && shipInfoNode.length > 0) {
                            for (const info of shipInfoNode) {
                                shipInfo += $(info).find('td').text().trim() + '</br>';
                            }
                        }
                        shipInfo = shipInfo.trim();
                        product.ship_info = shipInfo;
                    } catch (error) {}

                    // product_buy_count
                    try {
                        let productCountNode = $('#acConHeader > div.acMdItemInfo.libItemInfo > dl > dd.decPrice > span').text();
                        if (productCountNode) {
                            let product_buy_count = productCountNode.replace(/\D+/g, '');
                            if (product_buy_count) {
                                product.product_buy_count = product_buy_count;
                            }
                        }
                    } catch (error) {}

                    // Progress status
                    try {
                        let progress = 'null';
                        let classStatusNode = $('div.acMdStatusImage > ul.acMdStatusImage__status');
                        let classText = classStatusNode.attr('class');
                        switch (classText) {
                            case 'acMdStatusImage__status acMdStatusImage__status--st05 acMdStatusImage__status--current05':
                                progress = '受取連絡';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st04 acMdStatusImage__status--current04':
                                progress = '受取連絡';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st04 acMdStatusImage__status--current04 acMdStatusImage__status--end acMdStatusImage__status--complete':
                                progress = '受取連絡';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st05 acMdStatusImage__status--current05 acMdStatusImage__status--end acMdStatusImage__status--complete':
                                progress = '受取連絡';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st04 acMdStatusImage__status--current02':
                                progress = 'お支払い';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st05 acMdStatusImage__status--current02':
                                progress = '送料連絡';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st04 acMdStatusImage__status--current03':
                                progress = '発送連絡';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st05 acMdStatusImage__status--current03':
                                progress = 'お支払い';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st04 acMdStatusImage__status--current01':
                                progress = '取引情報';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st05 acMdStatusImage__status--current01':
                                progress = '取引情報';
                                break;
                            case 'acMdStatusImage__status acMdStatusImage__status--st05 acMdStatusImage__status--current04':
                                progress = '発送連絡';
                                break;
                        }
                        // Số tiền nhận thực tế
                        if (progress === '発送連絡' || progress === '受取連絡') {
                            if (!accountYahoo.cookie_aucpay) {
                                let result = await AuctionYahooService.getCookie(accountYahoo, proxy, true);
                                if (result.status === 'SUCCESS') {
                                    accountYahoo.cookie_aucpay = result.cookie;
                                    await accountYahoo.save();
                                }
                            }
                            if (accountYahoo.cookie_aucpay) {
                                let nodeAmountActual = $('div.acMdTradeInfo > div > div.libJsExpandBody.ptsMsgWr.mL10.mR10.mB10 > div:nth-child(2) > table > tbody > tr > td > div > table > tbody > tr > td > div > a');
                                try {
                                    if (nodeAmountActual && nodeAmountActual.attr('href')) {
                                        let url_get_amount = nodeAmountActual.attr('href');
                                        let response_get_amount = await axios.get(url_get_amount, {
                                            headers: {
                                                cookie: accountYahoo.cookie_aucpay,
                                            },
                                            proxy: proxyConfig,
                                        });
                                        if (response_get_amount && response_get_amount.status === 200) {
                                            let $$ = cheerio.load(response_get_amount.data);
                                            let node_amount_actual = $$('#rcvdtl > ul > li.decTotal > dl:nth-child(1) > dd');
                                            if (node_amount_actual) {
                                                let amount_actual = node_amount_actual.text().match(/\d+/)[0];
                                                product.amount_actual = amount_actual;
                                            }
                                        }
                                    }
                                } catch (error) {}
                            }
                            if (!product.amount_actual) {
                                let result = await AuctionYahooService.getCookie(accountYahoo, proxy, true);
                                if (result.status === 'SUCCESS') {
                                    accountYahoo.cookie_aucpay = result.cookie;
                                    await accountYahoo.save();
                                }
                                if (accountYahoo.cookie_aucpay) {
                                    let nodeAmountActual = $('div.acMdTradeInfo > div > div.libJsExpandBody.ptsMsgWr.mL10.mR10.mB10 > div:nth-child(2) > table > tbody > tr > td > div > table > tbody > tr > td > div > a');
                                    try {
                                        if (nodeAmountActual && nodeAmountActual.attr('href')) {
                                            let url_get_amount = nodeAmountActual.attr('href');
                                            let response_get_amount = await axios.get(url_get_amount, {
                                                headers: {
                                                    cookie: accountYahoo.cookie_aucpay,
                                                },
                                                proxy: proxyConfig,
                                            });
                                            if (response_get_amount && response_get_amount.status === 200) {
                                                let $$ = cheerio.load(response_get_amount.data);
                                                let node_amount_actual = $$('#rcvdtl > ul > li.decTotal > dl:nth-child(1) > dd');
                                                if (node_amount_actual) {
                                                    let amount_actual = node_amount_actual.text().match(/\d+/)[0];
                                                    product.amount_actual = amount_actual;
                                                }
                                            }
                                        }
                                    } catch (error) {}
                                }
                            }
                        }

                        // Số tiền nhận dự kiến:
                        if (progress === 'お支払い') {
                            progress = 'お支払い';
                            let nodeAmountExpected = $('div.acMdTradeInfo > div > div.libJsExpandBody.ptsMsgWr.mL10.mR10.mB10 > div:nth-child(2) > table > tbody > tr > td > div > table > tbody > tr:nth-child(2) > td');
                            let amount_expected = 0;
                            if (nodeAmountExpected.text()) {
                                amount_expected = nodeAmountExpected.text().match(/\d+/)[0];
                                if (amount_expected) {
                                    product.amount_expected = amount_expected;
                                }
                            }
                        }

                        product.progress = progress;
                    } catch (error) {}

                    // Check gộp thanh toán
                    try {
                        let buttonJoinPayment = $('div.acMdTradeBtn > a.libBtnBlueL');
                        if (buttonJoinPayment && buttonJoinPayment.length > 0 && buttonJoinPayment.text() === 'まとめて取引をはじめる') {
                            product.is_join_bill = true;
                        } else {
                            product.is_join_bill = false;
                        }
                    } catch (error) {}

                    if (isEmit) {
                        SocketIOService.emitData(accountYahoo.user_id, {
                            type: 'ENDED',
                            isLoading: true,
                            progress: (i + 1) / 2,
                            total: listProduct.length,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            // Get count buyer
            // for (let i = 0; i < listProduct.length; i++) {
            //     let product = listProduct[i];
            //     let url = `https://page.auctions.yahoo.co.jp/jp/auction/${product.aID}`;
            //     response = await axios.get(url, {
            //         headers: {
            //             cookie,
            //         },
            //         proxy: proxyConfig,
            //     });
            //     $ = cheerio.load(response.data);
            //     //message
            //     let buyer_count = $('#l-sub > div.ProductInformation > ul > li:nth-child(1) > div > ul > li:nth-child(1) > dl > dd').text();
            //     if (buyer_count) {
            //         buyer_count = buyer_count.replace(/\D+/g, '');
            //         if (buyer_count) {
            //             product.buyer_count = buyer_count;
            //         }
            //     }
            //     console.log(' ################## buyer_count: ', buyer_count);
            // }
        } catch (error) {
            console.log(' ### Error AuctionYahooService getProductAuctionEnded ', error);
        }
        return listProduct;
    }

    static async getProductAuctionFinished(cookie, proxy) {
        let listProduct = [];
        try {
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            if (config.get('env') === 'development') {
                proxyConfig = null;
            }
            let response = await axios.get('https://auctions.yahoo.co.jp/closeduser/jp/show/mystatus?select=closed&hasWinner=0', {
                headers: {
                    cookie,
                },
                proxy: proxyConfig,
                timeout: 60 * 1000,
            });

            let $ = cheerio.load(response.data);
            let rowTable = $('#acWrContents > div > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table:nth-child(6) > tbody > tr');
            for (const row of rowTable) {
                let aID = $(row).find('td:nth-child(2)').text().trim();
                let title = $(row).find('td:nth-child(3)').text().replace('未使用', '').replace('...', '').trim();
                let price_end = $(row).find('td:nth-child(4)').text().trim().replace(/\D+/g, '');
                let time_end = $(row).find('td:nth-child(5)').text().trim().replace('-', '');

                if (aID && aID !== '商品ID' && aID.trim() !== '' && aID.length > 5) {
                    listProduct.push({
                        aID,
                        price_end,
                        time_end,
                        title,
                    });
                }
            }
        } catch (error) {
            console.log(' ### Error AuctionYahooService getProductAuctionEnded ', error);
        }
        return listProduct;
    }

    static async getProductAuctionSelling(cookie, proxy) {
        let proxyConfig = {
            host: proxy.host,
            port: proxy.port,
            auth: {
                username: proxy.username,
                password: proxy.password,
            },
        };
        if (config.get('env') === 'development') {
            proxyConfig = null;
        }

        let response = await axios.get('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling', {
            headers: {
                cookie,
            },
            proxy: proxyConfig,
            timeout: 60 * 1000,
        });
        let $ = cheerio.load(response.data);

        let rowTable = $('#acWrContents > div > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr');
        let listProduct = [];
        for (const row of rowTable) {
            let aID = $(row).find('td:nth-child(1)').text();
            let title = $(row).find('td:nth-child(2)').text().replace('未使用', '').replace('...', '').trim();
            let price_end = $(row).find('td:nth-child(3)').text().trim().replace(/\D+/g, '');
            let negotiate = $(row).find('td:nth-child(4)').text().trim().replace('-', '');
            let flower = $(row).find('td:nth-child(5)').text().trim().replace(/\D+/g, '');
            let buyer_count = $(row).find('td:nth-child(6)').text().trim().replace(/\D+/g, '');
            let idBuyer = $(row).find('td:nth-child(7)').text().trim().replace('-', '');
            let time_end = $(row).find('td:nth-child(8)').text().trim().replace('-', '');

            if (aID && aID !== '商品ID' && aID.trim() !== '') {
                listProduct.push({
                    aID,
                    price_end,
                    negotiate,
                    flower,
                    buyer_count,
                    idBuyer,
                    time_end,
                    title,
                });
            }
        }
        return listProduct;
    }

    static async getCookie(account, proxy, is_get_cookie_auction) {
        try {
            console.log(' ==== Start login Yahoo ====');

            let sock5 = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
            const newProxyUrl = await proxyChain.anonymizeProxy(sock5);
            let args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--window-position=0,0', '--ignore-certifcate-errors', '--ignore-certifcate-errors-spki-list', '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"', `--proxy-server=${newProxyUrl}`];

            if (config.get('env') === 'development') {
                args.pop();
            }

            // if (Fs.existsSync('./tmp')) {
            //     Fs.rmdirSync('./tmp', { recursive: true });
            // }
            const options = {
                args,
                headless: true,
                ignoreHTTPSErrors: true,
                // userDataDir: './tmp',
            };

            const browser = await puppeteer.launch(options);
            const page = await browser.newPage();
            let urlLogin = 'https://login.yahoo.co.jp/config/login?auth_lv=pw&.lg=jp&.intl=jp&.src=auc&.done=https%3A%2F%2Fauctions.yahoo.co.jp%2F&sr_required=birthday%20gender%20postcode%20deliver';
            if (is_get_cookie_auction) {
                urlLogin = 'https://login.yahoo.co.jp/config/login?auth_lv=capin&.src=pay&.done=https%3A%2F%2Faucpay.yahoo.co.jp%2Fdetail-front%2FPaymentDetailList&.crumb=0';
            }
            let timeout = 5 * 60 * 1000;
            // urlLogin = 'http://lumtest.com/myip.json';
            await page.goto(urlLogin, { waitUntil: 'load', timeout: timeout });

            page.setDefaultNavigationTimeout(0);
            await Utils.sleep(1000);

            console.log(' ### username ');
            const username = await page.waitForSelector('#username');
            await username.type(account.yahoo_id);
            await Utils.sleep(1000);

            async function waitAndClick(selector) {
                await page.evaluate((selector) => document.querySelector(selector).click(), selector);
            }

            console.log(' ##### btnNext ');
            await waitAndClick('#btnNext');

            // await page.click('#btnNext');

            console.log(' ### password');
            const password = await page.waitForSelector('#passwd');
            await password.type(account.password);
            await Utils.sleep(1000);

            console.log(' #### Submit');
            await waitAndClick('#btnSubmit');
            const find = await page.waitForSelector('input[type=text]', { timeout: 30000 });
            await Utils.sleep(1000);
            const cookies = await page.cookies();

            if (cookies.length > 4) {
                try {
                    await browser.close();
                } catch (error) {}
                console.log(' ======== SUCCESS ======= ');
                let cookie = cookies
                    .map(function (c) {
                        return `${c.name}=${c.value}`;
                    })
                    .join('; ');
                return {
                    status: 'SUCCESS',
                    cookie,
                };
            } else {
                const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                // Fs.writeFileSync('preview.html', data);
                console.log(' ======== Failse ======= ');
                try {
                    await browser.close();
                } catch (error) {}
                return {
                    status: 'ERROR',
                    message: 'エラー。 管理者に連絡する ',
                };
            }
        } catch (error) {
            console.log(' ##### error: ', error);
            return {
                status: 'ERROR',
                message: 'エラー。 管理者に連絡する ',
            };
        }
    }

    static async deleteBuyer(cookie, proxy, aID, idBuyer, reason = 'seller') {
        // reason: seller or winner
        try {
            let headers = {
                cookie,
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
                origin: 'https://auctions.yahoo.co.jp',
                authority: 'auctions.yahoo.co.jp',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'content-type': 'application/x-www-form-urlencoded',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            // Get crumb
            let dataPreview = {
                aID,
                bidder: idBuyer,
                action: 'rmwinner',
                cc: 'jp',
                winnerRating: 1,
                advance: 'on',
                reason: reason,
                confirm: '削除',
            };
            let payloadPreview = Qs.stringify(dataPreview);
            let resPreview = await axios.post('https://auctions.yahoo.co.jp/jp/show/remove_winner', payloadPreview, { headers, proxy: proxyConfig });

            // Fs.writeFileSync('preview.html', resPreview.data);
            let $ = cheerio.load(resPreview.data);
            let crumb = $('input[name="crumb"]').val();
            if (crumb && crumb.trim() !== '') {
                let dataSubmit = {
                    aID,
                    bidder: idBuyer,
                    reason,
                    crumb,
                    winnerRating: 1,
                    advance: 'on',
                };
                let payload = Qs.stringify(dataSubmit);

                let resSubmit = await axios.post('https://auctions.yahoo.co.jp/jp/config/remove_winner', payload, { headers, proxy: proxyConfig });
                if (resSubmit.data.includes('以下のとおり落札者を削除しました')) {
                    return {
                        status: 'SUCCESS',
                    };
                } else {
                    $ = cheerio.load(resSubmit.data);
                    let message = $('strong').text();
                    return {
                        status: 'ERROR',
                        message: message,
                    };
                }
            } else {
                return {
                    status: 'ERROR',
                    message: 'crumb not found.!',
                };
            }
        } catch (error) {
            console.log(' #### AuctionYahooService stopTransaction: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }

    static async sendMessage(cookie, proxy, aID, usernameYahoo, idBuyer, message) {
        try {
            // console.log('### cookie: ', cookie);
            // console.log('### proxy: ', proxy);
            // console.log('### aID: ', aID);
            // console.log('### usernameYahoo: ', usernameYahoo);
            // console.log('### idBuyer: ', idBuyer);
            // console.log('### message: ', message);

            let headers = {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                Origin: 'https://contact.auctions.yahoo.co.jp',
                Host: 'contact.auctions.yahoo.co.jp',

                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };

            let urlPreview = `https://contact.auctions.yahoo.co.jp/seller/top?aid=${aID}&syid=${usernameYahoo}&bid=${idBuyer}`;
            let resPreview = await axios.get(urlPreview, { headers, proxy: proxyConfig });
            let $ = cheerio.load(resPreview.data);
            let oid = $('#oid').val();
            let crumb = $('#crumb').val();
            if (oid && crumb) {
                let dataSubmit = {
                    oid,
                    syid: usernameYahoo,
                    aid: aID,
                    bid: idBuyer,
                    crumb,
                    body: message,
                };
                let payload = Qs.stringify(dataSubmit);
                let resSubmit = await axios.post('https://contact.auctions.yahoo.co.jp/message/submit', payload, {
                    headers,
                    proxy: proxyConfig,
                });
                if (resSubmit.data.Result != null && resSubmit.data.Result != {}) {
                    return {
                        status: 'SUCCESS',
                    };
                } else {
                    return {
                        status: 'ERROR',
                        message: '...!',
                    };
                }
            } else {
                return {
                    status: 'ERROR',
                    message: 'crumb and oid not found.!',
                };
            }
        } catch (error) {
            console.log(' #### AuctionYahooService sendMessage: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }

    static async sendRating(cookie, proxy, aID, idBuyer, ratingData) {
        try {
            let headers = {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            let urlGetCrumb = `https://auctions.yahoo.co.jp/jp/show/leavefeedback?t=${idBuyer}&aID=${aID}&nr=1`;
            let resGetCrumb = await axios.get(urlGetCrumb, { headers, proxy: proxyConfig });
            let $ = cheerio.load(resGetCrumb.data);
            let crumb = $('input[name="crumb"]').val();
            if (crumb) {
                let dataPreview = {
                    t: idBuyer,
                    u: '',
                    target: idBuyer,
                    aID: aID,
                    crumb: crumb,
                    isBuyer: '',
                    isSeller: 1,
                    own: '',
                    isResponse: '',
                    isRevision: '',
                    rating: ratingData.rating,
                    formComment: ratingData.content,
                };
                let payloadPreview = Qs.stringify(dataPreview);
                let resPreview = await axios.post('https://auctions.yahoo.co.jp/jp/preview/leavefeedback', payloadPreview, {
                    headers,
                    proxy: proxyConfig,
                });
                if (resPreview.data.includes('以下の内容で評価を公開します。内容をご確認ください。')) {
                    let dataSubmit = {
                        t: idBuyer,
                        u: '',
                        aID: aID,
                        previewComment: ratingData.content,
                        rating: ratingData.rating,
                        isRevison: '',
                        isResponse: '',
                        own: '',
                        isBuyer: '',
                        isSeller: 1,
                        crumb: crumb,
                    };

                    let payloadSubmit = Qs.stringify(dataSubmit);
                    let resSubmit = await axios.post('https://auctions.yahoo.co.jp/jp/submit/leavefeedback', payloadSubmit, {
                        headers,
                        proxy: proxyConfig,
                    });
                    if (resSubmit.data.includes('落札者の評価')) {
                        return {
                            status: 'SUCCESS',
                        };
                    } else {
                        $ = cheerio.load(resSubmit.data);
                        return {
                            status: 'ERROR',
                            message: 'SUBMIT: ' + $('strong').text(),
                        };
                    }
                } else {
                    $ = cheerio.load(resPreview.data);
                    return {
                        status: 'ERROR',
                        message: 'PREVIEW: ' + $('body > table:nth-child(4) > tbody > tr > td > form:nth-child(1) > table:nth-child(11) > tbody > tr:nth-child(7) > td > table > tbody > tr > td > table').text(),
                    };
                }
            } else {
                return {
                    status: 'ERROR',
                    message: 'crumb not found.!',
                };
            }
        } catch (error) {
            console.log(' #### AuctionYahooService sendRating: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }

    static async cancelAuction(aID, cookie, proxy, isHaveBuyer) {
        let proxyConfig = {
            host: proxy.host,
            port: proxy.port,
            auth: {
                username: proxy.username,
                password: proxy.password,
            },
        };
        if (config.get('env') === 'development') {
            proxyConfig = null;
        }
        let response = await axios.get(`https://page.auctions.yahoo.co.jp/jp/show/cancelauction?aID=${aID}`, {
            headers: {
                cookie,
            },
            proxy: proxyConfig,
        });
        // Fs.writeFileSync('preview.html', response.data);
        let $ = cheerio.load(response.data);
        let crumb = $('input[name="crumb"]').val();
        if (!crumb) {
            return {
                status: 'ERROR',
                message: 'Crumb not found.!',
            };
        }
        let payload = {
            aID: aID,
            crumb: crumb,
            cancel_fee: 'none',
            confirm: '取り消す',
        };

        if (isHaveBuyer) {
            delete payload.cancel_fee;
        }
        payload = Qs.stringify(payload);
        response = await axios.post(`https://page.auctions.yahoo.co.jp/jp/config/cancelauction`, payload, {
            headers: {
                cookie,
                'content-type': 'application/x-www-form-urlencoded',
            },
            proxy: proxyConfig,
        });
        if (response.status === 200 && response.data.includes('このオークションは終了しています')) {
            return {
                status: 'SUCCESS',
            };
        } else {
            return {
                status: 'ERROR',
                message: 'ERROR: ' + response.status,
            };
        }
    }

    static async deleteProductFinished(aID, cookie, proxy) {
        let proxyConfig = {
            host: proxy.host,
            port: proxy.port,
            auth: {
                username: proxy.username,
                password: proxy.password,
            },
        };
        if (config.get('env') === 'development') {
            proxyConfig = null;
        }
        let response = await axios.get(`https://auctions.yahoo.co.jp/closeduser/jp/show/mystatus?select=closed&hasWinner=0`, {
            headers: {
                cookie,
            },
            proxy: proxyConfig,
        });
        // Fs.writeFileSync('preview.html', response.data);
        let $ = cheerio.load(response.data);
        let crumb = $('input[name=".crumb"]').val();
        if (!crumb) {
            return {
                status: 'ERROR',
                message: 'Crumb not found.!',
            };
        }
        if (typeof aID === 'object') {
            let result = [];
            for (const aid of aID) {
                let payload = {
                    action: 'delete',
                    hasWinner: '0',
                    '.done': 'https://auctions.yahoo.co.jp/closeduser/jp/show/mystatus?select=closed&hasWinner=0',
                    '.crumb': crumb,
                    'aidlist[]': aid,
                };
                payload = Qs.stringify(payload);
                response = await axios.post(`https://auctions.yahoo.co.jp/closeduser/jp/uconfig/removeclosed`, payload, {
                    headers: {
                        cookie,
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    proxy: proxyConfig,
                });
                if (response.status === 200 && response.data.includes('チェックした商品を終了分から削除しました')) {
                    result.push({
                        status: 'SUCCESS',
                    });
                } else {
                    result.push({
                        status: 'ERROR',
                        message: 'ERROR: ' + response.status,
                    });
                }
            }
            return {
                status: 'SUCCESS',
                result,
            };
        } else {
            let payload = {
                action: 'delete',
                hasWinner: '0',
                '.done': 'https://auctions.yahoo.co.jp/closeduser/jp/show/mystatus?select=closed&hasWinner=0',
                '.crumb': crumb,
                'aidlist[]': aID,
            };
            payload = Qs.stringify(payload);
            response = await axios.post(`https://auctions.yahoo.co.jp/closeduser/jp/uconfig/removeclosed`, payload, {
                headers: {
                    cookie,
                    'content-type': 'application/x-www-form-urlencoded',
                },
                proxy: proxyConfig,
            });
            if (response.status === 200 && response.data.includes('チェックした商品を終了分から削除しました')) {
                return {
                    status: 'SUCCESS',
                };
            } else {
                return {
                    status: 'ERROR',
                    message: 'ERROR: ' + response.status,
                };
            }
        }
    }

    static async getDetailInfoProductEnded(aID_Product, cookie, proxy) {
        try {
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            if (config.get('env') === 'development') {
                proxyConfig = null;
            }
            let resProduct = await axios.get(`https://auctions.yahoo.co.jp/sell/jp/show/resubmit?aID=${aID_Product}`, {
                headers: {
                    cookie,
                },
                proxy: proxyConfig,
            });
            let $ = cheerio.load(resProduct.data);

            let aID = $('input[name="aID"]').val();
            let oldAID = $('input[name="oldAID"]').val();
            let mode = $('input[name="mode"]').val();
            let category = $('input[name="category"]').val();

            let md5 = $('input[name="md5"]').val();
            let crumb = $('input[name=".crumb"]').val();
            let retpolicy_comment = $('input[name="retpolicy_comment"]').val();
            let title = $('#fleaTitleForm').val();

            let istatus = $('select[name="istatus"]').val();

            let Description = $('input[name="Description"]').val();
            let loc_cd = $('select[name="loc_cd"]').val();
            let auc_shipping_who = $('#auc_shipping_who').val();
            let shipschedule = $('#shipschedule').val();
            let StartPrice = $('#auc_StartPrice_auction').val();

            let Duration = $('#Duration').val();
            let tmpClosingYMD = $('#tmpClosingYMD').val();
            let tmpClosingTime = $('#tmpClosingTime').val();

            let thumbNail = $('#thumbNail').val();
            let img_crumb = $('#img_crumb').val();

            let ImageFullPath1 = $('#auc_image_fullpath1').val();
            let ImageFullPath2 = $('#auc_image_fullpath2').val();
            let ImageFullPath3 = $('#auc_image_fullpath3').val();
            let ImageFullPath4 = $('#auc_image_fullpath4').val();
            let ImageFullPath5 = $('#auc_image_fullpath5').val();
            let ImageFullPath6 = $('#auc_image_fullpath6').val();
            let ImageFullPath7 = $('#auc_image_fullpath7').val();
            let ImageFullPath8 = $('#auc_image_fullpath8').val();
            let ImageFullPath9 = $('#auc_image_fullpath9').val();
            let ImageFullPath10 = $('#auc_image_fullpath10').val();
            let ypoint = $('input[name="ypoint"]').val();

            let images = [ImageFullPath1, ImageFullPath2, ImageFullPath3, ImageFullPath4, ImageFullPath5, ImageFullPath6, ImageFullPath7, ImageFullPath8, ImageFullPath9, ImageFullPath10];
            images = images.filter((item) => item && item.trim() !== '');
            let productData = {
                aID,
                oldAID,
                images,
                product_model: mode,
                yahoo_auction_category_id: category,
                md5,
                crumb,
                retpolicy_comment,
                product_yahoo_title: title,
                status: istatus,
                description: Description,
                location: loc_cd,
                shipping: auc_shipping_who,
                ship_schedule: shipschedule,
                start_price: StartPrice,
                duration: Duration,
                tmpClosingTime,
                thumbNail,
                img_crumb,
                ypoint,
                tmpClosingYMD,
            };
            return productData;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async cancelTransaction(cookie, proxy, aID, usernameYahoo, idBuyer) {
        try {
            let headers = {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                Origin: 'https://contact.auctions.yahoo.co.jp',
                Host: 'contact.auctions.yahoo.co.jp',

                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };
            if (config.get('env') === 'development') {
                proxyConfig = null;
            }

            let urlPreview = `https://contact.auctions.yahoo.co.jp/seller/top?aid=${aID}&syid=${usernameYahoo}&bid=${idBuyer}`;
            let resPreview = await axios.get(urlPreview, { headers, proxy: proxyConfig });
            let $ = cheerio.load(resPreview.data);
            let oid = $('input[name="oid"]').val();
            let crumb = $('input[name=".crumb"]').val();
            if (oid && crumb) {
                let dataSubmit = {
                    oid,
                    syid: usernameYahoo,
                    aid: aID,
                    bid: idBuyer,
                    '.crumb': crumb,
                    checkRepay: 1,
                };
                let payload = Qs.stringify(dataSubmit);
                let resSubmit = await axios.post('https://contact.auctions.yahoo.co.jp/seller/escrowrepaysubmit', payload, {
                    headers,
                    proxy: proxyConfig,
                });

                if (resSubmit.data && resSubmit.data.includes('すべての取引が完了しました！またヤフオク!をご利用ください。')) {
                    return {
                        status: 'SUCCESS',
                    };
                } else {
                    // Fs.writeFileSync('CancelTransaction.html', resSubmit.data);
                    return {
                        status: 'ERROR',
                        message: '...!',
                    };
                }
            } else {
                return {
                    status: 'ERROR',
                    message: 'crumb and oid not found.!',
                };
            }
        } catch (error) {
            console.log(' #### AuctionYahooService cancelTransaction: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }

    static async setFeeShip(cookie, proxy, aID, usernameYahoo, idBuyer, set_ship_fee) {
        // reason: seller or winner
        try {
            let headers = {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                Origin: 'https://contact.auctions.yahoo.co.jp',
                Host: 'contact.auctions.yahoo.co.jp',

                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };

            if (config.get('env') === 'development') {
                proxyConfig = null;
            }

            let urlPreview = `https://contact.auctions.yahoo.co.jp/seller/top?aid=${aID}&syid=${usernameYahoo}&bid=${idBuyer}`;
            let resPreview = await axios.get(urlPreview, { headers, proxy: proxyConfig });
            let $ = cheerio.load(resPreview.data);
            let oid = $('#oid').val();
            let urlSetShip = $('input.libBtnBlueL').attr('onclick');
            urlSetShip = 'https://contact.auctions.yahoo.co.jp' + urlSetShip.replace("location.href='", '').replace("'", '');

            let resUrlSetShip = await axios.get(urlSetShip, { headers, proxy: proxyConfig });
            $ = cheerio.load(resUrlSetShip.data);
            let shipMethodName = $('input[name="shipMethodName"]').val();

            let crumb = $('input[name=".crumb"]').val();

            let paramsOverview = {
                aid: aID,
                syid: usernameYahoo,
                bid: idBuyer,
                oid,
                shipMethodName,
                '.crumb': crumb,
                shipChargeNumber1: set_ship_fee,
            };
            let urlShipOverview = 'https://contact.auctions.yahoo.co.jp/seller/shippreview';
            let resOverview = await axios.post(urlShipOverview, Qs.stringify(paramsOverview), { headers, proxy: proxyConfig });

            $ = cheerio.load(resOverview.data);
            crumb = $('input[name=".crumb"]').val();
            paramsOverview['.crumb'] = crumb;

            let urlShipSubmit = 'https://contact.auctions.yahoo.co.jp/seller/shipsubmit';
            let reSubmit = await axios.post(urlShipSubmit, Qs.stringify(paramsOverview), { headers, proxy: proxyConfig });
            if (reSubmit && reSubmit.data && reSubmit.data.includes('取引情報')) {
                return {
                    status: 'SUCCESS',
                };
            } else {
                Fs.writeFileSync('preview.html', reSubmit.data);
                return {
                    status: 'ERROR',
                    message: '...!',
                };
            }
        } catch (error) {
            console.log(' #### AuctionYahooService stopTransaction: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }

    static async contactShip(cookie, proxy, aID, usernameYahoo, idBuyer) {
        // reason: seller or winner
        try {
            let headers = {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                Origin: 'https://contact.auctions.yahoo.co.jp',
                Host: 'contact.auctions.yahoo.co.jp',

                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };

            if (config.get('env') === 'development') {
                proxyConfig = null;
            }

            let urlPreview = `https://contact.auctions.yahoo.co.jp/seller/top?aid=${aID}&syid=${usernameYahoo}&bid=${idBuyer}`;
            let resPreview = await axios.get(urlPreview, { headers, proxy: proxyConfig });
            let $ = cheerio.load(resPreview.data);
            let urlSetShip = $('input.libBtnBlueL').attr('onclick');
            urlSetShip = 'https://contact.auctions.yahoo.co.jp' + urlSetShip.split("location.href='")[1].replace("'", '');
            let resUrlSetShip = await axios.get(urlSetShip, { headers, proxy: proxyConfig });
            $ = cheerio.load(resUrlSetShip.data);
            let oid = $('input[name="oid"]').val();
            let crumb = $('input[name=".crumb"]').val();

            let paramsOverview = {
                aid: aID,
                syid: usernameYahoo,
                bid: idBuyer,
                oid,
                shipInvoiceNumReg: 1,
                shipInvoiceNumber1: '',
                shipUrl: '',
                '.crumb': crumb,
            };
            let urlShipOverview = 'https://contact.auctions.yahoo.co.jp/seller/preview';
            let resOverview = await axios.post(urlShipOverview, Qs.stringify(paramsOverview), { headers, proxy: proxyConfig });

            $ = cheerio.load(resOverview.data);
            crumb = $('input[name=".crumb"]').val();
            paramsOverview['.crumb'] = crumb;

            delete paramsOverview.shipUrl;
            delete paramsOverview.shipInvoiceNumber1;

            let urlShipSubmit = 'https://contact.auctions.yahoo.co.jp/seller/submit';
            let reSubmit = await axios.post(urlShipSubmit, Qs.stringify(paramsOverview), { headers, proxy: proxyConfig });
            if (reSubmit && reSubmit.data && reSubmit.data.includes('取引情報')) {
                return {
                    status: 'SUCCESS',
                };
            } else {
                Fs.writeFileSync('preview.html', reSubmit.data);
                return {
                    status: 'ERROR',
                    message: '...!',
                };
            }
        } catch (error) {
            console.log(' #### AuctionYahooService stopTransaction: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }

    static async setJoinBill(cookie, proxy, aID, usernameYahoo, idBuyer, is_join_bill, use_ship_origin, new_fee_ship_type, new_fee_ship_price) {
        // reason: seller or winner
        try {
            let headers = {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                Origin: 'https://contact.auctions.yahoo.co.jp',
                Host: 'contact.auctions.yahoo.co.jp',

                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };

            if (config.get('env') === 'development') {
                proxyConfig = null;
            }

            let urlPreview = `https://contact.auctions.yahoo.co.jp/seller/top?aid=${aID}&syid=${usernameYahoo}&bid=${idBuyer}`;
            let resPreview = await axios.get(urlPreview, { headers, proxy: proxyConfig });
            let $ = cheerio.load(resPreview.data);
            if (!is_join_bill) {
                let urlCancelJoinBill = $('#mBoxPay2 > div > input.libBtnRedL').attr('onclick');
                urlCancelJoinBill = 'https://contact.auctions.yahoo.co.jp' + urlCancelJoinBill.split("'")[1];
                console.log(urlCancelJoinBill);
                let resCancelJoinBill = await axios.get(urlCancelJoinBill, { headers, proxy: proxyConfig });
                if (resCancelJoinBill && resCancelJoinBill.data && resCancelJoinBill.data.includes('取引情報')) {
                    return {
                        status: 'SUCCESS',
                    };
                } else {
                    Fs.writeFileSync('cancel_join_bill_error.html', resCancelJoinBill.data);
                    return {
                        status: 'ERROR',
                        message: '...!',
                    };
                }
            } else {
                let urlJoinBill = $('div.acMdTradeBtn > a.libBtnBlueL').attr('href');
                urlJoinBill = 'https://contact.auctions.yahoo.co.jp' + urlJoinBill;
                console.log(urlJoinBill);
                let resCancelJoinBill = await axios.get(urlJoinBill, { headers, proxy: proxyConfig });
                $ = cheerio.load(resCancelJoinBill.data);
                let oid = $('input[name="oid"]').val();
                let _crumb = $('input[name="_crumb"]').val();
                let payload = {
                    shipUseParent: use_ship_origin ? 1 : 0,
                    shippingMethod: new_fee_ship_type,
                    shipChargeNumber: new_fee_ship_price,
                    aid: aID,
                    syid: usernameYahoo,
                    bid: idBuyer,
                    oid,
                    _crumb,
                    chargeForShipping: 1,
                };

                if (new_fee_ship_type === 'ヤフネコ!（ネコポス）' || new_fee_ship_type === 'ヤフネコ!（宅急便コンパクト）' || new_fee_ship_type === 'ヤフネコ!（宅急便）' || new_fee_ship_type === 'ゆうパケット（おてがる版）' || new_fee_ship_type === 'ゆうパック（おてがる版）') {
                    delete payload.shipChargeNumber;
                }

                let urlSetShipPreview = 'https://contact.auctions.yahoo.co.jp/seller/bundle/shippreview';
                let resSetShipPreview = await axios.post(urlSetShipPreview, Qs.stringify(payload), { headers, proxy: proxyConfig });

                // Fs.writeFileSync('resSetShipPreview.html', resSetShipPreview.data);

                $ = cheerio.load(resSetShipPreview.data);
                _crumb = $('input[name="_crumb"]').val();
                payload._crumb = _crumb;
                let urlSetShipSubmit = `https://contact.auctions.yahoo.co.jp/seller/bundle/shipsubmit`;
                let resSetShipSubmit = await axios.post(urlSetShipSubmit, Qs.stringify(payload), { headers, proxy: proxyConfig });
                if (resSetShipSubmit && resSetShipSubmit.data && resSetShipSubmit.data.includes('取引情報')) {
                    return {
                        status: 'SUCCESS',
                    };
                } else {
                    // Fs.writeFileSync('resSetShipSubmit.html', resSetShipSubmit.data);
                    return {
                        status: 'ERROR',
                        message: '...!',
                    };
                }
            }
        } catch (error) {
            console.log(' #### AuctionYahooService stopTransaction: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }

    static async rutTien(cookie, proxy, infoBank) {
        try {
            let headers = {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                origin: 'https://salesmanagement.yahoo.co.jp',
                referer: 'https://salesmanagement.yahoo.co.jp/list',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
            let proxyConfig = {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            };

            if (config.get('env') === 'development') {
                proxyConfig = null;
            }
            let $ = null;
            let resList = await axios.get('https://salesmanagement.yahoo.co.jp/list', { headers, proxy: proxyConfig });
            $ = cheerio.load(resList.data);
            let crumb = $('input[name=".crumb"]').val();
            let payload = {
                '.crumb': crumb,
            };
            let resPayoutConfirm = await axios.post('https://salesmanagement.yahoo.co.jp/payout_confirm', Qs.stringify(payload), { headers, proxy: proxyConfig });
            $ = cheerio.load(resPayoutConfirm.data);
            let backCurrentText = $('#yjMain > div.acMdPaymentInfo.mT30.mB40 > div.TransferDetails > div > div > div:nth-child(5) > div:nth-child(3) > span');
            let bankName = backCurrentText.trim().split('  ')[0];
            let bankBranch = backCurrentText.trim().split('  ')[1];
            let bankNumber = backCurrentText.trim().split('  ')[2];
            let bankUserName = backCurrentText.trim().split('  ')[3];
            console.log(' ####### backCurrentText: ', backCurrentText);
            console.log(' ####### bankName: ', bankName);
            console.log(' ####### bankBranch: ', bankBranch);
            console.log(' ####### bankNumber: ', bankNumber);
            console.log(' ####### bankUserName: ', bankUserName);

            //============ UPDATE BANK =============

            let resChangeBank = await axios.post('https://edit.wallet.yahoo.co.jp/config/wallet_trans_update?.done=https%3A%2F%2Fsalesmanagement.yahoo.co.jp%2Flist', {
                headers: {
                    cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                    origin: 'https://salesmanagement.yahoo.co.jp',
                    referer: 'https://salesmanagement.yahoo.co.jp/',
                    'Accept-Encoding': 'gzip, deflate, br',
                },
                proxy: proxyConfig,
            });

            // ============ Payout done =============
            payload = {
                ba: 579,
                '.crumb': 'a52d9ded336eb5298a25432c3c6a70c9665d6d42782ad25b98f74c86a6fb8fd6',
            };
            let resPayoutDone = await axios.post('https://salesmanagement.yahoo.co.jp/payout_done', Qs.stringify(payload), {
                headers: {
                    cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                    origin: 'https://salesmanagement.yahoo.co.jp',
                    referer: 'https://salesmanagement.yahoo.co.jp/payout_confirm',
                    'Accept-Encoding': 'gzip, deflate, br',
                },
                proxy: proxyConfig,
            });

            console.log(' ########### resPayoutDone: ', resPayoutDone);
            
            // ============ Payout Finish =============
            let resPayoutFinish = await axios.get(resPayoutDone.response.location, {
                headers: {
                    cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                    referer: 'https://salesmanagement.yahoo.co.jp/payout_confirm',
                    'Accept-Encoding': 'gzip, deflate, br',
                },
                proxy: proxyConfig,
            });

            $ = cheerio.load(resPayoutFinish.data);



        } catch (error) {
            console.log(' #### rutTien: ', error);
            return {
                status: 'ERROR',
                message: error.message,
            };
        }
    }
}
