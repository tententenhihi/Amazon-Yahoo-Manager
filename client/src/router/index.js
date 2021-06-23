import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home";
import store from "../store/store";
import Asin from "../views/Asin/index.vue";
import ProductAmazon from "../views/ProductAmazon";

const YahooAccounts = () => import(/* webpackChunkName: "/static/js/chunks/accounts" */ '@/views/users/YahooAccounts.vue');

const AsinManagement = () => import(/* webpackChunkName: "/static/js/chunks/asin" */ '@/views/Asin/AsinManagement.vue');

const ProductList = () => import(/* webpackChunkName: "/static/js/chunks/products" */ '@/views/products/List.vue');
const FormProduct = () => import(/* webpackChunkName: "/static/js/chunks/products" */ '@/views/products/FormProduct.vue');

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/asin",
      name: "asin",
      component: Asin,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/product",
      name: "product",
      component: ProductAmazon,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/yahoo-accounts',
      name: 'YahooAccounts',
      component: YahooAccounts,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/asin-management',
      name: 'AsinManagement',
      component: AsinManagement,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/products',
      name: 'Products',
      component: ProductList,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/product/:id',
      name: 'FormProduct',
      component: FormProduct,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
});

const waitForStorageToBeReady = async (to, from, next) => {
  const authUser = store.state.isUserLoggedIn;
  if (((to.name !== 'Login' && to.meta.requiredAuth) || to.name === null) && !authUser) {
    next({name: 'Login'})
  } else {
    if ((to.name === null || to.name === 'Login') && authUser) {
      next({name: 'Home'})
    }
    next()
  }
}
router.beforeEach(waitForStorageToBeReady)

export default router
