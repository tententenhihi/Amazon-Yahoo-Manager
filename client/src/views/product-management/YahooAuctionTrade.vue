<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク取扱商品管理
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-10 py-20 table-responsive">
        <table class="table table-striped pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">
                <input type="checkbox" name="" id="">
              </th>
              <th scope="col">オークションID</th>
              <th scope="col">出品画像</th>
              <th scope="col">取り扱い画像</th>
              <th scope="col">Y！オーク商品の名前</th>
              <th scope="col">落札価格</th>
              <th scope="col">落札個数</th>
              <th scope="col">落札者情報</th>
              <th scope="col">終了日時</th>
              <th scope="col">状態</th>
              <th scope="col">メモ</th>
              <th scope="col">発送先</th>
              <th scope="col">仕入れ価格</th>
              <th scope="col">想定利益</th>
              <th scope="col">落札手数料</th>
              <th scope="col">利益率</th>
              <th scope="col">予定送料</th>
              <th scope="col"></th>
              
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="index">
              <td>
                <input type="checkbox" name="" id="">
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <button class="btn btn-md btn-info mb-1 mr-1" @click="addMessage(product)">
                  取引連絡
                </button>
                <button class="btn btn-md btn-warning mb-1 mr-1" @click="addRating(product)">
                  評価
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ProductYahooApi from '@/services/ProductYahooApi'
import { mapGetters } from 'vuex'

export default {
  name: 'YahooAuctionTrade',
  data () {
    return {
      products: [{}],
      SERVER_HOST_UPLOAD: process.env.SERVER_API + 'uploads/'
    }
  },
  async mounted () {
    // await this.getListProduct();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
    yahooAccountId () {
      return this.selectedYahooAccount._id
    }
  },
  methods: {
    async getListProduct() {
      try {
        let res = await ProductYahooApi.get(this.yahooAccountId);
        if (res && res.status === 200) {
          this.products = res.data.products;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    onConfirmDelete(product, index) {
      let self = this;
      self.$swal.fire({
        title: "削除",
        text: "この製品を本当に削除しますか？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00a65a",
        cancelButtonColor: "#f39c12",
        confirmButtonText: '<i class="fa fa-check-square"></i> はい',
        cancelButtonText: '<i class="fa fa-times"></i>  番号',
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          let res = await ProductYahooApi.delete(product._id);
          if (res && res.status == 200) {
            self.products.splice(index, 1);
            self.$swal.fire(
              "削除しました！",
              "商品が削除されました。",
              "success"
            );
          }
        }
      });
    },
    addRating (product) {
      this.$router.push({name: 'YahooAuctionTradeRating', params: {id: 123}})
    },
    addMessage (product) {
      this.$router.push({name: 'YahooAuctionTradeMessage', params: {id: 123}})
    }
  }
}
</script>

<style scoped>
</style>
