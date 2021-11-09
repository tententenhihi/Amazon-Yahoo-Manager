import Api from "./api";

const prefix = "/api/v1/bank";

export default {
  get(type) {
    return Api.post(`${prefix}/get`, type);
  },
  create(credentials) {
    return Api.post(`${prefix}/create`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  update(credentials) {
    return Api.post(`${prefix}/update/${credentials._id}`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  delete(credentials) {
    return Api.post(`${prefix}/delete/${credentials._id}`, credentials);
  }
};
