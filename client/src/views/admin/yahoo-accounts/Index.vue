<template>
  <div class="wrapper-content">
    <div class="box-header">
      Yahoo Account
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
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
        <table class="table table-responsive table-striped display pt-10 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Yahoo ID</th>
              <th scope="col">Status</th>
              <th scope="col">Proxy IP</th>
              <th scope="col">Created At</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(account, index) in tableData" :key="index">
              <td>{{ account._id }}</td>
              <td>{{ account.name }}</td>
              <td>{{ account.yahoo_id }}</td>
              <td>{{ account.status }}</td>
              <td>{{ getProxyIp(account.proxy_id) }}</td>
              <td>{{ $moment(account.created).format('YYYY/MM/DD') }}</td>
              <td>
                <button class="btn btn-md btn-warning mb-1 mr-1"
                  @click="setProxyToAccount(index)">
                  <i class="fa fa-edit"></i> Set Proxy
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
  { value: 'all', display: 'ALL'},
  { value: 'live', display: 'LIVE'},
  { value: 'used', display: 'Used'},
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
    }
  },
  async mounted () {
    await this.getYahooAccounts();
  },
  computed: {
    tableData () {
      return this.accounts.slice((this.page - 1) * PAGE_SIZE, this.page * PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.accounts.length / PAGE_SIZE)
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
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    getProxyIp(proxy_id) {
      let proxy = this.proxies.find(item => item._id === proxy_id)
      return proxy ? proxy.ip : ''
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
        this.accounts[this.selectAccount] = {...res.data.account};
        this.accounts = [...this.accounts]
        let indexProxy = this.proxies.findIndex(pro => pro._id === this.selectedProxy);
        this.proxies[indexProxy].status = 'used'
        this.selectedProxy = null
        this.$refs.modalProxyAccount.closeModal()
      }
    },
    onCloseModal () {
      this.$refs.modalProxyAccount.closeModal()
    }
  }
}
</script>

<style scoped>
</style>
