import Api from "./api";

const prefix = "/api/v1/cron";

export default {
  get(payload) {
    return Api.post(`${prefix}/get`, payload);
  }
};
