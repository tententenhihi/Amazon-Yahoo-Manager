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

        <div>
          <button
            class="ml-2 btn btn-success"
            @click="$refs.modelJoinBill.openModal()"
            v-if="product.is_join_bill && !isSetJoinBillSuccess"
          >
            まとめて確認
          </button>
          <button
            class="ml-2 btn btn-info "
            @click="$refs.modelSetFeeShip.openModal()"
            v-if="product.progress === '送料連絡' && !isSetShipSuccess"
          >
            送料連絡
          </button>
          <router-link
            tag="button"
            class="ml-2 btn btn-default"
            :class="{
              'btn-warning':
                !product ||
                !product.rating_list ||
                product.rating_list.length == 0
            }"
            :to="{
              name: 'YahooAuctionTradeRating',
              params: { id: product._id }
            }"
            >{{
              product && product.rating_list && product.rating_list.length > 0
                ? "評価済"
                : "評価"
            }}</router-link
          >
          <button
            class="ml-2 btn btn-danger"
            @click="onCancelTransaction"
            v-if="
              product.progress === '発送連絡' && !isCancelTransactionSuccess
            "
          >
            取引中止
          </button>

          <button
            class="ml-2 btn btn-danger"
            @click="$refs.modalSelectReason.openModal()"
            v-if="
              !(
                product.progress !== '取引情報' &&
                product.progress !== '送料連絡' &&
                product.progress !== 'お支払い' &&
                !product.is_join_bill
              )
            "
          >
            落札者削除
          </button>
        </div>
        <br />
        <hr />
        <div class="my-2">
          取引で困ったことなどがあったら、落札者に質問してみよう！
        </div>
        <ValidationObserver tag="div" ref="formMessage">
          <div class="input-group mb-2">
            <select v-model="selectedTemplate" id="" class="form-control">
              <option :value="null" selected>テンプレートを選択</option>
              <option
                :key="index"
                v-for="(template, index) in templates"
                :value="template"
                >{{ template.name }}</option
              >
            </select>
            <div class="input-group-prepend">
              <div class="input-group-btn">
                <router-link
                  tag="button"
                  class="btn btn-primary btn-management"
                  :to="{ name: 'TradeMessageTemplate' }"
                  >管理</router-link
                >
              </div>
            </div>
          </div>
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
                      typeof message.created_at === "number"
                        ? $moment(message.created_at).format(
                            "MM月DD日 HH時mm分"
                          )
                        : message.created_at
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
                      typeof message.created_at === "number"
                        ? $moment(message.created_at).format(
                            "YYYY年MM月DD日 HH時mm分"
                          )
                        : message.created_at
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

    <modal-component ref="modalSelectReason">
      <template v-slot:header>
        <h5>理由</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <div class="col-sm-12">
            <select class="form-control" v-model="deleteReason">
              <option
                v-for="(reason, index) in DELETE_REASON"
                :value="reason.value"
                :key="index"
                >{{ reason.display }}</option
              >
            </select>
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-primary mr-2" @click="deleteBuyer">
            <i class="fa fa-save"></i> セーブ
          </button>
          <button
            class="btn btn-warning"
            @click="$refs.modalSelectReason.closeModal()"
          >
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>

    <modal-component ref="modelSetFeeShip">
      <template v-slot:header>
        <h5>送料を連絡</h5>
      </template>
      <template>
        <div>
          <div class="mb-3">
            <span>こちらの商品の送料を連絡します。</span>
          </div>
          <div class="form-group ">
            <label class="ml-2">送料</label>
            <div class="col-sm-12">
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  v-model="set_ship_fee"
                />
                <div class="input-group-append">
                  <span class="input-group-text">円</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-primary mr-2" @click="onSetFeeShip">
            <i class="fa fa-save"></i> 送料を連絡
          </button>
          <button
            class="btn btn-warning"
            @click="$refs.modelSetFeeShip.closeModal()"
          >
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>

    <modal-component ref="modelJoinBill">
      <template v-slot:header>
        <h5>配送方法</h5>
      </template>
      <template>
        <div class="p-2" style="font-size: 14px">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="is_join_bill_true"
              id="is_join_bill_true"
              :value="true"
              v-model="is_join_bill"
            />
            <label class="form-check-label" for="is_join_bill_true">
              まとめて取引
            </label>
          </div>
          <div v-if="is_join_bill" class="ml-4 mt-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="use_ship_origin_true"
                id="use_ship_origin_true"
                :value="true"
                v-model="use_ship_origin"
              />
              <label class="form-check-label" for="use_ship_origin_true">
                出品時に設定した配送方法を利用する
              </label>
            </div>
            <div class="form-check mt-1">
              <input
                class="form-check-input"
                type="radio"
                name="use_ship_origin_false"
                id="use_ship_origin_false"
                :value="false"
                v-model="use_ship_origin"
              />
              <label class="form-check-label" for="use_ship_origin_false">
                別の配送方法を利用する
              </label>
            </div>

            <div v-if="!use_ship_origin" class="input-group mt-2 mb-3">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span
                    class="input-group-text"
                    style="background-color: #fff7db"
                    id="inputGroupPrepend2"
                    >配送方法</span
                  >
                </div>
                <select class="custom-select" v-model="new_fee_ship_type">
                  <option
                    v-for="(item, index) in NEW_SHIP"
                    :key="index"
                    :value="item.value"
                    >{{ item.display }}</option
                  >
                </select>
                <div
                  v-if="
                    new_fee_ship_type !== 'ヤフネコ!（ネコポス）' &&
                      new_fee_ship_type !== 'ヤフネコ!（宅急便コンパクト）' &&
                      new_fee_ship_type !== 'ヤフネコ!（宅急便）' &&
                      new_fee_ship_type !== 'ゆうパケット（おてがる版）' &&
                      new_fee_ship_type !== 'ゆうパック（おてがる版）'
                  "
                  class="input-group-prepend"
                >
                  <span
                    class="input-group-text"
                    style="background-color: #fff7db"
                    id="inputGroupPrepend2"
                    >送料（円）</span
                  >
                </div>
                <input
                  v-if="
                    new_fee_ship_type !== 'ヤフネコ!（ネコポス）' &&
                      new_fee_ship_type !== 'ヤフネコ!（宅急便コンパクト）' &&
                      new_fee_ship_type !== 'ヤフネコ!（宅急便）' &&
                      new_fee_ship_type !== 'ゆうパケット（おてがる版）' &&
                      new_fee_ship_type !== 'ゆうパック（おてがる版）'
                  "
                  type="text"
                  class="form-control"
                  v-model="new_fee_ship_price"
                />
              </div>
            </div>
          </div>
          <div class="form-check mt-2">
            <input
              class="form-check-input"
              type="radio"
              name="is_join_bill_false"
              id="is_join_bill_false"
              v-model="is_join_bill"
              :value="false"
            />
            <label class="form-check-label" for="is_join_bill_false">
              単品で取引
            </label>
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-primary mr-2" @click="onSetJoinBill">
            <i class="fa fa-save"></i> 送料を連絡
          </button>
          <button
            class="btn btn-warning"
            @click="$refs.modelSetFeeShip.closeModal()"
          >
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProductYahooEndedApi from "@/services/ProductYahooEndedApi";
import TradeMessageTemplateApi from "@/services/TradeMessageTemplateApi";
const DELETE_REASON = [
  { value: "seller", display: "出品者都合" },
  { value: "winner", display: "落札者都合" }
];

