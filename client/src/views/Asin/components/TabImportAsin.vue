<template>
  <div class="px-10 py-5 pb-10">
    <div class="d-flex mb-3 align-center">
      <span class="font-weight-bold fs-14"
        >Group Asin ID (<span class="red--text">*</span>):</span
      >
      <v-text-field
        v-model="groupId"
        class="ml-3"
        style="max-width: 300px"
        placeholder="Enter Group Asin ID"
        outlined
        hide-details
        dense
        :error="isErrorGroupId"
        @input="isErrorGroupId = false"
      >
      </v-text-field>
    </div>
    <div class="d-flex">
      <v-textarea
        rows="10"
        max-height="12"
        outlined
        color=" primary"
        placeholder="Nhập Code Asin. Mỗi code 1 dòng"
        v-model="asinString"
        dense
        hide-details
        :error="isErrorasinString"
        @input="isErrorasinString = false"
        style="max-width: 700px"
      ></v-textarea>
      <div class="d-flex align-end">
        <div class="ml-4">
          <v-btn
            class="d-block px-3 mb-3 white--text"
            color="info"
            @click="$refs.inputCSV.click()"
            >Import CSV</v-btn
          >
          <input
            ref="inputCSV"
            hidden
            type="file"
            name=""
            accept=".txt"
            id=""
            @change="onSelectFileCSV"
          />
          <v-btn
            class="px-6 white--text"
            color="primary"
            @click="onClickAddAsin"
            >Nhập</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsinApi from "@/services/asinApi";

export default {
  data() {
    return {
      asinString: "",
      groupId: "",
      isErrorGroupId: false,
      isErrorasinString: false
    };
  },
  methods: {
    async readFileText(file) {
      return new Promise((resolve, reject) => {
        try {
          let reader = new FileReader();
          reader.onload = function(ev) {
            var contents = ev.target.result;
            return resolve(contents);
          };
          reader.readAsText(file);
        } catch (error) {
          reject(error);
        }
      });
    },
    async onSelectFileCSV(event) {
      try {
        let files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.asinString = await this.readFileText(file);
        }
        event.target.value = "";
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
        if (!this.groupId || this.groupId.trim() === "") {
          this.isErrorGroupId = true;
          return this.$swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Chưa nhập Group Asin ID.!"
          });
        }
        if (!this.asinString || this.asinString.trim() === "") {
          this.isErrorasinString = true;
          return this.$swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Chưa nhập Asin code.!"
          });
        }
        let listCode = this.asinString
          .split("\n")
          .filter(item => item.trim() != "");
        let res = await AsinApi.add({ listCode, groupId: this.groupId });
        if (res && res.status === 200) {
          this.asinString = "";
          await this.$emit("getListAsin");
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
  }
};
</script>

<style></style>
