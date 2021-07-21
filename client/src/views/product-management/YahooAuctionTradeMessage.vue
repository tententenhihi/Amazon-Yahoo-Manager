<template>
  <div class="wrapper-content">
    <div class="box-header"><i class="fa fa-list mr-2"></i>Y!オーク 評価</div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20 table-responsive">
        <div class="title">
          落札者情報
        </div>
        <table class="table table-striped pt-20 mb-30" style="width: 100%">
          <tbody>
            <tr>
              <td width="130px">商品タイトル</td>
              <td>{{ product.product_yahoo_title }}</td>
            </tr>
            <tr>
              <td width="130px">落札価格</td>
              <td>{{ product.price_end }}円</td>
            </tr>
            <tr>
              <td width="130px">落札個数</td>
              <td>{{ product.buyer_count }}</td>
            </tr>
            <tr>
              <td width="130px">仕入れ価格</td>
              <td>{{ product.import_price }}</td>
            </tr>
            <tr>
              <td width="130px">想定利益</td>
              <td>{{ product.profit }}</td>
            </tr>
            <tr>
              <td width="130px">落札手数料</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">利益率</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">予定送料</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">購入先</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">決済方法</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">予定受取金額</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">お届け方法</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">お届け先住所</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">送料</td>
              <td></td>
            </tr>
            <tr>
              <td width="130px">合計金額</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <!-- <div class="alert alert-success">
          この商品は発送が完了しています。
        </div> -->
        <router-link
          tag="button"
          class="btn btn-default mt-20"
          :to="{ name: 'YahooAuctionTradeRating', params: { id: product._id } }"
          >評価済</router-link
        >
        <br />
        <button class="btn btn-danger mt-20" :disabled="true">取引中止</button>
        <br />
        <button class="btn btn-danger my-20">落札者削除</button> <br />
        <hr />
        <div class="my-20">
          取引で困ったことなどがあったら、落札者に質問してみよう！
        </div>
        <ValidationObserver tag="div" ref="formMessage">
          <ValidationProvider
            name="コメント"
            rules="required"
            v-slot="{ errors }"
            tag="div"
            class="form-group"
          >
            <label for="comment">コメント</label>
            <textarea
              class="form-control"
              v-model="comment"
              id=""
              cols="30"
              rows="5"
            ></textarea>
            <div class="error-message" v-if="errors.length">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
          <div>
            <button class="btn btn-primary" @click="addMessage">
              メッセージを送信
            </button>
          </div>
        </ValidationObserver>
        <hr class="my-20" />
        <div class="message-list">
          <template v-for="message in product.message_list">
            <div class="message-item" :key="message.created_at">
              <template v-if="message.type === 'seller'">
                <div class="message-info d-block">
                  <span class="created-at float-left">
                    {{
                      $moment(message.created_at).format(
                        "YYYY年MM月DD日 HH時mm分"
                      )
                    }}
                  </span>
                  <span class="user float-right">
                    その他: {{ message.yahoo_id }}
                  </span>
                </div>
                <div style="clear:both" class="my-10"></div>
                <img
                  class="message-img seller"
                  src="https://dummyimage.com/100x100/000000/FFFFFF.png&text=S"
                  alt="Seller"
                />
                <div class="message-text seller">
                  <p style="white-space: pre-line">
                    {{ message.comment }}
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="message-info d-block">
                  <span class="created-at float-right">
                    {{
                      $moment(message.created_at).format(
                        "YYYY年MM月DD日 HH時mm分"
                      )
                    }}
                  </span>
                  <span class="user float-left">
                    {{ message.yahoo_id }}: その他
                  </span>
                </div>
                <div style="clear:both" class="my-10"></div>
                <img
                  class="message-img buyer"
                  src="https://dummyimage.com/100x100/000000/FFFFFF.png&text=B"
                  alt="Seller"
                />
                <div class="message-text buyer">
                  <p style="white-space: pre-line">
                    {{ message.comment }}
                  </p>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProductYahooEndedApi from "@/services/ProductYahooEndedApi";

export default {
  name: "YahooAuctionTradeMessage",
  data() {
    return {
      product: {},
      comment: ""
    };
  },
  async mounted() {
    this.getProduct();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount"
    }),
    yahooAccountId() {
      return this.selectedYahooAccount._id;
    },
    productId() {
      return this.$route.params.id;
    }
  },
  methods: {
    async getProduct() {
      let res = await ProductYahooEndedApi.show(this.productId);
      if (res && res.status === 200) {
        this.product = res.data.product;
      } else {
        this.$router.push({ name: "YahooAuctionTrade" });
      }
    },
    async addMessage() {
      let newComment = {
        yahoo_id: this.selectedYahooAccount.yahoo_id,
        comment: this.comment,
        created_at: new Date().getTime(),
        type: "seller"
      };
      let result = await this.$refs.formMessage.validate();
      if (result) {
        let params = {
          ...this.product,
          message_list: [newComment].concat(this.product.message_list),
          newComment
        };
        let res = await ProductYahooEndedApi.update(this.product._id, params);
        if (res && res.status === 200) {
          this.$swal.fire({
            icon: "success",
            title: "Add message successfully",
            timer: 500,
            showConfirmButton: false
          });
          this.product = res.data.product;
          this.comment = "";
        }
      }
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 20px;
  margin: 10px 0;
}
.table td,
.table th {
  padding: 10px;
}
.message-info {
  padding-bottom: 15px;
}
.message-img.seller {
  border-radius: 50%;
  float: right;
  width: 40px;
  height: 40px;
}
.message-text.seller {
  background: #00a65a;
  border-color: #00a65a;
  color: #ffffff;
  margin-right: 50px;
  margin-left: 0;
  padding: 0 15px 15px;
  border-radius: 5px;
  position: relative;
  border: 1px solid #d2d6de;
}
.message-text.seller::before {
  right: auto;
  left: 100%;
  position: absolute;
  top: 12px;
  border-left: 8px solid #00a65a;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  content: " ";
  height: 0;
  width: 0;
  pointer-events: none;
}
.message-img.buyer {
  border-radius: 50%;
  float: left;
  width: 40px;
  height: 40px;
}
.message-text.buyer {
  background: #d2d6de;
  border-color: #d2d6de;
  color: #000;
  margin-left: 50px;
  margin-right: 0;
  padding: 0 15px 15px;
  border-radius: 5px;
  position: relative;
  border: 1px solid #d2d6de;
}
.message-text.buyer::before {
  left: auto;
  right: 100%;
  position: absolute;
  top: 12px;
  border-right: 8px solid #d2d6de;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  content: " ";
  height: 0;
  width: 0;
  pointer-events: none;
}
.message-item {
  margin: 15px 0;
}
.created-at {
  color: #999;
}
.user {
  font-weight: bold;
}
</style>
