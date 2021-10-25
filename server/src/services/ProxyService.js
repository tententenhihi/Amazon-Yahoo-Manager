const ProxySchema = require('../models/ProxyModel');
const axios = require('axios-https-proxy-fix');
const Utils = require('../utils/Utils');
const config = require('config');

class ProxyService {
    static async getProxyById(id) {
        try {
            let proxy = await ProxySchema.findById(id);
            return proxy;
        } catch (error) {
            throw error;
        }
    }

    static async updateProxy(id, dataUpdate) {
        try {
            let newProxy = await ProxySchema.findByIdAndUpdate(id, { $set: { ...dataUpdate } }, { new: true });
            return newProxy != null;
        } catch (error) {
            console.log(' Error ProxyService updateProxy: ', error);
            return false;
        }
    }

    static async checkLiveProxy(proxy) {
        try {
            if (config.get('env') === 'development') {
                return true;
            }
            let timeout = 0;
            while (timeout < 3) {
                try {
                    let res = await axios.get('http://lumtest.com/myip.json', {
                        proxy: {
                            host: proxy.host,
                            port: proxy.port,
                            auth: {
                                username: proxy.username,
                                password: proxy.password,
                            },
                        },
                    });
                    if (res && res.status === 200 && res.data.ip === proxy.ip) {
                        return true;
                    }
                } catch (error) {}
                timeout++;
                await Utils.sleep(10 * 1000);
            }
            console.log(' ### PROXY DIE', proxy);
            return false;
        } catch (error) {
            console.log(' ### ERROR checkLiveProxy :', error.message);
            return false;
        }
    }

    static async findByIdAndCheckLive(id) {
        let proxy = await this.getProxyById(id);
        if (!proxy) {
            return {
                status: 'ERROR',
                statusMessage: 'プロキシが見つかりません！ ',
            };
        } else {
            if (proxy.status === 'die') {
                return {
                    status: 'ERROR',
                    statusMessage: 'プロキシが壊れた',
                };
            }
            if (proxy.status === 'lock') {
                return {
                    status: 'ERROR',
                    statusMessage: 'プロキシがロックされています ',
                };
            }
            let checkLive = await this.checkLiveProxy(proxy);
            if (!checkLive) {
                await this.updateProxy({ _id: proxy._id, status: 'die' });
                return {
                    status: 'ERROR',
                    statusMessage: 'プロキシが壊れた',
                };
            } else {
                return {
                    status: 'SUCCESS',
                    data: proxy,
                };
            }
        }
    }
}

module.exports = ProxyService;
