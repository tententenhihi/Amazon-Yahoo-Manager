<template>
  <div class="wrapper-content" v-if="isInit">
    <div class="box-header">
      Proxies
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <div class="search-proxy mt-10">
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="proxyIP">Proxy IP</label>
              <input type="text" class="form-control" id="proxyIP" v-model="searchStr">
            </div>
            <div class="form-group col-md-4">
              <label for="status">Status</label>
              <select class="form-control" id="status" v-model="filter_status">
                <option v-for="(status, index) in STATUS_PROXY" :key="index" :value="status.value">{{status.display}}</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" @click="searchProxy">Search</button>
        </div>
        <paginate
          v-if="pageCount"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'">
        </paginate>
        <table class="table table-responsive table-striped display pt-10 my-20">
          <thead class="thead-purple">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">IP Proxy</th>
              <th scope="col">Status</th>
              <th scope="col">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(proxy, index) in tableData" :key="index">
              <td>{{ proxy.proxy_id }}</td>
              <td>{{proxy.ip }}</td>
              <td>{{ proxy.status }}</td>
              <td>{{ $moment(proxy.created).format('YYYY/MM/DD') }}</td>
              <!-- <td>
                <button class="btn btn-md btn-warning mb-1 mr-1"
                  @click="goToFormRatingproxy(proxy._id)">
                  <i class="fa fa-edit"></i> 編集
                </button>
                <button class="btn btn-md btn-danger mb-1 mr-1" @click="onConfirmDelete(proxy, index)">
                  <i class="fa fa-trash"></i> 削除
                </button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AdminApi from '@/services/AdminApi'
const PAGE_SIZE = 20
const STATUS_PROXY = [
  { value: 'all', display: 'All'},
  { value: 'live', display: 'Live'},
  { value: 'used', display: 'Used'},
  { value: 'die', display: 'Die'},
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
    }
  }
}
</script>

<style scoped>
</style>
