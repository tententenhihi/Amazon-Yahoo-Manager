import Api from "./api";
const prefix = '/api/v1/product-yahoo'
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
};
