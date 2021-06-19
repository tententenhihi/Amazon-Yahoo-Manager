import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";

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
    isLoading: false
  },
  mutations: {
    setLoading(state, data) {
      state.isLoading = data;
    },
    setUser(state, user) {
      state.user = user;
      if (user) {
        state.token = user.token;
        state.isUserLoggedIn = true;
      } else {
        state.token = null;
        state.isUserLoggedIn = false;
      }
    },
    setLang(state, lang) {
      state.languageCurr = lang
    }
  },
  actions: {
    setUser({ commit }, data) {
      commit('setUser', data)
    },
    setLang({ commit }, lang) {
      commit('setLang', lang)
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
