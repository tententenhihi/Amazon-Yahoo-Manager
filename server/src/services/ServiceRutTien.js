const { workerData, parentPort } = require('worker_threads');
const axios = require('axios-https-proxy-fix');
const Qs = require('query-string');
const config = require('config');
const cheerio = require('cheerio');
const Fs = require('fs');
// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"

const changeBank = async (cookie, proxyConfig, oldBank, newBank) => {
    console.log(' ============================ Đổi Bank ========================= ');
    console.log(' ### oldBank:', oldBank);
    console.log(' ### newBank:', newBank);

    let payload = null;
    let crumb = null;
    console.log(' 11111 ');
    let resChangeBank = await axios.get('https://edit.wallet.yahoo.co.jp/config/wallet_trans_update?.done=https%3A%2F%2Fsalesmanagement.yahoo.co.jp%2Flist', {
        headers: {
            cookie,
        },
        proxy: proxyConfig,
        maxRedirects: 100,
    });
    console.log(' 222222 ');

    let $ = cheerio.load(resChangeBank.data);
    if (resChangeBank.data.includes('captchaAnswer')) {
        throw new Error('Captcha')
    }
    let fileName = new Date().getTime() + '.html';
    Fs.writeFileSync(fileName, resChangeBank.data);
    crumb = $('input[name=".crumb"]').val();
    if (!crumb) {
        // console.log(' ======== Confirm Old Bank ========== ');
        payload = {
            '.done': 'https://salesmanagement.yahoo.co.jp/list',
            '.bail': '',
            '.src': 'wallet',
            '.from': '',
            '.next': '1',
            conttype: 'rcpbnkac',
            bkAccountNum: oldBank.bkAccountNum,
            next: '次へ',
        };
        payload = Qs.stringify(payload);
        let resConfirmOldBank = await axios.post('https://edit.wallet.yahoo.co.jp/config/wallet_recv_account_control', payload, {
            headers: {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
            },
            proxy: proxyConfig,
            maxRedirects: 100,
        });
        $ = cheerio.load(resConfirmOldBank.data);
        crumb = $('input[name=".crumb"]').val();
    }

    let resChangeBankB1 = await axios.post('https://edit.wallet.yahoo.co.jp/config/wallet_recv_account_control', payload, {
        headers: {
            cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
        },
        proxy: proxyConfig,
        maxRedirects: 100,
    });
    // Fs.writeFileSync('resChangeBankB1.html', resChangeBankB1.data)
    $ = cheerio.load(resChangeBankB1.data);
    crumb = $('input[name=".crumb"]').val();
    console.log(' ### resChangeBankB1 crumb:', crumb);

    payload = {
        '.crumb': crumb,
        '.done': 'https://salesmanagement.yahoo.co.jp/list',
        '.bail': '',
        '.src': 'wallet',
        '.from': '',
        img_num: 0,
        type: 'BK',
        conttype: 'bnkacmgr',
        bank: 'on',
        bkSubCodeYucho: '',
        bkAccountNumYucho: '',
        edit: '同意して変更',
        ...newBank,
    };
    console.log(payload);

    payload = Qs.stringify(payload);
    let resChangeBankB2 = await axios.post('https://edit.wallet.yahoo.co.jp/config/wallet_recv_account_control', payload, {
        headers: {
            cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
        },
        proxy: proxyConfig,
        maxRedirects: 100,
    });

    // Fs.writeFileSync('resChangeBankB2.html', resChangeBankB2.data);
    return;
};

const start = async () => {
    let amount = 0;
    try {
        let { cookie, proxy, fakeBank, realBank } = workerData;
        console.log(' #### workerData: ', workerData);
        let headers = {
            cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
            origin: 'https://salesmanagement.yahoo.co.jp',
            referer: 'https://salesmanagement.yahoo.co.jp/list',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            timeout: 60 * 10000,
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
        let crumb = null;
        let payload = null;

        // ================= Đổi Bank =====================
        await changeBank(cookie, proxyConfig, fakeBank, realBank);

        let resList = await axios.get('https://salesmanagement.yahoo.co.jp/list', {
            headers: {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
            },
            proxy: proxyConfig,
            maxRedirects: 100,
        });
        $ = cheerio.load(resList.data);
        crumb = $('input[name=".crumb"]').val();
        payload = {
            '.crumb': crumb,
        };
        resPayoutConfirm = await axios.post('https://salesmanagement.yahoo.co.jp/payout_confirm', Qs.stringify(payload), {
            headers: {
                cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
            },
            proxy: proxyConfig,
            maxRedirects: 100,
        });
        $ = cheerio.load(resPayoutConfirm.data);
        // Fs.writeFileSync('resPayoutConfirm.html', resPayoutConfirm.data);
        amount = $('#transferDetails > div > div > div:nth-child(2) > div:nth-child(3) > span').text().trim();
        amount = parseInt(amount);

        backCurrentText = $('#yjMain > div.acMdPaymentInfo.mT30.mB40 > div.TransferDetails > div > div > div:nth-child(5) > div:nth-child(3) > span');
        backCurrentText = backCurrentText.text().trim();
        // console.log(' ### backCurrentText: ', backCurrentText);
        if (!backCurrentText.includes(realBank.bkSubName) || !backCurrentText.includes(realBank.bkAccountNum.substring(realBank.bkAccountNum.length - 2, realBank.bkAccountNum.length))) {
            throw new Error('Change Bank Error');
        }
        crumb = resPayoutConfirm.data.split('.crumb')[1].split('form.appendChild(input1)')[0].replace(/\n/g, '').replace('";  input2.value = "', '').replace('"', '').replace(';', '').trim();

        // console.log(' ==== payout_done ==== ');

        payload = {
            ba: amount,
            '.crumb': crumb,
        };
        let resPayoutDone = await axios.post('https://salesmanagement.yahoo.co.jp/payout_done', Qs.stringify(payload), {
            headers: {
                cookie,
                origin: 'https://salesmanagement.yahoo.co.jp',
                referer: 'https://salesmanagement.yahoo.co.jp/payout_confirm',
            },
            proxy: proxyConfig,
            maxRedirects: 100,
        });
        // ================= Đổi Bank =====================
        await changeBank(cookie, proxyConfig, realBank, fakeBank);

        parentPort.postMessage({
            status: 'SUCCESS',
            message: 'SUCCESS',
            amount,
        });
        // let resPayoutFinish = await axios.get(resPayoutDone.response.location, {
        //     headers: {
        //         cookie,
        //     },
        //     proxy: proxyConfig,
        // });
        // Fs.writeFileSync('resPayoutFinish.html', resPayoutFinish.data);

        // $ = cheerio.load(resPayoutFinish.data);
        // //
        // if (resPayoutFinish.data.includes('振込依頼が完了しました。')) {
        //     parentPort.postMessage({ status: 'SUCCESS', message: 'SUCCESS', amount });
        //     return;
        // }
        // parentPort.postMessage({ status: 'ERROR', message: resPayoutFinish.data, amount });
    } catch (error) {
        console.log(' #### rutTien: ', error);
        parentPort.postMessage({
            status: 'ERROR',
            message: 'Error: ' + error.message,
            amount,
        });
    }
};

start();
