<template>
  <div class="wrapper">
    <section class="content">
      <div class="login-box">
        <div class="login-box-body">
          <div class="login-logo">
            <a href="javascript:void(0)">パスワードを再設定する</a>
          </div>
          <ValidationObserver tag="form" @submit.prevent="onSubmit" ref="formForgotpassword">
            <div class="form-group position-relative">
              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="form-group position-relative">
                <div class="input-group_nouse">
                  <div class="form-group text">
                    <label for="">メールアドレス</label>
                    <input
                      ref="password"
                      type="password"
                      name="メールアドレス"
                      class="form-control"
                      placeholder="入力してください"
                      rules="required"
                      v-model="password"
                    />
                  </div>
                </div>
                <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
              </ValidationProvider>

              <ValidationProvider :rules="{required: true, same_value: samePasswordValue}" v-slot="{ errors }" tag="div" class="form-group position-relative">
                <div class="input-group_nouse">
                  <div class="form-group text">
                    <label for="">メールアドレス（確認用）</label>
                    <input
                      type="password"
                      name="メールアドレス（確認用）"
                      class="form-control"
                      placeholder="入力してください"
                      v-model="re_password"
                    />
                  </div>
                </div>
                <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
              </ValidationProvider>
              <div class="">
                <div class="col-xs-5" style="width: 100%">
                  <button type="submit" class="btn btn-primary btn-block btn-flat">
                    送信する
                  </button>
                </div>
                <div class="col-xs-5 mt-20" style="width: 100%">
                  <router-link class="btn btn-outline-info btn-block btn-flat" :to="{name: 'Login'}">戻る</router-link>
                </div>
              </div>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AuthApi from "@/services/auth";

export default {
  name: 'ResetPassword',
  data() {
    return {
      isLoading: false,
      password: "",
      re_password: "",
      samePasswordValue: "",
    };
  },
  computed: {
    verifyCode () {
      return this.$route.query.code
    }
  },
  mounted () {
    this.getVerifyCode();
  },
  methods: {
    async getVerifyCode () {
      let result = await AuthApi.getVerifyCode({code: this.verifyCode});
      if (!result || result.status !== 200) {
        this.$swal.fire(
          "エラー",
          "error"
        );
        this.$router.push({name: 'Login'})
      }
    },
    async onSubmit () {
      this.samePasswordValue = this.password
      let result = await this.$refs.formForgotpassword.validate();
      if (result) {
        this.isLoading = true;
        const response = await AuthApi.resetPassword({
          password: this.password.toLowerCase(),
          code: this.verifyCode,
        });

        if (response && response.status === 200) {
          this.$swal.fire(
            "成功",
            "パスワードの更新に成功しました。ログインしてください",
            "success"
          );
          this.$router.push({name: 'Login'})
        }
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .wrapper {
    margin-left: -280px;
  }
}
.login-box {
  width: 600px;
}
</style>
