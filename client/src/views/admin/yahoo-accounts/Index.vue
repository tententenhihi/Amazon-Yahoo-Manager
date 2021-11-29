<template>
  <div class="wrapper-content">
    <div class="box-header">
      プロキシ割り当て管理
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <div class="search-proxy mt-10">
          <div class="form-row">
            <div class="form-group col-md-3">
              <label for="userid">ユーザーID</label>
              <input
                type="text"
                class="form-control"
                id="userid"
                v-model="searchUserId"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="userid">ヤフーID</label>
              <input
                type="text"
                class="form-control"
                id="userid"
                v-model="searchYahooId"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="username">ユーザー名</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="searchUsername"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="proxy">プロキシ</label>
              <input
                type="text"
                class="form-control"
                id="proxy"
                v-model="searchProxy"
              />
            </div>
          </div>
          <button class="btn btn-primary px-4" @click="searchYahooAccount">
            検索
          </button>
        </div>
        <paginate
          v-if="pageCount > 1"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'«'"
          :next-text="'»'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
        <div class="table-responsive">
          <table class="table table-striped display pt-10 my-20">
            <thead class="thead-purple">
              <tr>
                <th scope="col">ユーザーID</th>
                <th scope="col">ヤフーID</th>
                <th scope="col">ユーザー名</th>
                <th scope="col">Yahoo! オークID</th>
                <th scope="col">状態</th>
                <th scope="col">プロキシ IP</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in tableData" :key="index">
                <td>{{ account.users[0].userId }}</td>
                <td>{{ account.accountId }}</td>
                <td>{{ account.users[0].username }}</td>
                <td>{{ account.yahoo_id }}</td>
                <td>{{ account.status }}</td>
                <td>
                  <template v-if="account.proxies[0]">
                    {{ account.proxies[0].ip }} <br />
                    <span>
                      {{ displayStatus(account.proxies[0].status) }}
                    </span>
                  </template>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-warning"
                    @click="setProxyToAccount(account)"
                  >
                    プロキシ変更
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <modal-component ref="modalProxyAccount">
      <template v-slot:header>
        <h5><i class="fa fa-user-plus"></i> アカウントのプロキシ設定</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">メールアドレス: </label>
          <div class="col-sm-7">
            <select class="form-control" v-model="selectedProxy">
              <option
                v-for="(proxy, index) in liveProxies"
                :value="proxy._id"
                :key="index"
                >{{ proxy.ip }}</option
              >
            </select>
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-2" @click="onSetProxyToAccount">
            <i class="fa fa-save"></i> セーブ
          </button>
          <button class="btn btn-warning" @click="onCloseModal">
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import AdminApi from "@/services/AdminApi";
const PAGE_SIZE = 20;
const STATUS_PROXY = [
  { value: "all", display: "全て" },
  { value: "live", display: "活動中" },
  { value: "used", display: "使用済み" },
  { value: "lock", display: "ロック" },
  { value: "die", display: "壊れた" }
];
export default {
  name: "YahooAccount",
  data() {
    return {
      accounts: [],
      proxies: [],
      STATUS_PROXY,
      page: 1,
      selectedProxy: null,
      selectAccount: null,
      searchUserId: "",
      searchYahooId: "",
      searchUsername: "",
      searchProxy: "",
      searchData: []
    };
  },
  async mounted() {
    await this.getYahooAccounts();
  },
  computed: {
    tableData() {
      return this.searchData.slice(
        (this.page - 1) * PAGE_SIZE,
        this.page * PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.searchData.length / PAGE_SIZE);
    },
    liveProxies() {
      return this.proxies.filter(item => item.status === "live");
    }
  },
  methods: {
    displayStatus(status) {
      return this.STATUS_PROXY.find(item => item.value === status).display;
    },
    async getYahooAccounts() {
      try {
        let res = await AdminApi.getYahooAccounts();
        if (res && res.status === 200) {
          this.accounts = res.data.accounts;
          this.proxies = res.data.proxies;
          this.searchData = res.data.accounts;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    setProxyToAccount(account) {
      this.$refs.modalProxyAccount.openModal();
      this.selectAccount = account;
    },
    async onSetProxyToAccount() {
      let res = await AdminApi.setProxyToYahooAccount({
        proxy_id: this.selectedProxy,
        yahoo_account_id: this.selectAccount._id
      });
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "アカウントにプロキシの設定が完了しました",
          timer: 500,
          showConfirmButton: false
        });
        await this.getYahooAccounts();
        this.selectedProxy = null;
        this.$refs.modalProxyAccount.closeModal();
      }
    },
    onCloseModal() {
      this.$refs.modalProxyAccount.closeModal();
    },
    searchYahooAccount() {
      this.searchData = this.accounts.filter(account => {
        let condition = true;
        if (this.searchUserId) {
          condition =
            condition &&
            account.users.length &&
            account.users[0].userId &&
            account.users[0].userId.toString().includes(this.searchUserId);
        }
        if (this.searchYahooId) {
          condition =
            condition &&
            account.users.length &&
            account.yahoo_id.toString().includes(this.searchYahooId);
        }

        if (this.searchUsername) {
          condition =
            condition &&
            account.users.length &&
            account.users[0].username.includes(this.searchUsername);
        }
        if (this.searchProxy) {
          condition =
            condition &&
            account.proxies.length &&
            account.proxies[0].ip.includes(this.searchProxy);
        }
        if (condition) {
          return account;
        }
      });
      this.page = 1;
    }
  }
};
</script>

<style scoped></style>
