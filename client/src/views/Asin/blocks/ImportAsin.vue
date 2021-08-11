<template>
  <div class="mx-20 mt-30">
    <!-- <div class="form-group row">
      <label class="font-weight-bold col-xl-2 col-md-3 col-sm-4 mt-10" for="group-id">ASINグループID (*): </label>
      <input type="text" class="form-control col-xl-4 col-md-5 col-sm-6" placeholder="ASINグループIDを入力"
        id="group-id" v-model="groupId">
    </div> -->
    <div class="row my-20">
      <textarea
        class="form-control col-md-6"
        id=""
        cols="30"
        rows="10"
        placeholder="ASINを入力、一行で一つだけです。"
        v-model="asinString"
      ></textarea>
      <div class="col-md-4 mt-10" v-if="!adminViewUser">
        <button
          class="btn btn-common btn-info mb-10"
          @click="$refs.inputCSV.click()"
        >
          CSVインポート
        </button>
        <input
          ref="inputCSV"
          hidden
          type="file"
          name=""
          accept=".txt"
          id=""
          @change="onSelectFileCSV"
        />
        <br />
        <button class="btn btn-common btn-success" @click="onClickAddAsin">
          プロセスへ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AsinApi from "@/services/asinApi";
import { mapGetters } from "vuex";

export default {
  name: "ImportAsin",
  data() {
    return {
      asinString: "",
      // groupId: "",
      isErrorGroupId: false,
      isErrorasinString: false
    };
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      adminViewUser: "getAdminViewUser"
    })
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
          title: "エラー",
          text: error.message
        });
      }
    },
    async onClickAddAsin() {
      try {
        // if (!this.groupId || this.groupId.trim() === "") {
        //   this.isErrorGroupId = true;
        //   return this.$swal.fire({
        //     icon: "error",
        //     title: "エラー",
        //     text: "接続エラー!"
        //   });
        // }
        if (!this.asinString || this.asinString.trim() === "") {
          this.isErrorasinString = true;
          return this.$swal.fire({
            icon: "error",
            title: "エラー",
            text: "接続エラー!"
          });
        }
        let listCode = this.asinString
          .split("\n")
          .filter(item => item.trim() != "");
        if (listCode.length > 10000) {
          this.$swal.fire({
            icon: "error",
            title: "エラー",
            text: "最大10.000ASINまでしか追加できません !"
          });
          return;
        }
        let res = await AsinApi.add({
          listCode,
          // groupId: this.groupId,
          yahoo_account_id: this.selectedYahooAccount._id
        });
        if (res && res.status === 200) {
          let newAsin = res.data.newAsin;

          this.asinString = "";
          // this.groupId = "";
          await this.$emit("pushNewAsin", newAsin);
          this.$swal.fire({
            icon: "success",
            title: "成功.!"
          });
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

<style scoped></style>
