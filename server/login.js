const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio'); 
const { lowerFirst } = require('lodash');

(async () => {
  const browser = await puppeteer.launch();
  // const page = await browser.newPage();

  // await page.goto('https://login.yahoo.co.jp/config/login?auth_lv=pw&.lg=jp&.intl=jp&.src=auc&.done=https%3A%2F%2Fauctions.yahoo.co.jp%2F&sr_required=birthday%20gender%20postcode%20deliver',
  //     {waitUntil: 'load', timeout: 0});

  //   // Login
  // page.setDefaultNavigationTimeout(0)
  // await page.type('#username', 'exffk72575');
  // await page.click('#btnNext');
  // await page.waitForNavigation();
  // await page.type('#passwd', 'hPPofa95hg%');
  // await page.click('#btnSubmit');

  // // Get cookies
  // const cookies = await page.cookies();
  // console.log('cookies: ', cookies);

  // Use cookies in another tab or browser
  let page2 = await browser.newPage();
  await page2.setCookie(
    {
      name: 'XA',
      value: '7v3l8elgdjpe8&t=1624892872&u=1624892913&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQxjYG8nVuf5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUem1Bucc6N9MmVL25LJiHRmh/0',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1656428913.429762,
      size: 235,
      httpOnly: true,
      secure: true,
      session: false,
      sameSite: 'None',
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'XC',
      value: '8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeUiwSajdQQZiZNaGyHFx/bWneOBfocYek+/99L4tIoVB08l4jBIyYwpwOUdTD3Q/qIVvH09UGceoqbSqL6krIbiu90OzdWu9uMhfcn5Db6nAGPm4zjKJIyvLle53auRd6MR2FIwSHgLikuzHEWxkO6RtlqOXT80Gy7uZEhOWDR1lzyM+4pa0i63AUa2Ew5zXB+7dIB00BmDn2qglV36HwGmwUKpEm7YrfWVPEx1DzwfS2alzJo37AyLt5vYvYGGv7byhEKO/YgLc/PARqfuWqK01+PU8wC7bFwXaZQpoDek21mObxpX6TXjWvXosZmc0pyI+1ItQHSAeHNTkzRRx3DXTGVY2WZFZ2TsNag14E7M4sPQ5ncrmL77A4IijJQVkORTcPpBTiJwiJZ0ucmG7t1+IQKqOMqNlrfpY0M3ZWA8chUVilEohpBJcNjAY8hMbk78vUyH9AOviV1byzfP7ZEdfum4/Chnu3Obb05nqpSXkw==.1',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.429598,
      size: 604,
      httpOnly: true,
      secure: true,
      session: false,
      sameSite: 'None',
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'SSL',
      value: 'v=1&s=uZFAlunsRn0YBK1pXnuOjhuH.2jxBqJJpstZCDuUaZqKALG3E5COZZ2STBhFWKs6EyiKpJ_mk6AmyG1LQREt8Q--&kv=0',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.429521,
      size: 102,
      httpOnly: true,
      secure: true,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'Y',
      value: 'v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.429462,
      size: 86,
      httpOnly: false,
      secure: true,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: '_n',
      value: 'cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathudMpqCddcZf7eBkpegBaoQOeChORB_s7eme6g5iZvWVlpuCT631Z5_yVJJOfFvZfrICwB1gtAf2iybBdBTq58hNFzt9bcNZIn3-CTukHZE0PWAlGGH68IDfOTgIIMjovAkIGftcPMoFIz4JJUcRihpQRNPmQt4iYGW33I2q1rrN_csTG0E9hkqPrdznnbBiyzfTCFeot_TGi-8BckqNc5UGcvUWC0KbkThyf3EI9t7dRwWDmZfMjaxo5siyD6s6EylPmh0FDwos3sVTb5qknJi4Zwes2nLFiL41sBvJnpzuTaD6mJoLNRsJptsBd--oZFz_axV3wKdgOjKelXSK2m7CMQZS1LdQjXhxY0QBx5XVGXi39JmwJQsmxksilUWoVQ3Fl43N9N5ZXrCHq-LLf56G3OUs4IcQgLgZWhgJHHJyfS3ecZf1n-eKz4WPx1jexOQudvORi5LOFK3Fk85IEaqE-7tz1XO4ggYU7W7Fg-QkwgXgu_ficCTYk7n3ttXtRDXUma1SibBW4AhB9KB_wiWMbKdWzIlaZSwcRzuyPZlsElGnvMKm2eDWYQK5kl7mgDFBECKJI5Y0jfrJO1c5HspYKE3lgovQ1-GpIUf9cYTR9oMWXfQt8QmBhOwJoDnt2UK4mgIHZFd2yDoF8Gl9T85nHfKNifLfbHaIhIjm6kckPMhjEHIwFRd7vTkQsbETWSuOGGKzCzPLP4fJRHraFNxS_jR2Q2PYOBott3RWEslkc_Op29RK452nGXof9RUaAuIcR1EGLBmo_zv5pHrK7Wqzmrh_a8fVeyBz_vth0DjXuG_WP3vN0Gm3TkwvOY91ooH58hBQn8p5MkBtxD2S06JQrvhKOSN-B-4G8oqPUoqwPHUhCGbwMmpmAYwvce1lZWS4zkcmQF-SOd5SnK_YX7I67ZvTRIYzcWrgcKw_mXdaqPmRDhG7IPnJaPGXmbFkL8u1rviHaYKbhmhwh4kQ0bYaMhpqHjV8ZTxfMq6VsetYJKCmKmmVVHN5XTD-gamzEcEd0sYOlyOPzh6suYMRS7jFgSZZukGAMM1Bf67fNAq03AWHbGNmMKaN-5p0o8NgTYfgdax1uO8V8cbNVX463RI.3',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.429546,
      size: 1199,
      httpOnly: true,
      secure: true,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'T',
      value: 'z=xXe2gBx/s/gB8K3F17GBXJpMDc2NwZONTMzMTA0NzY-&sk=DAATAltIm/pKti&ks=EAAxiQZ1eI3AeqlMtEJFZRb7Q--~F&kt=EAA_dd4ZlKRGqJwtoKwka5BXQ--~E&ku=FAAMEYCIQDKuQ.S4ncM2rKYgi0xFqcSPnFrhNyEFLTPxL.N37f3KQIhALOmi1B5897TdKdRKNHg25oQ4_QmmL0HHaLDvTeLzuLd~B&d=dGlwAU9nLkx6QgFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egF4WGUyZ0JBMko-',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.429492,
      size: 358,
      httpOnly: true,
      secure: true,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'B',
      value: '7v3l8elgdjpe8&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=0r&i=XUu6uet3uleLHNXqOTE7',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.429384,
      size: 89,
      httpOnly: false,
      secure: false,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'YLS',
      value: 'v=2&p=1&n=1',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1625497713.429351,
      size: 14,
      httpOnly: false,
      secure: false,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'A',
      value: '7v3l8elgdjpe8&t=1624892872&u=1624892913&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQxjYG8nVuf5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUem1Bucc6N9MmVL25LJiHRmh/0',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1656428913.429662,
      size: 234,
      httpOnly: true,
      secure: true,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'XB',
      value: '7v3l8elgdjpe8&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=0r&i=XUu6uet3uleLHNXqOTE7',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.42943,
      size: 90,
      httpOnly: false,
      secure: true,
      session: false,
      sameSite: 'None',
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    },
    {
      name: 'F',
      value: 'a=DKJr__wMvRjvJvLr.ANhJNdU7vLzBZPbDGlIG2zLVtgAudzOaHire3KK8bamoLbUE_lY34E-&b=t8rQ',
      domain: '.yahoo.co.jp',
      path: '/',
      expires: 1688051313.42927,
      size: 82,
      httpOnly: false,
      secure: false,
      session: false,
      sameParty: false,
      sourceScheme: 'Secure',
      sourcePort: 443
    });
  // Open the page as a logged-in user
  await page2.goto('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling',
    {waitUntil: 'load', timeout: 0});
  page2.setDefaultNavigationTimeout(0)
  let res = await axios.get('https://auctions.yahoo.co.jp/openuser/jp/show/mystatus?select=selling');
  if (res && res.status === 200) {
    let html = res.data;
    let $ = cheerio.load(html);
    console.log($('table'));
  }
  console.log('done');

  await browser.close();
})();