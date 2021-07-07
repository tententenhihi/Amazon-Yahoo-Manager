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
              <div class="col-md-4 text-align-end">Photos :</div>
              <div class="col-md-8">
                <input type="file" id="file" ref="file" @change="selectFile()"/>
              </div>
            </div>
            <div class="row"></div>
            <div class="row" v-if="product.photo_url">
              <div class="col-md-4 text-align-end"></div>
              <div class="col-md-8">
                <img :src="product.photo_url" width="100px" />
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">商品の状態 :</div>
              <div class="col-md-8">
                <input type="radio" v-model="product.product_status" class="ml-2" id="second" :value="1">
                <label for="second">中古</label>
                <input type="radio" v-model="product.product_status" class="ml-2" id="new" :value="2">
                <label for="new">新品</label>
                <input type="radio" v-model="product.product_status" class="ml-2" id="other" :value="3">
                <label for="other">その他</label>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4"></div>
              <div class="col-md-8">
                <input type="text" class="form-control" id="" v-model="product.product_status_des">
                中古・その他を選んだ場合、必ず上記に状態を全角15文字以内で記載して下さい。
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">値下げ交渉 :</div>
              <div class="col-md-8">
                <select class="form-control" id="" v-model="product.price_cut_negotiations">
                  <option value="0">なし</option>
                  <option value="1">あり</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">個数 :</div>
              <div class="col-md-8">
                <input type="number" :mix="1" v-model="product.quantity" id="" class="form-control">
                ※IDの評価が10以下の方は1個に固定されます。
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">開催期間 :</div>
              <div class="col-md-8">
                <select class="form-control" v-model="product.holding_period" id="">
                  <option v-for="(period, index) in HOLDING_PERIOD" :key="index" :value="period.value">{{period.display}}</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">終了時間 :</div>
              <div class="col-md-8">
                <select class="form-control" id="">
                  <option v-for="(time, index) in ENDING_TIME" :key="index" :value="time.value">{{time.display}}</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">返品の可否 :</div>
              <div class="col-md-8">
                <input type="radio" v-model="product.returnAbility" class="ml-2" :value="0" id="non-return">
                <label for="non-return">返品不可</label> 
                <input type="radio" v-model="product.returnAbility" class="ml-2" :value="1" id="accept-return">
                <label for="accept-return">返品可</label>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">返品の備考 :</div>
              <div class="col-md-8">
                <input type="text" id="" class="form-control" v-model="product.remarks_for_returns">
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
                  <input class="form-check-input" type="checkbox" id="overral-evaluation">
                  <label class="form-check-label" for="overral-evaluation">
                    総合評価で制限
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="bad-evaluation">
                  <label class="form-check-label" for="bad-evaluation">
                    悪い評価の割合で制限 （詳細)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="bidder-authen">
                  <label class="form-check-label" for="bidder-authen">
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
                    <input class="form-check-input" v-model="product.automatic_extension" type="checkbox" id="automatic-extension">
                    <label class="form-check-label" for="automatic-extension">
                      自動延長あり
                    </label>
                  </div>
                  <div>
                    <input class="form-check-input" v-model="product.early_termination" type="checkbox" id="early-terminate">
                    <label class="form-check-label" for="early-terminate">
                      早期終了あり
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">自動再出品 :</div>
              <div class="col-md-8">
                <select class="form-control" id="" v-model="product.auto_relisting">
                  <option v-for="(n, index) in 4" :key="index" :value="index">{{n}}</option>
                </select>回
              </div>
            </div>
            <div class="row">::: 支払い :::</div>
            <div class="row">
              <div class="col-md-4 text-align-end">決済方法 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" checked disabled>
                  <label class="form-check-label">
                    Yahoo!かんたん決済（詳細）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">代金先払い、後払い :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" v-model="product.paid_type" type="radio" :value="0" id="prepaid">
                  <label class="form-check-label" for="prepaid">
                    代金先払い（支払い確認後商品を発送）
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" v-model="product.paid_type" type="radio" :value="1" id="postpaid">
                  <label class="form-check-label" for="postpaid">
                    代金後払い（落札後、支払いの確認をまたずに商品を発送）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">送料負担 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" v-model="product.shipping_cost" type="radio" :value="0" id="bidder">
                  <label class="form-check-label" for="bidder">
                    落札者
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" v-model="product.shipping_cost" type="radio" :value="1" id="seller">
                  <label class="form-check-label" for="seller">
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
                <select class="form-control" id="" v-model="product.prefecture">
                  <option v-for="(pref, index) in PREFECTURE" :key="index" :value="pref.value">{{pref.display}}</option>
                </select>
              </div>
              <div class="col-md-3">市区町村（任意/全角10文字以内）：</div>
              <div class="col-md-3">
                <input type="text" class="form-control" v-model="product.address">
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">送料、配送方法 :</div>
              <div class="col-md-8">
                <div class="d-flex my-1">
                  <input type="text" v-model="product.shipping_method_1" style="width:45%" class="form-control mr-2">
                  <input type="text" v-model="product.shipping_rate_1" style="width:45%" class="form-control">円
                </div>
                <div class="d-flex my-1">
                  <input type="text" v-model="product.shipping_method_2" style="width:45%" class="form-control mr-2">
                  <input type="text" v-model="product.shipping_rate_2" style="width:45%" class="form-control">円
                </div>
                <div class="d-flex my-1">
                  <input type="text" v-model="product.shipping_method_3" style="width:45%" class="form-control mr-2">
                  <input type="text" v-model="product.shipping_rate_3" style="width:45%" class="form-control">円
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">海外発送 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="overseas" v-model="product.overseas_shipping">
                  <label class="form-check-label" for="overseas">
                    海外発送にも対応する
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">発送までの日数 :</div>
              <div class="col-md-8">
                <select class="form-control" id="" v-model="product.ship_schedule">
                  <option v-for="(ship, index) in SHIP_SCHEDULE" :key="index" :value="ship.value">{{ship.display}}</option>
                </select>
              </div>
            </div>
            <div class="row">
              ::: 有料オプション :::
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">注目のオークション :</div>
              <div class="col-md-8">
                <input type="text" class="form-control" v-model="product.featured_auction">
                円  （半角数字）   1日あたり20円（税込21.60円）～
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">太字テキスト :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="bold-text" v-model="product.bold_text">
                  <label class="form-check-label" for="bold-text">
                    1出品あたり10.80円（税込）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">背景色 :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="bg-color" v-model="product.bg_color">
                  <label class="form-check-label" for="bg-color">
                     1出品あたり32.40円（税込）
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">目立ちアイコン :</div>
              <div class="col-md-8">
                <select class="form-control" id="" v-model="product.conspicuous_icon">
                  <option v-for="(icon, index) in CONSPICUOUS_ICON" :key="index" :value="icon.value">{{icon.display}}</option>
                </select>
                1出品あたり21.60円（税込）
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 text-align-end">贈答品アイコン :</div>
              <div class="col-md-8">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="gift-icon" v-model="product.gift_icon">
                  <label class="form-check-label" for="gift-icon">
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
import ProductYahooApi from '@/services/ProductYahooApi'
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
        prefecture: 0,
        address: '',
        shipping_method_1: '',
        shipping_rate_1: '',
        shipping_method_2: '',
        shipping_rate_2: '',
        shipping_method_3: '',
        shipping_rate_3: '',
        overseas_shipping: false,
        featured_auction: '',
        bold_text: 0,
        bg_color: 0,
        conspicuous_icon: 1,
        gift_icon: false,
        photo_url: '',
        photo_height: 0,
        photo_width: 0,
        thumbnail_path: ''
      },
      HOLDING_PERIOD,
      ENDING_TIME,
      PREFECTURE,
      SHIP_SCHEDULE,
      CONSPICUOUS_ICON,
    }
  },
  async mounted () {
    if (this.productYahooId != 0) {
      let result = await ProductYahooApi.show({_id: this.productYahooId})
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
    async selectFile() {
      this.file = this.$refs.file.files[0];

      let formData = new FormData();
      formData.append('file', this.file);

      let result = await ProductYahooApi.getPhotos(formData)

      this.product.photo_url = result.data.url
      this.product.photo_height = result.data.height
      this.product.photo_width = result.data.width
      this.product.thumbnail_path = result.data.thumb_path
    },
    async onSaveProduct () {
      let result = null
      if (this.productYahooId == 0) {
        result = await ProductYahooApi.create(this.product)
      } else {
        result = await ProductYahooApi.update(this.productYahooId, this.product)
      }
      if (result && result.status === 200) {
        this.$swal.fire(
          "成功",
          "製品が更新されました。",
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
