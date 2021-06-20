import Api from "./api";

export default {
  add(credentials) {
    return Api.post("/api/v1/amazon/search-code/add", credentials);
  },
  get(credentials) {
    return Api.get("/api/v1/amazon/search-code/get", credentials);
  },
  getBlackList(credentials) {
    return Api.get("/api/v1/amazon/search-code/get-blacklist", credentials);
  },
  update(credentials) {
    return Api.post("/api/v1/amazon/search-code/update", credentials);
  },
  delete(credentials) {
    return Api.post("/api/v1/amazon/search-code/delete", credentials);
  }
};
