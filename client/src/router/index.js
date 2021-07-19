import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home";
import store from "../store/store";
import Asin from "../views/Asin/index.vue";
import ProductAmazon from "../views/ProductAmazon";

const Login = () => import(/* webpackChunkName: "/static/js/chunks/auth" */ '@/views/auth/Login.vue');
const ForgotPassword = () => import(/* webpackChunkName: "/static/js/chunks/auth" */ '@/views/auth/ForgotPassword.vue');
const ResetPassword = () => import(/* webpackChunkName: "/static/js/chunks/auth" */ '@/views/auth/ResetPassword.vue');

const YahooAccounts = () => import(/* webpackChunkName: "/static/js/chunks/users" */ '@/views/users/YahooAccounts.vue');
const ChangePassword = () => import(/* webpackChunkName: "/static/js/chunks/users" */ '@/views/users/ChangePassword.vue');

const AsinManagement = () => import(/* webpackChunkName: "/static/js/chunks/asin" */ '@/views/Asin/AsinManagement.vue');

const ProductList = () => import(/* webpackChunkName: "/static/js/chunks/products" */ '@/views/products/List.vue');
const FormProduct = () => import(/* webpackChunkName: "/static/js/chunks/products" */ '@/views/products/FormProduct.vue');

const ProductYahooList = () => import(/* webpackChunkName: "/static/js/chunks/products-yahoo" */ '@/views/products-yahoo/ProductYahooList.vue');
const FormProductYahoo = () => import(/* webpackChunkName: "/static/js/chunks/products-yahoo" */ '@/views/products-yahoo/FormProductYahoo.vue');

const TemplateSetting =
  () => import(/* webpackChunkName: "/static/js/chunks/settings" */ '@/views/settings/TemplateSetting.vue');
const ProductDescriptionSetting =
  () => import(/* webpackChunkName: "/static/js/chunks/settings" */ '@/views/settings/ProductDescriptionSetting.vue');
const YahooAuctionPublicSetting =
  () => import(/* webpackChunkName: "/static/js/chunks/settings" */ '@/views/settings/YahooAuctionPublicSetting.vue');
const ProductInfomationDefault = () => import(/* webpackChunkName: "/static/js/chunks/settings" */ '@/views/settings/ProductInfomationDefault.vue');

const TradeMessageTemplate = () => import(/* webpackChunkName: "/static/js/chunks/trade-message-template" */ '@/views/trade-message-template/Index.vue');
const FormTradeMessageTemplate = () => import(/* webpackChunkName: "/static/js/chunks/trade-message-template" */ '@/views/trade-message-template/FormInput.vue');

const RatingTemplate = () => import(/* webpackChunkName: "/static/js/chunks/rating-template" */ '@/views/rating-template/Index.vue');
const FormRatingTemplate = () => import(/* webpackChunkName: "/static/js/chunks/rating-template" */ '@/views/rating-template/FormInput.vue');

const FolderManagement = () => import(/* webpackChunkName: "/static/js/chunks/settings" */ '@/views/settings/FolderManagement.vue');

// product management
const YahooAuctionTrade = () =>
  import(/* webpackChunkName: "/static/js/chunks/product-management" */ '@/views/product-management/YahooAuctionTrade.vue');
const YahooAuctionTradeRating = () =>
  import(/* webpackChunkName: "/static/js/chunks/product-management" */ '@/views/product-management/YahooAuctionTradeRating.vue');
const YahooAuctionTradeMessage = () =>
  import(/* webpackChunkName: "/static/js/chunks/product-management" */ '@/views/product-management/YahooAuctionTradeMessage.vue');

// admin
const AdminUsers = () => import(/* webpackChunkName: "/static/js/chunks/admin/users" */ '@/views/admin/users/Users.vue');
const AdminProxy = () => import(/* webpackChunkName: "/static/js/chunks/admin/proxy" */ '@/views/admin/proxy/Index.vue');
const AdminYahooAccounts = () => import(/* webpackChunkName: "/static/js/chunks/admin/yahoo-accounts" */
  '@/views/admin/yahoo-accounts/Index.vue');
