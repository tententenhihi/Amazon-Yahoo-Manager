import Api from "./api";
const prefix = "/api/v1/product-yahoo-ended";
export default {
  get(yahooAccountId) {
    return Api.get(`${prefix}/get/${yahooAccountId}`);
  },
  show(id) {
    return Api.get(`${prefix}/show/${id}`);
  },
  update(id, credentials) {
    return Api.post(`${prefix}/update/${id}`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  deleteBuyer(credentials) {
    return Api.post(`${prefix}/delete-buyer`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  cancelTransaction(credentials) {
    return Api.post(`${prefix}/cancel-transaction`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  sendMessage(credentials) {
    return Api.post(`${prefix}/send-message`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  sendRating(credentials) {
    return Api.post(`${prefix}/send-rating`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  setNote(credentials) {
    return Api.post(`${prefix}/set-note`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  delete(id) {
    return Api.post(`${prefix}/delete/${id}`, null, {
      timeout: 15 * 60 * 1000
    });
  },
  refreshDataYahoo(credentials) {
    return Api.post(`${prefix}/refresh-data-yahoo`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  setShipFee(credentials) {
    return Api.post(`${prefix}/set-ship-fee`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  contactShip(credentials) {
    return Api.post(`${prefix}/contact-ship`, credentials, {
      timeout: 15 * 60 * 1000
    });
  }
};
