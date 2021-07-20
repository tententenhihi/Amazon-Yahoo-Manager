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
                <input type="checkbox" name="" id="" />
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
                <input type="checkbox" name="" id="" />
              </td>
              <td>{{ product.aID }}</td>
              <td>
                <img
                  style="max-height: 50px; max-width: 50px"
                  v-if="product.images && product.images.length"
                  :src="
                    product.images[0].includes('http')
                      ? product.images[0]
                      : SERVER_HOST_UPLOAD + product.images[0]
                  "
                  alt=""
                />
              </td>
              <td>
                <img
                  style="max-height: 50px; max-width: 50px"
                  v-if="product.images && product.images.length"
                  :src="
                    product.images[0].includes('http')
                      ? product.images[0]
                      : SERVER_HOST_UPLOAD + product.images[0]
                  "
                  alt=""
                />
              </td>
              <td>
                <div>
                  {{ product.product_yahoo_title }}
                </div>
                <a
                  :href="`https://www.amazon.co.jp/dp/${product.asin_amazon}`"
                  class="btn btn-info btn-xs"
                  target="_blank"
                >
                  購入先を表示
                </a>
              </td>
              <td>{{ product.price_end }}</td>
              <td>{{ product.buyer_count }}</td>
              <td>
                <div>
                  {{ product.idBuyer }}
                </div>
                <a
                  class="btn btn-xs"
                  style="border: 1px solid #d19405; background: #fece2f; color: #4c3000;"
                  :href="`/yahoo-auction-trade-message/${product._id}`"
                >
                  取引ナビ
                </a>
              </td>
              <td>{{ product.time_end }}</td>
              <td>{{ product.auction_status }}</td>
              <td>
                <div>
                  {{ product.note }}
                </div>
                <button class="btn btn-info" @click="onOpenModalNote(product)">
                  <i class="fa fa-edit" aria-hidden="true"></i> 編集
                </button>
              </td>
              <td>{{ "null" }}</td>
              <td>{{ product.import_price }}</td>
              <td>{{ product.profit }}</td>
              <td>{{ 0 }}</td>
              <td>{{ 0 }}</td>
              <td>{{ 0 }}</td>
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
          v-model="selectedEdiNote.note"
          class="form-control"
          id=""
          cols="30"
          rows="5"
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
      let res = await ProductYahooEndedApi.update(
        this.selectedEdiNote._id,
        this.selectedEdiNote
      );
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "Add note successfully",
          timer: 500,
          showConfirmButton: false,
        });
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

<style scoped></style>
