<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h4 class="font-weight-bold basil--text">CHỌN FILE</h4>
      </v-card-title>
      <v-tabs fixed-tabs background-color="cyan" dark>
        <v-tab
          active-class="border-tab  font-weight-bold"
          class="mx-3 font-weight-medium"
        >
          Nhập Asin
        </v-tab>
        <v-tab
          active-class="border-tab  font-weight-bold"
          class="mx-3 font-weight-medium"
        >
          Hiển thị mã Asin
        </v-tab>
        <v-tab
          active-class="border-tab  font-weight-bold"
          class="mx-3 font-weight-medium"
        >
          Các mã Asin bị cấm
        </v-tab>
        <v-tab-item>
          <v-card class="ma-2 pa-4 border">
            <div class="d-flex flex-column align-center justify-center">
              <v-textarea
                rows="10"
                max-height="12"
                outlined
                color=" primary"
                label="Nhập Code Asin"
                v-model="asinString"
              ></v-textarea>
              <v-btn
                class="px-3 py-5 white--text"
                color="primary"
                @click="submitAsin"
                >Gửi</v-btn
              >
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card class="ma-2 pa-4 border">
            <div class="d-flex flex-column align-center justify-center">
              <v-table></v-table>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      asinString: "",
      listAsin: [],
    };
  },
  methods: {
    submitAsin() {
      this.listAsin = this.asinString.split("\n");
    },
  },
};
</script>

<style scoped>
.border-tab {
  border-bottom: 1px solid black;
}
</style>