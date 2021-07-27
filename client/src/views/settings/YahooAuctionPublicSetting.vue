<template>
  <div v-if="isInit" class="mt-40 px-20 py-20" style="background-color: #fff">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item ml-20">
        <a class="nav-link active" id="new-list-tab" data-toggle="tab" href="#new-list" role="tab" aria-controls="new-list" aria-selected="true">自動新規出品設定</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="relist-tab" data-toggle="tab" href="#relist" role="tab" aria-controls="relist" aria-selected="false">自動再出品設定</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="calendar-tab" data-toggle="tab" href="#calendar" role="tab" aria-controls="calendar" aria-selected="false">カレンダー出品設定</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="auction-delete-tab" data-toggle="tab" href="#auction-delete" role="tab" aria-controls="auction-delete" aria-selected="false">Y!オーク 出品終了オークションの削除</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="new-list" role="tabpanel" aria-labelledby="new-list-tab">
        <div class="wrapper-content">
          <div class="box-header py-10">
            <i class="fa fa-calendar mr-2"></i>自動新規出品設定 
          </div>
          <hr />
          <div class="box-content">
            <div class="form-horizontal col-10 col-lg-6 py-20" style="float: none; margin: 0 auto;">
              <div class="form-group row">
                <div class="col-3 col-form-label">自動新規出品設定 :</div>
                <div class="col-9">
                  <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" v-model="setting.new_list_auto">
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="target-folder" class="col-3 col-form-label">対象フォルダ :</label>
                <div class="col-9">
                  <select class="custom-select" multiple v-model="setting.new_list_target_folder">
                    <option v-for="(folder, index) in folders" :key="index" :value="folder._id">{{folder.name}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="" class="col-3 col-form-label">初回出品開始時間(時) :
                  <br><small>(24時間表記:0~23)</small>
                </label>
                <div class="col-9">
                  <select class="form-control" id="" v-model="setting.new_list_start_time_hour">
                    <option v-for="(n, index) in 24" :value="index" :key="n">{{index}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group row">
                <label for="" class="col-3 col-form-label">初回出品開始時間(分) :</label>
                <div class="col-9">
                  <select class="form-control" id="" v-model="setting.new_list_start_time_minute">
                    <option v-for="(n) in START_MINUTE" :value="n" :key="n">{{n}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group row">
                <label for="" class="col-3 col-form-label">自動新規出品間隔 :
                <br><small>(単位:日)</small>
                </label>
                <div class="col-8">
                  <input type="text" :min="1" :maxlength="2" @keyup="validatePublicInterval" :max="12" :value="setting.publish_interval" class="form-control" :readonly="!setting.new_list_auto">
                </div>
                <div class="col-1">
                  <input type="radio" class="mt-2" :value="true" id="" v-model="setting.new_list_interval_per_day">
                </div>
              </div>

              <div class="form-group row">
                <label for="" class="col-3 col-form-label">自動新規出品曜日ごと設定 :</label>
                <div class="col-8">
                  <select class="form-control" id="" v-model="setting.new_list_day_of_week">
                    <option v-for="(n, index) in DAY_OF_WEEK" :value="n.value" :key="index">{{n.display}}</option>
                  </select>
                </div>
                <div class="col-1">
                  <input type="radio" class="mt-2" :value="false" id="" v-model="setting.new_list_interval_per_day">
                </div>
              </div>

              <div class="form-group row">
                <label for="" class="col-3 col-form-label">スキップされた商品の処理 :</label>
                <div class="col-9">
                  <select class="form-control" id="" v-model="setting.new_list_process_of_skipped_items">
                    <option value="1">以降、24時間経過した時点で出品する</option>
                    <option value="0">しない</option>
                  </select>
                </div>
              </div>
              
              <div class="row justify-content-center">
                <button class="btn btn-success" @click="onUpdateSetting()">
                  <i class="fa fa-save"> 保存</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="relist" role="tabpanel" aria-labelledby="relist-tab">
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
            <div class="form-horizontal col-7 py-20" style="float: none; margin: 0 auto;">
              <div class="form-group row">
                <div class="col-3 col-form-label">自動再出品設定 :</div>
                <div class="col-9">
                  <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" v-model="setting.relist_auto">
                  </div>
                </div>
              </div>
              
              <div class="form-group row">
                <label for="" class="col-3 col-form-label">再出品開始時間(時) :
                  <br><small>(24時間表記:0~23)</small>
                </label>
                <div class="col-9">
                  <select class="form-control" id="" v-model="setting.relist_start_time_hour">
                    <option v-for="(n, index) in 24" :value="index" :key="n">{{index}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group row">
                <label for="" class="col-3 col-form-label">再出品開始時間(分) :</label>
                <div class="col-9">
                  <select class="form-control" id="" v-model="setting.relist_start_time_minute">
                    <option v-for="(n) in START_MINUTE" :value="n" :key="n">{{n}}</option>
                  </select>
                </div>
              </div>
              
              <div class="row justify-content-center">
                <button class="btn btn-success" @click="onUpdateSetting()">
                  <i class="fa fa-save"> 保存</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="calendar" role="tabpanel" aria-labelledby="calendar-tab">
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
            <div class="form-horizontal col-7 py-20" style="float: none; margin: 0 auto;">
              <div class="form-group row">
                <div class="col-3 col-form-label">カレンダー出品設定 :</div>
                <div class="col-9">
                  <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" v-model="setting.calendar_list_setting">
                  </div>
                </div>
              </div>
              <template v-for="(n, i) in 31">
                <div class="form-group row" :key="n">
                  <label for="" class="col-3 col-form-label">{{n}}日目 :</label>
                  <div class="col-9">
                    <select class="form-control" id="" v-model="setting.calendar_target_folder[i]">
                      <option v-for="(folder, index) in folders" :key="index" :value="folder._id">
                        {{folder.name}}
                      </option>
                    </select>
                  </div>
                </div>
              </template>

              <div class="row justify-content-center">
                <button class="btn btn-success" @click="onUpdateSetting()">
                  <i class="fa fa-save"> 保存</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="auction-delete" role="tabpanel" aria-labelledby="auction-delete-tab">
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
                <button class="btn btn-danger" v-if="!setting.auction_delete" @click="onUpdateSetting(true)">
                  <i class="fa fa-save"> 削除をONにする</i>
                </button>
                <button class="btn btn-success" v-else @click="onUpdateSetting(true)">
                  <i class="fa fa-save"> 削除をOFFにする</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuctionPublicSettingApi from '@/services/AuctionPublicSettingApi'
import FolderApi from '@/services/FolderApi'
import { mapGetters } from 'vuex'

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
  name: 'YahooAuctionPublicSetting',
  data () {
    return {
      DAY_OF_WEEK,
      START_MINUTE,
      setting: {},
      folders: [],
      isInit: false
    }
  },
  mounted () {
    this.getCurrentSetting()
    this.getFolders()
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
    validatePublicInterval(e) {
      if (
        !(
          (e.keyCode > 95 && e.keyCode < 106) ||
          (e.keyCode > 47 && e.keyCode < 58) ||
          e.keyCode == 8
        )
      ) {
        e.target.value = 1
        this.setting.publish_interval = 1
        e.preventDefault();
      }
      if (parseInt(e.target.value) > 31) {
        e.target.value = 31
        this.setting.publish_interval = 31
      }
      this.setting.publish_interval = e.target.value
    },
    async getCurrentSetting () {
      let res = await AuctionPublicSettingApi.get(this.yahooAccountId);
      if (res && res.status == 200) {
        this.setting = res.data.setting
        if (this.setting.new_list_process_of_skipped_items == null) {
          this.setting.new_list_process_of_skipped_items = 1;
        }
      }
      this.isInit = true
    },
    async getFolders () {
      let res = await FolderApi.get(this.selectedYahooAccount._id);
      if (res && res.status === 200) {
        this.folders = res.data.folders
      }
    },
    async onUpdateSetting (isChangeAuctionDelete = false) {
      if (isChangeAuctionDelete) {
        this.setting.auction_delete = !this.setting.auction_delete
      }
      let res = await AuctionPublicSettingApi.update(this.setting);
      if (res && res.status == 200) {
        this.setting = res.data
        this.$swal.fire(
          "成功",
          "更新が成功しました",
          "success"
        );
      }
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