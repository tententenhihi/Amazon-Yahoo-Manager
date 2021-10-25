import Api from "./api";

const prefix = "/api/v1/yahoo-account";

export default {
  get() {
    return Api.get(`${prefix}/get-list`);
  },
  setOldBankNumber(credentials) {
    return Api.post(`${prefix}/set_old_bank_number`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  withDrawMoney(credentials) {
    return Api.post(`${prefix}/with-draw-money`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  stopWithDrawMoney(credentials) {
    return Api.post(`${prefix}/stop-with-draw-money`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  create(credentials) {
    return Api.post(`${prefix}/create-new`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  update(credentials) {
    return Api.post(`${prefix}/edit/${credentials._id}`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  delete(credentials) {
    return Api.post(`${prefix}/delete/${credentials._id}`, credentials);
  },
  copyData(credentials) {
    return Api.post(`${prefix}/copy-data`, credentials);
  },
  getAccountAndBank(credentials) {
    return Api.post(`${prefix}/get-account-bank`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  setBankToAccount(credentials) {
    return Api.post(`${prefix}/set-bank-to-account`, credentials, {
      timeout: 15 * 60 * 1000
    });
  },
  getAccountAndHistoryWithDraw(credentials) {
    return Api.get(`${prefix}/get-account-history-withdraw`, credentials, {
      timeout: 15 * 60 * 1000
    });
  }
};
