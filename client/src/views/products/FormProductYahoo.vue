<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-edit mr-2"></i>{{ productYahooId ? 'Edit product' : 'Add new product'}}
    </div>
    <hr />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="form-row">
          <div class="col-md-9">
            <div class="row">::: 商品情報 :::</div>
            <div class="row">
              <div class="col-md-4 text-align-end">商品の状態 :</div>
              <div class="col-md-8">
                <input type="radio" class="ml-2" name="" id="">中古
                <input type="radio" class="ml-2" name="" id="">新品
                <input type="radio" class="ml-2" name="" id="">その他
              </div>
            </div>
            <div class="row">
              <div class="col-md-4"></div>
              <div class="col-md-8">
                <input type="text" class="form-control" id="">
                中古・その他を選んだ場合、必ず上記に状態を全角15文字以内で記載して下さい。
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">値下げ交渉 :</div>
              <div class="col-md-8">
                <select class="form-control" id="">
                  <option value="1">1</option>
                  <option value="1">1</option>
                  <option value="1">1</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">個数 :</div>
              <div class="col-md-8">
                <input type="text" name="" id="" class="form-control">
                ※IDの評価が10以下の方は1個に固定されます。
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">開催期間 :</div>
              <div class="col-md-8">
                <select class="form-control" id="">
                  <option value="1">1</option>
                  <option value="1">1</option>
                  <option value="1">1</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">終了時間 :</div>
              <div class="col-md-8">
                <select class="form-control" id="">
                  <option value="1">1</option>
                  <option value="1">1</option>
                  <option value="1">1</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">返品の可否 :</div>
              <div class="col-md-8">
                <input type="radio" class="ml-2" name="" id="">返品不可
                <input type="radio" class="ml-2" name="" id="">返品可
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">返品の備考 :</div>
              <div class="col-md-8">
                <input type="text" name="" id="" class="form-control">
                ※IDの評価が10以下の方は1個に固定されます。
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end"></div>
              <div class="col-md-8">返品可の場合、全角30文字以内で必須入力です。</div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">入札制限 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                    総合評価で制限
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                    悪い評価の割合で制限 （詳細)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                    入札者認証制限あり (詳細)
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">その他 :</div>
              <div class="col-md-8">
                <div class="form-check d-flex">
                  <div class="mr-30">
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                    <label class="form-check-label" for="defaultCheck1">
                      自動延長あり
                    </label>
                  </div>
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                    <label class="form-check-label" for="defaultCheck1">
                      早期終了あり
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">自動再出品 :</div>
              <div class="col-md-8">
                <input type="text" class="form-control" style="width: 90%">回
              </div>
            </div>
            <div class="row">::: 支払い :::</div>
            <div class="row">
              <div class="col-md-4 text-align-end">決済方法 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                    Yahoo!かんたん決済（詳細）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">代金先払い、後払い :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="option1" checked>
                  <label class="form-check-label" for="exampleRadios1">
                    代金先払い（支払い確認後商品を発送）
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="option2">
                  <label class="form-check-label" for="exampleRadios2">
                    代金後払い（落札後、支払いの確認をまたずに商品を発送）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">送料負担 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="option1" checked>
                  <label class="form-check-label" for="exampleRadios1">
                    落札者
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="option2">
                  <label class="form-check-label" for="exampleRadios2">
                    出品者（落札者は無料）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              ::: 配送方法 :::
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">商品発送元の地域 :</div>
              <div class="col-md-2">
                <select class="form-control" id="">
                  <option value="1">1</option>
                  <option value="1">1</option>
                  <option value="1">1</option>
                </select>
              </div>
              <div class="col-md-3">市区町村（任意/全角10文字以内）：</div>
              <div class="col-md-3">
                <input type="text" class="form-control">
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">送料、配送方法 :</div>
              <div class="col-md-8">
                <div class="d-flex my-1">
                  <input type="text" style="width:45%" class="form-control mr-2">
                  <input type="text" style="width:45%" class="form-control">円
                </div>
                <div class="d-flex my-1">
                  <input type="text" style="width:45%" class="form-control mr-2">
                  <input type="text" style="width:45%" class="form-control">円
                </div>
                <div class="d-flex my-1">
                  <input type="text" style="width:45%" class="form-control mr-2">
                  <input type="text" style="width:45%" class="form-control">円
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">海外発送 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                    海外発送にも対応する
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">発送までの日数 :</div>
              <div class="col-md-8">
                <select class="form-control" id="">
                  <option value="1">1</option>
                  <option value="1">1</option>
                  <option value="1">1</option>
                </select>
              </div>
            </div>
            <div class="row">
              ::: 有料オプション :::
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">注目のオークション :</div>
              <div class="col-md-8">
                <input type="text" class="form-control">
                円  （半角数字）   1日あたり20円（税込21.60円）～
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">太字テキスト :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                    1出品あたり10.80円（税込）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">背景色 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                     1出品あたり32.40円（税込）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">目立ちアイコン :</div>
              <div class="col-md-8">
                <select class="form-control" id="">
                  <option value="1">1</option>
                  <option value="1">1</option>
                  <option value="1">1</option>
                </select>
                1出品あたり21.60円（税込）
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">贈答品アイコン :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  <label class="form-check-label" for="defaultCheck1">
                     1出品あたり21.60円（税込）
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-20">
          <button class="btn btn-success mb-1 mr-1" @click="onSaveProduct()">
            Save
          </button>
          <router-link :to="{name: 'ProductYahooList'}" tag="button" class="btn btn-warning mb-1">Cancel</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductAmazonApi from '@/services/ProductAmazonApi'
export default {
  name: 'FormProduct',
  data () {
    return {
      product: {
        product_status: 1,
        product_status_des: '',
        price_cut_negotiations: false,
        quantity: 1,
        holding_period: 0,
        ending_time: 0,
        returnAbility: false,
        remarks_for_returns: '',
        bid_limit: [],
        automatic_extension: false,
        early_termination: false,
        auto_relisting: 0,
        paid_type: 0,
        shipping_cost: 0,
        prefecture: '',
        address: '',
        shipping_method_1: '',
        shipping_rate_1: '',
        shipping_method_2: '',
        shipping_rate_2: '',
        shipping_method_3: '',
        shipping_rate_3: '',
        overseas_shipping: false,
        featured_auction: 0,
        bold_text: 0,
        bg_color: 0,
        conspicuous_icon: 1,
        gift_icon: false
      },
    }
  },
  async mounted () {
    if (this.productYahooId != 0) {
      let result = await ProductAmazonApi.show({_id: this.productYahooId})
      if (result && result.status === 200) {
        this.product = result.data
      } else {
        this.$router.push({name: 'ProductYahooList'})
      }
    }
  },
  computed: {
    productYahooId () {
      return this.$route.params.id || 0
    }
  },
  methods: {
    async onSaveProduct () {
      let result = null
      if (this.productYahooId == 0) {
        result = await ProductAmazonApi.create(this.product)
      } else {
        result = await ProductAmazonApi.update(this.productYahooId, this.product)
      }
      if (result && result.status === 200) {
        this.$swal.fire(
          "Successful!",
          "Your product has been updated.",
          "success"
        );
        this.$router.push({name: 'ProductYahooList'})
      }
    }
  }
}
</script>

<style scoped>
.btn-add-info {
  width: 26px;
  padding: 0;
}
.row {
  margin: 10px 0;
}
</style>
