import Api from "./api";
const prefix = '/api/v1/product-auction'
export default {
  get(credentials) {
    return Api.get(`${prefix}/get`, credentials);
  },
  // show(credentials) {
  //   return Api.get(`${prefix}/show/${credentials._id}`, credentials);
  // },
  // create(credentials) {
  //   return Api.post(`${prefix}/create`, credentials);
  // },
  // update(id, credentials) {
  //   return Api.post(`${prefix}/update/${id}`, credentials);
  // },
  // delete(id) {
  //   return Api.post(`${prefix}/delete/${id}`);
  // },
};
