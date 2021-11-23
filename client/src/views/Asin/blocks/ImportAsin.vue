<template>
  <div class="mx-20 mt-30">
    <!-- <div class="form-group row">
      <label class="font-weight-bold col-xl-2 col-md-3 col-sm-4 mt-10" for="group-id">ASINグループID (*): </label>
      <input type="text" class="form-control col-xl-4 col-md-5 col-sm-6" placeholder="ASINグループIDを入力"
        id="group-id" v-model="groupId">
    </div> -->
    <span class="fs-12 font-weight-bold"
      >ヤフオクの仕様上、1アカウントで6000件までしか出品できないので、1アカウントあたり最大6000件まで登録可能</span
    >
    <div class="row ">
      <textarea
        class="form-control col-md-6"
        id=""
        cols="30"
        rows="10"
        placeholder="ASINを入力、一行で一つだけです。"
        v-model="asinString"
      ></textarea>
      <div class="col-md-4 mt-10" style="place-self: flex-end;">
        <div style="display: flex; align-items: center;margin-bottom:10px">
          <input
            type="checkbox"
            v-model="checkUpdateAsin"
            style="cursor: pointer; width: 15px; height: 15px; margin-right: 5px"
          />
          <span
            @click="checkUpdateAsin = !checkUpdateAsin"
            style="cursor: pointer;"
            >新規取得でDB商品データを更新する</span
          >
        </div>
        <div>
          <input
            ref="inputCSV"
            hidden
            type="file"
            name=""
            accept=".csv"
            id=""
            @change="onSelectFileCSV"
          />
          <button
            class="btn btn-common btn-success mb-2 mr-3"
            @click="onClickAddAsin"
          >
            プロセスへ
          </button>
          <button
            class="btn btn-common btn-info mb-2"
            @click="$refs.inputCSV.click()"
          >
            CSVインポート
          </button>
        </div>
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
      checkUpdateAsin: false,
      asinString: "",
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
        const file = files[0];
        if (file.type !== "application/vnd.ms-excel") {
          return this.$swal.fire({
            icon: "error",
            title: "エラー",
            text:
              "CSVファイルしかアップ出来ません。CSVファイルを選択してください。!"
          });
        }
        this.asinString = await this.readFileText(file);
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
      event.target.value = "";
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
        if (listCode.length > 6000) {
          this.$swal.fire({
            icon: "error",
            title: "エラー",
            text:
              "ヤフオクの仕様上、1アカウントで6000件までしか出品できないので、1アカウントあたり最大6000件まで登録可能"
          });
          return;
        }
        let res = await AsinApi.add({
          listCode,
          // groupId: this.groupId,
          yahoo_account_id: this.selectedYahooAccount._id,
          checkUpdateAsin: this.checkUpdateAsin
        });
        if (res && res.status === 200) {
          // let newAsin = res.data.newAsin;

          // this.asinString = "";
          // // this.groupId = "";
          // await this.$emit("pushNewAsin", newAsin);
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
