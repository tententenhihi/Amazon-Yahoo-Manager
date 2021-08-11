import Api from "./api";

export default {
  add(credentials) {
    return Api.post("/api/v1/amazon/asin/add", credentials, {
      timeout: 10 * 60 * 10000
    });
  },
  get(yahooAccountId) {
    return Api.get("/api/v1/amazon/asin/get/" + yahooAccountId, {
      timeout: 10 * 60 * 10000
    });
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
