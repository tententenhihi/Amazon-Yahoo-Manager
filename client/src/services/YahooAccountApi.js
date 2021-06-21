import Api from "./api";

export default {
  get () {
    return Api.get("/api/v1/yahoo-account/get-list");
  },
  create (credentials) {
    return Api.post("/api/v1/yahoo-account/create-new", credentials);
  },
  update (credentials) {
    return Api.post("/api/v1/yahoo-account/edit/" + credentials._id, credentials);
  },
  delete (credentials) {
    return Api.post("/api/v1/yahoo-account/delete/" + credentials._id, credentials);
  }
};
