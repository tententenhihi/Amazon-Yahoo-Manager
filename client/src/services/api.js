import Axios from 'axios'
import store from '../store/store'


export default class Api {
  static post = async (url, data, exConfig) => {
    let config = {
      baseURL: process.env.SERVER_API,
      headers: {
        Authorization: "Bearer " + store.state.token
      },
      timeout: 10000
    };
    var newConfig = { ...config, ...exConfig };
    newConfig.headers = {
      ...newConfig.headers,
      ...{
        Authorization: "Bearer " + store.state.token
      }
    };
    var res = {};
    try {
      res = await Axios.post(url, data, newConfig);
    } catch (err) {
      res = err.response;
    }

    if (
      !res ||
      (!res.status &&
        !(res.data && res.data.status) &&
        !(
          res.error &&
          res.error.response &&
          (res.error.response.status || res.error.response.data.status)
        ))
    ) {
      res = {
        status: 1000,
        message: "Netword Error.!"
      };
    }

    if (res.status != 200) {
      console.log('error');
    }

    return res;
  };

  static get = async (url, exConfig) => {
    let config = {
      baseURL: process.env.SERVER_API,
      headers: {
        Authorization: "Bearer " + store.state.token
      },
      timeout: 10000
    };
    var newConfig = { ...config, ...exConfig };

    var res = {};
    try {
      res = await Axios.get(url, newConfig);
    } catch (err) {
      res = err.response;
    }

    // Check network error
    if (
      !res ||
      (!res.status &&
        !(res.data && res.data.status) &&
        !(res.error && res.error.response && res.error.response.data.status))
    ) {
      res = {
        status: 1000,
        message: "Netword Error.!"
      };
    }
    if (res.status != 200) {
      console.log('error');
    }
    return res;
  };
}
