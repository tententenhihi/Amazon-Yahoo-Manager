<template>
  <div id="app">
    <div class="page-wrapper chiller-theme toggled">
      <button id="show-sidebar" class="btn btn-sm btn-dark" @click="isShowSidebar = true">
        <i class="fas fa-bars"></i>
      </button>
      <SidebarAdmin v-if="isUserLoggedIn && isShowSidebar" @closeSidebar="closeSidebar()" />
      <main class="page-content" :style="!isShowSidebar ? 'padding-left: 0' : ''">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SidebarAdmin from "./SidebarAdmin.vue";

export default {
  name: "App",
  data: () => ({
    isShowSidebar: true,
  }),
  components: {
    SidebarAdmin
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
  computed: {
    ...mapState(["isUserLoggedIn"]),
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
    }
  },
  watch: {
    '$route' () {
      this.onResize()
    },
  }
};
</script>
