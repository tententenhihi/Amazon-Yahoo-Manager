<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Amazon商品取得
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
        <div>
          <div class="py-2">
            Amazon商品一覧
          </div>
          <hr>
          <div class="form-search">
            <div class="form-row">
              <div class="form-group col-sm-6">
                <label for="folder">出品フォルダ</label>
                <select id="folder" class="form-control" v-model="searchObj.folder">
                  <option :value="null" selected>--------------- ★全商品リスト★ ---------------</option>
                  <option v-for="(folder, index) in folders" :key="index" :value="folder._id">
                    {{ folder.name }}
                  </option>
                </select>
              </div>
              <div class="form-group col-sm-6">
                <label for="asin">検索クエリー</label>
                <input type="text" class="form-control" v-model="searchObj.asinKeyword" id="asin" placeholder="ASIN / キーワード">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-sm-6">
                <label for="price-more">仕入元の値段</label>
                <div class="input-group">
                  <input type="number" class="form-control" v-model="searchObj.minPrice" id="price-more">
                  <div class="input-group-prepend">
                    <div class="input-group-text">円以上</div>
                  </div>
                </div>
              </div>
              <div class="form-group col-sm-6">
                <label for="price-below">仕入元の値段</label>
                <div class="input-group">
                  <input type="number" class="form-control" v-model="searchObj.maxPrice" id="price-more">
                  <div class="input-group-prepend">
                    <div class="input-group-text">円以下</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- <div class="form-row">
              <div class="form-group col-sm-6">
                <label for="inputCity">プライム</label>
                <select id="inputState" class="form-control">
                  <option selected>Choose...</option>
                  <option>...</option>
                </select>
              </div>
            </div> -->
            <button type="submit" class="btn btn-primary" @click="onSearchProduct">検索</button>
            <button type="submit" class="btn btn-default" @click="clearSearchProduct">リセット</button>
          </div>
          <hr>
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
        <button type="submit" :disabled="!selectedProduct.length" class="btn btn-primary my-10" @click="convertYahooProduct">取扱いに追加</button>
        <table class="table pt-20 my-20">
          <thead class="thead-purple">
            <tr>
              <th class="cell-5"></th>
              <th class="cell-10">画像</th>
              <th class="cell-20">タイトル</th>
              <th class="cell-5">開始価格</th>
              <th class="cell-5">想定利益</th>
              <th class="cell-10">仕入元の値段</th>
              <th class="cell-15">送料</th>
              <th class="cell-10">仕入元の <br> 在庫数</th>
              <th class="cell-10">取扱に追加</th>
              <th class="cell-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in tableData" :key="product._id">
              <td scope="row">
                <input type="checkbox" :id="product._id" v-model="selectedProduct" :value="product">
              </td>
              <td>
                <img style="max-height: 180px" v-if="product.images && product.images.length" :src="product.images[0].includes('http') 
                  ? product.images[0] : SERVER_HOST_UPLOAD + product.images[0]" alt="">
              </td>
              <td class="cell-10">{{ product.name }} <br> ASIN: {{product.asin}}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.profit }}</td>
              <td>{{ product.basecost }}</td>
              <td>
                <div class="input-group">
                  <input type="number" class="form-control" v-model="product.shipping">
                  <div class="input-group-prepend">
                    <span class="input-group-text">円</span>
                    <button class="btn btn-primary btn-setup" @click="onSetupShipping(product)">設定</button>
                  </div>
                </div>
              </td>
              <td>{{ product.countProduct }}</td>
              <td>
                <div v-if="product.is_convert_yahoo" class="mypage-item-status bold awaiting">追加済み</div>
                <div v-else class="mypage-item-status bold action-required">追加ない</div>
              </td>
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
    <modal-component ref="modalSelectFolder">
      <template v-slot:header>
        <h5><i class="fa fa-file"></i> フォルダ管理</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">選択フォルダの出品予定</label>
          <div class="col-sm-7">
            <select class="form-control" v-model="selectedFolder">
              <option v-for="(folder, index) in folders" :value="folder._id" :key="index">{{folder.name}}</option>
            </select>
          </div>
          に
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-2" @click="onConvertYahooProduct">
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
import ProductAmazonApi from '@/services/ProductAmazonApi'
import FolderApi from '@/services/FolderApi'
import { mapGetters } from 'vuex'

