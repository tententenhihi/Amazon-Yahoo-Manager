// The Vue build version to load with the `import` command
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/store";
import VueI18n from "vue-i18n";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Swal from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import VueLodash from "vue-lodash";
import lodash from "lodash";
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
  setInteractionMode
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import "datatables.net";
import "datatables.net-dt";
import $ from "jquery";
import Constants from "./constant/index";
import Helpers from "./helpers/index";
import i18n from "./lang/lang";
import "./helpers/validate";
import Paginate from "vuejs-paginate";
import { EventBus } from "@/events/EventBus";

Vue.prototype.$ = $;
Vue.prototype.$constants = Constants;
Vue.prototype.$helpers = Helpers;
Vue.prototype.$eventBus = EventBus;

Vue.use(VueLodash, { name: "custom", lodash: lodash });
Vue.use(require("vue-moment"));
Vue.use(Swal, {
  heightAuto: false,
  confirmButtonText: 'はい',
  cancelButtonText: 'いいえ',
});

Vue.config.productionTip = false;
i18n.locale = "ja";
localize(i18n.locale);

// common component
import ModalComponent from "./components/commons/ModalComponent";

Vue.component("modal-component", ModalComponent);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("paginate", Paginate);

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});
setInteractionMode("passive");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
