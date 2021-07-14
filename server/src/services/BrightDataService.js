import Axios from 'axios';
let token = `fccab79c0ecbb29bd950417e492131ca`;
let username = 'lum-customer-c_84db29ae';
var port = 22225;

export default class BrightDataService {
    static async getZone() {
        try {
            let url = `https://brightdata.com/api/zone/get_active_zones`;
            let headers = {
                Authorization: `Bearer ${token}`,
            }
            let res = await Axios.get(url, { headers, timeout: 30 * 1000 });
            if (res && res.status === 200) {
                return res.data;
            }
            return null
        } catch (error) {
            console.log(" ### Error BrightDataService getZone: ", error);
            return null;
        }
    }
    static async getInfoZone(zoneName) {
        try {
            let url = `https://brightdata.com/api/zone?zone=${zoneName}`;
            let headers = {
                Authorization: `Bearer ${token}`
            }
            let res = await Axios.get(url, { headers });
            if (res && res.status === 200) {
                return res.data;
            }
            return null
        } catch (error) {
            console.log(" ### Error BrightDataService getInfoZone: ", error);
            return null;
        }
    }
    static async getIpByZone(zoneName) {
        try {
            let url = `https://brightdata.com/api/zone/route_ips?zone=${zoneName}&country=jp`;
            let headers = {
                Authorization: `Bearer ${token}`
            }
            let res = await Axios.get(url, { headers });
            console.log(' #### res: ', res);
            if (res && res.status === 200) {
                return res.data;
            }
            return null
        } catch (error) {
            console.log(" ### Error BrightDataService getIpByZone: ", error);
            return null;
        }
    }
    static async getAllIp() {
        let listZone = await this.getZone();
        if (listZone && listZone.length > 0) {
            for (let zone of listZone) {
                let infoZone = await this.getInfoZone(zone.name);
                if (infoZone) {
                    zone.password = infoZone.password[0];
                    let listIpByZone = await this.getIpByZone(zone.name);
                    if (listIpByZone) {
                        zone.ips = listIpByZone.split('\n').filter(x => x !== '');
                    }
                }
            }
        }
        let listIp = [];
        for (const zone of listZone) {
            for (const ip of zone.ips) {
                listIp.push({
                    zone: zone.name,
                    ip,
                    username,
                    password: zone.password,

                })
            }
        }
        return listIp;
    }
    static async loadProxyToDB() {
        let listProxy = getAllIp();
    }
}