import ProxySchema from '../models/ProxyModel';
import axios from 'axios'
export default class ProxyService {
  static async getIpProxy () {
    let proxies = await ProxySchema.find();
    if (!proxies.length) {
      const configs = {
        headers: {
          Authorization: `Bearer fccab79c0ecbb29bd950417e492131ca`
        }
      }
      let result = await axios.get('https://brightdata.com/api/zone/route_ips?zone=zone2&country=jp', configs)
      let data = result.data.split('\n').map((item, index) => {
        return {
          ip: item,
          proxy_id: ++index
        }
      });
      await ProxySchema.insertMany(data);
    }
    return proxies;
  }
}