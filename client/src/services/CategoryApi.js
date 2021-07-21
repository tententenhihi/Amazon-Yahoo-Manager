import Api from "./api";

const prefix = '/api/v1/category'

export default {
  get () {
    return Api.get(`${prefix}/get/`);
  },
  update (data) {
    return Api.post(`${prefix}/update/${data._id}`, data);
  },
};
