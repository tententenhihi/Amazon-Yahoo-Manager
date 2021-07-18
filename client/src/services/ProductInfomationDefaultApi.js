import Api from "./api";
const prefix = '/api/v1/product-info-default'
export default {
  get(yahooAccountId) {
    return Api.get(`${prefix}/${yahooAccountId}`);
  },
  update(id, credentials) {
    return Api.post(`${prefix}/update/${id}`, credentials);
  },
  delete(id) {
    return Api.post(`${prefix}/delete/${id}`);
  },
};
