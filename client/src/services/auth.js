import Api from "./api";

export default {
  login(credentials) {
    return Api.post("/user/login", credentials);
  }
};
