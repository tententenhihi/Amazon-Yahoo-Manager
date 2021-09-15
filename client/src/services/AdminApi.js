import Api from "./apiAdmin";
const prefix = "/api/v1/admin";

export default {
  getUsers() {
    return Api.get(prefix + "/users");
  },
  createUser(data) {
    return Api.post(prefix + "/users/create", data);
  },
  updateUser(data) {
    return Api.post(prefix + "/users/update/" + data._id, data);
  },
  deleteUser(data) {
    return Api.post(prefix + "/users/delete/" + data._id, data);
  },
  getProxies() {
    return Api.get(prefix + "/proxies");
  },
  getYahooAccounts() {
    return Api.get(prefix + "/yahoo-accounts");
  },
  setProxyToYahooAccount(data) {
    return Api.post(prefix + "/set-proxy-to-yahoo-account", data);
  },
  getBlackListAsin() {
    return Api.get(prefix + "/get-black-list-asin");
  },
  getWhiteListAsin() {
    return Api.get(prefix + "/get-white-list-asin");
  },
  createAsin(data) {
    return Api.post(prefix + "/create-asin", data);
  },
  deleteAsin(id) {
    return Api.post(prefix + "/delete-asin/" + id);
  },
  unLockProxy(id) {
    return Api.post(prefix + "/unlock-proxy/" + id);
  },
  loadProxyAgain(id) {
    return Api.get(prefix + "/reload-proxy", { timeout: 5 * 60 * 1000 });
  }
};
