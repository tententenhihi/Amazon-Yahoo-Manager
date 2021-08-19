import Api from "./api";

const prefix = "/api/v1/yahoo-account";

export default {
  get() {
    return Api.get(`${prefix}/get-list`);
  },
  create(credentials) {
    return Api.post(`${prefix}/create-new`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  update(credentials) {
    return Api.post(`${prefix}/edit/${credentials._id}`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  delete(credentials) {
    return Api.post(`${prefix}/delete/${credentials._id}`, credentials);
  },
  copyData(credentials) {
    return Api.post(`${prefix}/copy-data`, credentials);
  }
};
