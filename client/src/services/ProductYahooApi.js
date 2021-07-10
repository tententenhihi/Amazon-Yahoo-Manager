import Api from "./api";
const prefix = '/api/v1/product-yahoo'
export default {
  get(credentials) {
    return Api.get(`${prefix}/get`, credentials);
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
