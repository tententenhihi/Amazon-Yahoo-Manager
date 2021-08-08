import Api from "./api";

export default {
  add(credentials) {
    return Api.post("/api/v1/amazon/asin/add", credentials);
  },
  get(yahooAccountId) {
    return Api.get("/api/v1/amazon/asin/get/" + yahooAccountId);
  },
  getBlackList(credentials) {
    return Api.get("/api/v1/amazon/asin/get-blacklist", credentials);
  },
  update(credentials) {
    return Api.post("/api/v1/amazon/asin/update", credentials);
  },
  delete(credentials) {
    return Api.post("/api/v1/amazon/asin/delete", credentials);
  }
};