export default {
  name: 'ProductList',
  data () {
    return {
      products: [],
      isInit: false,
      page: 1,
      folders: [],
      searchObj: {
        folder: null,
        asinKeyword: '',
        minPrice: '',
        maxPrice: ''
      },
      searchProducts: [],
      selectedProduct: [],
      selectedFolder: null,
      SERVER_HOST_UPLOAD: process.env.SERVER_API + 'uploads/'
    }
  },
  async mounted () {
    await this.getListProduct();
    this.getFolders();
    this.isInit = true
  },
  computed: {
    tableData () {
      return this.searchProducts.slice((this.page - 1) * this.$constants.PAGE_SIZE, this.page * this.$constants.PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.searchProducts.length / this.$constants.PAGE_SIZE)
    },
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
  },
  methods: {
    async getFolders () {
      let res = await FolderApi.get(this.selectedYahooAccount._id);
      if (res && res.status === 200) {
        this.folders = res.data.folders;
        if (this.folders.length) {
          this.selectedFolder = this.folders[0]._id
        }
      }
    },
    async getListProduct() {
      try {
        let res = await ProductAmazonApi.get(this.selectedYahooAccount._id);
        if (res && res.status === 200) {
          this.products = res.data.listProduct;
          this.searchProducts = this.products
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
    async onSetupShipping (product) {
      let res = await ProductAmazonApi.setShippingProduct(product._id, {shipping: product.shipping})
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "Set shipping successfully",
          timer: 500,
          showConfirmButton: false,
        });
      }
    },
    onSearchProduct () {
      this.searchProducts = this.products.filter(product => {
        let condition = true;
        if (this.searchObj.folder) {
          condition = condition && product.folder_id === this.searchObj.folder
        }
        if (this.searchObj.asinKeyword) {
          condition = condition && (product.name.includes(this.searchObj.asinKeyword) || product.asin.includes(this.searchObj.asinKeyword))
        }
        if (this.searchObj.minPrice) {
          condition = condition && (parseInt(product.basecost) > parseInt(this.searchObj.minPrice))
        }
        if (this.searchObj.maxPrice) {
          condition = condition && parseInt(product.basecost) < parseInt(this.searchObj.maxPrice)
        }
        if (condition) {
          return product;
        }
      })
    },
    clearSearchProduct () {
      this.searchObj = {
        folder: null,
        asinKeyword: '',
        minPrice: '',
        maxPrice: ''
      }
    },
    convertYahooProduct () {
      this.$refs.modalSelectFolder.openModal()
    },
    onCloseModal () {
      this.$refs.modalSelectFolder.closeModal()
    },
    async onConvertYahooProduct () {
      let params = {
        amazon_product_ids: this.selectedProduct.map(product => product._id),
        folder_id: this.selectedFolder
      }
      let res = await ProductAmazonApi.convertYahooProduct(params);
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "Update successfully",
          timer: 500,
          showConfirmButton: false,
        });
        this.selectedFolder = null;
        this.selectedProduct = []
        this.onCloseModal()
        this.getListProduct()
      }
    }
  }
}
</script>

<style scoped>
.opacity-0 {
  opacity: 0;
}
.btn-setup {
  border-top-right-radius: 0.25rem !important;
  border-bottom-right-radius: 0.25rem !important;
}
.form-search {
  padding: 20px 0;
}
.mypage-item-status.action-required {
  background: #ea352d;
}
.mypage-item-status.awaiting {
  background: #0099e8;
}
.mypage-item-status {
  display: inline-block;
  margin: 8px 0 0 0;
  padding: 5px 6px;
  border-radius: 2px;
  font-size: 11px;
  color: #fff;
}
</style>
