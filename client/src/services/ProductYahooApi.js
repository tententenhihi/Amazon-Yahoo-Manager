import Api from "./api";
const prefix = '/api/v1/product-yahoo'
export default {
  getPhotos(data) {
    let configs = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return Api.post(`${prefix}/get_photos`, data, configs);
  },
  get(credentials) {
    return Api.get(`${prefix}/get`, credentials);
  },
  show(credentials) {
    return Api.get(`${prefix}/show/${credentials._id}`, credentials);
  },
  create(credentials) {
    return Api.post(`${prefix}/create`, credentials);
  },
  update(id, credentials) {
    return Api.post(`${prefix}/update/${id}`, credentials);
  },
  delete(id) {
    return Api.post(`${prefix}/delete/${id}`);
  },
};
