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
              <strong>Admin</strong>
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
                  <li>
                    <router-link :to="{name: 'ChangePassword'}">
                      <i class="fa fa-lock"></i>
                      <span>パスワード変更</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'AsinManagement'}">
                <i class="fa fa-list"></i>
                <span>ASIN管理</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'Products'}">
                <i class="fa fa-calendar"></i>
                <span>AMAZON製品</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown active">
              <a href="#">
                <i class="fa fa-check-square"></i>
                <span>出品管理</span>
              </a>
              <div class="sidebar-submenu d-block">
                <ul>
                  <li>
                    <router-link :to="{name: 'ProductYahooList'}">
                      <i class="fa fa-calendar"></i>
                      <span>Y!オーク取扱商品管理</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
            <!-- <li class="sidebar-dropdown">
              <router-link :to="{name: 'ProductYahooList'}">
                <i class="fa fa-calendar"></i>
                <span>YAHOO製品</span>
              </router-link>
            </li> -->
            <li class="sidebar-dropdown">
              <router-link :to="{name: 'YahooAuctionSelling'}">
                <i class="fa fa-list"></i>
                <span>落札商品管理</span>
              </router-link>
            </li>

            <li class="sidebar-dropdown active">
              <a href="#">
                <i class="fa fa-cogs"></i>
                <span>出品設定</span>
              </a>
              <div class="sidebar-submenu d-block">
                <ul>
                  <li>
                    <router-link :to="{name: 'ProductInfomationDefault'}">
                      <i class="fa fa-list-alt"></i>
                      <span>出品データデフォルト値</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'TemplateSetting'}">
                      <i class="fa fa-list-alt"></i>
                      <span>テンプレート</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'ProductDescriptionSetting'}">
                      <i class="fa fa-edit"></i>
                      <span>説明文</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'TradeMessageTemplate'}">
                      <i class="fa fa-book"></i>
                      <span>取引ナビテンプレート管理</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'RatingTemplate'}">
                      <i class="fa fa-book"></i>
                      <span>評価テンプレート管理</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{name: 'YahooAuctionPublicSetting'}">
                      <i class="fa fa-tasks"></i>
                      <span>自動出品設定</span>
                    </router-link>
                  </li>
                </ul>
              </div>
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
export default {
  methods: {
    onClickLogout() {
      this.$store.dispatch("setUser", null);
      this.$router.push({ name: "Login" });
    },
  }
};
</script>

<style scoped>
</style>