const NEW_SHIP = [
  { value: "ヤフネコ!（ネコポス）", display: "ヤフネコ!（ネコポス）" },
  {
    value: "ヤフネコ!（宅急便コンパクト）",
    display: "ヤフネコ!（宅急便コンパクト）"
  },
  { value: "ヤフネコ!（宅急便）", display: "ヤフネコ!（宅急便）" },
  {
    value: "ゆうパケット（おてがる版）",
    display: "ゆうパケット（おてがる版）"
  },
  { value: "ゆうパック（おてがる版）", display: "ゆうパック（おてがる版）" },
  { value: "定形郵便", display: "定形郵便" },
  { value: "定形外郵便", display: "定形外郵便" },
  { value: "レターパックプラス", display: "レターパックプラス" },
  { value: "レターパックライト", display: "レターパックライト" },
  { value: "ゆうパック", display: "ゆうパック" },
  { value: "ゆうメール", display: "ゆうメール" },
  { value: "宅急便（ヤマト運輸）", display: "宅急便（ヤマト運輸）" },
  { value: "飛脚宅配便（佐川急便）", display: "飛脚宅配便（佐川急便）" },
  { value: "飛脚メール便（佐川急便）", display: "飛脚メール便（佐川急便）" },
  { value: "クリックポスト", display: "クリックポスト" },
  { value: "カンガルー便（西濃運輸）", display: "カンガルー便（西濃運輸）" }
];

