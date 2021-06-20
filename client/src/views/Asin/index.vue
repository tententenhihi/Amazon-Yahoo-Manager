<template>
  <v-container>
    <v-card class="pa-1">
      <v-tabs
        background-color="white"
        active-class="active-tab font-weight-bold"
        height="40px"
        
      >
        <v-tab class="tab">
          Nhập Asin
        </v-tab>
        <v-tab class="tab">
          Lịch sử
        </v-tab>
        <v-tab class="tab">
          Danh sách đen
        </v-tab>
          <v-tab-item>
            <TabImportAsin @getListAsin="getListAsin" />
          </v-tab-item>
          <v-tab-item>
            <TableGroupAsin :listAsin="listAsin" />
          </v-tab-item>
          <v-tab-item>
            <div class="d-flex px-10 py-5 pb-10">
              <v-card style="width: 100%;">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field
                    style="max-width: 200px"
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="listAsin"
                  :search="search"
                >
                  <template v-slot:[`item.stt`]="{ item }">
                    {{ listAsin.indexOf(item) + 1 }}
                  </template>
                  <template v-slot:[`item.created`]="{ item }">
                    {{ $moment(item.created).format("DD/MM/YYYY") }}
                  </template>
                </v-data-table>
              </v-card>
            </div>
          </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import AsinApi from "../../services/asinApi";
import TabImportAsin from "./components/TabImportAsin.vue";
import TableGroupAsin from "./components/TableGroupAsin.vue";

export default {
  components: {
    TabImportAsin,
    TableGroupAsin
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
  methods: {
    async getListAsin() {
      try {
        let res = await AsinApi.get();
        if (res && res.status === 200) {
          this.listAsin = res.data.listSearchCode;
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
  computed: {},
  mounted() {
    // let loader = this.$loading.show({
    //   // Optional parameters
    //   container: null
    // });
    // // simulate AJAX
    // setTimeout(() => {
    //   loader.hide();
    // }, 5000);

    this.getListAsin();
  }
};
</script>

<style scoped>
.tab {
  font-size: 12px;
  font-weight: 500;
  color: #6777ef !important;
  text-transform: none;
}

.active-tab {
  background-color: #6777ef;
  color: #fff !important;
}

.active-table {
  background-color: red;
}
</style>
