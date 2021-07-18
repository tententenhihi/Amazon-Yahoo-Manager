<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>製品リスト
      <button class="btn btn-add-account" @click="goToFormProduct(0)">
        <i class="fa fa-plus"></i> その他の商品
      </button>
    </div>
    <div class="csv-button ml-20">
      <button class="btn btn-outline-info mr-1 mb-1" @click="$refs.importCSV.click()">CSVインポート</button>
      <input type="file" hidden ref="importCSV" accept=".csv" name="" @change="onChangeFileCSV">
      <button class="btn btn-outline-primary mb-1" @click="onClickExportCSV">CSVエスポルト</button>
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-20 py-20">
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
        <table class="table pt-20 mb-20">
          <thead class="thead-purple">
            <tr>
              <th scope="col">数</th>
              <th scope="col">画像</th>
              <th scope="col">タイトル</th>
              <th scope="col">開始価格</th>
              <th scope="col">想定利益</th>
              <th scope="col">仕入元の値段</th>
              <th scope="col">送料</th>
              <th scope="col">仕入元の <br> 在庫数</th>
              <th scope="col">取扱に追加</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in tableData" :key="product._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <img v-if="product.images && product.images.length" :src="product.images[0].includes('http') 
                  ? product.images[0] : SERVER_HOST_UPLOAD + product.images[0]" alt="">
              </td>
              <td>{{ product.name }} <br> ASIN: {{product.asin}}</td>
              <td>{{ product.price }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <button class="btn btn-md btn-warning mb-1 mr-1" @click="goToFormProduct(product._id)">
                  <i class="fa fa-edit"></i> 編集
                </button>
                <button class="btn btn-md btn-danger mb-1 mr-1" @click="onConfirmDelete(product, index)">
                  <i class="fa fa-trash"></i> 削除
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
import ProductAmazonApi from '@/services/ProductAmazonApi'
import { mapGetters } from 'vuex'

export default {
  name: 'ProductList',
  data () {
    return {
      products: [],
      isInit: false,
      page: 1,
      SERVER_HOST_UPLOAD: process.env.SERVER_API + 'uploads/'
    }
  },
  async mounted () {
    await this.getListProduct();
    this.createDatatable()
    this.isInit = true
  },
  computed: {
    tableData () {
      return this.products.slice((this.page - 1) * this.$constants.PAGE_SIZE, this.page * this.$constants.PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.products.length / this.$constants.PAGE_SIZE)
    },
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
  },
  methods: {
    async getListProduct() {
      try {
        let res = await ProductAmazonApi.get(this.selectedYahooAccount._id);
        if (res && res.status === 200) {
          this.products = res.data.listProduct;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    createDatatable () {
      let self = this;
      if (self.$("#productTable").DataTable()) {
        self.$("#productTable").DataTable().destroy();
      }
      self.$nextTick(() => {
        self.$("#productTable").DataTable({});
      });
    },
    onConfirmDelete(product, index) {
      let self = this;
      self.$swal
        .fire({
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
            let res = await ProductAmazonApi.delete(product._id);
            if (res && res.status == 200) {
              self.products.splice(index, 1);
              this.createDatatable()
              self.$swal.fire(
                "削除しました！",
                "商品が削除されました。",
                "success"
              );
            }
          }
        });
    },
    goToFormProduct (id) {
      this.$router.push({name: 'FormProduct', params: {id} })
    },
    onChangeFileCSV (event) {
      try {
        let file = event.target.files[0];
        let reader = new FileReader();
        let self = this
        reader.onload = async function(e) {
          let arrLines = e.target.result.split('\n');
          let contentCsv = arrLines.slice(1, arrLines.length)
          let productList = [];
          contentCsv.forEach(line => {
            if (line.trim().replaceAll(',', '').replace('\r', '').replace('\n', '')) {
              let pros = line.trim().split('","');
              productList.push({
                asin: pros[0],
                name: pros[1],
                url: pros[2],
                price: pros[3],
                countProduct: parseInt(pros[4]),
                delivery: pros[5],
                type: pros[6],
                status: pros[7],
                image: pros[8],
              })
            }
          });
          let result = await ProductAmazonApi.createByCsv(productList);
          if (result && result.status === 200) {
            self.$swal.fire(
              "成功",
              "製品が更新されました。",
              "success"
            );
            self.products = self.products.concat(result.data.products)
            self.createDatatable()
          }
        };
        reader.readAsText(file);

        event.target.value = "";
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    onClickExportCSV () {
      let data = []
      data.push([
        'Asin"',
        '"名前"',
        '"Url"',
        '"価格"',
        '"カウント製品""',
        '"配達"',
        '"タイプ"',
        '"状態"',
        '"画像"',
        '"で作成"',
      ])
      
      this.products.map((product) => {
        let item = [
          product.asin + '"',
          '"' + product.name + '"',
          '"' + product.url + '"',
          '"' + product.price + '"',
          '"' + product.countProduct + '"',
          '"' + product.delivery + '"',
          '"' + product.type + '"',
          '"' + product.status + '"',
          '"' + product.images + '"',
          '"' + this.$moment(product.created).format("YYYY/MM/DD") + '"',
        ]
        data.push(item)
      })
      this.$helpers.exportToCSV(data)
    },
  }
}
</script>

<style scoped>
.opacity-0 {
  opacity: 0;
}
</style>
