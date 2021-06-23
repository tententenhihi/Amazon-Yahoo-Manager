import Api from "./api";
const prefix = '/api/v1/product-global-setting'

export default {
  get (credentials) {
    return Api.get(`${prefix}/get`, credentials);
  },
  create (credentials) {
    return Api.post(`${prefix}/create`, credentials);
  },
  update (credentials) {
    return Api.post(`${prefix}/update`, credentials);
  },
};
