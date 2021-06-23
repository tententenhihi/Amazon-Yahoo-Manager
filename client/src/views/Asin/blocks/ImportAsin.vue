<template>
  <div class="mx-20 mt-60">
    <div class="form-group row">
      <label class="font-weight-bold col-md-2 col-sm-6" for="group-id">Group Asin ID (*): </label>
      <input type="text" class="form-control col-md-4 col-sm-6" placeholder="Enter group asin id"
        id="group-id" v-model="groupId">
    </div>
    <div class="row my-20">
      <textarea class="form-control col-md-6" id="" cols="30" rows="10"
        placeholder="Please input asin code. One code per line" v-model="asinString"></textarea>
      <div class="col-md-4">
        <button class="btn btn-common btn-info mb-10" @click="$refs.inputCSV.click()">
          Import CSV
        </button>
        <input ref="inputCSV" hidden type="file" name="" accept=".txt" id="" @change="onSelectFileCSV" />
        <br>
        <button class="btn btn-common btn-success" @click="onClickAddAsin">
          Process
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AsinApi from '@/services/asinApi'
export default {
  name: 'ImportAsin',
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
}
</script>

<style scoped>

</style>
