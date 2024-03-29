import Api from "./api";
const prefix = "/api/v1/product-yahoo-finished";
export default {
  get(yahooAccountId) {
    return Api.get(`${prefix}/get/${yahooAccountId}`);
  },
  setNote(credentials) {
    return Api.post(`${prefix}/set-note`, credentials, {
      timeout: 60 * 1000
    });
  },
  delete(id) {
    return Api.post(`${prefix}/delete/${id}`);
  },
  deleteMultiple(ids) {
    return Api.post(`${prefix}/delete-multiple`, ids, {
      timeout: 15 * 60 * 1000
    });
  },
  refreshDataYahoo(credentials) {
    return Api.post(`${prefix}/refresh-data-yahoo`, credentials, {
      timeout: 15 * 60 * 1000
    });
  }
};
