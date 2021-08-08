<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク出品中の商品
    </div>
    <hr class="mt-10" />
    <div class="box-content px-10 py-20">
      <div class="form-search">
        <div class="form-row">
          <div class="form-group col-sm-8">
            <label for="queryString">検索クエリー</label>
            <input
              type="text"
              class="form-control"
              v-model="searchObj.queryString"
              id="queryString"
              placeholder="キーワード / 仕入元・オークションID"
            />
          </div>
        </div>
        <button class="btn btn-primary" @click="onSearchProduct">検索</button>
        <button class="btn btn-default" @click="clearSearchProduct">
          リセット
        </button>
      </div>
      <div class="alert alert-danger" v-if="isDieProxy">
        現在プロキシ未割当のため一時的に機能が利用できなくなっております。管理者までお問い合わせ下さい。
      </div>
      <div class="group-button py-20 position-relative">
        <button
          class="btn btn-primary my-10"
          style="position: absolute; top: -15px; right: 0; margin-bottom: -10px;"
          @click="getListProduct()"
        >
          <i class="fa fa-refresh"></i> 最新の情報を反映する
        </button>
        <button
          :disabled="!selectedProduct.length"
          @click="$refs.modalDeleteProduct.openModal()"
          class="btn btn-danger px-3"
        >
          削除
        </button>
      </div>
      <div class="table-responsive">
        <paginate
          v-if="pageCount > 1"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'«'"
          :next-text="'»'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
        <table class="table table-hover pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th class="text-center">
                <input
                  class="checkall"
                  type="checkbox"
                  v-model="isCheckAllProduct"
                />
              </th>
              <th class="text-center" width="120">オークションID</th>
              <th class="text-center" width="110">出品画像</th>
              <th class="text-center" width="100">取り扱い画像</th>
              <th width="300">Y！オーク商品の名前</th>
              <th class="text-center" width="110">落札価格</th>
              <th class="text-center" width="130">落札者情報</th>
              <th class="text-center" width="120">終了日時</th>
              <th width="150">メモ</th>
              <th class="text-center" width="100">予定受取金額</th>
              <th width="200">発送先</th>
              <th width="200">仕入れ価格</th>
              <th width="200">想定利益</th>
              <th width="200">落札手数料</th>
              <th width="200">利益率</th>
              <th width="200">予定送料</th>
              <th width="100"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in tableData" :key="index">
              <td class="text-center" width="50">
                <input
                  type="checkbox"
                  :id="product._id"
                  :disabled="!!product.idBuyer"
                  v-model="selectedProduct"
                  :value="product"
                />
              </td>
              <td class="text-center">{{ product.aID }}</td>
              <td class="text-center" width="100">
                <img
                  v-if="product.thumbnail"
                  :src="
                    product.thumbnail.includes('http')
                      ? product.thumbnail
                      : SERVER_HOST_UPLOAD + product.thumbnail
                  "
                  style="min-width: 50px; max-height: 100px; object-fit: contain;"
                />
              </td>
              <td class="text-center" width="100">
                <img
                  v-if="product.images && product.images.length"
                  :src="
                    product.images[0].includes('http')
                      ? product.images[0]
                      : SERVER_HOST_UPLOAD + product.images[0]
                  "
                  style="min-width: 50px; max-height: 100px; object-fit: contain;"
                />
              </td>
              <td>
                <a
                  :href="
                    `https://page.auctions.yahoo.co.jp/jp/auction/${product.aID}`
                  "
                  target="_blank"
                  >{{ product.product_yahoo_title }}</a
                >
                <div>
                  <a
                    :href="`https://www.amazon.co.jp/dp/${product.asin_amazon}`"
                    class="btn btn-info btn-xs"
                    target="_blank"
                  >
                    購入先を表示
                  </a>
                </div>
              </td>
              <td class="text-center">{{ getPriceEnd(product) }}</td>
              <td class="text-center">
                <div class="field-buyer">{{ product.idBuyer }}</div>
              </td>
              <td class="text-center">{{ product.time_end }}</td>
              <td class="text-note">
                <div class="field-note">
                  <p>{{ product.note }}</p>
                </div>
                <div>
                  <button
                    class="btn btn-info"
                    @click="onOpenModalNote(product)"
                  >
                    <i class="fa fa-edit" aria-hidden="true"></i> 編集
                  </button>
                </div>
              </td>
              <td class="text-center">{{ getExpectInCome(product) }}</td>

              <td v-html="getShipInfo(product)"></td>

              <td>{{ getPriceOriginal(product) }}</td>
              <td>{{ getProfitExpect(product) }}</td>

              <td>{{ getYahooFee(product) }}</td>

              <td>{{ getPersentProfit(product) }}</td>

              <td>
                {{ getExpectShiping(product) }}
              </td>
              <td>
                <button
                  class="btn btn-md btn-danger mb-1 mr-1"
                  @click="deleteProduct(product)"
                >
                  削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <modal-component ref="modalNote">
      <template v-slot:header>
        メモ: {{ selectedEdiNote.product_yahoo_title }}
      </template>
      <template>
        <textarea
          :value="selectedEdiNote.note"
          class="form-control"
          id=""
          cols="30"
          rows="5"
          ref="textareaNote"
        ></textarea>
      </template>
      <template v-slot:button>
        <button class="btn btn-primary" @click="onSaveNote">
          保存
        </button>
        <button class="btn btn-default" @click="oncloseModal()">
          キャンセル
        </button>
      </template>
    </modal-component>
    <modal-component ref="modalDeleteProduct" :isModalBody="false">
      <template v-slot:header>
        <h5>ご選択された商品がありません。</h5>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button
            class="btn btn-default"
            @click="$refs.modalDeleteProduct.closeModal()"
          >
            キャンセル
          </button>
          <button class="btn btn-primary mr-1" @click="onDeleteMultipleProduct">
            確認
          </button>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import ProductYahooFinishedApi from "@/services/ProductYahooFinishedApi";
