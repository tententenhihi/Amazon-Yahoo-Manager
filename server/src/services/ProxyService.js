import ProxySchema from '../models/ProxyModel';
import axios from 'axios'
export default class ProxyService {
  static async getProxyById(id) {
    try {
      let proxy = await ProxySchema.findById(id);
      return proxy;
    } catch (error) {
      throw error;
    }
  }

  static async checkLiveProxy(proxy) {
    try {
      proxy = {
        id: '178.171.80.121',
        host: 'zproxy.lum-superproxy.io',
        port: 22225,
        username: 'lum-customer-c_84db29ae-zone-zone2-ip-178.171.80.121',
        password: '7ox35md3j0jm'
      }
      let res = await axios.get('http://lumtest.com/myip.json',
        {
          proxy: {
            host: proxy.host,
            port: proxy.port,
            auth: {
              username: proxy.username,
              password: proxy.password
            }
          }
        }
      )
      if (res && res.status === 200 && res.data.ip === proxy.ip) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(' ### Error checkLiveProxy: ', error);
      return false;
    }
  }
}
