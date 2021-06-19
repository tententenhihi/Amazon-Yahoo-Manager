<template>
  <v-app>
    <div class="d-flex">
      <v-main>
        <Header v-if="isUserLoggedIn" />
        <router-view />
      </v-main>
      <div />
    </div>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import Header from "./layouts/Header.vue";

export default {
  name: "App",

  components: {
    Header
  },
  computed: {
    ...mapState(["isUserLoggedIn"])
  },
  data: () => ({
    //
  })
};
</script>
