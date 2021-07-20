<template>
  <div class="mx-20 mt-30">
    <div class="box-content">
      <div class="title">
        <i class="fa fa-list"></i> ASIN一覧 更新をして最新情報を確認してください
      </div>
      <p>
        ＊ブラックリストは管理者側で入れます。ユーザーはスプレッドシートにて記入をしてください。 <br>
        定期的に管理者側で入れていきますのですぐに反映されるわけではありません。 <br>
        ブラックリスト依頼スプレッドシート記入（禁止ASIN
        <a href="https://docs.google.com/spreadsheets/d/1dsYomQEsQIqhOIxQxtwsmNEF_CzHVwPh_FRVXI75XdE/edit?usp=sharing">
          https://docs.google.com/spreadsheets/d/1dsYomQEsQIqhOIxQxtwsmNEF_CzHVwPh_FRVXI75XdE/edit?usp=sharing
        </a>
        <br>
        ブラックリストの仕様について：<a href="https://meow-apply.mobi/?p=6236">https://meow-apply.mobi/?p=6236</a>
      </p>
      <div class="">
        <paginate
          v-if="pageCount > 1"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'«'"
          :next-text="'»'"
          :container-class="'pagination'"
          :page-class="'page-item'">
        </paginate>
        <div class="table-responive">
          <table id="historyTable" class="table table-hover">
            <thead class="thead-purple">
              <tr>
                <th scope="col">ASIN</th>
                <th scope="col">禁止理由</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td>{{ item.asin }}</td>
                <td>{{ item.reason_for_prohibition }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryAsin',
  props: ["blackList"],
  data () {
    return {
      selectedGroup: {},
      page: 1,
    }
  },
  computed: {
    tableData () {
      return this.blackList.slice((this.page - 1) * this.$constants.PAGE_SIZE, this.page * this.$constants.PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.blackList.length / this.$constants.PAGE_SIZE)
    },
  },
  methods: {
  },
}
</script>

<style scoped>
.status-fail {
  font-weight: bold;
  color: red;
}
.status-success {
  font-weight: bold;
  color: green;
}
.title {
  font-size: 16px;
  margin: 10px 0;
}
</style>
