<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-edit mr-2"></i>商品追加
    </div>
    <hr />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="form-row">
          <div class="col-md-9 col-12">
            <div class="row" v-for="(image, index) in images" :key="index">
              <div class="col-4 text-align-end">
                商品画像 : <br>
                <small>
                  (商品画像は10枚まで可能/画像は１０００PX 以下にしてください。大きすぎるとアップロードできず、エラーになります。)
                </small>
              </div>
              <div class="col-8 product-image">
                <input type="file"  class="ml-2 d-none" :ref="'inputImage-' + index" @change="onUploadImage(index)">
                <img :src="image.preview_url" :id="`image_${index}_preview`"
                  @click="onClickReUploadImage(index)"
                  style="width:200px; border:1px solid #d2d6de">
                <i class="fa fa-times image_icon_remove" @click="onRemoveImage(index)"></i>
              </div>
            </div>
            <div class="row">
              <div class="col-4 text-align-end">
                商品画像 : <br>
                <small>
                  (商品画像は10枚まで可能/画像は１０００PX 以下にしてください。大きすぎるとアップロードできず、エラーになります。)
                </small>
              </div>
              <div class="col-8 product-image">
                <input type="file"  class="ml-2 d-none" :ref="'inputImage-' + images.length" @change="onUploadImage(images.length)">
                <img src="@/assets/images/no_product.png" name="image_preview" id="image_preview"
                  @click="$refs['inputImage-' + images.length].click()"
                  style="width:200px; border:1px solid #d2d6de">
              </div>
            </div>

            <div class="row item-info">
              <span @click="isShowProductInfo = !isShowProductInfo">::: 商品情報 :::</span>
            </div>
            <transition name="fade">
              <div v-show="isShowProductInfo">
                <div class="row">
                  <div class="col-4 text-align-end"><font color="red">*</font> フォルダ :</div>
                  <div class="col-8">
                    <select class="form-control" id="" v-model="product.folder_id">
                      <option v-for="(folder, index) in folders" :key="index" :value="folder._id">{{ folder.name }}</option>
                    </select>
                  </div>
                </div>
                <!-- <div class="row">
                  <div class="col-4 text-align-end">仕入れ元サイト :</div>
                  <div class="col-8">
                    <select class="form-control" v-model="product.folder">
                      <option v-for="(folder, index) in TARGET_FOLDER" :key="index" :value="folder.value">
                      {{folder.display}}</option>
                    </select>
                  </div>
                </div> -->
                <div class="row">
                  <div class="col-4 text-align-end">仕入れ元ID :</div>
                  <div class="col-8">
                    <input type="text" v-model="product.foreign_key" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end"><font color="red">*</font> Y！オーク商品名 : <br>
                    <small>(商品名は全角64文字以内)</small>
                  </div>
                  <div class="col-8">
                    <input type="text" v-model="product.product_yahoo_title" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end"><font color="red">*</font>Yahoo商品のカテゴリー :</div>
                  <div class="col-8">
                    <span v-if="yahooAuctionCategory" style="color: green; margin-top: 5px">
                      {{yahooAuctionCategory.path}}
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end"><font color="red">*</font>Yahoo商品のカテゴリー（ID指定）:
                  </div>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model.lazy="product.yahoo_auction_category_id" id="">
                    入力すると、上記で選択したカテゴリーよりも、こちらの値が優先されます。 <br>
                    <span v-if="yahooAuctionCategory === null" style="color: red;">
                      message lỗi nhập cate
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">開始価格 : <br> <small>(JPY)</small></div>
                  <div class="col-8 col-lg-4">
                    <input type="number" v-model="product.start_price" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">即決価格 : <br> <small>(JPY)</small></div>
                  <div class="col-8 col-lg-4">
                    <input type="number" v-model="product.bid_or_buy_price" class="form-control">
                    <p>
                      空欄で自動計算されます。開始価格と同額を設定すると、定額出品となります。入札者がこの価格以上で入札すると、終了時間前でも自動的に落札されます。
                    </p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end"><font color="red">*</font>仕入れ価格 : <br> <small>(JPY)</small></div>
                  <div class="col-8 col-lg-4">
                    <input type="number" v-model="product.import_price" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">商品の状態 :</div>
                  <div class="col-8">
                    <input type="radio" v-model="product.status" class="ml-2" id="second" value="used">
                    <label for="second">中古</label>
                    <input type="radio" v-model="product.status" class="ml-2" id="new" value="new">
                    <label for="new">新品</label>
                    <input type="radio" v-model="product.status" class="ml-2" id="other" value="other">
                    <label for="other">その他</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4"></div>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="product.status_comment">
                    中古・その他を選んだ場合、必ず上記に状態を全角15文字以内で記載して下さい。
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">値下げ交渉 :</div>
                  <div class="col-8">
                    <select class="form-control" v-model="product.offer">
                      <option value="no">なし</option>
                      <option value="yes">あり</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">個数 :</div>
                  <div class="col-8">
                    <input type="number" :min="1" v-model="product.quantity" class="form-control">
                    ※IDの評価が10以下の方は1個に固定されます。
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">開催期間 :</div>
                  <div class="col-8">
                    <select class="form-control" v-model="product.duration">
                      <option v-for="(period, index) in HOLDING_PERIOD" :key="index" :value="period.value">{{period.display}}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">終了時間 :</div>
                  <div class="col-8">
                    <select class="form-control" v-model="product.closing_time">
                      <option v-for="(time, index) in ENDING_TIME" :key="index" :value="time.value">{{time.display}}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">返品の可否 :</div>
                  <div class="col-8">
                    <input type="radio" v-model="product.retpolicy" class="ml-2" value="no" id="non-return">
                    <label for="non-return">返品不可</label> 
                    <input type="radio" v-model="product.retpolicy" class="ml-2" value="yes" id="accept-return">
                    <label for="accept-return">返品可</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">返品の備考 :</div>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="product.retpolicy_comment">
                    ※IDの評価が10以下の方は1個に固定されます。
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end"></div>
                  <div class="col-8">返品可の場合、全角30文字以内で必須入力です。</div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">入札制限 :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" v-model="product.min_bid_rating" true-value="yes" false-value="no" type="checkbox" id="overral-evaluation">
                      <label class="form-check-label" for="overral-evaluation">
                        総合評価で制限
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" v-model="product.bad_rating_ratio" true-value="yes" false-value="no" type="checkbox" id="bad-evaluation">
                      <label class="form-check-label" for="bad-evaluation">
                        悪い評価の割合で制限 （詳細)
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" v-model="product.bid_credit_limit" true-value="yes" false-value="no" type="checkbox" id="bidder-authen">
                      <label class="form-check-label" for="bidder-authen">
                        入札者認証制限あり (詳細)
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">その他 :</div>
                  <div class="col-8">
                    <div class="form-check d-flex">
                      <div class="mr-30">
                        <input class="form-check-input" v-model="product.auto_extension" true-value="yes" false-value="no" type="checkbox" id="automatic-extension">
                        <label class="form-check-label" for="automatic-extension">
                          自動延長あり
                        </label>
                      </div>
                      <div>
                        <input class="form-check-input" v-model="product.close_early" true-value="yes" false-value="no" type="checkbox" id="early-terminate">
                        <label class="form-check-label" for="early-terminate">
                          早期終了あり
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">自動再出品 :</div>
                  <div class="col-8 d-flex">
                    <select class="form-control" v-model="product.num_resubmit">
                      <option v-for="(n, index) in 4" :key="index" :value="index">{{n}}</option>
                    </select>
                    <div class="mt-2 ml-2">回</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">最低落札価格  :</div>
                  <div class="col-8 d-flex">
                    <input type="number" v-model="product.reserve_price" style="width: 180px" class="form-control">
                    <div class="mt-2 ml-2">回（半角数字） ※有料オプション</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end"><font color="red">*</font>商品詳細  :</div>
                  <div class="col-8 d-flex">
                    <textarea class="form-control" v-model="product.description" cols="30" rows="5"></textarea>
                  </div>
                </div>
              </div>
            </transition>

            <div class="row item-info">
              <span @click="isShowPayment = !isShowPayment">::: 支払い :::</span>
            </div>
            <transition name="fade">
              <div v-show="isShowPayment">
                <div class="row">
                  <div class="col-4 text-align-end">決済方法 :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" true-value="yes" false-value="no" type="checkbox" checked disabled>
                      <label class="form-check-label">
                        Yahoo!かんたん決済（詳細）
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">代金先払い、後払い :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" v-model="product.ship_time" type="radio" value="after" id="prepaid">
                      <label class="form-check-label" for="prepaid">
                        代金先払い（支払い確認後商品を発送）
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" v-model="product.ship_time" type="radio" value="before" id="postpaid">
                      <label class="form-check-label" for="postpaid">
                        代金後払い（落札後、支払いの確認をまたずに商品を発送）
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">送料負担 :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" v-model="product.shipping" type="radio" value="buyer" id="bidder">
                      <label class="form-check-label" for="bidder">
                        落札者
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" v-model="product.shipping" type="radio" value="seller" id="seller">
                      <label class="form-check-label" for="seller">
                        出品者（落札者は無料）
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <div class="row item-info">
              <span @click="isShowDelivery = !isShowDelivery">::: 配送方法 :::</span>
            </div>
            <transition name="fade">
              <div v-show="isShowDelivery">
                <div class="row">
                  <div class="col-4 text-align-end"><font color="red">*</font>商品発送元の地域 :</div>
                  <div class="col-4 col-lg-4">
                    <select class="form-control" v-model="product.location">
                      <option v-for="(pref, index) in PREFECTURE" :key="index" :value="pref.value">{{pref.display}}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">市区町村（任意/全角10文字以内）：</div>
                  <div class="col-4 col-lg-4">
                    <input type="text" class="form-control" v-model="product.city">
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">送料、配送方法 :</div>
                  <div class="col-8">
                    <div class="d-flex my-1">
                      <input type="text" v-model="product.ship_name1" style="width:45%" class="form-control mr-2">
                      <input type="text" v-model="product.ship_fee1" style="width:45%" class="form-control">
                      <span class="ml-2 mt-2">円</span>
                    </div>
                    <div class="d-flex my-1">
                      <input type="text" v-model="product.ship_name2" style="width:45%" class="form-control mr-2">
                      <input type="text" v-model="product.ship_fee2" style="width:45%" class="form-control">
                      <span class="ml-2 mt-2">円</span>
                    </div>
                    <div class="d-flex my-1">
                      <input type="text" v-model="product.ship_name3" style="width:45%" class="form-control mr-2">
                      <input type="text" v-model="product.ship_fee3" style="width:45%" class="form-control">
                      <span class="ml-2 mt-2">円</span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">海外発送 :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" true-value="yes" false-value="no" type="checkbox" id="overseas" v-model="product.foreign_check">
                      <label class="form-check-label" for="overseas">
                        海外発送にも対応する
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">発送までの日数 :</div>
                  <div class="col-8">
                    <select class="form-control" v-model="product.ship_schedule">
                      <option v-for="(ship, index) in SHIP_SCHEDULE" :key="index" :value="ship.value">{{ship.display}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </transition>

            <div class="row item-info">
              <span @click="isShowChargedOption = !isShowChargedOption">::: 有料オプション :::</span>
            </div>
            <transition name="fade">
              <div v-show="isShowChargedOption">
                <div class="row">
                  <div class="col-4 text-align-end">注目のオークション :</div>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="product.featured_amount">
                    円  （半角数字）   1日あたり20円（税込21.60円）～
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">太字テキスト :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" true-value="yes" false-value="no" type="checkbox" id="bold-text" v-model="product.bold">
                      <label class="form-check-label" for="bold-text">
                        1出品あたり10.80円（税込）
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">背景色 :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" true-value="yes" false-value="no" type="checkbox" id="bg-color" v-model="product.highlight">
                      <label class="form-check-label" for="bg-color">
                        1出品あたり32.40円（税込）
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">目立ちアイコン :</div>
                  <div class="col-8">
                    <select class="form-control" v-model="product.gift">
                      <option v-for="(icon, index) in CONSPICUOUS_ICON" :key="index" :value="icon.value">{{icon.display}}</option>
                    </select>
                    1出品あたり21.60円（税込）
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-align-end">贈答品アイコン :</div>
                  <div class="col-8">
                    <div class="form-check">
                      <input class="form-check-input" true-value="yes" false-value="no" type="checkbox" id="gift-icon" v-model="product.wrapping">
                      <label class="form-check-label" for="gift-icon">
                        1出品あたり21.60円（税込）
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="row mt-20">
          <button class="btn btn-success mb-1 mr-1" @click="onSaveProduct()">
            保存
          </button>
          <router-link :to="{name: 'YahooAuctionProducts'}" tag="button" class="btn btn-warning mb-1">
            キャンセル</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductYahooApi from '@/services/ProductYahooApi'
import ProductInfomationDefaultApi from '@/services/ProductInfomationDefaultApi'
import FolderApi from '@/services/FolderApi'
import { mapGetters } from 'vuex'

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
  { display: '１〜２日', value: 1 },
  { display: '２〜３日', value: 7 },
  { display: '３〜７日', value: 2 },
  { display: '７日〜１３日', value: 5 },
  { display: '１４日以降', value: 6 },
]
const CONSPICUOUS_ICON = [
  { display: '美品', value: 2 },
  { display: '非売品', value: 3 },
  { display: '限定品', value: 4 },
  { display: '保証書付', value: 5 },
  { display: '全巻セット', value: 6 },
  { display: '正規店購入', value: 7 },
  { display: '産地直送', value: 8 },
]
const TARGET_FOLDER = [
  {display: '基本フォルダ', value: 0},
  {display: '1日目', value: 1},
  {display: '2日目', value: 2},
  {display: '3日目', value: 3},
  {display: '4日目', value: 4},
  {display: '5日目', value: 5},
  {display: '6日目', value: 6},
]
export default {
  name: 'FormProductYahoo',
  data () {
    return {
      product: {
        folder_id: '',
        product_model: '',
        foreign_key: '',
        product_yahoo_title: '',
        yahoo_auction_category_id: '',
        start_price: '',
        bid_or_buy_price: '',
        import_price: '',
        status: '',
        status_comment: '',
        offer: '',
        quantity: '',
        duration: '',
        closing_time: '',
        retpolicy: '',
        retpolicy_comment: '',
        min_bid_rating: '',
        bad_rating_ratio: '',
        bid_credit_limit: '',
        auto_extension: '',
        close_early: '',
        num_resubmit: '',
        reserve_price: '',
        description: '',
        ship_time: '',
        shipping: '',
        location: '',
        city: '',
        ship_name1: '',
        ship_fee1: '',
        ship_name2: '',
        ship_fee2: '',
        ship_name3: '',
        ship_fee3: '',
        foreign_check: '',
        ship_schedule: '',
        featured_amount: '',
        bold: '',
        highlight: '',
        gift: '',
        wrapping: '',
        images: [],
        image_length: 0
      },
      images: [],
      HOLDING_PERIOD,
      ENDING_TIME,
      PREFECTURE,
      SHIP_SCHEDULE,
      TARGET_FOLDER,
      CONSPICUOUS_ICON,
      isShowProductInfo: false,
      isShowPayment: false,
      isShowDelivery: false,
      isShowChargedOption: false,
      folders: [],
      SERVER_HOST_UPLOAD: process.env.SERVER_API + "uploads/",
      yahooAuctionCategory: undefined
    }
  },
  async mounted () {
    await this.getFolders();
    if (this.productId != 0) {
      let result = await ProductYahooApi.show(this.productId)
      if (result && result.status === 200) {
        this.product = result.data
        if (this.product.yahoo_account_id !== this.yahooAccountId) {
          this.$router.push({name: 'YahooAuctionProducts'})
        }
        this.images = this.product.images.map(image => {
          return {
            preview_url: image.includes('http') ? image : this.SERVER_HOST_UPLOAD + image
          }
        })
      } else {
        this.$router.push({name: 'YahooAuctionProducts'})
      }
    } else {
      let result = await ProductInfomationDefaultApi.get(this.yahooAccountId)
      if (result && result.status === 200) {
        this.product = {...this.product, ...result.data}
      }
    }
  },
  computed: {
    productId () {
      return this.$route.params.id || 0
    },
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
    yahooAccountId () {
      return this.selectedYahooAccount._id
    }
  },
  methods: {
    async getFolders () {
      let res = await FolderApi.get(this.yahooAccountId);
      if (res && res.status === 200) {
        this.folders = res.data.folders
      }
    },
    onUploadImage (index) {
      let file = null;
      if (index === this.images.length) {
        file = this.$refs[`inputImage-${index}`].files[0]
        if (file) {
          this.images.push({
            file,
            preview_url: URL.createObjectURL(file)
          })
        }
      } else {
        file = this.$refs[`inputImage-${index}`][0].files[0]
        if (file) {
          this.images[index] = {
            file,
            preview_url: URL.createObjectURL(file)
          }
          this.images = [...this.images]
        }
      }
    },
    onClickReUploadImage (index) {
      this.$refs['inputImage-' + index][0].click();
    },
    onRemoveImage (index) {
      this.images.splice(index, 1);
      if (this.product.images[index]) {
        this.product.images.splice(index, 1);
      }
    },
    async onSaveProduct () {
      if (!this.yahooAuctionCategory) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: 'message lỗi nhập cate'
        });
        return;
      }
      let formData = new FormData();
      this.product.image_length = this.images.length
      this.product.yahoo_account_id = this.yahooAccountId
      formData.append('payload', JSON.stringify(this.product));
      for (let index = 0; index < this.product.image_length; index++) {
        formData.append(`image-${index}`, this.images[index].file)
      }
      let result;
      if (this.productId == 0) {
        result = await ProductYahooApi.create(formData)
      } else {
        result = await ProductYahooApi.update(this.productId, formData)
      }
      if (result && result.status === 200) {
        this.$swal.fire(
          "成功",
          "製品が更新されました。",
          "success"
        );
        this.$router.push({name: 'YahooAuctionProducts'})
      }
    }
  },
  watch: {
    async 'product.yahoo_auction_category_id' () {
      let resCheckCateYahoo = await ProductYahooApi.checkCategoryYahoo({
        category_id: this.product.yahoo_auction_category_id
      })
      if (resCheckCateYahoo && resCheckCateYahoo.status === 200 ) {
        this.yahooAuctionCategory = resCheckCateYahoo.data.category
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
.product-image {
  position: relative;
}
.image_icon_remove {
  position: absolute;
  top: 5px;
  left: 192px;
  font-size: 22px;
  cursor: pointer;
}
.item-info {
  color: #3c8dbc;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
