<template>
  <div id="app">
    <div class="page-wrapper chiller-theme toggled">
      <SidebarAdmin v-if="isUserLoggedIn" />
      <main class="page-content">
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

  components: {
    SidebarAdmin
  },
  computed: {
    ...mapState(["isUserLoggedIn"]),
  },
  data: () => ({
    //
  })
};
</script>
