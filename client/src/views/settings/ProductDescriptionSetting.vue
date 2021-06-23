<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-edit mr-2"></i>出品時に使用するテンプレートの説明文 
    </div>
    <hr />
    <div class="box-content">
      <div class="form-horizontal col-md-7 py-20" style="float: none; margin: 0 auto;">
        <div class="form-group row mb-40">
          <label for="product-detail" class="col-sm-3 col-form-label">商品詳細 :</label>
          <div class="col-sm-8">
            <input type="text" v-model="setting.product_detail" class="form-control" id="product-detail" placeholder="(商品の商品詳細文が入る)" readonly>
          </div>
        </div>
        <div class="form-group row mb-40">
          <label for="payment" class="col-sm-3 col-form-label">支払詳細 :</label>
          <div class="col-sm-8">
            <textarea class="form-control" v-model="setting.payment_detail" id="payment" cols="30" rows="8"></textarea>
          </div>
        </div>
        <div class="form-group row mb-40">
          <label for="delivery" class="col-sm-3 col-form-label">発送詳細 :</label>
          <div class="col-sm-8">
            <textarea class="form-control" v-model="setting.delivery_detail" id="delivery" cols="30" rows="8"></textarea>
          </div>
        </div>
        <div class="form-group row mb-40">
          <label for="precautions" class="col-sm-3 col-form-label">注意事項  :</label>
          <div class="col-sm-8">
            <textarea class="form-control" id="precautions" v-model="setting.precaution_detail" cols="30" rows="8"></textarea>
          </div>
        </div>
        <div class="row justify-content-center">
          <button class="btn btn-success" @click="onUpdateSetting">
            <i class="fa fa-save"> 保存</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductGlobalSettingApi from '@/services/ProductGlobalSettingApi'
export default {
  name: 'ProductDescriptionSetting',
  data () {
    return {
      setting: {}
    }
  },
  mounted () {
    this.getCurrentSetting()
  },
  methods: {
    async getCurrentSetting () {
      let res = await ProductGlobalSettingApi.get();
      if (res && res.status == 200) {
        this.setting = res.data.setting
      }
    },
    async onUpdateSetting () {
      let res = await ProductGlobalSettingApi.update(this.setting);
      if (res && res.status == 200) {
        this.$swal.fire(
          "Successful!",
          "Your setting has been updated.",
          "success"
        );
      }
    }
  }
}
</script>

<style scoped>
.col-form-label {
  text-align: end;
}
</style>