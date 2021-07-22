import Api from "./api";
const prefix = "/api/v1/product-yahoo-ended";
export default {
  get(yahooAccountId) {
    return Api.get(`${prefix}/get/${yahooAccountId}`);
  },
  show(id) {
    return Api.get(`${prefix}/show/${id}`);
  },
  update(id, credentials) {
    return Api.post(`${prefix}/update/${id}`, credentials, {
      timeout: 60 * 1000
    });
  },
  delete(id) {
    return Api.post(`${prefix}/delete/${id}`);
  }
};
