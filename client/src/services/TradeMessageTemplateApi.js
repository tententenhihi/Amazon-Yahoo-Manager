import Api from "./api";
const prefix = '/api/v1/trade-message-template'

export default {
  get () {
    return Api.get(prefix);
  },
  create (data) {
    return Api.post(prefix + "/create", data);
  },
  show (id) {
    return Api.get(prefix + "/show/" + id);
  },
  update (data) {
    return Api.post(prefix + "/update/" + data._id, data);
  },
  delete (id) {
    return Api.post(prefix + "/delete/" + id);
  }
};