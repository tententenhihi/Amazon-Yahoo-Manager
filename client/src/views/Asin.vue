<template>
  <div>
    <v-container>
      <v-card
        class="container font-weight-bold"
        style="height: 50px; position: fixed; top: 45px;"
      >
        ASIN
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-tabs
          background-color="white"
          color="success"
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
            <div class="d-flex px-10 py-5 pb-10">
              <v-textarea
                rows="10"
                max-height="12"
                outlined
                color=" primary"
                placeholder="Nhập Code Asin. Mỗi code 1 dòng"
                v-model="asinString"
                dense
                hide-details
                style="max-width: 700px"
              ></v-textarea>
              <div class="d-flex align-end">
                <v-btn
                  class="ml-4 px-6 white--text"
                  color="primary"
                  @click="onClickAddAsin"
                  >Nhập</v-btn
                >
              </div>
            </div>
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
  </div>
</template>

<script>
import AsinApi from "../services/asinApi";

// B08QWXW524
// B08VGLHTR1

export default {
  data() {
    return {
      asinString: "",
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
    },
    async onClickAddAsin() {
      try {
        let listCode = this.asinString
          .split("\n")
          .filter(item => item.trim() != "");
        let res = await AsinApi.add({ listCode });
        if (res && res.status === 200) {
          this.asinString = "";
          await getListAsin();
          this.$swal.fire({
            icon: "success",
            title: "Success.!"
          });
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
