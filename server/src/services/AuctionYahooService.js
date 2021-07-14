import FormData from 'form-data';
import axios from 'axios';
import Fs from 'fs';
import cheerio from 'cheerio';
import Qs from 'query-string';
import moment from 'moment';
import constants from '../constants';
import puppeteer from 'puppeteer';

export default class AuctionYahooService {

    static async uploadNewProduct(cookie, productData) {
        productData = {
            images: [
                'yahoo-products/60e8574c8d5f2b4ae81d148d/1625839552710_402104904.jpg',
                'yahoo-products/60e8574c8d5f2b4ae81d148d/1625839552747_538141642.jpg',
            ],
            product_yahoo_title: 'Product Test 123421 3231 123 21312312 321321 11111111111',
            yahoo_auction_category_id: '2084316144',
            start_price: '1000',
            bid_or_buy_price: '',
            status: 'new',
            status_comment: '',
            quantity: '1',
            duration: '3',
            closing_time: '18',
            retpolicy: '0',
            retpolicy_comment: '',
            min_bid_rating: '0',
            bad_rating_ratio: 'yes',
            bid_credit_limit: '0',
            auto_extension: 'yes',
            num_resubmit: '3',
            reserve_price: '',
            description: 'Destciption Test',
            ship_time: 'payment',
            shipping: 'seller',
            location: '11',
            ship_name1: '',
            ship_fee1: '',
            ship_name2: '',
            ship_fee2: '',
            ship_name3: '',
            ship_fee3: '',
            ship_schedule: '2',
            featured_amount: '',
            bold: '',
            highlight: '',
            gift: '',
            wrapping: '',
        };
        cookie = `YLS=v=2&p=1&n=1; F=a=O7WTlr4MvRgadh4VTKkKXmxV4vn..wnQoX_s9o8vA0QIfnXYdyT8Px0NaC6KLCtK189I2NI-&b=qFZt; B=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; XB=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; T=z=o0S3gBochAhBIRkBW8DxLhVMDc2NwZONTMzMTA0NzY-&sk=DAAV4Z3gRjvI3m&ks=EAAPbZHaZUMEKEQFKoGpiquow--~F&kt=EAA7fNwChNSjnV1qj8F9akb6g--~E&ku=FAAMEUCIFs67FZAYrDcaWHJxVGW6pWbcyq34oepI4x0Ou5LZoKXAiEAjxZQ9w4gEHGNqz0IxM1piq.6KlYqa7GInOrlkjP319w-~B&d=dGlwAXJxTzVEQQFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFvMFMzZ0JBMko-; SSL=v=1&s=K2AbBlwbnk_2.4ZvdfiHAKPh2fmTRvD1CWQRId_muoqPAckvu0wHKOZfDSe5v7qwEEdJTUGpDwV6HQ._k4VMJA--&kv=0; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathnQVoj7rx1a0zANXuwDZ_E_frmCnIXz0x2jnFZJLzfUvgFM_XP67HR14U0XW6_JyODD4FGwFOsfaSajCsJAdYLrVG39v0DkSJgICmkvQAh5KD-AQ8Ct21wFAsw_ld9lqbmNHNa6KSyxjZX80ijk8bPDr8bNxfKlC_0dYkPhWhaabKPj_cOShs2NU6HYQp8sOKMYJbiT4_b4_AeDLqpPkL1YX0xFevASgF-5sAo07FCSrDT5LuAWz48c_hBGF6I2YkcHIcOw2Re7ft0U-I7ShtXPg77mwFbOBF0LWtVnYsUve8tIGZufawG2jZr8cPMvgNmPTsvbw87XOnk5T9urGg947GoZ8_xS2tYV-p0D6U0ktJhUBZcTDfscSz130i5SYW4MXOJRj30gv88q_4e8n8MBnvUHUBLUcrJTzPgxGQcNPvgWDEMyuL4qECO96r_vahQurYHyqpcY03QQqhXZkvkQbvpCcZe4zKlOEyLEl5rwYiBo6EZHV7_QtqmTsyeONAWLWaUHjTY7PEbP0rsyJBpqQsidvfGA9v1xQulN_FbbDwXA5_SqgVnhS669gMk4KZQG4yQPUqVgvDsCnNqG-kgiHI1uXgE6vPRaDzdUqz3fz3BBh_pVpaVQNHRH5US2dy05moGrut8L5GDdeNDDe8ijS14u9zLQX2w3hx0DHaeCBrOxI8hKKp_2YojARJTu4KVgEhcrbRfpd3P3J9_L5yDIqP6mOAbHXkwlVm4nclTrNeQ9v1DrU9lk25v_PQL8iG_-GGy9qWbW-Eql_tkLP9v0le3iPiyQ3DuwbZojS8bne1srsIs1oxnKoxNm408hrIy5s26qr6hQAbl7g626I7LcmQEG0ZE4_lRW2XK6vpl5cdnX_3bHfjiY_FQEAR3Kp63YOCtLMFm4q1nNtTnagcd2EMOhvpSKTlJy0hRwdIzc9glMFepwdqYLz6EU3S7yLrpMKRqFKc8lBCCgEVDIbkElVuGe-mRpNSQWHyTP64CA8w5QKPjhWNkD5pMizqM6YK5wI7pL-SAP0t7h1X1Hi3kq0rtftQvhlYEb8UsRlRt4nKEusu1hrVtEDA1RQ4QhCBYyCbZQ2GEDR9zx7v7FiyNU.3; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeWY1k2posgYa0lahA32apZyf2NlbmE/nO4vE1n0jIP4MQDTCMYzvBo503uRnRcldHctdZC5CNCRNJSTIUCaAQRMZSJgKmb2pRPnsuAszs7tW8wYXCOWcjkyof5zAVsRqWMEzvPDS+FFUQW7wrTI6/dNs9glboawdo2J5ITGABKSbAm/6FoW3DHq0VKUxDxbcDMl4XeGpPTVREIkftodW+04pVpAdYzyPblhfxxCperzsvEZBKWnEeGbFgDeXc7s6BED/gKV2vVrRjii30cEckNSqsA2c8PvATw0C9p5LJYD3UECpYgsCrbHzYFEIbsZzGQb60HekYle3Rvb9w/6b9AgdnJv76ZHEqXZB6L+0BynnyvcPY/zF/tPo6nSlP6Ctg/VtNva2K+ZSaNLAfRbWjiO1960ao0ArQzuRYbZueYBTMlnhwmJDcKcsJiAIVloMHI6vOmUan32qUHpusVOc3/e0o7atc7LexRerQ0+dbymAA==.1; A=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; XA=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; irepNoBidExp=1; irepNoWonExp=1; irepIsLogin=1; irepLastBidTime=2; irepLastWonTime=2`;
        let listImage = productData.images.map((item) => {
            return 'uploads/' + item;
        });
        let headers = {
            cookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
            origin: 'https://auctions.yahoo.co.jp',
            authority: 'auctions.yahoo.co.jp',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
        };

        const getKeys = async (cookie) => {
            try {
                const configs = {
                    headers: {
                        cookie: cookie,
                    },
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
                console.error(err);
                return {};
            }
        };

        let keys = await getKeys(cookie);

        // Upload Image and get thumbnail
        let payloadImage = {};
        for (let i = 0; i < listImage.length; i++) {
            const formData = new FormData();
            const buffer = Fs.readFileSync(listImage[i]);
            formData.append('files[0]', buffer, `photo${i}.jpg`);
            formData.append('.crumb', keys.img_crumb);
            const resImage = await axios.post(`https://auctions.yahoo.co.jp/img/images/new`, formData, {
                headers: {
                    ...headers,
                    ...formData.getHeaders(),
                },
            });

            payloadImage[`image_comment${i + 1}`] = '';
            payloadImage[`ImageFullPath${i + 1}`] = resImage.data.images[0].url;
            payloadImage[`ImageWidth${i + 1}`] = resImage.data.images[0].width;
            payloadImage[`ImageHeight${i + 1}`] = resImage.data.images[0].height;

            // Set Thumbnail is first image
            if (i === 0) {
                let urlImage = resImage.data.images[0].url;
                const form = new FormData();
                form.append('path', urlImage);
                form.append('.crumb', keys.img_crumb);

                const configs = {
                    headers: {
                        ...form.getHeaders(),
                        cookie: cookie,
                    },
                };
                const resThumbnail = await axios.post('https://auctions.yahoo.co.jp/img/images/new', form, configs);
                payloadImage = { ...payloadImage, thumbNail: resThumbnail.data.thumbnail };
            }
        }

        // Biến Ko biết
        //値下げ交渉
        //決済方法
        //海外発送
        let now = new Date();
        now.setDate(now.getDate() + productData.duration);
        let tmpClosingYMD = moment(now).format('yyyy-MM-DD');

        let location = constants.PREFECTURE.find((x) => x.value == productData.location);
        location = location.display;
        // PREVIEW
        let previewParams = {
            aID: '',
            oldAID: '',
            mode: 'submit',
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
            is_yahuneko_nekoposu_ship: 'yes',
            is_yahuneko_taqbin_ship: 'yes',
            is_jp_yupacket_official_ship: 'yes',
            salesmode: 'auction',
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
            StartPrice: productData.start_price,
            BidOrBuyPrice: productData.bid_or_buy_price,
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
            ReservePrice: productData.reserve_price,

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
        let payload = Qs.stringify(previewParams);
        headers = {
            ...headers,
            referer: 'https://auctions.yahoo.co.jp/sell/jp/show/submit',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        let resPreview = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/show/preview`, payload, {
            headers,
        });

        let mgc = /<input type="hidden" name="mgc" value="(.*)">/.exec(resPreview.data);
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

            // markdown_ratio: '',
            // categoryPath: 'オークション > おもちゃ、ゲーム > ゲーム > トレーディングカードゲーム > 遊戯王（コナミ） > その他',
            // LastStartPrice: '',
            // startDate: '1625637884',
            // endDate: '1625897084',
            // DurationDetail: '',
            // initNumResubmit: '',
            // aspj3: '',
            // aspj4: '',
            // charityOption: '',
            // markdownPrice1: '',
            // markdownPrice2: '',
            // markdownPrice3: '',
            // itemsizeStr: '－',
            // itemweightStr: '－',
            // ypkOK: '',
            // hacoboon_shipratelink: '',
            // affiliateRate: '',
            // cpaAmount: '',
            // initialFeaturedCharge: '',
            // GiftIconCharge: '',
            // ReserveFeeOnly: '',
            // reserveFeeTotal: '',
            // IsPrivacyDeliveryAvailable: '',
            // brand_line_id: '',
            // brand_line_name: '',
            // item_spec_size_id: '',
            // item_spec_size_type: '',
            // item_spec_size: '',
            // item_segment_id: '',
            // item_segment: '',
            // catalog_id: '',
            // catalog_jan_code: '',
            // catalog_name: '',
            // catalog_spec_select_type: '',
            // catalog_spec_numerical_type: '',
            // paymethod1: '',
            // paymethod2: '',
            // paymethod3: '',
            // paymethod4: '',
            // paymethod5: '',
            // paymethod6: '',
            // paymethod7: '',
            // paymethod8: '',
            // paymethod9: '',
            // paymethod10: '',
            // shipnameWithSuffix1: '',
            // shipratelink1: '',
            // shipnameWithSuffix2: '',
            // shipratelink2: '',
            // shipnameWithSuffix3: '',
            // shipratelink3: '',
            // shipnameWithSuffix4: '',
            // shipratelink4: '',
            // shipnameWithSuffix5: '',
            // shipratelink5: '',
            // shipnameWithSuffix6: '',
            // shipratelink6: '',
            // shipnameWithSuffix7: '',
            // shipratelink7: '',
            // shipnameWithSuffix8: '',
            // shipratelink8: '',
            // shipnameWithSuffix9: '',
            // shipratelink9: '',
            // shipnameWithSuffix10: '',
            // shipratelink10: '',
            // bkname1: '',
            // bkname2: '',
            // bkname3: '',
            // bkname4: '',
            // bkname5: '',
            // bkname6: '',
            // bkname7: '',
            // bkname8: '',
            // bkname9: '',
            // bkname10: '',
            // hacoboonMiniFeeInfoAreaName1: '',
            // hacoboonMiniFeeInfoFee1: '',
            // hacoboonMiniFeeInfoAreaName2: '',
            // hacoboonMiniFeeInfoFee2: '',
            // hacoboonMiniFeeInfoAreaName3: '',
            // hacoboonMiniFeeInfoFee3: '',
            // hacoboonMiniFeeInfoAreaName4: '',
            // hacoboonMiniFeeInfoFee4: '',
            // hacoboonMiniCvsPref: '',
            // aspj1: '',
            // isFirstSubmit: '',
            // is_hb_ship: '',
            // hb_shipratelink: '',
            // hb_ship_fee: '',
            // hb_hokkaido_ship_fee: '',
            // hb_okinawa_ship_fee: '',
            // hb_isolatedisland_ship_fee: '',
            // hb_deliveryfeesize: '',
            // is_hbmini_ship: '',
            // is_yahuneko_taqbin_compact_ship: '',
            // yahuneko_taqbin_deliveryfeesize: '',
            // is_jp_yupack_official_ship: '',
            // jp_yupack_deliveryfeesize: '',
            // draftIndex: '',
        };
        payload = Qs.stringify(previewParams);
        let resSubmit = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/config/submit`, payload, {
            headers,
        });

        // if (Fs.existsSync('./preview.html')) {
        //     Fs.unlinkSync('./preview.html');
        // }
        // Fs.writeFile('./preview.html', resSubmit.data, function (err, data) {
        //     if (err) {
        //         return console.log(err);
        //     }
        // });
        console.log(' =========== Upload Product Auction DONE ============= ');

        if (resSubmit.data.includes('以下の商品の出品手続きが完了しました。ご利用ありがとうございました。')) {
            return true;
        } else {
            let $ = cheerio.load(resSubmit.data);
            let message = $('strong').text();
            return message;
        }
    }
    static async getProductAuctionsSuccess(cookie) {
        cookie = `YLS=v=2&p=1&n=1; F=a=O7WTlr4MvRgadh4VTKkKXmxV4vn..wnQoX_s9o8vA0QIfnXYdyT8Px0NaC6KLCtK189I2NI-&b=qFZt; B=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; XB=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; T=z=o0S3gBochAhBIRkBW8DxLhVMDc2NwZONTMzMTA0NzY-&sk=DAAV4Z3gRjvI3m&ks=EAAPbZHaZUMEKEQFKoGpiquow--~F&kt=EAA7fNwChNSjnV1qj8F9akb6g--~E&ku=FAAMEUCIFs67FZAYrDcaWHJxVGW6pWbcyq34oepI4x0Ou5LZoKXAiEAjxZQ9w4gEHGNqz0IxM1piq.6KlYqa7GInOrlkjP319w-~B&d=dGlwAXJxTzVEQQFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFvMFMzZ0JBMko-; SSL=v=1&s=K2AbBlwbnk_2.4ZvdfiHAKPh2fmTRvD1CWQRId_muoqPAckvu0wHKOZfDSe5v7qwEEdJTUGpDwV6HQ._k4VMJA--&kv=0; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathnQVoj7rx1a0zANXuwDZ_E_frmCnIXz0x2jnFZJLzfUvgFM_XP67HR14U0XW6_JyODD4FGwFOsfaSajCsJAdYLrVG39v0DkSJgICmkvQAh5KD-AQ8Ct21wFAsw_ld9lqbmNHNa6KSyxjZX80ijk8bPDr8bNxfKlC_0dYkPhWhaabKPj_cOShs2NU6HYQp8sOKMYJbiT4_b4_AeDLqpPkL1YX0xFevASgF-5sAo07FCSrDT5LuAWz48c_hBGF6I2YkcHIcOw2Re7ft0U-I7ShtXPg77mwFbOBF0LWtVnYsUve8tIGZufawG2jZr8cPMvgNmPTsvbw87XOnk5T9urGg947GoZ8_xS2tYV-p0D6U0ktJhUBZcTDfscSz130i5SYW4MXOJRj30gv88q_4e8n8MBnvUHUBLUcrJTzPgxGQcNPvgWDEMyuL4qECO96r_vahQurYHyqpcY03QQqhXZkvkQbvpCcZe4zKlOEyLEl5rwYiBo6EZHV7_QtqmTsyeONAWLWaUHjTY7PEbP0rsyJBpqQsidvfGA9v1xQulN_FbbDwXA5_SqgVnhS669gMk4KZQG4yQPUqVgvDsCnNqG-kgiHI1uXgE6vPRaDzdUqz3fz3BBh_pVpaVQNHRH5US2dy05moGrut8L5GDdeNDDe8ijS14u9zLQX2w3hx0DHaeCBrOxI8hKKp_2YojARJTu4KVgEhcrbRfpd3P3J9_L5yDIqP6mOAbHXkwlVm4nclTrNeQ9v1DrU9lk25v_PQL8iG_-GGy9qWbW-Eql_tkLP9v0le3iPiyQ3DuwbZojS8bne1srsIs1oxnKoxNm408hrIy5s26qr6hQAbl7g626I7LcmQEG0ZE4_lRW2XK6vpl5cdnX_3bHfjiY_FQEAR3Kp63YOCtLMFm4q1nNtTnagcd2EMOhvpSKTlJy0hRwdIzc9glMFepwdqYLz6EU3S7yLrpMKRqFKc8lBCCgEVDIbkElVuGe-mRpNSQWHyTP64CA8w5QKPjhWNkD5pMizqM6YK5wI7pL-SAP0t7h1X1Hi3kq0rtftQvhlYEb8UsRlRt4nKEusu1hrVtEDA1RQ4QhCBYyCbZQ2GEDR9zx7v7FiyNU.3; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeWY1k2posgYa0lahA32apZyf2NlbmE/nO4vE1n0jIP4MQDTCMYzvBo503uRnRcldHctdZC5CNCRNJSTIUCaAQRMZSJgKmb2pRPnsuAszs7tW8wYXCOWcjkyof5zAVsRqWMEzvPDS+FFUQW7wrTI6/dNs9glboawdo2J5ITGABKSbAm/6FoW3DHq0VKUxDxbcDMl4XeGpPTVREIkftodW+04pVpAdYzyPblhfxxCperzsvEZBKWnEeGbFgDeXc7s6BED/gKV2vVrRjii30cEckNSqsA2c8PvATw0C9p5LJYD3UECpYgsCrbHzYFEIbsZzGQb60HekYle3Rvb9w/6b9AgdnJv76ZHEqXZB6L+0BynnyvcPY/zF/tPo6nSlP6Ctg/VtNva2K+ZSaNLAfRbWjiO1960ao0ArQzuRYbZueYBTMlnhwmJDcKcsJiAIVloMHI6vOmUan32qUHpusVOc3/e0o7atc7LexRerQ0+dbymAA==.1; A=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; XA=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; irepNoBidExp=1; irepNoWonExp=1; irepIsLogin=1; irepLastBidTime=2; irepLastWonTime=2`;

        let response = await axios.get('https://auctions.yahoo.co.jp/closeduser/jp/show/mystatus?select=closed&hasWinner=1', {
            headers: {
                cookie,
            },
        });

        let $ = cheerio.load(response.data);

        let rowTable = $('#acWrContents > div > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table:nth-child(6) > tbody > tr');
        let listProductID = [];
        for (const row of rowTable) {
            let id = $(row).find('td:nth-child(2)').text();
            if (id !== '商品ID') {
                listProductID.push(id);
            }
        }
        console.log(listProductID);
        let listProductDATA = [];

        for (const productID of listProductID) {
            console.log(productID);
            let resProduct = await axios.get(`https://auctions.yahoo.co.jp/sell/jp/show/resubmit?aID=${productID}`, {
                headers: {
                    cookie,
                },
            });
            $ = cheerio.load(resProduct.data);

            let aID = $('input[name="aID"]').val();
            let oldAID = $('input[name="oldAID"]').val();
            let mode = $('input[name="mode"]').val();
            let category = $('input[name="category"]').val();

            let md5 = $('input[name="md5"]').val();
            let crumb = $('input[name=".crumb"]').val();
            let tos = $('input[name="tos"]').val();
            let submitTipsDisp = $('input[name="submitTipsDisp"]').val();
            let fnavi = $('input[name="fnavi"]').val();
            let CloseEarly = $('input[name="CloseEarly"]').val();
            let pagetype = $('input[name="pagetype"]').val();
            let isDraftChecked = $('input[name="isDraftChecked"]').val();
            let saveIndex = $('input[name="saveIndex"]').val();
            let newsubmitform = $('input[name="newsubmitform"]').val();
            let retpolicy_comment = $('input[name="retpolicy_comment"]').val();
            let info01 = $('input[name="info01"]').val();
            let info02 = $('input[name="info02"]').val();
            let info03 = $('input[name="info03"]').val();
            let title = $('#fleaTitleForm').val();

            let istatus = $('select[name="istatus"]').val();

            let submit_description = $('input[name="submit_description"]').val();
            let Description = $('input[name="Description"]').val();
            let Description_rte = $('input[name="Description_rte"]').val();
            let Description_rte_work = $('input[name="Description_rte_work"]').val();

            let categoryText = $('.Category__text').text();

            let loc_cd = $('select[name="loc_cd"]').val();
            let auc_shipping_who = $('#auc_shipping_who').val();

            let ship_delivery_n = $('#ship_delivery_n').val();
            let ship_delivery_s = $('#ship_delivery_s').val();
            let ship_delivery_l = $('#ship_delivery_l').val();

            let ship_delivery_yupacket = $('#ship_delivery_yupacket').val();
            let ship_delivery_yupack = $('#ship_delivery_yupack').val();

            let shipschedule = $('#shipschedule').val();
            let StartPrice = $('#auc_StartPrice_auction').val();

            let submitUnixtime = $('input[name="submitUnixtime"]').val();
            let Duration = $('#Duration').val();
            let tmpClosingYMD = $('#tmpClosingYMD').val();
            let tmpClosingTime = $('#tmpClosingTime').val();

            let thumbNail = $('#thumbNail').val();
            let img_crumb = $('#img_crumb').val();

            let ImageFullPath1 = $('#auc_image_fullpath1').val();
            let ImageWidth1 = $('input[name="ImageWidth1"]').val();
            let ImageHeight1 = $('input[name="ImageHeight1"]').val();

            let ImageFullPath2 = $('#auc_image_fullpath2').val();
            let ImageWidth2 = $('input[name="ImageWidth2"]').val();
            let ImageHeight2 = $('input[name="ImageHeight2"]').val();

            let ImageFullPath3 = $('#auc_image_fullpath3').val();
            let ImageWidth3 = $('input[name="ImageWidth3"]').val();
            let ImageHeight3 = $('input[name="ImageHeight3"]').val();

            let ImageFullPath4 = $('#auc_image_fullpath4').val();
            let ImageWidth4 = $('input[name="ImageWidth4"]').val();
            let ImageHeight4 = $('input[name="ImageHeight4"]').val();

            let ImageFullPath5 = $('#auc_image_fullpath5').val();
            let ImageWidth5 = $('input[name="ImageWidth5"]').val();
            let ImageHeight5 = $('input[name="ImageHeight5"]').val();

            let ImageFullPath6 = $('#auc_image_fullpath6').val();
            let ImageWidth6 = $('input[name="ImageWidth6"]').val();
            let ImageHeight6 = $('input[name="ImageHeight6"]').val();

            let ImageFullPath7 = $('#auc_image_fullpath7').val();
            let ImageWidth7 = $('input[name="ImageWidth7"]').val();
            let ImageHeight7 = $('input[name="ImageHeight7"]').val();

            let ImageFullPath8 = $('#auc_image_fullpath8').val();
            let ImageWidth8 = $('input[name="ImageWidth8"]').val();
            let ImageHeight8 = $('input[name="ImageHeight8"]').val();

            let ImageFullPath9 = $('#auc_image_fullpath9').val();
            let ImageWidth9 = $('input[name="ImageWidth9"]').val();
            let ImageHeight9 = $('input[name="ImageHeight9"]').val();

            let ImageFullPath10 = $('#auc_image_fullpath10').val();
            let ImageWidth10 = $('input[name="ImageWidth10"]').val();
            let ImageHeight10 = $('input[name="ImageHeight10"]').val();

            let ypoint = $('input[name="ypoint"]').val();

            let productData = {
                aID,
                oldAID,
                mode,
                category,
                md5,
                crumb,
                tos,
                submitTipsDisp,
                fnavi,
                CloseEarly,
                pagetype,
                isDraftChecked,
                saveIndex,
                newsubmitform,
                retpolicy_comment,
                info01,
                info02,
                info03,
                title,
                istatus,
                submit_description,
                Description,
                Description_rte,
                Description_rte_work,
                categoryText,
                loc_cd,
                auc_shipping_who,
                ship_delivery_n,
                ship_delivery_s,
                ship_delivery_l,
                ship_delivery_yupacket,
                ship_delivery_yupack,
                shipschedule,
                StartPrice,
                submitUnixtime,
                Duration,
                tmpClosingYMD,
                tmpClosingTime,
                thumbNail,
                img_crumb,
                ImageFullPath1,
                ImageWidth1,
                ImageHeight1,
                ImageFullPath2,
                ImageWidth2,
                ImageHeight2,
                ImageFullPath3,
                ImageWidth3,
                ImageHeight3,
                ImageFullPath4,
                ImageWidth4,
                ImageHeight4,
                ImageFullPath5,
                ImageWidth5,
                ImageHeight5,
                ImageFullPath6,
                ImageWidth6,
                ImageHeight6,
                ImageFullPath7,
                ImageWidth7,
                ImageHeight7,
                ImageFullPath8,
                ImageWidth8,
                ImageHeight8,
                ImageFullPath9,
                ImageWidth9,
                ImageHeight9,
                ImageFullPath10,
                ImageWidth10,
                ImageHeight10,
                ypoint,
            };
            listProductDATA.push(productData);
        }
        console.log(' =========== Done =============== ');
        return listProductDATA;
    }
    static async getProductAuctioning(cookie) {
        cookie = `YLS=v=2&p=1&n=1; F=a=O7WTlr4MvRgadh4VTKkKXmxV4vn..wnQoX_s9o8vA0QIfnXYdyT8Px0NaC6KLCtK189I2NI-&b=qFZt; B=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; XB=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; T=z=o0S3gBochAhBIRkBW8DxLhVMDc2NwZONTMzMTA0NzY-&sk=DAAV4Z3gRjvI3m&ks=EAAPbZHaZUMEKEQFKoGpiquow--~F&kt=EAA7fNwChNSjnV1qj8F9akb6g--~E&ku=FAAMEUCIFs67FZAYrDcaWHJxVGW6pWbcyq34oepI4x0Ou5LZoKXAiEAjxZQ9w4gEHGNqz0IxM1piq.6KlYqa7GInOrlkjP319w-~B&d=dGlwAXJxTzVEQQFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFvMFMzZ0JBMko-; SSL=v=1&s=K2AbBlwbnk_2.4ZvdfiHAKPh2fmTRvD1CWQRId_muoqPAckvu0wHKOZfDSe5v7qwEEdJTUGpDwV6HQ._k4VMJA--&kv=0; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathnQVoj7rx1a0zANXuwDZ_E_frmCnIXz0x2jnFZJLzfUvgFM_XP67HR14U0XW6_JyODD4FGwFOsfaSajCsJAdYLrVG39v0DkSJgICmkvQAh5KD-AQ8Ct21wFAsw_ld9lqbmNHNa6KSyxjZX80ijk8bPDr8bNxfKlC_0dYkPhWhaabKPj_cOShs2NU6HYQp8sOKMYJbiT4_b4_AeDLqpPkL1YX0xFevASgF-5sAo07FCSrDT5LuAWz48c_hBGF6I2YkcHIcOw2Re7ft0U-I7ShtXPg77mwFbOBF0LWtVnYsUve8tIGZufawG2jZr8cPMvgNmPTsvbw87XOnk5T9urGg947GoZ8_xS2tYV-p0D6U0ktJhUBZcTDfscSz130i5SYW4MXOJRj30gv88q_4e8n8MBnvUHUBLUcrJTzPgxGQcNPvgWDEMyuL4qECO96r_vahQurYHyqpcY03QQqhXZkvkQbvpCcZe4zKlOEyLEl5rwYiBo6EZHV7_QtqmTsyeONAWLWaUHjTY7PEbP0rsyJBpqQsidvfGA9v1xQulN_FbbDwXA5_SqgVnhS669gMk4KZQG4yQPUqVgvDsCnNqG-kgiHI1uXgE6vPRaDzdUqz3fz3BBh_pVpaVQNHRH5US2dy05moGrut8L5GDdeNDDe8ijS14u9zLQX2w3hx0DHaeCBrOxI8hKKp_2YojARJTu4KVgEhcrbRfpd3P3J9_L5yDIqP6mOAbHXkwlVm4nclTrNeQ9v1DrU9lk25v_PQL8iG_-GGy9qWbW-Eql_tkLP9v0le3iPiyQ3DuwbZojS8bne1srsIs1oxnKoxNm408hrIy5s26qr6hQAbl7g626I7LcmQEG0ZE4_lRW2XK6vpl5cdnX_3bHfjiY_FQEAR3Kp63YOCtLMFm4q1nNtTnagcd2EMOhvpSKTlJy0hRwdIzc9glMFepwdqYLz6EU3S7yLrpMKRqFKc8lBCCgEVDIbkElVuGe-mRpNSQWHyTP64CA8w5QKPjhWNkD5pMizqM6YK5wI7pL-SAP0t7h1X1Hi3kq0rtftQvhlYEb8UsRlRt4nKEusu1hrVtEDA1RQ4QhCBYyCbZQ2GEDR9zx7v7FiyNU.3; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeWY1k2posgYa0lahA32apZyf2NlbmE/nO4vE1n0jIP4MQDTCMYzvBo503uRnRcldHctdZC5CNCRNJSTIUCaAQRMZSJgKmb2pRPnsuAszs7tW8wYXCOWcjkyof5zAVsRqWMEzvPDS+FFUQW7wrTI6/dNs9glboawdo2J5ITGABKSbAm/6FoW3DHq0VKUxDxbcDMl4XeGpPTVREIkftodW+04pVpAdYzyPblhfxxCperzsvEZBKWnEeGbFgDeXc7s6BED/gKV2vVrRjii30cEckNSqsA2c8PvATw0C9p5LJYD3UECpYgsCrbHzYFEIbsZzGQb60HekYle3Rvb9w/6b9AgdnJv76ZHEqXZB6L+0BynnyvcPY/zF/tPo6nSlP6Ctg/VtNva2K+ZSaNLAfRbWjiO1960ao0ArQzuRYbZueYBTMlnhwmJDcKcsJiAIVloMHI6vOmUan32qUHpusVOc3/e0o7atc7LexRerQ0+dbymAA==.1; A=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; XA=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; irepNoBidExp=1; irepNoWonExp=1; irepIsLogin=1; irepLastBidTime=2; irepLastWonTime=2`;

        let response = await axios.get('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling', {
            headers: {
                cookie,
            },
        });

        let $ = cheerio.load(response.data);

        let rowTable = $(
            '#acWrContents > div > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr'
        );
        let listProductID = [];
        for (const row of rowTable) {
            let id = $(row).find('td:nth-child(1)').text();
            if (id !== '商品ID') {
                listProductID.push(id);
            }
        }
        console.log(listProductID);
        let listProductDATA = [];

        for (const productID of listProductID) {
            console.log(productID);
            let resProduct = await axios.get(`https://auctions.yahoo.co.jp/sell/jp/show/updateauction?aID=${productID}`, {
                headers: {
                    cookie,
                },
            });
            $ = cheerio.load(resProduct.data);

            let aID = $('input[name="aID"]').val();
            let oldAID = $('input[name="oldAID"]').val();
            let mode = $('input[name="mode"]').val();
            let category = $('input[name="category"]').val();

            let md5 = $('input[name="md5"]').val();
            let crumb = $('input[name=".crumb"]').val();
            let tos = $('input[name="tos"]').val();
            let submitTipsDisp = $('input[name="submitTipsDisp"]').val();
            let fnavi = $('input[name="fnavi"]').val();
            let CloseEarly = $('input[name="CloseEarly"]').val();
            let pagetype = $('input[name="pagetype"]').val();
            let isDraftChecked = $('input[name="isDraftChecked"]').val();
            let saveIndex = $('input[name="saveIndex"]').val();
            let newsubmitform = $('input[name="newsubmitform"]').val();
            let retpolicy_comment = $('input[name="retpolicy_comment"]').val();
            let info01 = $('input[name="info01"]').val();
            let info02 = $('input[name="info02"]').val();
            let info03 = $('input[name="info03"]').val();
            let title = $('#fleaTitleForm').val();

            let istatus = $('select[name="istatus"]').val();

            let submit_description = $('input[name="submit_description"]').val();
            let Description = $('input[name="Description"]').val();
            let Description_rte = $('input[name="Description_rte"]').val();
            let Description_rte_work = $('input[name="Description_rte_work"]').val();

            let categoryText = $('.Category__text').text();

            let loc_cd = $('select[name="loc_cd"]').val();
            let auc_shipping_who = $('#auc_shipping_who').val();

            let ship_delivery_n = $('#ship_delivery_n').val();
            let ship_delivery_s = $('#ship_delivery_s').val();
            let ship_delivery_l = $('#ship_delivery_l').val();

            let ship_delivery_yupacket = $('#ship_delivery_yupacket').val();
            let ship_delivery_yupack = $('#ship_delivery_yupack').val();

            let shipschedule = $('#shipschedule').val();
            let StartPrice = $('#auc_StartPrice_auction').val();

            let submitUnixtime = $('input[name="submitUnixtime"]').val();
            let Duration = $('#Duration').val();
            let tmpClosingYMD = $('#tmpClosingYMD').val();
            let tmpClosingTime = $('#tmpClosingTime').val();

            let thumbNail = $('#thumbNail').val();
            let img_crumb = $('#img_crumb').val();

            let ImageFullPath1 = $('#auc_image_fullpath1').val();
            let ImageWidth1 = $('input[name="ImageWidth1"]').val();
            let ImageHeight1 = $('input[name="ImageHeight1"]').val();

            let ImageFullPath2 = $('#auc_image_fullpath2').val();
            let ImageWidth2 = $('input[name="ImageWidth2"]').val();
            let ImageHeight2 = $('input[name="ImageHeight2"]').val();

            let ImageFullPath3 = $('#auc_image_fullpath3').val();
            let ImageWidth3 = $('input[name="ImageWidth3"]').val();
            let ImageHeight3 = $('input[name="ImageHeight3"]').val();

            let ImageFullPath4 = $('#auc_image_fullpath4').val();
            let ImageWidth4 = $('input[name="ImageWidth4"]').val();
            let ImageHeight4 = $('input[name="ImageHeight4"]').val();

            let ImageFullPath5 = $('#auc_image_fullpath5').val();
            let ImageWidth5 = $('input[name="ImageWidth5"]').val();
            let ImageHeight5 = $('input[name="ImageHeight5"]').val();

            let ImageFullPath6 = $('#auc_image_fullpath6').val();
            let ImageWidth6 = $('input[name="ImageWidth6"]').val();
            let ImageHeight6 = $('input[name="ImageHeight6"]').val();

            let ImageFullPath7 = $('#auc_image_fullpath7').val();
            let ImageWidth7 = $('input[name="ImageWidth7"]').val();
            let ImageHeight7 = $('input[name="ImageHeight7"]').val();

            let ImageFullPath8 = $('#auc_image_fullpath8').val();
            let ImageWidth8 = $('input[name="ImageWidth8"]').val();
            let ImageHeight8 = $('input[name="ImageHeight8"]').val();

            let ImageFullPath9 = $('#auc_image_fullpath9').val();
            let ImageWidth9 = $('input[name="ImageWidth9"]').val();
            let ImageHeight9 = $('input[name="ImageHeight9"]').val();

            let ImageFullPath10 = $('#auc_image_fullpath10').val();
            let ImageWidth10 = $('input[name="ImageWidth10"]').val();
            let ImageHeight10 = $('input[name="ImageHeight10"]').val();

            let ypoint = $('input[name="ypoint"]').val();

            let productData = {
                aID,
                oldAID,
                mode,
                category,
                md5,
                crumb,
                tos,
                submitTipsDisp,
                fnavi,
                CloseEarly,
                pagetype,
                isDraftChecked,
                saveIndex,
                newsubmitform,
                retpolicy_comment,
                info01,
                info02,
                info03,
                title,
                istatus,
                submit_description,
                Description,
                Description_rte,
                Description_rte_work,
                categoryText,
                loc_cd,
                auc_shipping_who,
                ship_delivery_n,
                ship_delivery_s,
                ship_delivery_l,
                ship_delivery_yupacket,
                ship_delivery_yupack,
                shipschedule,
                StartPrice,
                submitUnixtime,
                Duration,
                tmpClosingYMD,
                tmpClosingTime,
                thumbNail,
                img_crumb,
                ImageFullPath1,
                ImageWidth1,
                ImageHeight1,
                ImageFullPath2,
                ImageWidth2,
                ImageHeight2,
                ImageFullPath3,
                ImageWidth3,
                ImageHeight3,
                ImageFullPath4,
                ImageWidth4,
                ImageHeight4,
                ImageFullPath5,
                ImageWidth5,
                ImageHeight5,
                ImageFullPath6,
                ImageWidth6,
                ImageHeight6,
                ImageFullPath7,
                ImageWidth7,
                ImageHeight7,
                ImageFullPath8,
                ImageWidth8,
                ImageHeight8,
                ImageFullPath9,
                ImageWidth9,
                ImageHeight9,
                ImageFullPath10,
                ImageWidth10,
                ImageHeight10,
                ypoint,
            };
            listProductDATA.push(productData);
        }
        console.log(listProductDATA);
        console.log(' =========== Done =============== ');
        return listProductDATA;
    }
    static async getCookie(account, proxy) {
        console.log(' ==== Start login Yahoo ====');
        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
        ];

        const options = {
            args,
            headless: true,
            ignoreHTTPSErrors: true,
            userDataDir: './tmp'
        };

        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.goto('https://login.yahoo.co.jp/config/login?auth_lv=pw&.lg=jp&.intl=jp&.src=auc&.done=https%3A%2F%2Fauctions.yahoo.co.jp%2F&sr_required=birthday%20gender%20postcode%20deliver',
            { waitUntil: 'load', timeout: 0 });
        page.setDefaultNavigationTimeout(0)
        await page.type('#username', account.yahoo_id);
        await page.click('#btnNext');
        await page.waitForNavigation();
        await page.type('#passwd', account.password);
        await page.click('#btnSubmit');
        await page.waitForNavigation();

        // Get cookies
        const cookies = await page.cookies();
        browser.close()
        if (cookies.length > 4) {
            return cookies.map(function (c) { return `${c.name}=${c.value}` }).join('; ')
        } else {
            throw new Error('Can not get cookies:', page.url())
        }
    }
}