const AdminAsins = () => import(/* webpackChunkName: "/static/js/chunks/admin/asins" */ '@/views/admin/asins/Index.vue');

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
      path: "/forgot-password",
      name: "ForgotPassword",
      component: ForgotPassword
    },
    {
      path: "/reset-password",
      name: "ResetPassword",
      component: ResetPassword
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
        requiredAuth: true,
        type: 'user'
      }
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: {
        requiredAuth: true,
        type: 'user'
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
      path: '/products-yahoo',
      name: 'ProductYahooList',
      component: ProductYahooList,
      meta: {
        requiredAuth: true,
        type: 'product'
      }
    },
    {
      path: '/products-yahoo/:id',
      name: 'FormProductYahoo',
      component: FormProductYahoo,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/product-information-default',
      name: 'ProductInfomationDefault',
      component: ProductInfomationDefault,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/folder-management',
      name: 'FolderManagement',
      component: FolderManagement,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/template-setting',
      name: 'TemplateSetting',
      component: TemplateSetting,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/product-description-setting',
      name: 'ProductDescriptionSetting',
      component: ProductDescriptionSetting,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/yahoo-auction-public-setting',
      name: 'YahooAuctionPublicSetting',
      component: YahooAuctionPublicSetting,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/trade-message-template',
      name: 'TradeMessageTemplate',
      component: TradeMessageTemplate,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/trade-message-template/:id',
      name: 'FormTradeMessageTemplate',
      component: FormTradeMessageTemplate,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/rating-template',
      name: 'RatingTemplate',
      component: RatingTemplate,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/rating-template/:id',
      name: 'FormRatingTemplate',
      component: FormRatingTemplate,
      meta: {
        requiredAuth: true,
        type: 'config'
      }
    },
    {
      path: '/yahoo-auction-trade',
      name: 'YahooAuctionTrade',
      component: YahooAuctionTrade,
      meta: {
        requiredAuth: true,
        type: 'product-management'
      }
    },
    {
      path: '/yahoo-auction-trade-rating/:id',
      name: 'YahooAuctionTradeRating',
      component: YahooAuctionTradeRating,
      meta: {
        requiredAuth: true,
        type: 'product-management'
      }
    },
    {
      path: '/yahoo-auction-trade-message/:id',
      name: 'YahooAuctionTradeMessage',
      component: YahooAuctionTradeMessage,
      meta: {
        requiredAuth: true,
        type: 'product-management'
      }
    },
    
    // admin
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: AdminUsers,
      meta: {
        requiredAuth: true,
        layout: 'admin',
        isAdmin: true
      }
    },
    {
      path: '/admin/proxy',
      name: 'AdminProxy',
      component: AdminProxy,
      meta: {
        requiredAuth: true,
        layout: 'admin',
        isAdmin: true
      }
    },
    {
      path: '/admin/yahoo-accounts',
      name: 'AdminYahooAccounts',
      component: AdminYahooAccounts,
      meta: {
        requiredAuth: true,
        layout: 'admin',
        isAdmin: true
      }
    },
    {
      path: '/admin/asins',
      name: 'AdminAsins',
      component: AdminAsins,
      meta: {
        requiredAuth: true,
        layout: 'admin',
        isAdmin: true
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
  const user = store.state.user
  if (((to.name !== 'Login' && to.meta.requiredAuth) || to.name === null) && !authUser) {
    next({name: 'Login'})
  } else if (to.meta.isAdmin && authUser) {
    if (user.type == 'admin') {
      next()
    } else {
      next({name: 'Home'})
    }
  } else {
    if ((to.name === null || to.name === 'Login') && authUser) {
      next({name: 'Home'})
    }
    next()
  }
}
router.beforeEach(waitForStorageToBeReady)

export default router
