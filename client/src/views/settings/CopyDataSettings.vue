<template>
  <div class="wrapper-content">
    <div class="box-header">
      データをコピーする
    </div>
    <hr class="mt-10" />
    <div class="box-content px-50 py-20">
      <div>
        アカウントのリスト
        <select
          v-model="idYahooSelected"
          class="form-control mx-2"
          style="display: unset; width: 175px"
        >
          <option value="">アカウントを選択</option>
          <option
            v-for="(folder, index) in listYahooAccount.filter(
              item => item._id != this.selectedYahooAccount._id
            )"
            :value="folder._id"
            :key="index"
            >{{ folder.name }}</option
          >
        </select>
        <button
          v-if="!adminViewUser"
          class="btn btn-info mb-1 px-3"
          @click="onCopyData"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import YahooAccountApi from "@/services/YahooAccountApi";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      name: "",
      disableDraggable: false,
      selectedFolder: [],
      destinationFolder: "",
      idYahooSelected: ""
    };
  },
  components: {
    draggable
  },
  async mounted() {},
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      listYahooAccount: "getYahooAccount",
      adminViewUser: "getAdminViewUser"
    })
  },

  methods: {
    async onCopyData() {
      let res = await YahooAccountApi.copyData({
        yahoo_account_id: this.selectedYahooAccount._id,
        account_id_selected: this.idYahooSelected
      });
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "データを正常にコピーする",
          timer: 500,
          showConfirmButton: false
        });
      }
    }
  }
};
</script>

<style scoped>
.folder-list {
  margin: 10px 0;
  width: 100%;
  max-width: 400px;
  max-height: 400px;
  overflow: auto;
}
.group-button {
  position: absolute;
  top: 15px;
  right: 10px;
}
.group-button .btn {
  padding: 4px 5px;
}
</style>
