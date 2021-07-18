import Api from "./api";
const prefix = '/api/v1/auction-global-setting'

export default {
  get (yahooAccountId) {
    return Api.get(`${prefix}/get/${yahooAccountId}`);
  },
  update (credentials) {
    return Api.post(`${prefix}/update`, credentials);
  },
};
