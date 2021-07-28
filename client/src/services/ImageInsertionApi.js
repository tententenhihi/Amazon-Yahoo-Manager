import Api from "./api";
const prefix = '/api/v1/image-insertion'

export default {
  get (yahooAccountId) {
    return Api.get(`${prefix}/get?yahoo_account_id=${yahooAccountId}`);
  },
  update (credentials) {
    return Api.post(`${prefix}/update`, credentials);
  },
};
