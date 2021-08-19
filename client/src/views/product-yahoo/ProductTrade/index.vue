<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク落札商品管理
    </div>
    <hr class="mt-10" />
    <div class="box-content px-10 py-20">
      <div class="form-search">
        <div class="form-row">
          <div class="form-group col-sm-4">
            <label for="queryString">検索クエリー</label>
            <input
              type="text"
              class="form-control"
              v-model="searchObj.queryString"
              id="queryString"
              placeholder="キーワード / 仕入元・オークションID"
            />
          </div>
          <div class="form-group col-sm-4">
            <label for="progress">状態</label>
            <select
              id="progress"
              class="form-control"
              v-model="searchObj.progress"
            >
              <option :value="null" selected>すべて</option>
              <option
                v-for="(progress, index) in LISTING_PROGRESS"
                :key="index"
                :value="progress.value"
              >
                {{ progress.display }}
              </option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary px-4" @click="onSearchProduct">
          検索
        </button>
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
          @click="refreshDataYahoo()"
        >
          <i class="fa fa-sync-alt" style="font-size: 12px"></i>
          最新の情報を反映する
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
                  style="cursor: pointer; width: 15px; height: 15px;"
                />
              </th>
              <th class="text-center" width="120">オークションID</th>
              <th class="text-center" width="110">出品画像</th>
              <th width="300">Y！オーク商品の名前</th>
              <th class="text-center" width="110">落札価格</th>
              <th class="text-center" width="110">落札個数</th>
              <th class="text-center" width="130">落札者情報</th>
              <th class="text-center" width="120">終了日時</th>
              <th class="text-center">状態</th>
              <th width="150">メモ</th>
              <th class="text-center" width="100">予定受取金額</th>
              <th class="text-center" width="100">実際受取金額</th>
              <th width="110" class="text-center">発送先</th>
              <th width="120" class="text-center">仕入れ価格</th>
              <th width="110" class="text-center">想定利益</th>
              <th width="110" class="text-center">落札手数料</th>
              <th width="110" class="text-center">利益率</th>
              <th width="110" class="text-center">予定送料</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in tableData" :key="index">
              <td class="text-center" width="50">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  style="cursor: pointer; width: 15px; height: 15px;"
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
                <img
                  v-else
                  :src="product.images[0]"
                  style="min-width: 50px; max-height: 100px; object-fit: contain;"
                />
              </td>
              <!-- <td class="text-center" width="100">
                <img
                  v-if="product.images && product.images.length"
                  :src="
                    product.images[0].includes('http')
                      ? product.images[0]
                      : SERVER_HOST_UPLOAD + product.images[0]
                  "
                  style="min-width: 50px; max-height: 100px; object-fit: contain;"
                />
              </td> -->
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
              <td class="text-center">{{ product.product_buy_count }}</td>
              <td class="text-center">
                <div class="field-buyer">{{ product.idBuyer }}</div>
                <div class="goto">
                  <a
                    class="btn btn-xs"
                    style="border: 1px solid #d19405; background: #fece2f; color: #4c3000"
                    :href="`/yahoo-auction-trades-message/${product._id}`"
                  >
                    取引ナビ
                  </a>
                </div>
              </td>
              <td class="text-center">{{ product.time_end }}</td>
              <td class="text-center">
                <span class="label label-info fs-sm">{{
                  product.progress
                }}</span>
                <div class="mt-1" v-if="product.progress_message">
                  <span
                    class="label "
                    style="color: black"
                    v-html="product.progress_message"
                  >
                  </span>
                </div>
              </td>
              <td class="text-note">
                <div class="field-note">
                  <p>{{ product.note }}</p>
                </div>
                <div>
                  <button
                    class="btn btn-primary btn-sm"
                    @click="onOpenModalNote(product)"
                  >
                    <i class="fa fa-edit" aria-hidden="true"></i> 編集
                  </button>
                </div>
              </td>
              <td class="text-center">{{ getExpectInCome(product) }}</td>
              <td class="text-center">{{ getAmount_Actual(product) }}</td>

              <td class="text-center" v-html="getShipInfo(product)"></td>

              <td class="text-center">{{ getPriceOriginal(product) }}</td>
              <td class="text-center">{{ getProfitExpect(product) }}</td>

              <td class="text-center">{{ getYahooFee(product) }}</td>

              <td class="text-center">{{ getPersentProfit(product) }}</td>

              <td class="text-center">
                {{ getExpectShiping(product) }}
              </td>
              <td>
                <button
                  v-if="product.progress === '発送連絡'"
                  class="btn btn-md btn-danger mb-1 mr-1"
                  @click="onContactShip(product)"
                >
                  発送連絡
                </button>
                <button
                  class="btn btn-md btn-info mb-1 mr-1"
                  @click="addMessage(product)"
                >
                  取引連絡
                </button>
                <button
                  class="btn btn-md btn-warning mb-1 mr-1"
                  @click="addRating(product)"
                >
                  評価
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
  </div>
