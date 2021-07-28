import Api from "./api";
const prefix = "/api/v1/product-yahoo-selling";
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
    return Api.post(`${prefix}/delete-multiple`, ids);
  }
};
