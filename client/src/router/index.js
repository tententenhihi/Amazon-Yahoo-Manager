import Vue from "vue";
import Router from "vue-router";
import store from "../store/store";
import Asin from "../views/Asin/index.vue";

const Login = () => import("@/views/auth/Login.vue");
const ForgotPassword = () => import("@/views/auth/ForgotPassword.vue");
const ResetPassword = () => import("@/views/auth/ResetPassword.vue");

const Dashboard = () => import("@/views/Dashboard.vue");

const YahooAccounts = () => import("@/views/users/YahooAccounts.vue");
const ChangePassword = () => import("@/views/users/ChangePassword.vue");

const AsinManagement = () => import("@/views/Asin/AsinManagement.vue");

const ProductAmazon = () => import("@/views/ProductAmazon");
const CreateProductAmazon = () =>
  import("@/views/ProductAmazon/CreateProductAmazon.vue");

const YahooAuctionProducts = () => import("@/views/product-yahoo/ProductLocal");
const CreateProductYahooLocal = () =>
  import("@/views/product-yahoo/ProductLocal/CreateProductLocal.vue");

const TemplateSetting = () => import("@/views/settings/TemplateSetting.vue");
const ProductDescriptionSetting = () =>
  import("@/views/settings/ProductDescriptionSetting.vue");
const YahooAuctionPublicSetting = () =>
  import("@/views/settings/YahooAuctionPublicSetting.vue");
const ProductInfomationDefault = () =>
  import("@/views/settings/ProductInfomationDefault.vue");

const TradeMessageTemplate = () =>
  import("@/views/trade-message-template/Index.vue");
const FormTradeMessageTemplate = () =>
  import("@/views/trade-message-template/FormInput.vue");

const RatingTemplate = () => import("@/views/rating-template/Index.vue");
const FormRatingTemplate = () =>
  import("@/views/rating-template/FormInput.vue");

const FolderManagement = () => import("@/views/settings/FolderManagement.vue");
const CopyDataSettings = () => import("@/views/settings/CopyDataSettings.vue");

const Categories = () => import("@/views/categories/Index.vue");

const Logs = () => import("@/views/logs/Index.vue");
const LogDetail = () => import("@/views/logs/Detail.vue");

const ImageInsertion = () => import("@/views/image-insertion/Index.vue");

const ProductYahooTrade = () => import("@/views/product-yahoo/ProductTrade");
const YahooAuctionTradeRating = () =>
  import("@/views/product-yahoo/ProductTrade/Rating");
const YahooAuctionTradeMessage = () =>
  import("@/views/product-yahoo/ProductTrade/Message");
const ProductYahooSelling = () =>
  import("@/views/product-yahoo/ProductSelling");
const ProductYahooFinished = () =>
  import("@/views/product-yahoo/ProductFinished");

// admin
const AdminUsers = () => import("@/views/admin/users/Users.vue");
const AdminProxy = () => import("@/views/admin/proxy/Index.vue");
const AdminYahooAccounts = () =>
  import("@/views/admin/yahoo-accounts/Index.vue");
