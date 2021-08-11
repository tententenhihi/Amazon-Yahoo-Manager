<template>
  <div id="app">
    <component :is="layout"></component>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import NormalLayout from "./layouts/NormalLayout.vue";
import AdminLayout from "./layouts/AdminLayout.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import YahooAccountApi from "@/services/YahooAccountApi";

export default {
  name: "App",
  data() {
    return {
      isLoading: false
    };
  },
  components: {
    NormalLayout,
    AdminLayout,
    Loading
  },
  computed: {
    ...mapState(["isUserLoggedIn"]),
    ...mapState(["adminViewUser"]),
    ...mapState(["isAdmin"]),
    layout() {
      return (this.$route.meta.layout || "normal") + "-layout";
    },
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.$eventBus.$on("showLoading", this.onShowLoading);
  },
  async mounted() {
    if (
      (this.isUserLoggedIn && !this.isAdmin) ||
      (this.isAdmin && this.adminViewUser)
    ) {
      await this.getListAccount();
      this.checkExistYahooAccount();
    }
  },
  beforeDestroy() {
    this.$eventBus.$off("showLoading", this.onShowLoading);
  },
  methods: {
    async getListAccount() {
      let result = await YahooAccountApi.get();
      if (result && result.status === 200) {
        let accounts = result.data.accounts || [];
        await this.$store.dispatch("setYahooAccount", accounts);
      } else if (result.status === 401) {
        await this.$store.dispatch("setUser", null);
        this.$router.push({ name: "Login" });
      }
    },
    onShowLoading(value) {
      this.isLoading = value;
    },
    checkExistYahooAccount() {
      const NO_NEED_VALIDATE_ROUTER = ["YahooAccounts", "ChangePassword"];

      // console.log(" #### 11111111111111: ", this.isUserLoggedIn);
      // console.log(" #### 22222222222222: ", this.userInfo.type !== "admin");
      // console.log(" #### 33333333333333: ", !this.selectedYahooAccount._id);

      if (
        !this.adminViewUser &&
        this.isUserLoggedIn &&
        this.userInfo &&
        this.userInfo.type !== "admin" &&
        !this.selectedYahooAccount._id
      ) {
        if (!NO_NEED_VALIDATE_ROUTER.includes(this.$route.name)) {
          this.$router.push({ name: "YahooAccounts" });
          this.$swal.fire({
            icon: "warning",
            title: "ヤフーのアカウントを設定してください"
          });
        }
      }
    }
  },
  watch: {
    $route() {
      this.checkExistYahooAccount();
    }
  }
};
</script>
<style src="@/assets/css/reset.css"></style>
<style src="@/assets/css/common.css"></style>
<style src="@/assets/css/style.css"></style>

<style>
.btn-xs {
  padding: 1px 5px !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
}
.vld-overlay.is-full-page {
  z-index: 9999 !important;
}
body {
  min-height: 100vh;
  font-family: "Roboto", "Arial", sans-serif !important;
  font-weight: 400 !important;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  font-family: "Roboto", "Arial", sans-serif !important;
  font-weight: 400 !important;
}

.v-btn {
  text-transform: none !important;
}

.reset {
  margin: 0px !important;
  padding: 0px !important;
}
.color-picker-container {
  box-shadow: 1px 1px 10px black !important;
}
.text-bold {
  font-weight: bold;
}
.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.fa-trash-alt:hover {
  color: red;
}
.span-fix-header-fixed {
  display: table-cell;
}
.fs-16 {
  font-size: 16px !important;
}
.fs-15 {
  font-size: 15px !important;
}

.fs-14 {
  font-size: 14px !important;
}
.fs-12 {
  font-size: 12px !important;
}
.fs-10 {
  font-size: 10px !important;
}
.fs-sm {
  font-size: 0.875rem !important;
}
.fs-md {
  font-size: 1rem !important;
}
.fs-lg {
  font-size: 1.25rem !important;
}
.fs-xl {
  font-size: 1.5rem !important;
}
.btn-radius {
  border-radius: 50px !important;
}
.text-gray {
  color: rgb(100, 100, 100);
}
</style>
