<template>
  <div class="wrapper-content" v-if="isInit">
    <div class="box-header">
      BLACKLIST ASIN
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <div class="d-flex mt-20 col-12">
          <input type="text" placeholder="asin" v-model="asin" class="form-control col-4 col-lg-3">
          <input type="text" placeholder="reason for prohibition" v-model="reason_for_prohibition"
            class="form-control ml-2 col-4 col-lg-3">
          <button class="btn btn-primary ml-2" @click="addAsin">Add Asin</button>
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
          :page-class="'page-item'">
        </paginate>
        <div class="table-responsive">
          <table class="table table-striped display pt-10 my-20">
            <thead class="thead-purple">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">ASIN</th>
                <th scope="col">Reason for prohibition</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td>{{ item.asin_id }}</td>
                <td>{{ item.asin }}</td>
                <td>{{ item.reason_for_prohibition }}</td>
                <!-- <td>{{ $moment(item.created).format('YYYY/MM/DD') }}</td> -->
                <td>
                  <button class="btn btn-warning" @click="deleteAsin(item, index)">Delete</button>
                </td>
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

const STATUS_ASIN = [
  { value: 'BLACK', display: 'BLACK'},
  { value: 'WHITE', display: 'WHITE'},
]
export default {
  name: 'AsinAmazon',
  data () {
    return {
      asins: [],
      STATUS_ASIN,
      page: 1,
      asin: '',
      reason_for_prohibition: '',
      isInit: false
    }
  },
  async mounted () {
    await this.getBlackListAsin();
    this.isInit = true;
  },
  computed: {
    tableData () {
      return this.asins.slice((this.page - 1) * PAGE_SIZE, this.page * PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.asins.length / PAGE_SIZE)
    },
  },
  methods: {
    async getBlackListAsin() {
      try {
        let res = await AdminApi.getBlackListAsin();
        if (res && res.status === 200) {
          this.asins = res.data.black_list;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    async addAsin () {
      let res = await AdminApi.createAsin({asin: this.asin, type: 'BLACK', reason_for_prohibition: this.reason_for_prohibition});
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "Add black asin successfully",
        });
        this.asin = ''
        this.reason_for_prohibition = ''
        this.asins.push(res.data.asin)
      }
    },
    async deleteAsin (item, index) {
      let res = await AdminApi.deleteAsin(item._id);
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "Delete black asin successfully",
        });
        this.asins.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
</style>
