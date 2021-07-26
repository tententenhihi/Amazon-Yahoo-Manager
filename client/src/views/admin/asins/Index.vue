<template>
  <div class="wrapper-content" v-if="isInit">
    <div class="box-header">
      禁止ASIN一覧
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <ValidationObserver tag="div" class="d-flex my-20 col-12" ref="formAsin">
          <ValidationProvider rules="required" name="ASIN" v-slot="{ errors }" tag="div" class="col-4 col-lg-3">
            <input type="text" placeholder="ASIN" v-model="asin" class="form-control">
            <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
          </ValidationProvider>
          <ValidationProvider rules="required" name="禁止理由" v-slot="{ errors }" tag="div" class="col-4 col-lg-3">
            <input type="text" placeholder="禁止理由" v-model="reason_for_prohibition" class="form-control">
            <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
          </ValidationProvider>
          <div>
            <button class="btn btn-primary ml-2" style="height: 38px;" @click="addAsin">追加</button>
          </div>
        </ValidationObserver>
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
          <table class="table table-striped display pt-10 my-10">
            <thead class="thead-purple">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">ASIN</th>
                <th scope="col">禁止理由</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td>{{ item.asin_id }}</td>
                <td>{{ item.asin }}</td>
                <td>{{ item.reason_for_prohibition }}</td>
                <td>
                  <button class="btn btn-warning" @click="deleteAsin(item, index)">削除</button>
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
      let validate = await this.$refs.formAsin.validate();
      if (validate) {
        let res = await AdminApi.createAsin({asin: this.asin, type: 'BLACK', reason_for_prohibition: this.reason_for_prohibition});
        if (res && res.status === 200) {
          this.$swal.fire({
            icon: "success",
            title: "ASINブラックリストに追加しました。",
            timer: 500,
            showConfirmButton: false,
          });
          this.asin = ''
          this.reason_for_prohibition = ''
          this.asins.push(res.data.asin)
        }
      }
    },
    async deleteAsin (item, index) {
      let res = await AdminApi.deleteAsin(item._id);
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "ASINブラックリストに削除しました。",
          timer: 500,
          showConfirmButton: false,
        });
        let findIndex = this.asins.findIndex(asin => asin._id === item._id)
        this.asins.splice(findIndex, 1)
        if (this.tableData.length === 0) {
          this.page -= 1
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
