import Api from "./api";
const prefix = '/api/v1/auction-global-setting'

export default {
  get (credentials) {
    return Api.get(`${prefix}/get`, credentials);
  },
  update (credentials) {
    return Api.post(`${prefix}/update`, credentials);
  },
};
