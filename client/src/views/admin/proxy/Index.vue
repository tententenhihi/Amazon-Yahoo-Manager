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
              <label for="proxyIP">プロキシ IP</label>
              <input type="text" class="form-control" id="proxyIP" v-model="searchStr">
            </div>
            <div class="form-group col-md-4">
              <label for="status">状態</label>
              <select class="form-control" id="status" v-model="filter_status">
                <option v-for="(status, index) in STATUS_PROXY" :key="index" :value="status.value">{{status.display}}</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" @click="searchProxy">検索</button>
        </div>
        <paginate
          v-if="pageCount"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'«'"
          :next-text="'»'"
          :container-class="'pagination'"
          :page-class="'page-item'">
        </paginate>
        <div class="table-responsive">
          <table class="table table-striped display pt-10 my-20">
            <thead class="thead-purple">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">プロキシ IP</th>
                <th scope="col">状態</th>
                <th scope="col">作成日</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(proxy, index) in tableData" :key="index">
                <td>{{ proxy.id }}</td>
                <td>{{ proxy.ip }}</td>
                <td>{{ displayStatus(proxy.status) }}</td>
                <td>{{ $moment(proxy.created).format('YYYY/MM/DD') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminApi from '@/services/AdminApi'
const PAGE_SIZE = 20
const STATUS_PROXY = [
  { value: 'all', display: '全て'},
  { value: 'live', display: '活動中'},
  { value: 'used', display: '使用済み'},
  { value: 'lock', display: 'ロック'},
  { value: 'die', display: '壊れた'},
]
export default {
  name: 'Proxies',
  data () {
    return {
      proxies: [],
      STATUS_PROXY,
      page: 1,
      filter_status: 'all',
      searchStr: '',
      searchData: [],
      isInit: false
    }
  },
  async mounted () {
    await this.getProxies();
    this.isInit = true;
  },
  computed: {
    tableData () {
      return this.searchData.slice((this.page - 1) * PAGE_SIZE, this.page * PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.searchData.length / PAGE_SIZE)
    },
  },
  methods: {
    displayStatus (status) {
      return this.STATUS_PROXY.find(item => item.value === status).display
    },
    async getProxies() {
      try {
        let res = await AdminApi.getProxies();
        if (res && res.status === 200) {
          this.proxies = res.data.proxies;
          this.searchData = this.proxies
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    searchProxy () {
      let filters = [];
      if (this.filter_status === 'all') {
        filters = this.proxies.filter(item => {
          if (item.ip.includes(this.searchStr)) {
            return item
          }
        })
      } else {
        filters = this.proxies.filter(item => {
          if (item.status === this.filter_status && item.ip.includes(this.searchStr)) {
            return item
          }
        })
      }
      this.searchData = filters
      this.page = 1;
    }
  }
}
</script>

<style scoped>
</style>
