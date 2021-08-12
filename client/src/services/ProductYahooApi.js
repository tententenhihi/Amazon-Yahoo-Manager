import Api from "./api";
const prefix = "/api/v1/product-yahoo";
export default {
  get(yahooAccountId) {
    return Api.get(`${prefix}/get/${yahooAccountId}`);
  },
  create(credentials) {
    return Api.post(`${prefix}/create`, credentials);
  },
  show(id) {
    return Api.get(`${prefix}/show/${id}`);
  },
  update(id, credentials) {
    return Api.post(`${prefix}/update/${id}`, credentials);
  },
  delete(id) {
    return Api.post(`${prefix}/delete/${id}`);
  },
  switchWatchOption(data) {
    return Api.post(`${prefix}/switch-watch-option`, data);
  },
  changeProductFolder(data) {
    return Api.post(`${prefix}/change-product-folder`, data);
  },
  deleteMultipleProduct(data) {
    return Api.post(`${prefix}/delete-multiple-product`, data);
  },
  checkCategoryYahoo(data) {
    return Api.post(`${prefix}/check-category`, data);
  },
  setOverlayImage(data) {
    return Api.post(`${prefix}/set-image-overlay`, data);
  },
  uploadProductNow(data) {
    return Api.post(`${prefix}/upload-product-yahoo-now`, data, {
      timeout: 30 * 60 * 1000
    });
  },
  updateDataByCsv(data) {
    return Api.post(`${prefix}/update-data-csv`, data);
  }
};
