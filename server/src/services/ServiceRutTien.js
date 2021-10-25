const { workerData, parentPort } = require('worker_threads');
const axios = require('axios-https-proxy-fix');
const Qs = require('query-string');
const config = require('config');
const cheerio = require('cheerio');
const Fs = require('fs');
// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"
const start = async () => {
    let amount = 0;
    try {
        let { cookie, proxy, bankInfo } = workerData;
        console.log(' ####### workerData: ', workerData);
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
        console.log(' ###### config : ', config.get('env'));
        if (config.get('env') === 'development') {
            proxyConfig = null;
        }
        let $ = null;
        let crumb = null;
        let payload = null;

        //============ UPDATE BANK =============
        console.log(' ==== list ==== ');
        let resList = await axios.get('https://salesmanagement.yahoo.co.jp/list', { headers, proxy: proxyConfig });
        console.log(' 111111111111 ');
        // Fs.writeFileSync('list.html', resList.data);
        $ = cheerio.load(resList.data);
        crumb = $('input[name=".crumb"]').val();
        payload = {
            '.crumb': crumb,
        };

        console.log(' ==== payout_confirm ==== ');
        let resPayoutConfirm = await axios.post('https://salesmanagement.yahoo.co.jp/payout_confirm', Qs.stringify(payload), { headers, proxy: proxyConfig });
        $ = cheerio.load(resPayoutConfirm.data);
        amount = $('#transferDetails > div > div > div:nth-child(2) > div:nth-child(3) > span').text().trim();
        amount = parseInt(amount);
        if (!amount) {
            throw new Error('The account is out of money');
        }

        // Fs.writeFileSync('resPayoutConfirm.html', resPayoutConfirm.data);
        crumb = resPayoutConfirm.data.split('.crumb')[1].split('form.appendChild(input1)')[0].replace(/\n/g, '').replace('";  input2.value = "', '').replace('"', '').replace(';', '').trim();

        let backCurrentText = $('#yjMain > div.acMdPaymentInfo.mT30.mB40 > div.TransferDetails > div > div > div:nth-child(5) > div:nth-child(3) > span');
        backCurrentText = backCurrentText.text().trim();
        console.log(' ### backCurrentText: ', backCurrentText);
        if (!backCurrentText.includes(bankInfo.bkSubName) || !backCurrentText.includes(bankInfo.bkAccountNum.substring(bankInfo.bkAccountNum.length - 2, bankInfo.bkAccountNum.length))) {
            console.log(' ======== Đổi Bank ========== ');
            let resChangeBank = await axios.get('https://edit.wallet.yahoo.co.jp/config/wallet_trans_update?.done=https%3A%2F%2Fsalesmanagement.yahoo.co.jp%2Flist', {
                headers: {
                    cookie,
                },
                proxy: proxyConfig,
            });
            $ = cheerio.load(resChangeBank.data);
            crumb = $('input[name=".crumb"]').val();
            console.log(' ######### crumb: ', crumb);

            if (!crumb) {
                console.log(' ======== Confirm Old Bank ========== ');
                if (!bankInfo.old_bank_number) {
                    throw new Error('Enter Old Bank Number');
                }
                payload = {
                    '.done': 'https://salesmanagement.yahoo.co.jp/list',
                    '.bail': '',
                    '.src': 'wallet',
                    '.from': '',
                    '.next': '1',
                    conttype: 'rcpbnkac',
                    bkAccountNum: bankInfo.old_bank_number,
                    next: '次へ',
                };
                payload = Qs.stringify(payload);
                let resConfirmOldBank = await axios.post('https://edit.wallet.yahoo.co.jp/config/wallet_recv_account_control', payload, {
                    headers: {
                        cookie,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                    },
                    proxy: proxyConfig,
                });
                // Fs.writeFileSync('resConfirmOldBank.html', resConfirmOldBank.data);
                $ = cheerio.load(resConfirmOldBank.data);
                crumb = $('input[name=".crumb"]').val();
            }
            console.log(' ######### crumb: ', crumb);

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
                ...bankInfo,
            };
            console.log(payload);

            payload = Qs.stringify(payload);
            let resChangeBankPost = await axios.post('https://edit.wallet.yahoo.co.jp/config/wallet_recv_account_control', payload, {
                headers: {
                    cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                },
                proxy: proxyConfig,
            });
            // Fs.writeFileSync('resChangeBankPost.html', resChangeBankPost.data);

            resList = await axios.get('https://salesmanagement.yahoo.co.jp/list', { headers, proxy: proxyConfig });
            $ = cheerio.load(resList.data);
            crumb = $('input[name=".crumb"]').val();
            payload = {
                '.crumb': crumb,
            };
            resPayoutConfirm = await axios.post('https://salesmanagement.yahoo.co.jp/payout_confirm', Qs.stringify(payload), { headers, proxy: proxyConfig });
            $ = cheerio.load(resPayoutConfirm.data);
            // Fs.writeFileSync('resPayoutConfirm.html', resPayoutConfirm.data);

            amount = $('#transferDetails > div > div > div:nth-child(2) > div:nth-child(3) > span').text().trim();
            amount = parseInt(amount);

            backCurrentText = $('#yjMain > div.acMdPaymentInfo.mT30.mB40 > div.TransferDetails > div > div > div:nth-child(5) > div:nth-child(3) > span');
            backCurrentText = backCurrentText.text().trim();
            console.log(' ### backCurrentText: ', backCurrentText);
            if (!backCurrentText.includes(bankInfo.bkSubName) || !backCurrentText.includes(bankInfo.bkAccountNum.substring(bankInfo.bkAccountNum.length - 2, bankInfo.bkAccountNum.length))) {
                throw new Error('Change Bank Error');
            }
            crumb = resPayoutConfirm.data.split('.crumb')[1].split('form.appendChild(input1)')[0].replace(/\n/g, '').replace('";  input2.value = "', '').replace('"', '').replace(';', '').trim();
        }

        console.log(' ====== Confirm Rut Tien ======= ');
        console.log(' #### crumb: ', crumb);

        payload = {
            ba: amount,
            '.crumb': crumb,
        };
        console.log(' ==== payout_done ==== ');
        console.log(' #### payload: ', payload);
        let resPayoutDone = await axios.post('https://salesmanagement.yahoo.co.jp/payout_done', Qs.stringify(payload), {
            headers: {
                cookie,
                origin: 'https://salesmanagement.yahoo.co.jp',
                referer: 'https://salesmanagement.yahoo.co.jp/payout_confirm',
            },
            proxy: proxyConfig,
        });
        // Fs.writeFileSync('resPayoutDone.html', resPayoutDone.data);
        console.log(' ==== payout_confirm ==== ');
        try {
            console.log(' ####### resPayoutDone 111: ', resPayoutDone.res);
            console.log(' ####### resPayoutDone 222 : ', resPayoutDone.res.responseUrl);
        } catch (error) {}

        try {
            console.log(' ####### resPayoutDone 3333 : ', resPayoutDone.res.IncomingMessage);
            console.log(' ####### resPayoutDone 4444: ', resPayoutDone.res.IncomingMessage.responseUrl);
        } catch (error) {}

        parentPort.postMessage({ status: 'SUCCESS', message: 'SUCCESS', amount });
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
        parentPort.postMessage({ status: 'ERROR', message: 'Error: ' + error.message, amount });
    }
};

start();
