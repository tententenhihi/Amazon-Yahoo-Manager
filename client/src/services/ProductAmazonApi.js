import Api from "./api";
const prefix = '/api/v1/amazon/product'
export default {
  get(yahooAccountId) {
    return Api.get(`${prefix}/get/${yahooAccountId}`);
  },
  show(credentials) {
    return Api.get(`${prefix}/show/${credentials._id}`, credentials);
  },
  create(credentials) {
    return Api.post(`${prefix}/create`, credentials, {headers: {
      'Content-Type': 'multipart/form-data'
    }});
  },
  update(id, credentials) {
    return Api.post(`${prefix}/update/${id}`, credentials, {headers: {
      'Content-Type': 'multipart/form-data'
    }});
  },
  delete(id) {
    return Api.post(`${prefix}/delete/${id}`);
  },
  createByCsv(data) {
    return Api.post(`${prefix}/create-by-csv`, data);
  },
  setShippingProduct (id, data) {
    return Api.post(`${prefix}/set-shipping-product/` + id, data)
  },
  convertYahooProduct (data) {
    return Api.post(`${prefix}/convert-yahoo-product/`, data)
  }
};
