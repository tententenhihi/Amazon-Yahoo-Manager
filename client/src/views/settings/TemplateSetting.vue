<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-edit mr-2"></i>出品時のデザインテンプレート
    </div>
    <hr />
    <div class="box-content py-20">
      <div class="image-selected col-12">
        <img
          :src="
            `/static/images/template-setting/template${selectedTemplate}.png`
          "
          alt=""
        />
      </div>
      <div class="list-template my-30">
        <ul style="justify-content: center;">
          <li
            v-for="n in 2"
            @click="selectedTemplate = n"
            :class="{ active: n == selectedTemplate }"
            :key="n"
            class="mx-20"
          >
            <img
              height="110"
              width="120"
              :src="`/static/images/template-setting/template${n}.png`"
              alt=""
            />
          </li>
        </ul>
      </div>
      <div class="row justify-content-center" >
        <button class="btn btn-success" @click="onSelectTemplate">
          <i class="fa fa-save"> 保存</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductGlobalSettingApi from "@/services/ProductGlobalSettingApi";
import { mapGetters } from "vuex";
export default {
  name: "TemplateSetting",
  data() {
    return {
      selectedTemplate: 1,
      setting: {}
    };
  },
  mounted() {
    this.getCurrentSetting();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      adminViewUser: "getAdminViewUser"
    }),
    yahooAccountId() {
      return this.selectedYahooAccount._id;
    }
  },
  methods: {
    async getCurrentSetting() {
      let res = await ProductGlobalSettingApi.get(this.yahooAccountId);
      if (res && res.status == 200) {
        this.setting = res.data.setting;
        this.selectedTemplate = this.setting.template;
      }
    },
    async onSelectTemplate() {
      this.setting.template = this.selectedTemplate;
      let res = await ProductGlobalSettingApi.update(this.setting);
      if (res && res.status == 200) {
        this.$swal.fire("成功!", "更新が成功しました", "success");
      }
    }
  }
};
</script>

<style scoped>
.box-content {
  max-width: 800px;
  margin: 0 auto;
}
.image-selected {
  display: flex;
  justify-content: center;
}
ul {
  display: flex;
}
ul li {
  cursor: pointer;
}
ul li.active {
  border: 2px solid red;
}
</style>
