<template>
  <div>
    <nav id="sidebar" class="sidebar-wrapper">
      <div class="sidebar-content">
        <div class="sidebar-brand">
          <a href="#" style="font-size: 16px; font-weight: bold; color: white; text-align: center;">ヤフプロ</a>
          <div id="close-sidebar" @click="$emit('closeSidebar')" >
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div class="sidebar-header">
          <div class="user-pic">
            <img
              class="img-responsive img-rounded"
              src="https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg"
              alt="User picture"
            />
          </div>
          <div class="user-info">
            <span class="user-name">
              <strong>{{ this.userInfo.username }}</strong>
            </span>
            <span class="user-role">管理者</span>
            <span class="user-status">
              <i class="fa fa-circle"></i>
              <span>Online</span>
            </span>
          </div>
        </div>
        <div class="sidebar-menu">
          <ul>
            <!-- <li class="sidebar-dropdown">
              <router-link :to="{name: 'Home'}">
                <i class="fa fa-home"></i>
                <span>ホームページ</span>
              </router-link>
            </li> -->
            <li class="sidebar-dropdown mt-20">
              <router-link :to="{name: 'AdminUsers'}">
                <i class="fa fa-user"></i>
                <span>ユーザー設定</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'AdminProxy'}">
                <i class="fa fa-cog"></i>
                <span>プロキシ</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'AdminYahooAccounts'}">
                <i class="fa fa-list"></i>
                <span>プロキシ割り当て管理</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'AdminAsins'}">
                <i class="fa fa-star"></i>
                <span>禁止ASIN一覧</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown mt-60" @click="onClickLogout">
              <a style="cursor: pointer">
                <i class="fa fa-power-off"></i>
                <span>ログアウト</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    onClickLogout() {
      this.$store.dispatch("setUser", null);
      this.$router.push({ path: "/login" });
    },
  }
};
</script>

<style scoped>
</style>
