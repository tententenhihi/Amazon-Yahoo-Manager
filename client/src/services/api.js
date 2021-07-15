import Axios from "axios";
import store from "../store/store";
import {EventBus} from '@/events/eventBus'

import Vue from "vue";
var vue = new Vue({});

var showError = res => {
  switch (res.status) {
    case 401:
      vue.$swal.fire({
        icon: "error",
        title: "Chưa Đăng Nhập"
      });
      break;
    case 1000:
      vue.$swal.fire({
        icon: "error",
        title: "Lỗi Kết Nối Server"
      });
      break;
    case 500:
      vue.$swal.fire({
        icon: "error",
        title: `Lỗi Server. Vui Lòng báo cho Admin.!`
      });
      console.log(res);
      break;
    case 400:
      if (res && res.data && res.data.isActive === false) {
        return;
      }
      vue.$swal.fire({
        icon: "error",
        title: `${res.data.message ? res.data.message : ""}`
      });
      break;
    case 404:
      vue.$swal.fire({
        icon: "error",
        title: `${res.data.message ? res.data.message : "Không tìm thấy Api"}`
      });
      break;
    case 409:
      vue.$swal.fire({
        icon: "error",
        title: `Đã Tồn Tại.!`
      });
      break;
    default:
      vue.$swal.fire({
        icon: "error",
        title: "Lỗi"
      });
      break;
  }
};

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
      EventBus.$emit('showLoading', true)
      res = await Axios.post(url, data, newConfig);
      EventBus.$emit('showLoading', false)
    } catch (err) {
      EventBus.$emit('showLoading', false)
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
      showError(res);
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
      EventBus.$emit('showLoading', true)
      res = await Axios.get(url, newConfig);
      EventBus.$emit('showLoading', false)
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
      showError(res);
    }
    return res;
  };
}
