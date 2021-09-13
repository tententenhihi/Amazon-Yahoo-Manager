import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";
import YahooAccountApi from "@/services/YahooAccountApi";

Vue.use(Vuex);
export default new Vuex.Store({
  strict: false,
  state: {
    user: null,
    token: null,
    isUserLoggedIn: false,
    languageCurr: {
      location: "Việt Nam",
      lang: "vn"
    },
    admin: null,
    isAdmin: false,
    adminViewUser: false,
    isLoading: false,
    yahooAccount: [],
    selectedYahooAccount: {},
    apiKey: {}
  },
  getters: {
    getApiKey(state) {
      return state.apiKey;
    },
    getAdminViewUser(state) {
      return state.adminViewUser;
    },
    getUserInfo(state) {
      return state.user;
    },
    getYahooAccount(state) {
      return state.yahooAccount;
    },
    getSelectedYahooAccount(state) {
      return state.selectedYahooAccount;
    }
  },
  mutations: {
    setApiKey(state, data) {
      state.apiKey = data;
    },
    setAdminViewUser(state, data) {
      state.adminViewUser = true;
    },
    adminSetUserData(state, user) {
      state.user = user;
      state.token = user.token;
    },

    setLoading(state, data) {
      state.isLoading = data;
    },
    setUser(state, user) {
      state.user = user;
      if (user && user.type === "admin") {
        state.admin = user;
        state.isUserLoggedIn = true;
        state.isAdmin = true;
      } else if (user) {
        state.user = user;
        state.token = user.token;
        state.isUserLoggedIn = true;
        state.isAdmin = false;
      } else {
        state.token = null;
        state.isUserLoggedIn = false;
        state.isAdmin = false;
      }
    },
    setLang(state, lang) {
      state.languageCurr = lang;
    },
    SET_YAHOO_ACCOUNT(state, payload) {
      state.yahooAccount = payload;
    },
    SET_SELECTED_YAHOO_ACCOUNT(state, payload) {
      state.selectedYahooAccount = payload;
    },
    async GET_YAHOO_ACCOUNT(state) {
      let result = await YahooAccountApi.get();
      if (result && result.status === 200) {
        let accounts = result.data.accounts || [];
        state.yahooAccount = accounts;
      }
    },
    CLEAR_DATA(state) {
      state.user = null;
      state.isAdmin = false;
      state.admin = null;
      state.token = null;
      state.isUserLoggedIn = false;
      state.adminViewUser = false;
      state.yahooAccount = [];
      state.selectedYahooAccount = {};
    }
  },
  actions: {
    setApiKey({ commit }, data) {
      commit("setApiKey", data);
    },
    adminSetUserData({ commit }, data) {
      commit("adminSetUserData", data);
    },
    setAdminViewUser({ commit }, data) {
      commit("setAdminViewUser", data);
    },
    setUser({ commit }, data) {
      commit("setUser", data);
    },
    setLang({ commit }, lang) {
      commit("setLang", lang);
    },
    getYahooAccount({ commit }) {
      commit("GET_YAHOO_ACCOUNT");
    },
    setYahooAccount({ commit }, data) {
      commit("SET_YAHOO_ACCOUNT", data);
    },
    logout({ commit }) {
      commit("CLEAR_DATA");
    }
  },
  plugins: [
    createPersistedState({
      storeage: {
        getItem: key => Cookies.getJSON(key),
        setItem: (key, state) =>
          Cookies.set(key, state, { expires: 3, secure: true }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ]
});
