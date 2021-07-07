<template>
  <div id="app">
    <div class="page-wrapper chiller-theme toggled">
      <Sidebar v-if="isUserLoggedIn" />
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
    
  },
  data: () => ({
    //
  })
};
</script>
