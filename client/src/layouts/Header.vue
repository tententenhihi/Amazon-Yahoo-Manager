<template>
  <div>
    <v-system-bar color="white" height="48px" class="app-bar">
      <v-app-bar-nav-icon> </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <!-- <v-btn icon :to="'/user'">
        <v-avatar
          class="mx-2"
          v-if="$store.state.isUserLoggedIn"
          style="border: 1px solid gray; cursor: pointer"
          color="red"
          size="32"
        >
          <span class="white--text title text-uppercase">B</span>
        </v-avatar>
      </v-btn> -->
    </v-system-bar>
    <v-navigation-drawer app v-model="drawer" permanent>
      <v-list-item class="px-2">
        <v-list-item-title class="pl-4">Yahoo</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="(item, index) in menu_items"
          :key="index"
          :to="item.path"
          link
        >
          <v-list-item-icon class="mr-4">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              ><span>{{ item.text }}</span></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      locations: [
        { lang: "vn", location: "Việt Nam" },
        { lang: "ja", location: "にほん" },
        { lang: "en", location: "England" }
      ],
      drawer: true,
      menu_items: [
        {
          text: "Tài khoản",
          icon: "mdi-account-circle",
          path: "/user/profile"
        },
        {
          text: "Quản lí file",
          icon: "mdi-folder",
          path: "/user/file"
        }
      ],

      mini: false
    };
  },
  computed: {
    ...mapState(["languageCurr"])
  },
  methods: {
    transitionRouter(nameRouter) {
      this.$router.push({ name: nameRouter });
    },
    ...mapActions(["setLang"]),
    ConvertLang(lang) {
      console.log(lang);
      this.setLang(lang);
    }
  }
};
</script>

<style scroped>
.app-bar {
  box-shadow: 0px 1px 4px 1px #d9d9d9;
  z-index: 7 !important;
}
.avatar {
  -webkit-transition: all 0.3s ease-out 0s;
  -moz-transition: all 0.3s ease-out 0s;
  -ms-transition: all 0.3s ease-out 0s;
  -o-transition: all 0.3s ease-out 0s;
  object-fit: cover;
  width: 32px;
  height: 32px;
}

.navbar-brand.logo {
  font-size: 21px;
  font-weight: bold;
  text-decoration: none;
}

.navbar-brand.logo span {
  color: #ff5c97;
  border: 3px solid #ff5c97;
  border-radius: 6px;
  padding: 0px 5px;
}
</style>
