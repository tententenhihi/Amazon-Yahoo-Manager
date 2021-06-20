<template>
  <div>
    <v-system-bar color="#6777ef" height="80px" class="app-bar">
      <v-spacer></v-spacer>

      <v-menu
        transition="slide-y-transition"
        rounded
        offset-y
        max-width="180px"
        right
        :offset-x="true"
      >
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" class=" mt-2" style="align-self: end;">
            <v-avatar
              class="mx-2"
              v-if="$store.state.isUserLoggedIn"
              style="border: 1px solid gray; cursor: pointer"
              size="32"
              color="white"
            >
              <span class="black--text font-weight-bold text-uppercase">B</span>
            </v-avatar>
            <span class="white--text fs-12" style="text-transform: none;"
              >Nguyen Tuan Bac</span
            >
            <v-icon color="white">mdi-menu-down</v-icon>
          </div>
        </template>
        <v-list dense>
          <v-list-item-group>
            <v-list-item dense>
              <v-list-item-icon>
                <v-icon size="18">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title dense @click="onClickLogout"
                  >Logout</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-system-bar>
    <v-navigation-drawer app v-model="drawer" permanent>
      <v-list-item class="px-2">
        <v-list-item-title class="pl-4">Site Logo</v-list-item-title>
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
          text: "Home",
          icon: "mdi-account-circle",
          path: "/"
        },
        {
          text: "ASIN",
          icon: "mdi-account-circle",
          path: "/asin"
        },
        {
          text: "Product",
          icon: "mdi-folder",
          path: "/product"
        }
      ],

      mini: false
    };
  },
  computed: {
    ...mapState(["languageCurr"])
  },
  methods: {
    onClickLogout() {
      this.$store.dispatch("setUser", null);
      this.$router.push({ path: "/login" });
    },
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
