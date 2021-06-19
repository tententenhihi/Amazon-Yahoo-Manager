import Response from '../utils/Response';
import Axios from 'axios';
import Utils from '../utils/Utils';
const cheerio = require('cheerio');

export default class AmazonController {
    static async getInfoProductByASIN(req, res) {
        let response = new Response(res);
        try {
            let asin = req.body.asin;
            console.log(asin);

            let headers = {
                Connection: 'keep-alive',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'max-age=0',
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36 Edg/91.0.864.48',
                'upgrade-insecure-requests': '1',
                'sec-ch-ua': `Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91`,
                // "Connection": "keep",
                // "Connection": "keep",
                // "Connection": "keep",
                // "Connection": "keep",
                // "Connection": "keep",
                // "Connection": "keep",
                // "Connection": "keep",
            };
            let requestAmazon = await Axios.get(`https://www.amazon.com/s?k=${asin}`, { headers });
            if (requestAmazon && requestAmazon.status === 200) {
                let html = requestAmazon.data;
                let $ = cheerio.load(html);
                let list = $(
                    '#search > div.s-desktop-width-max.s-opposite-dir > div > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div'
                );
                let itemAsin = null;
                for (let i = 0; i < list.length; i++) {
                    const item = list[i];
                    let asinItem = $(item).attr('data-asin');
                    if (asinItem && asinItem.trim() === asin) {
                        itemAsin = item;
                    }
                }
                if (itemAsin) {
                    let aTag = $(itemAsin).find('.a-link-normal.s-no-outline');
                    if (aTag && aTag.attr('href')) {
                        let url = `https://www.amazon.com` + aTag.attr('href').trim();
                        let requestProductAmazon = await Axios.get(url, { headers });
                        if (requestAmazon && requestAmazon.status === 200) {
                            $ = cheerio.load(requestProductAmazon.data);
                            let nameProduct = $('#productTitle').text().trim();
                            let priceProduct = $('#priceblock_ourprice').text().trim();

                            return response.success200({ nameProduct });
                        }
                    } else {
                        return response.error400({ message: 'not found tag a href url Product' });
                    }
                } else {
                    return response.error400({ message: 'not found itemAsin' });
                }
                // console.log(list);
                return response.success200({});
            } else {
                console.log(' ### requestAmazon: ', requestAmazon);
                return response.error400({ message: 'Lỗi không load được Amazon: ' });
            }
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }
}
