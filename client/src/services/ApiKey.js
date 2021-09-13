import Api from "./api";

export default {
  get() {
    return Api.get("/api/v1/api-key/get", {
      timeout: 10 * 60 * 10000
    });
  },
  update(credentials) {
    return Api.post("/api/v1/api-key/update", credentials);
  }
};
