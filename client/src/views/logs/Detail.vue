<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list"></i> 出品ログ一覧
      <small><i>更新をして最新情報を確認してください</i></small>
      <!-- <button class="btn btn-add-account">
        更新
      </button> -->
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
                <th scope="col">取扱商品ID</th>
                <th scope="col">オークションID</th>
                <th scope="col">メッセージ</th>
                <th scope="col">処理日付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in tableData" :key="index">
                <td>
                  {{
                    $moment(log.product_created).format("DD/MM/YYYY - HH:mm")
                  }}
                </td>
                <td>
                  <a
                    target="_blank"
                    :href="`/yahoo-auction-products/${log.product_id}`"
                    >{{ log.product_id }}</a
                  >
                </td>
                <td>{{ log.product_aID ? log.product_aID : "-" }}</td>
                <td>{{ log.message ? log.message : "-" }}</td>
                <td>{{ $moment(log.created).format("DD/MM/YYYY - HH:mm") }}</td>
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

export default {
  name: "LogPublish",
  data() {
    return {
      log: {},
      details: [123],
      page: 1
    };
  },
  async mounted() {
    this.details = this.$route.params.data;
  },
  computed: {
    tableData() {
      return this.details.slice(
        (this.page - 1) * this.$constants.PAGE_SIZE,
        this.page * this.$constants.PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.details.length / this.$constants.PAGE_SIZE);
    },
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount"
    }),
    yahooAccountId() {
      return this.selectedYahooAccount._id;
    }
  }
};
</script>

<style scoped></style>