import { mapGetters } from "vuex";
const LISTING_PROGRESS = [
  { value: "address_inputing", display: "住所入力待ち" },
  { value: "postage_inputing", display: "送料連絡中" },
  { value: "bundle_requested", display: "同梱依頼品" },
  { value: "bundle_accepted", display: "同梱" },
  { value: "money_received", display: "入金待ち" },
  { value: "preparation_for_shipment", display: "発送連絡中" },
  { value: "shipping", display: "発送完了" },
  { value: "complete", display: "取引完了" }
];
const PROXY_STATUS_DIE = "die";
export default {
  name: "YahooAuctionFinisheds",
  data() {
    return {
      products: [],
      SERVER_HOST_UPLOAD: process.env.SERVER_API + "uploads/",
      selectedEdiNote: {},
      searchObj: {
        queryString: ""
      },
      searchProducts: [],
      page: 1,
      LISTING_PROGRESS,
      isCheckAllProduct: false,
      selectedProduct: []
    };
  },
  async mounted() {
    await this.getListProduct();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount"
    }),
    yahooAccountId() {
      return this.selectedYahooAccount._id;
    },
    tableData() {
      return this.searchProducts.slice(
        (this.page - 1) * this.$constants.PAGE_SIZE,
        this.page * this.$constants.PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.searchProducts.length / this.$constants.PAGE_SIZE);
    },
    isDieProxy() {
      return this.selectedYahooAccount.proxy &&
        this.selectedYahooAccount.proxy.length
        ? this.selectedYahooAccount.proxy[0].status === PROXY_STATUS_DIE
        : false;
    }
  },
  methods: {
    getPriceEnd(product) {
      if (product.price_end) {
        return product.price_end.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getExpectShiping(product) {
      let feeShipping = product.ship_fee1 * product.product_buy_count;
      if (feeShipping) {
        return feeShipping.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getExpectInCome(product) {
      let yahooFee = product.price_end * (product.yahooAuctionFee / 100);
      let income = product.price_end + product.ship_fee1 - yahooFee;
      income = income * product.product_buy_count;
      if (income) {
        return income.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getPersentProfit(product) {
      let profitExpect =
        product.price_end + product.ship_fee1 - product.import_price;
      let persent = profitExpect / (product.price_end + product.ship_fee1);
      persent = parseFloat(persent.toFixed(2)) * 100;
      persent = parseFloat(persent).toFixed(0);
      if (persent) {
        return persent + "%";
      }
      return "-";
    },
    getYahooFee(product) {
      let yahooFee = product.price_end * (product.yahooAuctionFee / 100);
      if (yahooFee) {
        yahooFee = yahooFee * product.product_buy_count;
        return yahooFee.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getPriceOriginal(product) {
      let priceOriginal = (product.import_price += product.amazon_shipping_fee);
      if (priceOriginal) {
        priceOriginal = priceOriginal * product.product_buy_count;
        return priceOriginal.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getProfitExpect(product) {
      let profit =
        (product.price_end + product.ship_fee1 - product.import_price) *
        product.product_buy_count;
      if (profit) {
        return profit.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getShipInfo(product) {
      if (product.ship_info) {
        return product.ship_info;
      }
      return `<span class="label label-danger">未定</span>`;
    },
    async getListProduct() {
      try {
        let res = await ProductYahooFinishedApi.get(this.yahooAccountId);
        if (res && res.status === 200) {
          this.products = res.data.products;
          this.searchProducts = this.products;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    onOpenModalNote(product) {
      this.selectedEdiNote = product;
      this.$refs.modalNote.openModal();
    },
    async onSaveNote() {
      let res = await ProductYahooFinishedApi.setNote({
        product_id: this.selectedEdiNote._id,
        note: this.$refs.textareaNote.value
      });
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "追加成功",
          timer: 500,
          showConfirmButton: false
        });
        this.selectedEdiNote.note = this.$refs.textareaNote.value;
        this.oncloseModal();
      }
    },
    oncloseModal() {
      this.selectedEdiNote = {};
      this.$refs.modalNote.closeModal();
    },
    onSearchProduct() {
      this.searchProducts = this.products.filter(product => {
        let condition = true;
        if (this.searchObj.queryString) {
          condition =
            condition &&
            (product.product_yahoo_title.includes(this.searchObj.queryString) ||
              product.aID.includes(this.searchObj.queryString) ||
              product.idBuyer.includes(this.searchObj.queryString));
        }
        if (condition) {
          return product;
        }
      });
      this.page = 1;
    },
    clearSearchProduct() {
      this.searchObj = {
        queryString: ""
      };
      this.searchProducts = [...this.products];
    },
    displayProgress(progress) {
      return this.LISTING_PROGRESS.find(item => item.value === progress)
        .display;
    },
    deleteProduct(product) {
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
          cancelButtonText: '<i class="fa fa-times"></i>  番号'
        })
        .then(async result => {
          if (result.isConfirmed) {
            let res = await ProductYahooFinishedApi.delete(product._id);
            if (res && res.status == 200) {
              let findIndex = this.searchProducts.findIndex(
                item => item._id === product._id
              );
              this.searchProducts.splice(findIndex, 1);
              if (this.tableData.length === 0) {
                this.page -= 1;
              }
              self.$swal.fire(
                "削除しました！",
                "商品が削除されました。",
                "success"
              );
            }
          }
        });
    },
    async onDeleteMultipleProduct() {
      let params = {
        ids: this.selectedProduct.map(item => item._id)
      };
      let res = await ProductYahooFinishedApi.deleteMultiple(params);
      if (res && res.status === 200) {
        this.selectedProduct.forEach(item => {
          let findIndex = this.searchProducts.findIndex(
            product => product._id === item._id
          );
          this.searchProducts.splice(findIndex, 1);
        });
        this.isCheckAllProduct = false;
        this.selectedProduct = [];
        this.$refs.modalDeleteProduct.closeModal();
        this.$swal.fire({
          icon: "success",
          title: "商品一覧を削除しました。"
        });
        if (this.tableData.length === 0) {
          this.page -= 1;
        }
      }
    }
  },
  watch: {
    isCheckAllProduct() {
      if (this.isCheckAllProduct) {
        let data = [...this.tableData];
        let filterPro = data.filter(item => {
          if (!item.idBuyer) {
            return item;
          }
        });
        this.selectedProduct = [...filterPro];
      } else {
        this.selectedProduct = [];
      }
    },
    selectedProduct() {
      if (
        this.selectedProduct.length &&
        this.selectedProduct.length ==
          this.tableData.filter(item => {
            if (!item.idBuyer) {
              return item;
            }
          }).length
      ) {
        this.isCheckAllProduct = true;
      } else {
        this.isCheckAllProduct = false;
      }
    },
    page() {
      this.isCheckAllProduct = false;
      this.selectedProduct = [];
    }
  },
  created() {
    const selectedYahooAccount = this.$store.state.selectedYahooAccount;
    if (selectedYahooAccount && selectedYahooAccount.is_lock) {
      this.$routes.push({ name: "YahooAccounts" });
    }
  }
};
</script>

<style scoped>
table tr td.text-note {
  word-break: break-all;
}
.form-search {
  padding: 20px 0;
}
label {
  font-weight: bold;
  margin-bottom: 5px;
}
</style>
