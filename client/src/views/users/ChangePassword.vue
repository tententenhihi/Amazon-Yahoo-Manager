<template>
  <div class="wrapper-content">
    <div class="box-header"><i class="fa fa-lock mr-2"></i> パスワード変更</div>
    <hr />
    <div class="box-content py-20">
      <ValidationObserver tag="form" class="col-md-12" @submit.prevent="onChangePassword"
        ref="formChangePass">
        <ValidationProvider class="row my-10" tag="div" v-slot="{ errors }"
          name="現在のパスワード" rules="required">
          <div class="col-md-3 label-end-center">現在のパスワード</div>
          <div class="col-md-6">
            <input type="password" class="form-control" v-model="credential.current_password">
            <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
          </div>
        </ValidationProvider>
        <ValidationProvider class="row my-10" tag="div" v-slot="{ errors }"
          name="新しいパスワード" rules="required">
          <div class="col-md-3 label-end-center">新しいパスワード</div>
          <div class="col-md-6">
            <input type="password" class="form-control" v-model="credential.password">
            <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
          </div>
        </ValidationProvider>
        <ValidationProvider class="row my-10" tag="div" v-slot="{ errors }"
          name="新しいパスワード（確認）" :rules="{required: true, same_value: passwordCompare}">
          <div class="col-md-3 label-end-center">新しいパスワード（確認）</div>
          <div class="col-md-6">
            <input type="password" class="form-control" v-model="credential.re_password">
            <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
          </div>
        </ValidationProvider>
        <div class="row justify-content-center my-10 mt-20">
          <button class="btn btn-success mb-1 mr-1" type="submit">
            <i class="fa fa-save"></i> セーブ
          </button>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import UserApi from '@/services/UserApi.js'
export default {
  name: "ChangePassword",
  data () {
    return {
      credential: {
        current_password: '',
        password: '',
        re_password: ''
      },
      passwordCompare: ''
    }
  },
  methods: {
    async onChangePassword () {
      this.passwordCompare = this.credential.password
      let validate = await this.$refs.formChangePass.validate();
      console.log(validate);
      if (validate) {
        let res = await UserApi.changePassword(this.credential);
        if (res && res.status === 200) {
          this.$swal.fire(
            "更新しました！",
            "パスワードを正常に変更する",
            "success"
          );
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
