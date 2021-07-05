import Api from "./api";

export default {
  login(credentials) {
    return Api.post("/auth/login", credentials);
  }
};
