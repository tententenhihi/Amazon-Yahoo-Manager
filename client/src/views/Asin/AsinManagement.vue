<template>
  <div class="page-container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="import-tab" data-toggle="tab" href="#import" role="tab" aria-controls="import" aria-selected="true">Import Asin</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="history-tab" data-toggle="tab" href="#history" role="tab" aria-controls="history" aria-selected="false">History</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="black-list-tab" data-toggle="tab" href="#black-list" role="tab" aria-controls="black-list" aria-selected="false">Black list</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="import" role="tabpanel" aria-labelledby="import-tab">
        <ImportAsin @getListAsin="getListAsin" />
      </div>
      <div class="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
        <History :listAsin="listAsin" />
      </div>
      <div class="tab-pane fade" id="black-list" role="tabpanel" aria-labelledby="black-list-tab">...</div>
    </div>
  </div>
</template>

<script>
import AsinApi from "../../services/asinApi";
import ImportAsin from './blocks/ImportAsin.vue'
import History from './blocks/History.vue'
export default {
  name: 'AsinManagement',
  components: {
    ImportAsin,
    History
  },
  data() {
    return {
      isLoading: false,
      listAsin: [],
      search: "",
      headers: [
        {
          text: "NO",
          value: "stt"
        },
        { text: "Code", value: "code" },
        { text: "Product", value: "isProductGeted" },
        { text: "Created", value: "created" }
      ]
    };
  },
  mounted() {
    this.getListAsin();
  },
  computed: {},
  methods: {
    async getListAsin() {
      try {
        let res = await AsinApi.get();
        if (res && res.status === 200) {
          this.listAsin = res.data.listSearchCode;
          console.log('dasd: ', this.listAsin);
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Errror.!",
          text: error.message
        });
      }
    }
  },
}
</script>

<style scoped>

</style>