const AdminAsins = () => import("@/views/admin/asins/Index.vue");

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
      alias: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
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
      path: "/yahoo-accounts",
      name: "YahooAccounts",
      component: YahooAccounts,
      meta: {
        requiredAuth: true,
        type: "user"
      }
    },
    {
      path: "/change-password",
      name: "ChangePassword",
      component: ChangePassword,
      meta: {
        requiredAuth: true,
        type: "user"
      }
    },
    {
      path: "/asin-management",
      name: "AsinManagement",
      component: AsinManagement,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/amazon-products",
      name: "AmazonProducts",
      component: ProductAmazon,
      meta: {
        requiredAuth: true,
        type: "product"
      }
    },
    {
      path: "/product/:id",
      name: "CreateProductAmazon",
      component: CreateProductAmazon,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/yahoo-auction-products",
      name: "YahooAuctionProducts",
      component: YahooAuctionProducts,
      meta: {
        requiredAuth: true,
        type: "product"
      }
    },
    {
      path: "/yahoo-auction-products/:id",
      name: "CreateProductYahooLocal",
      component: CreateProductYahooLocal,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/product-information-default",
      name: "ProductInfomationDefault",
      component: ProductInfomationDefault,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/folder-management",
      name: "FolderManagement",
      component: FolderManagement,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/categories",
      name: "Categories",
      component: Categories,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/template-setting",
      name: "TemplateSetting",
      component: TemplateSetting,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/product-description-setting",
      name: "ProductDescriptionSetting",
      component: ProductDescriptionSetting,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/yahoo-auction-public-setting",
      name: "YahooAuctionPublicSetting",
      component: YahooAuctionPublicSetting,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/copy-default-settings",
      name: "CopyDataSettings",
      component: CopyDataSettings,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/trade-message-template",
      name: "TradeMessageTemplate",
      component: TradeMessageTemplate,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/trade-message-template/:id",
      name: "FormTradeMessageTemplate",
      component: FormTradeMessageTemplate,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/rating-template",
      name: "RatingTemplate",
      component: RatingTemplate,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/rating-template/:id",
      name: "FormRatingTemplate",
      component: FormRatingTemplate,
      meta: {
        requiredAuth: true,
        type: "config"
      }
    },
    {
      path: "/logs",
      name: "Logs",
      component: Logs,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/logs/view/:id",
      name: "LogDetail",
      component: LogDetail,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: "/yahoo-auction-trades",
      name: "ProductYahooTrade",
      component: ProductYahooTrade,
      meta: {
        requiredAuth: true,
        type: "product-management"
      }
    },
    {
      path: "/yahoo-auction-trades-rating/:id",
      name: "YahooAuctionTradeRating",
      component: YahooAuctionTradeRating,
      meta: {
        requiredAuth: true,
        type: "product-management"
      }
    },
    {
      path: "/yahoo-auction-trades-message/:id",
      name: "YahooAuctionTradeMessage",
      component: YahooAuctionTradeMessage,
      meta: {
        requiredAuth: true,
        type: "product-management"
      }
    },
    {
      path: "/yahoo-auction-sellings",
      name: "ProductYahooSelling",
      component: ProductYahooSelling,
      meta: {
        requiredAuth: true,
        type: "product-management"
      }
    },
    {
      path: "/yahoo-auction-finished",
      name: "ProductYahooFinished",
      component: ProductYahooFinished,
      meta: {
        requiredAuth: true,
        type: "product-management"
      }
    },
    {
      path: "/images",
      name: "ImageInsertion",
      component: ImageInsertion,
      meta: {
        requiredAuth: true
      }
    },

    // admin
    {
      path: "/admin/users",
      name: "AdminUsers",
      component: AdminUsers,
      meta: {
        requiredAuth: true,
        layout: "admin",
        isAdmin: true
      }
    },
    {
      path: "/admin/proxy",
      name: "AdminProxy",
      component: AdminProxy,
      meta: {
        requiredAuth: true,
        layout: "admin",
        isAdmin: true
      }
    },
    {
      path: "/admin/yahoo-accounts",
      name: "AdminYahooAccounts",
      component: AdminYahooAccounts,
      meta: {
        requiredAuth: true,
        layout: "admin",
        isAdmin: true
      }
    },
    {
      path: "/admin/asins",
      name: "AdminAsins",
      component: AdminAsins,
      meta: {
        requiredAuth: true,
        layout: "admin",
        isAdmin: true
      }
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

const waitForStorageToBeReady = async (to, from, next) => {
  const authUser = store.state.isUserLoggedIn;
  const user = store.state.user;
  if (
    ((to.name !== "Login" && to.meta.requiredAuth) || to.name === null) &&
    !authUser
  ) {
    next({ name: "Login" });
  } else if (to.meta.isAdmin && authUser) {
    if (user.type == "admin") {
      next();
    } else {
      next({ name: "Dashboard" });
    }
  } else if (!to.meta.isAdmin && authUser && user.type == "admin") {
    next({ name: "AdminUsers" });
  } else {
    if ((to.name === null || to.name === "Login") && authUser) {
      next({ name: "Dashboard" });
    }
    next();
  }
};
router.beforeEach(waitForStorageToBeReady);

export default router;
