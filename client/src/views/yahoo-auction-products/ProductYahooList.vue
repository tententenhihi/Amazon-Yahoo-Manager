<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク取扱商品管理
      <button class="btn btn-add-account" @click="goToFormProduct(0)">
        <i class="fa fa-plus"></i> 新規追加
      </button>
    </div>
    <hr class="mt-10" />
    <!-- <div class="box-content">
      <div class="px-30 py-20">
        <table id="productTable" class="display pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">数</th>
              <th scope="col">商品の状態</th>
              <th scope="col">個数</th>
              <th scope="col">開催期間</th>
              <th scope="col">終了時間</th>
              <th scope="col">返品の可否</th>
              <th scope="col">商品発送元の地域</th>
              <th scope="col">で作成</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                {{ PRODUCT_STATUS[product.product_status].display}}
              </td>
              <td>{{ product.quantity }}</td>
              <td>{{ HOLDING_PERIOD[product.holding_period].display }}</td>
              <td>{{ ENDING_TIME[product.ending_time].display }}</td>
              <td>{{ product.returnAbility }}</td>
              <td>{{ PREFECTURE[product.prefecture].display }}</td>
              <td>{{ product.created }}</td>
              <td>
                <button class="btn btn-md btn-warning mb-1 mr-1" @click="goToFormProduct(product._id)">
                  <i class="fa fa-edit"></i> 編集
                </button>
                <button class="btn btn-md btn-danger" @click="onConfirmDelete(product, index)">
                  <i class="fa fa-trash"></i> 削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
  </div>
</template>

