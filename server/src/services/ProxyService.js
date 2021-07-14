import ProxySchema from '../models/ProxyModel';
import axios from 'axios-https-proxy-fix';
import Utils from '../utils/Utils';
export default class ProxyService {
    static async getProxyById(id) {
        try {
            let proxy = await ProxySchema.findById(id);
            return proxy;
        } catch (error) {
            throw error;
        }
    }

    static async updateProxy(dataUpdate) {
        try {
            let newProxy = await ProxySchema.findByIdAndUpdate(dataUpdate._id, { $set: { ...dataUpdate } }, { new: true });
            return newProxy != null;
        } catch (error) {
            console.log(' Error ProxyService updateProxy: ', error);
            return false;
        }
    }

    static async checkLiveProxy(proxy) {
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
            } catch (error) {
                console.log(' ####  Error checkLiveProxy: ', error);
            }
            timeout++;
            await Utils.sleep(10 * 1000);
        }
        return false;
    }

    static async findByIdAndCheckLive(id) {
        let proxy = await this.getProxyById(id);
        if (!proxy) {
            return {
                status: 'ERROR',
                statusMessage: 'Proxy not found!',
            };
        } else {
            let checkLive = await this.checkLiveProxy(proxy);
            if (!checkLive) {
                await this.dataUpdate({ _id: proxy._id, status: 'die' });
                return {
                    status: 'ERROR',
                    statusMessage: 'Proxy is dead',
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
