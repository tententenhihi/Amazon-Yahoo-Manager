import Api from "./api";

export default {
  get(token) {
    console.log(" ############### token: ", token);
    return Api.get("/api/v1/api-key/get", {
      timeout: 10 * 60 * 10000,
      headers: token
        ? {
            Authorization: "Bearer " + token
          }
        : {}
    });
  },
  update(credentials) {
    return Api.post("/api/v1/api-key/update", credentials);
  }
};
