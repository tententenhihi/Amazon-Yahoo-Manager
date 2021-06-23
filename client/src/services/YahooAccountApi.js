import Api from "./api";

const prefix = '/api/v1/yahoo-account'

export default {
  get () {
    return Api.get(`${prefix}/get-list`);
  },
  create (credentials) {
    return Api.post(`${prefix}/create-new`, credentials);
  },
  update (credentials) {
    return Api.post(`${prefix}/edit/${credentials._id}`, credentials);
  },
  delete (credentials) {
    return Api.post(`${prefix}/delete/${credentials._id}`, credentials);
  }
};
