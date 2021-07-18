<template>
  <div id="app">
    <div class="page-wrapper chiller-theme toggled">
      <span id="show-sidebar" class="btn btn-sm btn-dark" @click="isShowSidebar = true">
        <i class="fas fa-bars"></i>
      </span>
      <Sidebar v-if="isUserLoggedIn && isShowSidebar" :currentRouter="currentRouter" @closeSidebar="closeSidebar()" />
      <YahooAccountList v-if="isUserLoggedIn" :isShowSidebar="isShowSidebar" @onChangeYahooAccount="onChangeYahooAccount" />
      <main :key="keyUpdateComponent" class="page-content" :style="!isShowSidebar ? 'padding-left: 0' : ''">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Sidebar from "./Sidebar.vue";
import YahooAccountList from "./YahooAccountList.vue";

export default {
  name: "App",
  data: () => ({
    isShowSidebar: true,
    keyUpdateComponent: 0
  }),
  components: {
    Sidebar,
    YahooAccountList
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
  computed: {
    ...mapState(["isUserLoggedIn"]),
    currentRouter () {
      return this.$route.name
    }
  },
  methods: {
    onResize (e) {
      if (window.innerWidth < 768) {
        this.isShowSidebar = false
      } else {
        this.isShowSidebar = true
      }
    },
    closeSidebar () {
      this.isShowSidebar = false
    },
    onChangeYahooAccount () {
      this.keyUpdateComponent++;
    }
  },
  watch: {
    '$route' () {
      this.onResize()
    },
  }
};
</script>
<style scoped>
</style>