import Api from "./api";

const prefix = '/api/v1/folder'

export default {
  get () {
    return Api.get(`${prefix}/get`);
  },
  create (data) {
    return Api.post(`${prefix}/create`, data);
  },
  update (data) {
    return Api.post(`${prefix}/update/${data._id}`, data);
  },
  delete (data) {
    return Api.post(`${prefix}/delete`, data);
  },
  sort (data) {
    return Api.post(`${prefix}/sort`, data);
  },
};
