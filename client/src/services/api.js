import Axios from "axios";
import store from "../store/store";
import {
  EventBus
} from "@/events/EventBus";

import Vue from "vue";
var vue = new Vue({});

var showError = res => {
  switch (res.status) {
    case 401:
      vue.$swal.fire({
        icon: "error",
        title: "未ログイン"
      });
      break;
    case 1001:
      vue.$swal.fire({
        icon: "warning",
        title: "更新完了"
      });
      break;
    case 1000:
      vue.$swal.fire({
        icon: "error",
        title: "接続エラー"
      });
      break;
    case 500:
      vue.$swal.fire({
        icon: "error",
        title: `サーバー接続のエラーが発生しました。管理者に連絡しください。`
      });
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
        title: `${
          res.data.message ? res.data.message : "APIが見つかりませんでした"
        }`
      });
      break;
    case 409:
      vue.$swal.fire({
        icon: "error",
        title: `既に存在してます`
      });
      break;
    default:
      vue.$swal.fire({
        icon: "error",
        title: "未ログイン"
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
      timeout: 5 * 60 * 1000
    };
    var newConfig = {
      ...config,
      ...exConfig
    };
    newConfig.headers = {
      ...newConfig.headers,
      ...{
        Authorization: "Bearer " + store.state.token
      }
    };
    var res = {};
    console.log(' ##### 33333333: ', newConfig)

    try {
      EventBus.$emit("showLoading", true);
      res = await Axios.post(url, data, newConfig);
    } catch (err) {
      console.log(' ##### 4444: ', err)
      console.log(' ##### res: ', res)


      if (err.message.includes("timeout")) {
        res = {
          status: 1001,
          message: err.message
        };
      } else {
        res = err.response;
      }
    }
    EventBus.$emit("showLoading", false);
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
        message: "サーバー接続のエラーが発生しました。管理者に連絡しください。"
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
      timeout: 60000
    };
    var newConfig = {
      ...config,
      ...exConfig
    };

    var res = {};
    try {
      EventBus.$emit("showLoading", true);
      res = await Axios.get(url, newConfig);
    } catch (err) {
      res = err.response;
    }
    EventBus.$emit("showLoading", false);
    // Check network error
    if (
      !res ||
      (!res.status &&
        !(res.data && res.data.status) &&
        !(res.error && res.error.response && res.error.response.data.status))
    ) {
      res = {
        status: 1000,
        message: "サーバー接続のエラーが発生しました。管理者に連絡しください。"
      };
    }
    if (res.status != 200) {
      showError(res);
    }
    return res;
  };
}