</template>

<script>
import ProductYahooEndedApi from "@/services/ProductYahooEndedApi";
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
  name: "YahooAuctionTrade",
  data() {
    return {
      products: [],
      SERVER_HOST_UPLOAD: process.env.SERVER_API + "uploads/",
      selectedEdiNote: {},
      searchObj: {
        queryString: "",
        progress: null
      },
      searchProducts: [],
      page: 1,
      LISTING_PROGRESS
    };
  },
  async mounted() {
    await this.getListProduct();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      adminViewUser: "getAdminViewUser"
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
    async onContactShip(product) {
      let res = await ProductYahooEndedApi.contactShip({
        product_id: product._id
      });
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "追加成功",
          timer: 500,
          showConfirmButton: false
        });
      }
    },
    async refreshDataYahoo() {
      let res = await ProductYahooEndedApi.refreshDataYahoo({
        yahoo_account_id: this.yahooAccountId
      });
      if (res && res.status === 200) {
        this.products = res.data.products;
        this.searchProducts = this.products;
        this.$swal.fire({
          icon: "success",
          title: "追加成功",
          timer: 500,
          showConfirmButton: false
        });
      }
    },
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
    getAmount_Actual(product) {
      let amount_actual = product.amount_actual;
      if (amount_actual) {
        return amount_actual.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getExpectInCome(product) {
      let amount_expected =
        product.price_end - product.price_end * 0.1 + product.ship_fee1;
      if (amount_expected) {
        amount_expected = parseInt(amount_expected);
        amount_expected = amount_expected * product.product_buy_count;
        return amount_expected.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getPersentProfit(product) {
      let persent = product.actual_profit / product.price;
      if (persent) {
        persent = parseFloat(persent.toFixed(2)) * 100;
        persent = parseFloat(persent).toFixed(0);
        return persent + "%";
      }
      return "-";
    },
    getYahooFee(product) {
      let yahooFee = product.price_end * 0.1;
      if (yahooFee) {
        yahooFee = yahooFee * product.product_buy_count;
        return yahooFee.toLocaleString("ja-JP") + "円";
      }
      return "-";
    },
    getPriceOriginal(product) {
      if (product.import_price && product.amazon_shipping_fee) {
        return `${product.import_price.toLocaleString("ja-JP")}円 + 送料${
          product.amazon_shipping_fee
        }円`;
      } else if (product.import_price) {
        return `${product.import_price.toLocaleString("ja-JP")}円`;
      }
      return "-";
    },
    getProfitExpect(product) {
      let profit = product.actual_profit;
      if (profit) {
        profit = profit * product.product_buy_count;
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
        let res = await ProductYahooEndedApi.get(this.yahooAccountId);
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
    addRating(product) {
      this.$router.push({
        name: "YahooAuctionTradeRating",
        params: { id: product._id }
      });
    },
    addMessage(product) {
      this.$router.push({
        name: "YahooAuctionTradeMessage",
        params: { id: product._id }
      });
    },
    onOpenModalNote(product) {
      this.selectedEdiNote = product;
      this.$refs.modalNote.openModal();
    },
    async onSaveNote() {
      let res = await ProductYahooEndedApi.setNote({
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
            product.product_yahoo_title.includes(this.searchObj.queryString);
        }
        if (this.searchObj.progress) {
          condition = condition && product.progress === this.searchObj.progress;
        }
        if (condition) {
          return product;
        }
      });
      this.page = 1;
    },
    clearSearchProduct() {
      this.searchObj = {
        queryString: "",
        progress: null
      };
      this.searchProducts = [...this.products];
    }
  },
  created() {
    const selectedYahooAccount = this.$store.state.selectedYahooAccount;
    // if (selectedYahooAccount && selectedYahooAccount.is_lock) {
    //   this.$routes.push({ name: "YahooAccounts" });
    // }
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
