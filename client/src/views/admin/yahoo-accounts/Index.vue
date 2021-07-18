<template>
  <div class="wrapper-content">
    <div class="box-header">
      Yahoo Account
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <div class="search-proxy mt-10">
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="userid">User Id</label>
              <input type="text" class="form-control" id="userid" v-model="searchUserId">
            </div>
            <div class="form-group col-md-4">
              <label for="username">Username</label>
              <input type="text" class="form-control" id="username" v-model="searchUsername">
            </div>
            <div class="form-group col-md-4">
              <label for="proxy">Proxy</label>
              <input type="text" class="form-control" id="proxy" v-model="searchProxy">
            </div>
          </div>
          <button class="btn btn-primary" @click="searchYahooAccount">Search</button>
        </div>
        <paginate
          v-if="pageCount > 1"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'">
        </paginate>
        <div class="table-responsive">
          <table class="table table-striped display pt-10 my-20">
            <thead class="thead-purple">
              <tr>
                <th scope="col">User ID</th>
                <th scope="col">Username</th>
                <th scope="col">Yahoo ID</th>
                <th scope="col">Status</th>
                <th scope="col">Proxy IP</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in tableData" :key="index">
                <td>{{ account.users[0].userId }}</td>
                <td>{{ account.users[0].username }}</td>
                <td>{{ account.yahoo_id }}</td>
                <td>{{ account.status }}</td>
                <td>
                  <template v-if="account.proxies[0]">
                    {{account.proxies[0].ip}} <br>
                    <span>
                      {{account.proxies[0].status}}
                    </span>
                  </template>
                </td>
                <td>
                  <button class="btn btn-sm btn-warning"
                    @click="setProxyToAccount(index)">
                      Change Proxy
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
        <h5><i class="fa fa-user-plus"></i> Set proxy to account</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">メールアドレス: </label>
          <div class="col-sm-7">
            <select class="form-control" v-model="selectedProxy">
              <option v-for="(proxy, index) in liveProxies" :value="proxy._id" :key="index">{{proxy.ip}}</option>
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
import AdminApi from '@/services/AdminApi'
const PAGE_SIZE = 20
const STATUS_PROXY = [
  { value: 'all', display: 'All'},
  { value: 'live', display: 'Live'},
  { value: 'used', display: 'Used'},
  { value: 'lock', display: 'Lock'},
  { value: 'die', display: 'Die'},
]
export default {
  name: 'YahooAccount',
  data () {
    return {
      accounts: [],
      proxies: [],
      STATUS_PROXY,
      page: 1,
      selectedProxy: null,
      selectAccount: null,
      searchUserId: '',
      searchUsername: '',
      searchProxy: '',
      searchData: [],
    }
  },
  async mounted () {
    await this.getYahooAccounts();
  },
  computed: {
    tableData () {
      return this.searchData.slice((this.page - 1) * PAGE_SIZE, this.page * PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.searchData.length / PAGE_SIZE)
    },
    liveProxies () {
      return this.proxies.filter(item => item.status === 'live')
    }
  },
  methods: {
    async getYahooAccounts() {
      try {
        let res = await AdminApi.getYahooAccounts();
        if (res && res.status === 200) {
          this.accounts = res.data.accounts;
          this.proxies = res.data.proxies;
          this.searchData = this.accounts
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    setProxyToAccount (index) {
      this.$refs.modalProxyAccount.openModal()
      this.selectAccount = index
    },
    async onSetProxyToAccount () {
      let res = await AdminApi.setProxyToYahooAccount({
        proxy_id: this.selectedProxy,
        yahoo_account_id: this.accounts[this.selectAccount]._id
      })
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "Success",
        });
        await this.getYahooAccounts();
        this.selectedProxy = null
        this.$refs.modalProxyAccount.closeModal()
      }
    },
    onCloseModal () {
      this.$refs.modalProxyAccount.closeModal()
    },
    searchYahooAccount () {
      this.searchData = this.accounts.filter(account => {
        let condition = true;
        if (this.searchUserId) {
          condition = condition && account.users.length && account.users[0].userId && account.users[0].userId.toString().includes(this.searchUserId)
        }
        if (this.searchUsername) {
          condition = condition && account.users.length && account.users[0].username.includes(this.searchUsername)
        }
        if (this.searchProxy) {
          condition = condition && account.proxies.length && account.proxies[0].ip.includes(this.searchProxy)
        }
        if (condition) {
          return account;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
