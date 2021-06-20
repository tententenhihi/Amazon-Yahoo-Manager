// The Vue build version to load with the `import` command
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/store";
import vuetify from "./plugins/vuetify";
import VueI18n from "vue-i18n";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Swal from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.use(require("vue-moment"));
Vue.use(Swal, {
  heightAuto: false,
  confirmButtonText: `<span style="padding: 0 10px">OK</span>`
});
Vue.config.productionTip = false;
Vue.use(VueI18n);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  vuetify,
  store,
  components: { App },
  template: "<App/>"
});
