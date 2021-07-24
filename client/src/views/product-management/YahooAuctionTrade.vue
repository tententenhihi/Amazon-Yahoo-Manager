<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク取扱商品管理
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-10 py-20 table-responsive">
        <table class="table table-hover pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th class="text-center">
                <input class="checkall" type="checkbox" />
              </th>
              <th class="text-center" width="120">オークションID</th>
              <th class="text-center" width="110">出品画像</th>
              <th class="text-center" width="100">取り扱い画像</th>
              <th width="300">Y！オーク商品の名前</th>
              <th class="text-center" width="110">落札価格</th>
              <th class="text-center" width="110">落札個数</th>
              <th class="text-center" width="130">落札者情報</th>
              <th class="text-center" width="120">終了日時</th>
              <th class="text-center">状態</th>
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
            <tr v-for="(product, index) in products" :key="index">
              <td class="text-center" width="50">
                <input type="checkbox" name="" id="" />
              </td>
              <td class="text-center">{{ product.aID }}</td>
              <td class="text-center" width="100">
                <img
                  v-if="product.images && product.images.length"
                  :src="
                    product.images[0].includes('http')
                      ? product.images[0]
                      : SERVER_HOST_UPLOAD + product.images[0]
                  "
                  style="min-width: 50px"
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
                  style="min-width: 50px"
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
              <td class="text-center">{{ product.price_end }}</td>
              <td class="text-center">{{ product.buyer_count }}</td>
              <td class="text-center">
                <div class="field-buyer">{{ product.idBuyer }}</div>
                <div class="goto">
                  <a
                    class="btn btn-xs"
                    style="border: 1px solid #d19405; background: #fece2f; color: #4c3000"
                    :href="`/yahoo-auction-trade-message/${product._id}`"
                  >
                    取引ナビ
                  </a>
                </div>
              </td>
              <td class="text-center">{{ product.time_end }}</td>
              <td class="text-center">{{ product.auction_status }}</td>
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

export default {
  name: "YahooAuctionTrade",
  data() {
    return {
      products: [],
      SERVER_HOST_UPLOAD: process.env.SERVER_API + "uploads/",
      selectedEdiNote: {}
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
    }
  },
  methods: {
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
        let res = await ProductYahooEndedApi.get(this.yahooAccountId);
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
            let res = await ProductYahooEndedApi.delete(product._id);
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
          title: "Add note successfully",
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
    }
  }
};
</script>

<style scoped>
table tr td.text-note {
  word-break: break-all;
}
</style>
