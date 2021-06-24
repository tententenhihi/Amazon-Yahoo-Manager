<template>
  <div>
    <a id="show-sidebar" class="btn btn-sm btn-dark" href="#">
      <i class="fas fa-bars"></i>
    </a>
    <nav id="sidebar" class="sidebar-wrapper">
      <div class="sidebar-content">
        <div class="sidebar-brand">
          <a href="#">AYM</a>
          <!-- <div id="close-sidebar">
            <i class="fas fa-times"></i>
          </div> -->
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
              <strong>Mongji</strong>
            </span>
            <span class="user-role">Administrator</span>
            <span class="user-status">
              <i class="fa fa-circle"></i>
              <span>Online</span>
            </span>
          </div>
        </div>
        <div class="sidebar-menu">
          <ul>
            <li class="header-menu">
              <span>General</span>
            </li>
            <li class="sidebar-dropdown active">
              <a href="#">
                <i class="fa fa-user"></i>
                <span>アカウント設定</span>
              </a>
              <div class="sidebar-submenu d-block">
                <ul>
                  <li>
                    <router-link :to="{name: 'YahooAccounts'}">
                      <i class="fa fa-user"></i>
                      <span>アカウント設定</span>
                    </router-link>
                  </li>
                  <!-- <li>
                    <a href="#">
                      <i class="fa fa-lock"></i>
                      <span>パスワード変更</span></a>
                  </li> -->
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'AsinManagement'}">
                <i class="fa fa-list"></i>
                <span>Asin Management</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'Products'}">
                <i class="fa fa-calendar"></i>
                <span>Products Management</span>
              </router-link>
            </li>

            <li class="sidebar-dropdown active">
              <a href="#">
                <i class="fa fa-user"></i>
                <span>Settings</span>
              </a>
              <div class="sidebar-submenu d-block">
                <ul>
                  <li>
                    <router-link :to="{name: 'TemplateSetting'}">
                      <i class="fa fa-list"></i>
                      <span>Template Setting</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'ProductDescriptionSetting'}">
                      <i class="fa fa-edit"></i>
                      <span>Product Description</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'YahooAuctionPublicSetting'}">
                      <i class="fa fa-edit"></i>
                      <span>Yahoo Auction Public</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown mt-60" @click="onClickLogout">
              <a href="#">
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
export default {
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
