import Queue from 'better-queue';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import axios from 'axios';

let queueLogin = null;
const autoLoginYahoo = async (inputData, cb) => {
    try {
        console.log('start login and get product')
        const browser = await puppeteer.launch({headless: false});
        if (inputData.cookies_auction && inputData.cookies_auction.length === 0) {
            console.log(' ==== Start login Yahoo ====');
            console.log(inputData);
            const page = await browser.newPage();
    
            await page.goto('https://login.yahoo.co.jp/config/login?auth_lv=pw&.lg=jp&.intl=jp&.src=auc&.done=https%3A%2F%2Fauctions.yahoo.co.jp%2F&sr_required=birthday%20gender%20postcode%20deliver',
                {waitUntil: 'load', timeout: 0});
            console.log(1)
    
                // Login
            page.setDefaultNavigationTimeout(0)
            console.log(2)
            await page.type('#username', inputData.yahoo_id);
            await page.click('#btnNext');
            await page.waitForNavigation();
            console.log(3)
            await page.type('#passwd', inputData.password);
            await page.click('#btnSubmit');
            console.log(4)
            // Get cookies
            const cookies = await page.cookies();
            inputData.cookies_auction = cookies;
            console.log(5)
            inputData.status = ['SUCCESS'];
            await inputData.save();
            browser.close()
            console.log(' ==== End login ====');
            cb(null, inputData);
        }
        let page2 = await browser.newPage();
        await page2.setCookie(...inputData.cookies_auction);
        await page2.goto('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling',
            {waitUntil: 'load', timeout: 0});
        page2.setDefaultNavigationTimeout(0)
        let res = await axios.get('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling');
        if (res && res.status === 200) {
            let html = res.data;
            let $ = cheerio.load(html);
            console.log($('table'));
        }
        browser.close();
        console.log('done');
    } catch (error) {
        console.log(' ### Error Queue autoLoginYahoo: ', error);
        inputData.status = 'ERROR'
        inputData.statusMessage = 'Error: ' + error.message,
        await inputData.save();
        cb({ error });
    }
};
export default class QueueLoginYahooAuction {
    constructor() {
        if (!queueLogin) {
            queueLogin = new Queue(autoLoginYahoo, { concurrent: 5, autoResume: true, cancelIfRunning: true });
        }
    }

    static async addNew(data) {
        if (!data) {
            return;
        }
        queueLogin.push(data);
    }
}
