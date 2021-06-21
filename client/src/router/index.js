import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home";
import store from "../store/store";
import Asin from "../views/Asin/index.vue";
import ProductAmazon from "../views/ProductAmazon";

import YahooAccounts from '@/views/users/YahooAccounts'

Vue.use(Router);

const router = new Router({
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
    },
    {
      path: '/yahoo-accounts',
      name: 'YahooAccounts',
      component: YahooAccounts,
      meta: {
        requiredAuth: true
      }
    }
  ]
});

const waitForStorageToBeReady = async (to, from, next) => {
  const authUser = store.state.isUserLoggedIn;
  if (((to.name !== 'login' && to.meta.requiredAuth) || to.name === null) && !authUser) {
    next({name: 'login'})
  } else {
    if ((to.name === null || to.name === 'login') && authUser) {
      next({name: 'Home'})
    }
    next()
  }
}
router.beforeEach(waitForStorageToBeReady)

export default router
