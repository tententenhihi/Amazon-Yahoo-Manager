<template>
  <div>
    <div class="wrapper-content">
      <div class="box-header py-10">
        <i class="fa fa-calendar mr-2"></i>自動新規出品設定 
      </div>
      <hr />
      <div class="box-content">
        <div class="form-horizontal col-md-7 py-20" style="float: none; margin: 0 auto;">
          <div class="form-group row">
            <div class="col-md-3 col-form-label">自動新規出品設定 :</div>
            <div class="col-md-9">
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="gridCheck1">
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="target-folder" class="col-md-3 col-form-label">対象フォルダ :</label>
            <div class="col-md-9">
              <select class="custom-select" multiple>
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                <option value="3">Three</option>
                <option value="3">Three</option>
                <option value="3">Three</option>
                <option value="3">Three</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-md-3 col-form-label">初回出品開始時間(時) :
              <br><small>(24時間表記:0~23)</small>
            </label>
            <div class="col-md-9">
              <select class="form-control" id="">
                <option v-for="(n, index) in 24" :value="index" :key="n">{{index}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="" class="col-md-3 col-form-label">初回出品開始時間(分) :</label>
            <div class="col-md-9">
              <select class="form-control" id="">
                <option v-for="(n) in START_MINUTE" :value="n" :key="n">{{n}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="" class="col-md-3 col-form-label">自動新規出品間隔 :
            <br><small>(単位:日)</small>
            </label>
            <div class="col-md-8">
              <input type="text" class="form-control" readonly :value="1">
            </div>
            <div class="col-sm-1">
              <input type="radio" class="mt-2" name="" id="">
            </div>
          </div>

          <div class="form-group row">
            <label for="" class="col-md-3 col-form-label">自動新規出品曜日ごと設定 :</label>
            <div class="col-md-8">
              <select class="form-control" id="">
                <option v-for="(n, index) in DAY_OF_WEEK" :value="n.value" :key="index">{{n.display}}</option>
              </select>
            </div>
            <div class="col-sm-1">
              <input type="radio" class="mt-2" name="" id="">
            </div>
          </div>

          <div class="form-group row">
            <label for="" class="col-md-3 col-form-label">スキップされた商品の処理 :</label>
            <div class="col-md-9">
              <select class="form-control" id="">
                <option value="1">以降、24時間経過した時点で出品する</option>
                <option value="0">しない</option>
              </select>
            </div>
          </div>
          
          <div class="row justify-content-center">
            <button class="btn btn-success">
              <i class="fa fa-save"> 保存</i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper-content">
      <div class="box-header py-10">
        <i class="fa fa-calendar mr-2"></i>自動再出品設定 
      </div>
      <hr />
      <div class="box-content">
        <div class="px-20 py-20">
          <p>
            自動再出品出品設定が加わりました。<br>
            終了になったオークションをそのまま出すことができます<br>
            この機能を使うときは、重複を防ぐため、終了分の自動削除機能・自動新規出品機能をOFFにしてください<br>
            すべてON状態の場合カレンダー出品が最優先となります。　<br>
            自動新規出品+再出品両方を動かすことはできません。<br>
          </p>
        </div>
        <hr>
        <div class="form-horizontal col-md-7 py-20" style="float: none; margin: 0 auto;">
          <div class="form-group row">
            <div class="col-md-3 col-form-label">自動再出品設定 :</div>
            <div class="col-md-9">
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="gridCheck1">
              </div>
            </div>
          </div>
          
          <div class="form-group row">
            <label for="" class="col-md-3 col-form-label">再出品開始時間(時) :
              <br><small>(24時間表記:0~23)</small>
            </label>
            <div class="col-md-9">
              <select class="form-control" id="">
                <option v-for="(n, index) in 24" :value="index" :key="n">{{index}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="" class="col-md-3 col-form-label">再出品開始時間(分) :</label>
            <div class="col-md-9">
              <select class="form-control" id="">
                <option v-for="(n) in START_MINUTE" :value="n" :key="n">{{n}}</option>
              </select>
            </div>
          </div>
          
          <div class="row justify-content-center">
            <button class="btn btn-success">
              <i class="fa fa-save"> 保存</i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper-content">
      <div class="box-header py-10">
        <i class="fa fa-calendar mr-2"></i>カレンダー出品設定 
      </div>
      <hr />
      <div class="box-content">
        <div class="px-20 py-20">
          <p>
            カレンダー出品をしたい場合は、自動新規出品もオンにしてください。さらにカレンダー出品もオンにすることでカレンダー出品優先になります<br>
            出品時間は自動新規出品の部分で設定してください。<br>
            設定時点から、31日間にわたり、日ごとのフォルダの設定が可能です。（2月の場合29.30.31はないので、設定してても29～31の日の商品は出品されません）<br>
            各日にフォルダを指定することで、毎日異なる商品フォルダを自動で出品することができます。 出品しない日を設けることも可能です<br>
          </p>
        </div>
        <hr>
        <div class="form-horizontal col-md-7 py-20" style="float: none; margin: 0 auto;">
          <div class="form-group row">
            <div class="col-md-3 col-form-label">カレンダー出品設定 :</div>
            <div class="col-md-9">
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="gridCheck1">
              </div>
            </div>
          </div>
          <template v-for="n in 31">
            <div class="form-group row" :key="n">
              <label for="" class="col-md-3 col-form-label">{{n}}日目 :</label>
              <div class="col-md-9">
                <select class="form-control" id="">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
          </template>

          <div class="row justify-content-center">
            <button class="btn btn-success">
              <i class="fa fa-save"> 保存</i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper-content">
      <div class="box-header py-10">
        <i class="fa fa-calendar mr-2"></i>Y!オーク 出品終了オークションの削除 
      </div>
      <hr />
      <div class="box-content">
        <div class="mx-20 py-20">
          <div class="text-auction-delete">
            入札が入っている場合は手数料500円かかるので、自動削除しません。ご自身の判断で手動削除してください。
          </div>
          <div class="row justify-content-center mt-20">
            <button class="btn btn-danger">
              <i class="fa fa-save"> 削除をONにする</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const DAY_OF_WEEK = [
  { display: '日曜日', value: '1' },
  { display: '月曜日', value: '2' },
  { display: '火曜日', value: '3' },
  { display: '水曜日', value: '4' },
  { display: '木曜日', value: '5' },
  { display: '金曜日', value: '6' },
  { display: '土曜日', value: '7' },
]
const START_MINUTE = [0, 15, 30, 45]
export default {
  name: 'YahooAuctionPublicSetting',
  data () {
    return {
      DAY_OF_WEEK,
      START_MINUTE
    }
  }
}
</script>

<style scoped>
.col-form-label {
  text-align: end;
}
.wrapper-content {
  border-top: 2px solid purple;
}
.text-auction-delete {
  background-color: #f39c12;
  padding: 15px;
  border-radius: 3px;
}
</style>