export default {
  name: "YahooAuctionTradeMessage",
  data() {
    return {
      product: {},
      comment: "",
      templates: [],
      selectedTemplate: null,
      deleteReason: DELETE_REASON[0].value,
      DELETE_REASON,
      NEW_SHIP,
      set_ship_fee: "",
      isSetShipSuccess: false,
      isCancelTransactionSuccess: false,
      is_join_bill: true,
      use_ship_origin: false,
      new_fee_ship_type: NEW_SHIP[0].value,
      new_fee_ship_price: 0,
      isSetJoinBillSuccess: false
    };
  },
  async mounted() {
    this.getProduct();
    await this.getListTradeMessageTemplate();
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
    async onSetJoinBill() {
      try {
        let payload = {
          product_id: this.product._id,
          is_join_bill: this.is_join_bill,
          use_ship_origin: this.use_ship_origin,
          new_fee_ship_type: this.new_fee_ship_type,
          new_fee_ship_price: this.new_fee_ship_price
        };

        let res = await ProductYahooEndedApi.setJoinBill(payload);
        if (res && res.status === 200) {
          this.isSetJoinBillSuccess = true;
          this.$refs.modelJoinBill.closeModal();
          this.$swal.fire({
            icon: "success",
            title: "成功",
            timer: 500,
            showConfirmButton: false
          });
        }
      } catch (error) {}
    },
    async onSetFeeShip() {
      let payload = {
        product_id: this.product._id,
        set_ship_fee: this.set_ship_fee
      };

      let res = await ProductYahooEndedApi.setShipFee(payload);
      if (res && res.status === 200) {
        this.isSetShipSuccess = true;
        this.$refs.modelSetFeeShip.closeModal();
        this.$swal.fire({
          icon: "success",
          title: "成功",
          timer: 500,
          showConfirmButton: false
        });
      }
    },
    async onCancelTransaction() {
      let result = await this.$swal.fire({
        icon: "warning",
        title: "取引中止",
        text: "トランザクションのキャンセルを確認する ",
        showConfirmButton: true,
        showCancelButton: true
      });
      if (result && result.value) {
        try {
          let payload = {
            product_id: this.product._id
          };
          let res = await ProductYahooEndedApi.cancelTransaction(payload);
          if (res && res.status === 200) {
            this.isCancelTransactionSuccess = true;
            this.$swal.fire({
              icon: "success",
              title: "成功",
              timer: 500
            });
          }
        } catch (error) {}
      }
    },
    async deleteBuyer() {
      let payload = {
        product_id: this.product._id,
        reason: this.deleteReason
      };

      let res = await ProductYahooEndedApi.deleteBuyer(payload);
      if (res && res.status === 200) {
        this.product = res.data.product;
        this.comment = "";
        this.$refs.modalSelectReason.closeModal();
        this.$swal.fire({
          icon: "success",
          title: " 落札者の削除が完了しました",
          timer: 500,
          showConfirmButton: false
        });
      }
    },
    async getListTradeMessageTemplate() {
      try {
        let res = await TradeMessageTemplateApi.get(this.yahooAccountId);
        if (res && res.status === 200) {
          this.templates = res.data.templates;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    async getProduct() {
      let res = await ProductYahooEndedApi.show(this.productId);
      if (res && res.status === 200) {
        this.product = res.data.product;
      } else {
        this.$router.push({ name: "YahooAuctionTrade" });
      }
    },
    async addMessage() {
      let result = await this.$refs.formMessage.validate();
      if (result && this.comment.trim() != "") {
        let payload = {
          message: this.comment,
          product_id: this.product._id
        };

        let res = await ProductYahooEndedApi.sendMessage(payload);
        if (res && res.status === 200) {
          this.product = res.data.product;
          this.comment = "";
          this.$swal.fire({
            icon: "success",
            title: "メッセージの追加が完了しました",
            timer: 500,
            showConfirmButton: false
          });
        }
      }
    }
  },
  watch: {
    selectedTemplate() {
      if (this.selectedTemplate) {
        this.comment = this.selectedTemplate.content;
      } else {
        this.comment = "";
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
.btn-management {
  height: calc(2.25rem + 2px);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
