const Apify = require('apify');
const { log } = Apify.utils;

Apify.main(async () => {
    // Get the username and password inputs
    // const input = await Apify.getValue('INPUT');

    const browser = await Apify.launchPuppeteer();
    const page = await browser.newPage();
    await page.goto('https://login.yahoo.co.jp/config/login?auth_lv=pw&.lg=jp&.intl=jp&.src=auc&.done=https%3A%2F%2Fauctions.yahoo.co.jp%2F&sr_required=birthday%20gender%20postcode%20deliver',
      {waitUntil: 'load', timeout: 0});

    // Login
    page.setDefaultNavigationTimeout(0)
    await page.type('#username', 'exffk72575');
    await page.click('#btnNext');
    await page.waitForNavigation();
    await page.type('#passwd', 'hPPofa95hg%');
    await page.click('#btnSubmit');
    await page.waitForNavigation();

    await Promise.all([
      await page.click('.Close-sc-1nsnvko')
    ]);

    // Get cookies
    const cookies = await page.cookies();
    log.info('cookies: ', cookies);

    // Use cookies in another tab or browser
    let page2 = await browser.newPage();
    await page2.setCookie(...cookies);
    // Open the page as a logged-in user
    await page2.goto('https://auctions.yahoo.co.jp/user/jp/show/mystatus',
      {waitUntil: 'load', timeout: 0});
      page2.setDefaultNavigationTimeout(0)

    await browser.close();

    log.info('Done.');
});