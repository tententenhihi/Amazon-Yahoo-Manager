import Api from "./api";

export default {
  add(credentials) {
    return Api.post("/api/v1/amazon/product/add", credentials);
  },
  get(credentials) {
    return Api.get("/api/v1/amazon/product/get", credentials);
  },
  update(credentials) {
    return Api.post("/api/v1/amazon/product/update", credentials);
  },
  delete(credentials) {
    return Api.post("/api/v1/amazon/product/delete", credentials);
  }
};
