import Api from "./api";
const prefix = '/api/v1/admin'

export default {
  getUsers () {
    return Api.get(prefix + "/users");
  },
  createUser (data) {
    return Api.post(prefix + "/users/create", data);
  },
  updateUser (data) {
    return Api.post(prefix + "/users/update/" + data._id, data);
  },
  deleteUser (data) {
    return Api.post(prefix + "/users/delete/" + data._id, data);
  }
};