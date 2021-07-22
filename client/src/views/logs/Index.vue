<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list"></i> 日別一覧
      <small><i>更新をして最新情報を確認してください</i></small>
      <button class="btn btn-add-account" @click="getLogs()">
        更新
      </button>
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 py-20">
        <paginate
          v-if="pageCount > 1"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'«'"
          :next-text="'»'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
        <div class="table-responsive">
          <table
            class="table table-striped display pt-20 mb-20"
            style="width: 100%"
          >
            <thead class="thead-purple">
              <tr>
                <th scope="col">日付</th>
                <th scope="col">成功件数</th>
                <th scope="col">失敗件数</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in tableData" :key="index">
                <td>{{ $moment(log.created).format("DD/MM/YYYY - HH:mm") }}</td>
                <td>{{ log.success_count }}</td>
                <td>{{ log.error_count }}</td>
                <td>
                  <router-link
                    :to="{ name: 'LogDetail', params: { data: log.detail } }"
                    >ログを確認する</router-link
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CronHistoryApi from "../../services/CronHistoryApi";

export default {
  name: "LogPublish",
  data() {
    return {
      logs: [],
      page: 1
    };
  },
  async mounted() {
    await this.getLogs();
  },
  computed: {
    tableData() {
      return this.logs.slice(
        (this.page - 1) * this.$constants.PAGE_SIZE,
        this.page * this.$constants.PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.logs.length / this.$constants.PAGE_SIZE);
    },
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount"
    }),
    yahooAccountId() {
      return this.selectedYahooAccount._id;
    }
  },
  methods: {
    async getLogs() {
      try {
        let res = await CronHistoryApi.get({
          yahoo_account_id: this.yahooAccountId
        });
        if (res && res.status === 200) {
          this.logs = res.data.crons;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    }
  }
};
</script>

<style scoped>
a {
  color: #3c8dbc;
}
</style>
