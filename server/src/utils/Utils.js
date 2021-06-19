import Fs from 'fs';
import Path from 'path';
import FS from 'fs';
import Axios from 'axios';
import MTD from '../lib/zeltice-mt-downloader';

var toString = (str) => {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
};

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(resolve, time);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const removeAllTag = (text) => {
    var regex = /(<([^>]+)>)/gi;
    let result = text.replace(regex, '');
    return result;
};

const isUrlEndcoded = (url) => {
    return url.includes('%');
};

const downloadFile = async (url, saveFile, onProgress, idVideo) => {
    while (url.includes('\\')) {
        url = url.replace('\\', '/');
    }
    if (url.includes(SERVER_MAIN_FILE)) {
        url = url.replace('/file', '');
    }
    if (!isUrlEndcoded(url)) {
        url = encodeURI(url);
    }
    console.log(' ==========  START DOWNLOAD: ', url);

    try {
        let result = await new Promise((resolve, reject) => {
            try {
                var options = {
                    count: 8, //(Default: 2)
                    headers: { cookies: 'abc=pqr;' },
                    method: 'GET', //(Default: GET)
                    port: 80, //(Default: 80)
                    timeout: 5, //(Default: 5 seconds)
                    range: '0-100', //(Default: '0-100')
                    onStart: function (meta) {},
                    onEnd: async function (err, result) {
                        if (err) {
                            if (Fs.existsSync(saveFile)) Fs.unlinkSync(saveFile);
                            console.log(' #### Lỗi Download lần 1: ', err);
                            reject(false);
                        }
                        // console.log(' ########### resolve 1 ===============');
                        resolve(true);
                    },
                };
                var downloader = new MTD(saveFile, url, options);
                downloader.start();
            } catch (error) {
                console.log(' ############ Error downloadFile 222: ', error.message);
                resolve(false);
            }
        });
        if (!result) {
            console.log(' #### Lỗi Download lần 1.......... Đang Thử lại');
            await sleep(2000);
            result = await new Promise((resolve, reject) => {
                try {
                    var options = {
                        count: 8, //(Default: 2)
                        headers: { cookies: 'abc=pqr;' },
                        method: 'GET', //(Default: GET)
                        port: 80, //(Default: 80)
                        timeout: 5, //(Default: 5 seconds)
                        range: '0-100', //(Default: '0-100')
                        onStart: function (meta) {},
                        onEnd: async function (err, result) {
                            if (err) {
                                if (Fs.existsSync(saveFile)) Fs.unlinkSync(saveFile);
                                console.log(' #### Lỗi Download lần 2: ', err);
                                reject(false);
                            }
                            // console.log(' ########### resolve 1');
                            resolve(true);
                        },
                    };

                    var downloader = new MTD(saveFile, url, options);
                    downloader.start();
                } catch (error) {
                    console.log(' ############ Error downloadFile 222: ', error.message);
                    resolve(false);
                }
            });
        }
        if (result) {
            console.log(' =========  FINISH DOWNLOAD  =========');
        }
        return result;
    } catch (error) {
        console.log(' ############ Error downloadFile 111: ', error.message);
    }
};

var deleteFolder = function (path) {
    if (FS.existsSync(path)) {
        FS.readdirSync(path).forEach(function (file, index) {
            var curPath = path + '/' + file;
            if (FS.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolder(curPath);
            } else {
                // delete file
                FS.unlinkSync(curPath);
            }
        });
        FS.rmdirSync(path);
    } else {
        console.log(' not exist', path);
    }
};

const converTimeToSecound = (time) => {
    try {
        let times = time.split(':');
        let totalTime = parseInt(times[0]) * 3600 + parseInt(times[1]) * 60 + parseInt(times[2].split('.')[0]) + parseInt(times[2].split('.')[1]) / 100;
        return totalTime;
    } catch (error) {
        return 0;
    }
};

const generateKey = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const secondsToHHMMSS = (sec) => {
    var hours = Math.floor(sec / 3600);
    hours >= 1 ? (sec = sec - hours * 3600) : (hours = '00');
    var min = Math.floor(sec / 60);
    min >= 1 ? (sec = sec - min * 60) : (min = '00');
    // sec < 1 ? (sec = '00') : void 0;
    min.toString().length == 1 ? (min = '0' + min) : void 0;
    sec = sec.toFixed(2);

    sec.toString().length == 1 ? (sec = '0' + sec) : void 0;

    if (sec > 0 && sec < 10) {
        sec = '0' + sec;
    }

    let time = hours + ':' + min + ':' + sec;
    return time;
};

const deleteFolderRecursive = async function (path) {
    if (Fs.existsSync(path)) {
        let listFile = Fs.readdirSync(path);
        for (let i = 0; i < listFile.length; i++) {
            let file = listFile[i];
            const curPath = Path.join(path, file);

            if (Fs.lstatSync(curPath).isDirectory()) {
                // recurse
                await deleteFolderRecursive(curPath);
            } else {
                // delete file
                Fs.unlinkSync(curPath);
                await sleep(100);
            }
        }
        Fs.rmdirSync(path);
        await sleep(100);
    }
};

const partFileName = (filename) => {
    if (!filename) {
        return null;
    }
    if (filename.length > 200) {
        filename = filename.substring(0, 200);
    }
    return filename + '-' + generateKey();
};
const Utils = {
    downloadFile,
    converTimeToSecound,
    deleteFolder,
    sleep,
    generateKey,
    secondsToHHMMSS,
    removeAllTag,
    deleteFolderRecursive,
    isUrlEndcoded,
    partFileName,
    toString,
};

export default Utils;
