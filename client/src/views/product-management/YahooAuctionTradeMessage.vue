<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク 評価
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20 table-responsive">
        <div class="title">
          落札者情報
        </div>
        <table class="table table-striped pt-20 mb-30" style="width: 100%">
          <tbody>
            <tr>
              <td>非常に良い</td>
              <td>Φ6mm Φ8mm クワ型端子 C型端子 クワガタ端子 クワ型圧着端子 ギボシ端子 アース用端子 ターミナル端子 丸型端子 配線</td>
            </tr>
            <tr>
              <td>落札価格</td>
              <td>127円</td>
            </tr>
            <tr>
              <td>落札個数</td>
              <td>2</td>
            </tr>
            <tr>
              <td>仕入れ価格</td>
              <td>999</td>
            </tr>
            <tr>
              <td>想定利益</td>
              <td>857</td>
            </tr>
            <tr>
              <td>落札手数料</td>
              <td>25.4</td>
            </tr>
            <tr>
              <td>利益率</td>
              <td>64%</td>
            </tr>
            <tr>
              <td>予定送料</td>
              <td>1,300</td>
            </tr>
            <tr>
              <td>購入先</td>
              <td></td>
            </tr>
            <tr>
              <td>決済方法</td>
              <td>Yahoo!かんたん決済</td>
            </tr>
            <tr>
              <td>予定受取金額</td>
              <td>2,654円</td>
            </tr>
            <tr>
              <td>お届け方法</td>
              <td>ヤマト運輸または郵便局</td>
            </tr>
            <tr>
              <td>お届け先住所</td>
              <td>
                〒3420035 <br>
                埼玉県吉川市高久1-22-2 <br>
                0489845155 <br>
                有限会社 エスガレージ <br>
              </td>
            </tr>
            <tr>
              <td>送料</td>
              <td>2,400円</td>
            </tr>
            <tr>
              <td>合計金額</td>
              <td>2,654円</td>
            </tr>
          </tbody>
        </table>
        <div class="alert alert-success">
          この商品は発送が完了しています。
        </div>
        <button class="btn btn-default mt-20">評価済</button> <br>
        <button class="btn btn-danger mt-20" :disabled="true">取引中止</button> <br>
        <button class="btn btn-danger my-20">落札者削除</button> <br>
        <hr>
        <div class="my-20">
          取引で困ったことなどがあったら、落札者に質問してみよう！
        </div>
        <div class="form-group">
          <label for="comment">コメント</label>
          <textarea class="form-control" id="" cols="30" rows="5"></textarea>
        </div>
        <div>
          <button class="btn btn-primary">メッセージを送信</button>
        </div>
        <hr class="my-20">
        <div class="message-list">
          <div class="message-item">
            <div class="message-info d-block">
              <span class="created-at float-left">
                2020年11月30日 11時09分
              </span>
              <span class="created-at float-right">
                その他: iwaac11
              </span>
            </div>
            <div style="clear:both" class="my-10"></div>
            <img class="message-img" src="https://dummyimage.com/100x100/000000/FFFFFF.png&text=S" alt="Seller">
            <div class="message-text">
              <p>
                商品発送いたしました。
                到着までしばらくお待ちください。 <br>
                届きましたら、評価よりご連絡ください。<br>
                <br>
                なお、作業円滑化のため、追跡番号連絡や時間指定はできませんのでご了承ください。<br>
                1週間過ぎても商品が届かない場合はご連絡ください。<br>
                以上、ありがとうございました。<br>
                <br>
                私から製品を購入していただきました方限定で、毎月3万～100万のお小遣いを得る丸秘術を無料でメール配信しております。<br>
                https://december-ex.com/rg/5218/1/<br>
                <br>
                LINE@:https://line.me/ti/p/%40zno5557o<br>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'YahooAuctionTradeMessage',
  data () {
    return {
     
    }
  },
  async mounted () {
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
    yahooAccountId () {
      return this.selectedYahooAccount._id
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.title {
  font-size: 20px;
  margin: 10px 0;
}
.table td, .table th {
  padding: 10px;
}
.message-info {
  padding-bottom: 15px;
}
.message-img {
  border-radius: 50%;
  float: right;
  width: 40px;
  height: 40px;
}
.message-text {
  background: #00a65a;
  border-color: #00a65a;
  color: #ffffff;
  margin-right: 50px;
  margin-left: 0;
  padding: 15px;
  border-radius: 5px;
  position: relative;
  border: 1px solid #d2d6de;
}
.message-text::before {
  right: auto;
  left: 100%;
  position: absolute;
  top: 12px;
  border-left: 8px solid #00a65a;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  pointer-events: none;
}
</style>
