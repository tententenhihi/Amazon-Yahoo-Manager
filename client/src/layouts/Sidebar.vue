<template>
  <div>
    <nav id="sidebar" class="sidebar-wrapper">
      <div class="sidebar-content">
        <div class="sidebar-brand">
          <a
            href="#"
            style="
              font-size: 16px;
              font-weight: bold;
              color: white;
              text-align: center;
            "
            >ヤフプロ</a
          >
          <div id="close-sidebar" @click="$emit('closeSidebar')">
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
            <span class="user-status">
              <i class="fa fa-circle"></i>
              <span>Online</span>
            </span>
          </div>
        </div>
        <div class="sidebar-menu pt-10">
          <ul>
            <!-- <li class="sidebar-dropdown">
              <router-link :to="{ name: 'Dashboard' }">
                <i class="fa fa-home"></i>
                <span>ダッシュボード</span>
              </router-link>
            </li> -->
            <li class="sidebar-dropdown" v-if="isAdmin">
              <router-link :to="{ name: 'AdminUsers' }">
                <i class="fas fa-arrow-left"></i>
                <span>管理者に戻る</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{ name: 'AsinManagement' }">
                <i class="fa fa-shopping-cart"></i>
                <span>ASIN管理</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <!-- <a href="#" @click="showDropdown(2)">
                <i class="fa fa-check-square"></i>
                <span>出品管理</span>
              </a> -->
              <router-link
                :to="'/yahoo-auction-products'"
                v-if="!isLockAccount"
              >
                <i class="fa fa-calendar"></i>
                <span>Y!オーク取扱商品管理</span>
              </router-link>

              <!-- <div
                class="sidebar-submenu"
                :class="{ 'd-block': dropdownOpen == 2 }"
              >
                <ul>
                  <li>
                    <router-link :to="'/amazon-products'">
                      <i class="fa fa-calendar"></i>
                      <span>Amazon商品一覧</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="'/yahoo-auction-products'">
                      <i class="fa fa-calendar"></i>
                      <span>Y!オーク取扱商品管理</span>
                    </router-link>
                  </li>
                </ul>
              </div> -->
            </li>
            <li class="sidebar-dropdown">
              <a href="#" @click="showDropdown(4)">
                <i class="fa fa-list"></i>
                <span>出品した商品管理</span>
              </a>
              <div
                class="sidebar-submenu"
                :class="{ 'd-block': dropdownOpen == 4 }"
              >
                <ul>
                  <li>
                    <router-link :to="'/yahoo-auction-sellings'">
                      <i class="fa fa-calendar"></i>
                      <span>Y!オーク出品中</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="'/yahoo-auction-finished'">
                      <i class="fa fa-calendar"></i>
                      <span>Y!オーク出品終了分</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="'/yahoo-auction-trades'">
                      <i class="fa fa-calendar"></i>
                      <span>Y!オーク落札商品管理</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown" v-if="!isLockAccount">
              <a href="#" @click="showDropdown(3)">
                <i class="fa fa-cogs"></i>
                <span>出品設定</span>
              </a>
              <div
                class="sidebar-submenu"
                :class="{ 'd-block': dropdownOpen == 3 }"
              >
                <ul>
                  <li>
                    <router-link :to="{ name: 'ProductInfomationDefault' }">
                      <i class="fa fa-calculator"></i>
                      <span>Y!オーク出品情報管理</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'TemplateSetting' }">
                      <i class="fa fa-list-alt"></i>
                      <span>テンプレート</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'ProductDescriptionSetting' }">
                      <i class="fa fa-edit"></i>
                      <span>説明文</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'TradeMessageTemplate' }">
                      <i class="fa fa-book"></i>
                      <span>取引ナビテンプレート管理</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'RatingTemplate' }">
                      <i class="fa fa-book"></i>
                      <span>評価テンプレート管理</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'YahooAuctionPublicSetting' }">
                      <i class="fa fa-tasks"></i>
                      <span>自動出品設定</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link :to="'/copy-default-settings'">
                      <i class="fa fa-clone"></i>
                      <span>情報のコピーをする</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{ name: 'FolderManagement' }">
                <i class="fa fa-folder"></i>
                <span>フォルダ管理</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{ name: 'ImageInsertion' }">
                <i class="fa fa-file-image"></i>
                <span>画像挿入設定</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{ name: 'Categories' }">
                <i class="fa fa-bookmark"></i>
                <span>カテゴリ管理</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{ name: 'Logs' }">
                <i class="fa fa-archive"></i>
                <span>出品ログ</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <router-link :to="{ name: 'ApiKey' }">
                <i class="fa fa-key"></i>
                <span>Api</span>
              </router-link>
            </li>
            <li class="sidebar-dropdown">
              <a href="#" @click="showDropdown(1)">
                <i class="fa fa-user"></i>
                <span>アカウント設定</span>
              </a>
              <div
                class="sidebar-submenu"
                :class="{ 'd-block': dropdownOpen == 1 }"
              >
                <ul>
                  <li>
                    <router-link :to="{ name: 'YahooAccounts' }">
                      <i class="fa fa-user"></i>
                      <span>アカウント設定</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'ChangePassword' }">
                      <i class="fa fa-lock"></i>
                      <span>パスワード変更</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>

            <li class="sidebar-dropdown">
              <a href="#" @click="showDropdown(5)">
                <i class="fa fa-dollar-sign"></i>
                <span>出金</span>
              </a>
              <div
                class="sidebar-submenu"
                :class="{ 'd-block': dropdownOpen == 5 }"
              >
                <ul>
                  <li>
                    <router-link :to="{ name: 'AccountPayment' }">
                      <i class="fa fa-money-bill-alt m-0"></i>
                      <span>実行アカウント</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'MappingBank' }">
                      <i class="fa fa-map-signs m-0"></i>
                      <span>アカウントごとの口座管理</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'BankManager' }">
                      <i class="fa fa-university m-0"></i>
                      <span>本物口座情報</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              class="sidebar-dropdown mt-100"
              :class="{ 'mt-100': userInfo.type == 'member' }"
              @click="onClickLogout"
            >
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
import { mapGetters, mapState } from "vuex";
export default {
  props: ["currentRouter"],
  data() {
    return {
      dropdownOpen: 0,
      isShowCloseSidebar: true,
    };
  },
  computed: {
    ...mapState(["adminViewUser"]),
    ...mapGetters({
      userInfo: "getUserInfo",
      selectedYahooAccount: "getSelectedYahooAccount",
    }),
    isAdmin() {
      return this.adminViewUser;
    },
    isLockAccount() {
      if (this.selectedYahooAccount && this.selectedYahooAccount.is_lock) {
        return true;
      } else return false;
    },
  },
  methods: {
    onClickLogout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "Login" });
    },
    showDropdown(index) {
      this.dropdownOpen == index
        ? (this.dropdownOpen = 0)
        : (this.dropdownOpen = index);
    },
  },
  watch: {
    $route() {
      let type = this.$route.meta.type;
      switch (type) {
        case "user":
          this.dropdownOpen = 1;
          break;
        case "product":
          this.dropdownOpen = 2;
          break;
        case "config":
          this.dropdownOpen = 3;
          break;
        case "product-management":
          this.dropdownOpen = 4;
          break;
        case "bank":
          this.dropdownOpen = 5;
          break;
        default:
          this.dropdownOpen = 0;
          break;
      }
    },
  },
};
</script>

<style scoped>
li {
  white-space: nowrap;
}
</style>
