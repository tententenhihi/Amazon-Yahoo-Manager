import Api from "./api";
const prefix = "/auth"

export default {
  login (credentials) {
    return Api.post( prefix + "/login", credentials);
  },
  forgotPassword (credentials) {
    return Api.post( prefix + "/forgot-password", credentials);
  },
  resetPassword (credentials) {
    return Api.post( prefix + "/reset-password", credentials);
  },
  resetPassword (credentials) {
    return Api.post( prefix + "/reset-password", credentials);
  },
  verifyAccount (credentials) {
    return Api.post( prefix + "/verify-account", credentials);
  },
  getVerifyCode (credentials) {
    return Api.post( prefix + "/get-verify-code", credentials);
  }
};
