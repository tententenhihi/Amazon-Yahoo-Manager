<template>
  <div id="app">
    <div class="page-wrapper chiller-theme toggled">
      <Sidebar v-if="isUserLoggedIn" :currentRouter="currentRouter" />
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Sidebar from "./Sidebar.vue";

export default {
  name: "App",

  components: {
    Sidebar
  },
  computed: {
    ...mapState(["isUserLoggedIn"]),
    currentRouter () {
      return this.$route.name
    }
  },
  data: () => ({
    //
  })
};
</script>
