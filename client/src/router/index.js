import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home";
import store from "../store/store";
import Asin from "../views/Asin";
import ProductAmazon from "../views/ProductAmazon";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      name: "Home",
      component: Home,
      beforeEnter: (to, from, next) => {
        if (!store.state.isUserLoggedIn) {
          next("/login");
        } else {
          next();
        }
      }
    },
    {
      path: "/asin",
      name: "asin",
      component: Asin,
      beforeEnter: (to, from, next) => {
        if (!store.state.isUserLoggedIn) {
          next("/login");
        } else {
          next();
        }
      }
    },
    {
      path: "/product",
      name: "product",
      component: ProductAmazon,
      beforeEnter: (to, from, next) => {
        if (!store.state.isUserLoggedIn) {
          next("/login");
        } else {
          next();
        }
      }
    }
  ]
});