<script>
// import ProductYahooApi from '@/services/ProductYahooApi'
const PRODUCT_STATUS = [
  {},
  { display: '中古', value: 1 },
  { display: '新品', value: 2 },
  { display: 'その他', value: 3 },
]
const HOLDING_PERIOD = [
  { display: '当日終了', value: 0 },
  { display: '1日間', value: 1 },
  { display: '2日間', value: 2 },
  { display: '3日間', value: 3 },
  { display: '4日間', value: 4 },
  { display: '5日間', value: 5 },
  { display: '6日間', value: 6 },
  { display: '7日間', value: 7 },
]
const ENDING_TIME = [
  { display: '午前0時から午前1時', value: 0 },
  { display: '午前1時から午前2時', value: 1 },
  { display: '午前2時から午前3時', value: 2 },
  { display: '午前3時から午前4時', value: 3 },
  { display: '午前4時から午前5時', value: 4 },
  { display: '午前5時から午前6時', value: 5 },
  { display: '午前6時から午前7時', value: 6 },
  { display: '午前7時から午前8時', value: 7 },
  { display: '午前8時から午前9時', value: 8 },
  { display: '午前9時から午前10時', value: 9 },
  { display: '午前10時から午前11時', value: 10 },
  { display: '午前11時から午後0時（正午）', value: 11 },
  { display: '午後0時（正午）から午後1時', value: 12 },
  { display: '午後1時から午後2時', value: 13 },
  { display: '午後2時から午後3時', value: 14 },
  { display: '午後3時から午後4時', value: 15 },
  { display: '午後4時から午後5時', value: 16 },
  { display: '午後5時から午後6時', value: 17 },
  { display: '午後6時から午後7時', value: 18 },
  { display: '午後7時から午後8時', value: 19 },
  { display: '午後8時から午後9時', value: 20 },
  { display: '午後9時から午後10時', value: 21 },
  { display: '午後10時から午後11時', value: 22 },
  { display: '午後11時から午前0時', value: 23 },
]
const PREFECTURE = [
  { value: 1, display: '北海道' },
  { value: 2, display: '青森県' },
  { value: 3, display: '岩手県' },
  { value: 4, display: '宮城県' },
  { value: 5, display: '秋田県' },
  { value: 6, display: '山形県' },
  { value: 7, display: '福島県' },
  { value: 8, display: '茨城県' },
  { value: 9, display: '栃木県' },
  { value: 10, display: '群馬県' },
  { value: 11, display: '埼玉県' },
  { value: 12, display: '千葉県' },
  { value: 13, display: '東京都' },
  { value: 14, display: '神奈川県' },
  { value: 15, display: '新潟県' },
  { value: 16, display: '富山県' },
  { value: 17, display: '石川県' },
  { value: 18, display: '福井県' },
  { value: 19, display: '山梨県' },
  { value: 20, display: '長野県' },
  { value: 21, display: '岐阜県' },
  { value: 22, display: '静岡県' },
  { value: 23, display: '愛知県' },
  { value: 24, display: '三重県' },
  { value: 25, display: '滋賀県' },
  { value: 26, display: '京都府' },
  { value: 27, display: '大阪府' },
  { value: 28, display: '兵庫県' },
  { value: 29, display: '奈良県' },
  { value: 30, display: '和歌山県' },
  { value: 31, display: '鳥取県' },
  { value: 32, display: '島根県' },
  { value: 33, display: '岡山県' },
  { value: 34, display: '広島県' },
  { value: 35, display: '山口県' },
  { value: 36, display: '徳島県' },
  { value: 37, display: '香川県' },
  { value: 38, display: '愛媛県' },
  { value: 39, display: '高知県' },
  { value: 40, display: '福岡県' },
  { value: 41, display: '佐賀県' },
  { value: 42, display: '長崎県' },
  { value: 43, display: '熊本県' },
  { value: 44, display: '大分県' },
  { value: 45, display: '宮崎県' },
  { value: 46, display: '鹿児島県' },
  { value: 47, display: '沖縄県' },
  { value: 48, display: '海外' },
]
const SHIP_SCHEDULE = [
  { display: '１〜２日', value: 0 },
  { display: '２〜３日', value: 1 },
  { display: '３〜７日', value: 2 },
  { display: '７日〜１３日', value: 3 },
  { display: '１４日以降', value: 4 },
]
const CONSPICUOUS_ICON = [
  { display: '美品', value: 0 },
  { display: '非売品', value: 1 },
  { display: '限定品', value: 2 },
  { display: '保証書付', value: 3 },
  { display: '全巻セット', value: 4 },
  { display: '正規店購入', value: 5 },
  { display: '産地直送', value: 6 },
]
export default {
  name: 'ProductYahooList',
  data () {
    return {
      products: [],
      HOLDING_PERIOD,
      ENDING_TIME,
      PREFECTURE,
      SHIP_SCHEDULE,
      CONSPICUOUS_ICON,
      PRODUCT_STATUS
    }
  },
  async mounted () {
    // await this.getListProduct();
    // this.createDatatable()
  },
  methods: {
    // async getListProduct() {
    //   try {
    //     let res = await ProductYahooApi.get();
    //     if (res && res.status === 200) {
    //       this.products = res.data.products;
    //     }
    //   } catch (error) {
    //     this.$swal.fire({
    //       icon: "error",
    //       title: "エラー",
    //       text: error.message
    //     });
    //   }
    // },
    createDatatable () {
      let self = this;
      if (self.$("#productTable").DataTable()) {
        self.$("#productTable").DataTable().destroy();
      }
      self.$nextTick(() => {
        self.$("#productTable").DataTable({});
      });
    },
    // onConfirmDelete(product, index) {
    //   let self = this;
    //   self.$swal
    //     .fire({
    //       title: "削除",
    //       text: "この製品を本当に削除しますか？",
    //       icon: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#00a65a",
    //       cancelButtonColor: "#f39c12",
    //       confirmButtonText: '<i class="fa fa-check-square"></i> はい',
    //       cancelButtonText: '<i class="fa fa-times"></i>  番号',
    //     })
    //     .then(async (result) => {
    //       if (result.isConfirmed) {
    //         let res = await ProductYahooApi.delete(product._id);
    //         if (res && res.status == 200) {
    //           self.products.splice(index, 1);
    //           this.createDatatable()
    //           self.$swal.fire(
    //             "削除しました！",
    //             "商品が削除されました。",
    //             "success"
    //           );
    //         }
    //       }
    //     });
    // },
    goToFormProduct (id) {
      this.$router.push({name: 'FormProductYahoo', params: {id} })
    },
  }
}
</script>

<style scoped>
</style>
