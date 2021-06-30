const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio'); 

(async () => {
  const browser = await puppeteer.launch(
    {
      args: ["--no-sandbox",
		"--disable-setuid-sandbox"]
    }
  );
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

  // Get cookies
  const cookies = await page.cookies();
  console.log('cookies: ', cookies);

  // Use cookies in another tab or browser
  // let page2 = await browser.newPage();
  // await page2.setCookie(...[
  //   {
  //     name: 'XA',
  //     value: '2k7bp7tgdor83&t=1625058563&u=1625058578&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1rbGUrUOz5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel4hqWreNVpjy3+Mk/bXy6S/0',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1656594579.057148,
  //     size: 235,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameSite: 'None',
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'XC',
  //     value: '8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeUZgDsPtYNjdX0vGYdtDL2mCIqauDSkxnqbHfFYQrShJKT6HpnYyJsCDCgN3yCrHrWqTDoMDE6UyFw1Jfd3c6coolFc5h1AVgG5c67BCC+NErh7q7s7ZRrwOQu2NuUP4uq6NH/NCl6wj+B4jaul4OpXgpQmg1L+Qgu+ku4E6funiFQvgP0gYJ9aPTjp3n5ycGNXamLKnVTmlQw2lh3XxjxsoCCQ0zQqXP/KBgwtfrMdGpazWhnIQfyJyniRPGYl/DWTBUMGJ+/oRQkoUp8vGi6R0s2Mx19UlYiYVaXL7rJ60w6xqy/o1U+yDnpseQ/BbMY5aK4FBcFcfEbVVoLYVUxSRCzqK1vNplXVSXlIqdl6sVOQ3xzNc4uYpI0BazbVprJs0NnV0PrKLvKanJlBhxSE/cMSrtSVPMac8RIl0g/4mym44o+iuemfd+eeaDMtFvCjuR5y8hz36omL7s0hcTRrAKuVZTV4eEhJ3PcHyUVEjQ==.1',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.05687,
  //     size: 604,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameSite: 'None',
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'SSL',
  //     value: 'v=1&s=IDNoJ5RizwXNdtnzzGWlgscMvvEyMNFPZAvhZo038dImEIXSuEddedXSoLtv0rAZM4a4RB0of5h1Q5zS2oI9DA--&kv=0',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.056645,
  //     size: 102,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'Y',
  //     value: 'v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.05642,
  //     size: 86,
  //     httpOnly: false,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: '_n',
  //     value: 'cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathiftF4r47QDjyC5ByCz24C-3DTbJZlNAxkZCqZ2W2eY0wpKwng2Rv9DNILydgexvWnPCNqV9htzuB86VDwg9CCA78OLds4LUXejF5badk2crFMYOTSEEQtOAuB2wtW_xcDTG0GAWHP_gidxFmOKSc_4Fi5ClnbVTne0_VR2R_mdhLHKMy0pA7hVW4xMBakjPl-LBijsjxGwC1RZGbn_NWs3-0V0sF84pZbFaZv9L5Zlnuu_Hg5pbMSu-VTAESs1aWPXoh-iNJQ3Ne9fRo4RZg3DsOrl6Zp7JZXcfcUYCSKzs4xeOgNH3m9CJyWKBPfs1peH0Ql4y5Ke783oHp8RxbiKVB8EpBuhWsmteFr9I_mUbAaMaLySz_K_BSD8dnPWTQ79PZkRjh68Pc3eukwiJTTKInAcNZD8Yewb5uiNAvrL8cU45YT1nzs8ImCZ9BzuNLkeB2EqJQMim6nTkM8FhuiqiYMu7McEDSz6wHFfNZQbRN0s17OwQw2rO8Rwo86onH0JVASCpruIlxZcjeJMTD9_0O3k2dBbbL58d2XUrtsuVuJMvj_2lgMZYlg8tRwopMDQ26bECYjFVmejTjlBCzRs7S-gdctbp3XU9CBzPRneD4boQEI9Qdxr1PZD-W9bRuyq6Ty86aCjzso7LBI72ccdidSeFZaZk0ZciKnQ8bBH3MHkxz4TStuI-7qxsqgIcA4JWh3y_icnbuQiriDongjc7EeL-MHA1zB9OQ_7Bi8WoiAWv46qqHbLcz0j4fc6Ts00uAKewhl0mSsiTDRpwxMMmfVYhyok2W41MYzPTNlEVferaX5WNLNGwpcwKrehEoVsu1lUkr9nD_dvRT9BiiQLGnUWrby80RRJGo_G7_rbl38c224ImlRLuMaulRLaCmjCS0Wjq2I5435dLUYpK59WsQppTcXDQRLziYdzuT7U7dVHIKb8uK2FKidIzraQ0SOM2glnLcdHkr_AvT_dqQKVst8-I05jaHpoeKQcfE2aTfbEMwC1iiaz2w4_9aon5r0vUlB_jYyTED_1KCoZZmvWluy8TtSXglsuFtMrmN0zXUEWr7p74oKsMLLQmFvNjmC34rcit-q-nJfqW61LVUVk.3',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.056725,
  //     size: 1199,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'T',
  //     value: 'z=R0G3gBRcVAhB2kU4cVsUN9FMDc2NwZONTMzMTA0NzY-&sk=DAAs8m9yz.MAUK&ks=EAA5I2zHcK.wksKBxzB55Y8NQ--~F&kt=EAA.WSZbIrr8Z50T2Bjp0O2OA--~E&ku=FAAMEUCIQCiUAfwpnI2v0xfF.b4sJ4i_IqbkqxCwrBrg2P7b3PjUgIgZIH6nAiKQISMHEe2S6wDgCL2XBASbV6IGhQJ8rS7Zy4-~B&d=dGlwAU9nLkx6QgFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFSMEczZ0JBMko-',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.056527,
  //     size: 358,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'B',
  //     value: '2k7bp7tgdor83&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=rq&i=WzJ1rq.AUhG1LLoPyaWS',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.056199,
  //     size: 89,
  //     httpOnly: false,
  //     secure: false,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'YLS',
  //     value: 'v=2&p=1&n=1',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1625663378.056112,
  //     size: 14,
  //     httpOnly: false,
  //     secure: false,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'A',
  //     value: '2k7bp7tgdor83&t=1625058563&u=1625058578&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1rbGUrUOz5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel4hqWreNVpjy3+Mk/bXy6S/0',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1656594579.05706,
  //     size: 234,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'XB',
  //     value: '2k7bp7tgdor83&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=rq&i=WzJ1rq.AUhG1LLoPyaWS',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.056301,
  //     size: 90,
  //     httpOnly: false,
  //     secure: true,
  //     session: false,
  //     sameSite: 'None',
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   },
  //   {
  //     name: 'F',
  //     value: 'a=Uv08FV0MvRhTQ4HD52CRdnu6Hzf6TYuafjqHg7bz2LYN2zmRO7KLZkrgHlgAb9O.Bv6NlGo-&b=KNNB',
  //     domain: '.yahoo.co.jp',
  //     path: '/',
  //     expires: 1688216979.055972,
  //     size: 82,
  //     httpOnly: false,
  //     secure: false,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: 'Secure',
  //     sourcePort: 443
  //   }
  // ]
  // );
  // // Open the page as a logged-in user
  // await page2.goto('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling',
  //   {waitUntil: 'load', timeout: 0});
  // page2.setDefaultNavigationTimeout(0)
  // const data = await page2.evaluate(() => document.querySelector('*').outerHTML);
  // let $ = cheerio.load(data);
  // let productRows = $('table')[5].children[3].children.filter(item => item.type == 'tag' && item.name == 'tr');
  // for (let i = 1; i < productRows.length; i++) {
  //   let row = productRows[i];
  //   let tdList = row.children.filter(item => item.type == 'tag' && item.name == 'td')
  //   // console.log(tdList[0].children[0].data);
  //   console.log(tdList[1].children[0].children[0].data);
  //   console.log(tdList[2].children[0].children[0].data);
  // }
  // console.log('done');
  await browser.close();
})();
// ('table')[5].children[0].children[1].children[0].innerText