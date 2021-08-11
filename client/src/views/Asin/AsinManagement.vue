<template>
  <div class="wrapper-content">
    <div class="page-container">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item ml-20">
          <a
            class="nav-link active"
            id="import-tab"
            data-toggle="tab"
            href="#import"
            role="tab"
            aria-controls="import"
            aria-selected="true"
            >ASINインポート</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="history-tab"
            data-toggle="tab"
            href="#history"
            role="tab"
            aria-controls="history"
            aria-selected="false"
            >履歴</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="black-list-tab"
            data-toggle="tab"
            href="#black-list"
            role="tab"
            aria-controls="black-list"
            aria-selected="false"
            >ブラックリスト</a
          >
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="import"
          role="tabpanel"
          aria-labelledby="import-tab"
        >
          <ImportAsin @getListAsin="getListAsin" />
        </div>
        <div
          class="tab-pane fade"
          id="history"
          role="tabpanel"
          aria-labelledby="history-tab"
        >
          <History :listAsin="listAsin" />
        </div>
        <div
          class="tab-pane fade"
          id="black-list"
          role="tabpanel"
          aria-labelledby="black-list-tab"
        >
          <BlackList :blackList="blackList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsinApi from "../../services/asinApi";
import ImportAsin from "./blocks/ImportAsin.vue";
import History from "./blocks/History.vue";
import BlackList from "./blocks/BlackList.vue";
import { mapGetters } from "vuex";
export default {
  name: "AsinManagement",
  components: {
    ImportAsin,
    History,
    BlackList
  },
  data() {
    return {
      isLoading: false,
      listAsin: [],
      blackList: [],
      search: "",
      headers: [
        {
          text: "数",
          value: "stt"
        },
        { text: "コード", value: "code" },
        { text: "製品", value: "isProductGeted" },
        { text: "で作成された", value: "created" }
      ]
    };
  },
  mounted() {
    this.getListAsin();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount"
    })
  },
  methods: {
    async getListAsin() {
      try {
        let res = await AsinApi.get(this.selectedYahooAccount._id);
        if (res && res.status === 200) {
          this.listAsin = res.data.listAsin;
          this.listAsin = [...this.listAsin];
          this.blackList = res.data.black_list;
          this.blackList = [...this.blackList];
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "未ログイン!",
          text: error.message
        });
      }
    }
  }
};
</script>

<style scoped></style>
