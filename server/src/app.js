// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import indexRouter from './routes/index';
import MongoDB from './services/MongoDB';
import PassportService from './services/PassportService';
import UserService from './services/UserService';
import ProxyService from './services/ProxyService';
import Path from 'path';
import QueueGetProductAmazon from './services/QueueGetProductAmazon';
import QueueLoginYahooAuction from './services/QueueLoginYahooAuction';
import upload from 'express-fileupload';
import BrightDataService from './services/BrightDataService';
import AuctionYahooService from './services/AuctionYahooService';
import ProductYahooService from './services/ProductYahooService';
import AccountYahooService from './services/AccountYahooService';
import ProductYahooEndedService from './services/ProductYahooEndedService';

require('dotenv').config();

const app = express();
// Fix Cross
var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
};
app.use(cors(corsOptions));

// ================ use passport and jwt ================
var passport = PassportService.init();
app.use(passport.initialize());
app.use('/api', passport.authenticate('jwt', { session: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(Path.join(__dirname, '../public')));
app.use(upload());
app.use('/uploads', express.static('uploads'));
app.use('/', indexRouter);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

let initData = async () => {
    UserService.addUser({
        username: 'admin',
        password: 'admin',
        type: 'admin',
        name: 'admin',
        email: 'admin@gmail.com',
        verified_at: new Date(),
    });
    new QueueGetProductAmazon();
    new QueueLoginYahooAuction();
    BrightDataService.loadProxyToDB();

    console.log('Server Started.!');

    let proxy = {
        ip: '178.171.80.121',
        host: 'zproxy.lum-superproxy.io',
        port: 22225,
        username: 'lum-customer-c_84db29ae-zone-zone2-ip-178.171.80.121',
        password: '7ox35md3j0jm',
    };
    // //// get Product yahoo ended

    // let listAccountYahoo = await AccountYahooService.find({});
    // for (let i = 0; i < listAccountYahoo.length; i++) {
    //     const accountYahoo = listAccountYahoo[i];
    //     let proxyResult = await ProxyService.findByIdAndCheckLive(accountYahoo.proxy_id);
    //     console.log(proxyResult);
    //     if (proxyResult.status === 'SUCCESS') {
    //         let listProductEnded = await AuctionYahooService.getProductAuctionEnded(accountYahoo.cookie, proxyResult.data);
    //         for (let j = 0; j < listProductEnded.length; j++) {
    //             const product = listProductEnded[j];
    //             let productYahoo = await ProductYahooService.findOne({ aID: product.aID });
    //             if (productYahoo) {
    //                 let newProductYahooEnded = {
    //                     ...productYahoo._doc,
    //                     ...product,
    //                     _id: null,
    //                 };
    //                 newProductYahooEnded = await ProductYahooEndedService.create(newProductYahooEnded);
    //                 console.log(newProductYahooEnded);
    //             }
    //         }
    //     }
    // }
    // AuctionYahooService.getProductAuctionEnded();

    //// Upload Product Yahoo
    // let listProduct = await ProductYahooService.find({ upload_status: 'NEW' });
    // // console.log(listProduct);
    // for (let i = 0; i < listProduct.length; i++) {
    //     let product = listProduct[i];
    //     console.log(product.yahoo_auction_category_id);

    //     if (product.yahoo_auction_category_id && product.yahoo_auction_category_id != 0) {
    //         console.log(product);
    //         //Upload product
    //         let yahooAccount = await AccountYahooService.findOne({ _id: product.yahoo_account_id });
    //         console.log(' ######## yahooAccount ', yahooAccount);
    //         if (yahooAccount) {
    //             let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
    //             console.log(proxyResult);
    //             let dataUpdate = {};
    //             if (proxyResult.status === 'SUCCESS') {
    //                 let uploadAuctionResult = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, product, proxyResult.data);
    //                 console.log(uploadAuctionResult);
    //                 dataUpdate.listing_status = 'UPLOADED';
    //                 dataUpdate.upload_status = uploadAuctionResult.status;
    //                 dataUpdate.upload_status_message = uploadAuctionResult.statusMessage;
    //                 dataUpdate.aID = uploadAuctionResult.aID;
    //             } else {
    //                 dataUpdate.upload_status = proxyResult.status;
    //                 dataUpdate.upload_status_message = proxyResult.statusMessage;
    //             }
    //             await ProductYahooService.update(product._id, dataUpdate);
    //         }
    //     }
    // }

    // cookie = `YLS=v=2&p=1&n=1; F=a=O7WTlr4MvRgadh4VTKkKXmxV4vn..wnQoX_s9o8vA0QIfnXYdyT8Px0NaC6KLCtK189I2NI-&b=qFZt; B=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; XB=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; T=z=o0S3gBochAhBIRkBW8DxLhVMDc2NwZONTMzMTA0NzY-&sk=DAAV4Z3gRjvI3m&ks=EAAPbZHaZUMEKEQFKoGpiquow--~F&kt=EAA7fNwChNSjnV1qj8F9akb6g--~E&ku=FAAMEUCIFs67FZAYrDcaWHJxVGW6pWbcyq34oepI4x0Ou5LZoKXAiEAjxZQ9w4gEHGNqz0IxM1piq.6KlYqa7GInOrlkjP319w-~B&d=dGlwAXJxTzVEQQFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFvMFMzZ0JBMko-; SSL=v=1&s=K2AbBlwbnk_2.4ZvdfiHAKPh2fmTRvD1CWQRId_muoqPAckvu0wHKOZfDSe5v7qwEEdJTUGpDwV6HQ._k4VMJA--&kv=0; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathnQVoj7rx1a0zANXuwDZ_E_frmCnIXz0x2jnFZJLzfUvgFM_XP67HR14U0XW6_JyODD4FGwFOsfaSajCsJAdYLrVG39v0DkSJgICmkvQAh5KD-AQ8Ct21wFAsw_ld9lqbmNHNa6KSyxjZX80ijk8bPDr8bNxfKlC_0dYkPhWhaabKPj_cOShs2NU6HYQp8sOKMYJbiT4_b4_AeDLqpPkL1YX0xFevASgF-5sAo07FCSrDT5LuAWz48c_hBGF6I2YkcHIcOw2Re7ft0U-I7ShtXPg77mwFbOBF0LWtVnYsUve8tIGZufawG2jZr8cPMvgNmPTsvbw87XOnk5T9urGg947GoZ8_xS2tYV-p0D6U0ktJhUBZcTDfscSz130i5SYW4MXOJRj30gv88q_4e8n8MBnvUHUBLUcrJTzPgxGQcNPvgWDEMyuL4qECO96r_vahQurYHyqpcY03QQqhXZkvkQbvpCcZe4zKlOEyLEl5rwYiBo6EZHV7_QtqmTsyeONAWLWaUHjTY7PEbP0rsyJBpqQsidvfGA9v1xQulN_FbbDwXA5_SqgVnhS669gMk4KZQG4yQPUqVgvDsCnNqG-kgiHI1uXgE6vPRaDzdUqz3fz3BBh_pVpaVQNHRH5US2dy05moGrut8L5GDdeNDDe8ijS14u9zLQX2w3hx0DHaeCBrOxI8hKKp_2YojARJTu4KVgEhcrbRfpd3P3J9_L5yDIqP6mOAbHXkwlVm4nclTrNeQ9v1DrU9lk25v_PQL8iG_-GGy9qWbW-Eql_tkLP9v0le3iPiyQ3DuwbZojS8bne1srsIs1oxnKoxNm408hrIy5s26qr6hQAbl7g626I7LcmQEG0ZE4_lRW2XK6vpl5cdnX_3bHfjiY_FQEAR3Kp63YOCtLMFm4q1nNtTnagcd2EMOhvpSKTlJy0hRwdIzc9glMFepwdqYLz6EU3S7yLrpMKRqFKc8lBCCgEVDIbkElVuGe-mRpNSQWHyTP64CA8w5QKPjhWNkD5pMizqM6YK5wI7pL-SAP0t7h1X1Hi3kq0rtftQvhlYEb8UsRlRt4nKEusu1hrVtEDA1RQ4QhCBYyCbZQ2GEDR9zx7v7FiyNU.3; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeWY1k2posgYa0lahA32apZyf2NlbmE/nO4vE1n0jIP4MQDTCMYzvBo503uRnRcldHctdZC5CNCRNJSTIUCaAQRMZSJgKmb2pRPnsuAszs7tW8wYXCOWcjkyof5zAVsRqWMEzvPDS+FFUQW7wrTI6/dNs9glboawdo2J5ITGABKSbAm/6FoW3DHq0VKUxDxbcDMl4XeGpPTVREIkftodW+04pVpAdYzyPblhfxxCperzsvEZBKWnEeGbFgDeXc7s6BED/gKV2vVrRjii30cEckNSqsA2c8PvATw0C9p5LJYD3UECpYgsCrbHzYFEIbsZzGQb60HekYle3Rvb9w/6b9AgdnJv76ZHEqXZB6L+0BynnyvcPY/zF/tPo6nSlP6Ctg/VtNva2K+ZSaNLAfRbWjiO1960ao0ArQzuRYbZueYBTMlnhwmJDcKcsJiAIVloMHI6vOmUan32qUHpusVOc3/e0o7atc7LexRerQ0+dbymAA==.1; A=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; XA=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; irepNoBidExp=1; irepNoWonExp=1; irepIsLogin=1; irepLastBidTime=2; irepLastWonTime=2`;
    // AuctionYahooService.getProductAuctionEnded(null, proxy);
    // let result = await AuctionYahooService.sendRating(null, proxy, 'f524250153', 'bacntse2412', 'good', '666666666666');
    // console.log(result);
    // let check = await ProxyService.checkLiveProxy({
    //     ip: '178.171.80.121',
    //     host: 'zproxy.lum-superproxy.io',
    //     port: 22225,
    //     username: 'lum-customer-c_84db29ae-zone-zone2-ip-178.171.80.121',
    //     password: '7ox35md3j0jm',
    // });
    // console.log(check);
    // let cookie = await AuctionYahooService.getCookie({ yahoo_id: "exffk72575", password: "hPPofa95hg%" }, {
    //     ip: '176.105.250.169',
    //     host: 'zproxy.lum-superproxy.io',
    //     port: 22225,
    //     username: 'lum-customer-c_84db29ae-zone-zone2-ip-194.110.88.54',
    //     password: '7ox35md3j0jm',
    // });
    // console.log(cookie);
};
// Connect mongo DB
MongoDB.connect(initData);

export default app;
