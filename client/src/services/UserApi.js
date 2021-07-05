import Api from "./api";
const prefix = '/api/v1/user'

export default {
  changePassword (credentials) {
    return Api.post(prefix + "/change-password", credentials);
  }
};
