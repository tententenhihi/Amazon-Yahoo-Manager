<template>
  <div class="wrapper-content" v-if="isInit">
    <div class="box-header">
      プロキシ
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <div class="search-proxy mt-10">
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="proxyIP">ヤフーID </label>
              <input
                type="text"
                class="form-control"
                id="proxyIP"
                v-model="searchYahooID"
              />
            </div>
            <div class="form-group col-md-4">
              <label for="proxyIP">プロキシ IP</label>
              <input
                type="text"
                class="form-control"
                id="proxyIP"
                v-model="searchStr"
              />
            </div>
            <div class="form-group col-md-4">
              <label for="status">状態</label>
              <select class="form-control" id="status" v-model="filter_status">
                <option
                  v-for="(status, index) in STATUS_PROXY"
                  :key="index"
                  :value="status.value"
                  >{{ status.display }}</option
                >
              </select>
            </div>
          </div>
          <button class="btn btn-primary px-4" @click="searchProxy">
            検索
          </button>
        </div>
        <div class="row align-items-center" style="justify-content: space-between;">
          <paginate
            v-if="pageCount"
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
          <div>
            <button class="btn btn-success px-4 mr-3" @click="onUnLockAllProxy">
              Giải phóng toàn bộ proxy khóa
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped display pt-10 my-20">
            <thead class="thead-purple">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">プロキシ IP</th>
                <th scope="col" style="width: 200px;">状態</th>
                <th scope="col" style="width: 200px;">アクション</th>
                <th scope="col" style="width: 200px;">作成日</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(proxy, index) in tableData" :key="index">
                <td>{{ proxy.id }}</td>
                <td>
                  <div>
                    <div>
                      <span>{{ proxy.host }}</span>
                    </div>
                    <span>{{ proxy.username }}</span>
                  </div>
                </td>
                <td v-html="displayStatus(proxy._id, proxy.status)"></td>
                <td>
                  <button
                    v-if="checkProxyIsLock(proxy._id, proxy.status)"
                    class="btn btn-success"
                    @click="onUnLockProxy(proxy._id)"
                  >
                    ロックを解除する
                  </button>
                </td>
                <td>{{ $moment(proxy.created).format("YYYY/MM/DD") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
  name: "Proxies",
  data() {
    return {
      proxies: [],
      STATUS_PROXY,
      page: 1,
      filter_status: "all",
      searchStr: "",
      searchYahooID: "",
      searchData: [],
      isInit: false,
      listYahooAccount: []
    };
  },
  async mounted() {
    await this.getProxies();
    this.isInit = true;
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
    }
  },
  methods: {
    checkProxyIsLock(id, status) {
      if (status !== "live") {
        let accountUsed = this.listYahooAccount.find(
          item => item.proxy_id === id
        );
        if (!accountUsed) {
          return true;
        }
      }

      return false;
    },
    displayStatus(id, status) {
      switch (status) {
        case "live":
          return `<div class="text-center" style="width: 100px; border-radius:2px"><span>活動中</span></div>`;
        case "used":
          let accountUsed = this.listYahooAccount.find(
            item => item.proxy_id === id
          );
          if (accountUsed) {
            return `<div class="text-center" style="display: inline-block;">
            <div class="bg-success text-white p-1" style="width: 100px; border-radius:2px"><span >${accountUsed.yahoo_id}</span></div></br>${accountUsed.accountId}</div>`;
          } else {
            return `<div class=" text-center bg-warning text-white p-1" style="width: 100px; border-radius:2px"> <span>ロック</span></div>`;
          }
        case "lock":
          return ` <div class=" text-center bg-warning text-white p-1" style="width: 100px; border-radius:2px"> <span>ロック</span></div>`;
        case "die":
          return `<div class="text-center bg-danger text-white p-1" style="width: 100px; border-radius:2px"><span >壊れた</span></div>`;
      }
      return;
    },
    async onUnLockAllProxy() {
      try {
        let res = await AdminApi.unLockProxy("all");
        if (res && res.status === 200) {
          this.proxies = res.data.proxies;
          this.searchData = res.data.proxies;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    async onUnLockProxy(proxy_id) {
      try {
        let res = await AdminApi.unLockProxy(proxy_id);
        if (res && res.status === 200) {
          this.proxies = this.proxies.map(item => {
            if (item._id === proxy_id) {
              return {
                ...item,
                status: "live"
              };
            }
            return item;
          });
          this.searchData = this.proxies;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    async getProxies() {
      try {
        let res = await AdminApi.getProxies();
        if (res && res.status === 200) {
          this.proxies = res.data.proxies;
          this.listYahooAccount = res.data.listYahooAccount;
          this.searchData = this.proxies;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    searchProxy() {
      let filters = [];
      let listProxy = this.proxies;
      if (this.searchYahooID !== "") {
        listProxy = [];
        this.listYahooAccount.filter(item => {
          if (
            item.accountId &&
            item.accountId.toString() &&
            item.accountId.toString().includes(this.searchYahooID)
          ) {
            let proxy = this.proxies.find(pItem => pItem._id === item.proxy_id);
            listProxy.push(proxy);
          }
        });
      }
      if (this.filter_status === "all") {
        filters = listProxy.filter(item => {
          if (item.ip.includes(this.searchStr)) {
            return item;
          }
        });
      } else {
        filters = listProxy.filter(item => {
          if (
            item.status === this.filter_status &&
            item.ip.includes(this.searchStr)
          ) {
            return item;
          }
        });
      }
      this.searchData = filters;
      this.page = 1;
    }
  }
};
</script>

<style scoped></style>
