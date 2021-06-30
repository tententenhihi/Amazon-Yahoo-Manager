import Queue from 'better-queue';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import ProductAuctionModel from '../models/ProductAuctionModel'
let queueLogin = null;
const autoLoginYahoo = async (inputData, cb) => {
    try {
        console.log('start login and get product')
        if (inputData.status == 'ERROR') {
            console.log(' ==== Start login Yahoo ====');
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto('https://login.yahoo.co.jp/config/login?auth_lv=pw&.lg=jp&.intl=jp&.src=auc&.done=https%3A%2F%2Fauctions.yahoo.co.jp%2F&sr_required=birthday%20gender%20postcode%20deliver',
                {waitUntil: 'load', timeout: 0});
            page.setDefaultNavigationTimeout(0)
            await page.type('#username', inputData.yahoo_id);
            await page.click('#btnNext');
            await page.waitForNavigation();
            await page.type('#passwd', inputData.password);
            await page.click('#btnSubmit');
            // Get cookies
            const cookies = await page.cookies();
            console.log('cookies: ', cookies);
            if (cookies.length > 4) {
                inputData.cookies_auction = cookies;
                inputData.status = 'SUCCESS';
                await inputData.save();
                await browser.close()
                console.log(' ==== End login ====');
                cb(null, inputData);
            } else {
                throw new Error('Can not get cookies')
            }
        }
        const browser = await puppeteer.launch({headless: false});
        let page2 = await browser.newPage();
        await page2.setCookie(...inputData.cookies_auction);
        await page2.goto('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling',
            {waitUntil: 'load', timeout: 0});
        page2.setDefaultNavigationTimeout(0)
        const data = await page2.evaluate(() => document.querySelector('*').outerHTML);
        let $ = cheerio.load(data);
        let productRows = $('table')[5].children[3].children.filter(item => item.type == 'tag' && item.name == 'tr');
        for (let i = 1; i < productRows.length; i++) {
            let row = productRows[i];
            let tdList = row.children.filter(item => item.type == 'tag' && item.name == 'td')
            let productId = tdList[0].children[0].data;
            let name = tdList[1].children[0].children[0].data;
            let price = tdList[2].children[0].children[0].data;

            let product = new ProductAuctionModel();
            product.yahoo_id = inputData.yahoo_id;
            product.product_id = productId;
            product.name = name;
            product.current_price = price;
            await product.save()
        }
        inputData.status = 'SUCCESS';
        await inputData.save();
        await browser.close();
        console.log('done get product yahoo auction');
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
