<template>
  <div class="wrapper">
    <section class="content">
      <div class="login-box">
        <div class="login-box-body">
          <div class="login-logo">
            <a href="javascript:void(0)">パスワードがわからない方はこちら</a>
          </div>
          <ValidationObserver tag="form" @submit.prevent="onSubmit" ref="formForgotpassword">
            <div class="form-group position-relative">
              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="form-group position-relative">
                <div class="input-group_nouse">
                  <div class="form-group text">
                    <label for="">メールアドレス</label>
                    <input
                      ref="email"
                      type="email"
                      name="メールアドレス"
                      class="form-control"
                      placeholder="入力してください"
                      rules="required"
                      v-model="email"
                    />
                  </div>
                </div>
                <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
              </ValidationProvider>

              <ValidationProvider :rules="{required: true, same_value: sameEmailValue}" v-slot="{ errors }" tag="div" class="form-group position-relative">
                <div class="input-group_nouse">
                  <div class="form-group text">
                    <label for="">メールアドレス（確認用）</label>
                    <input
                      type="email"
                      name="メールアドレス（確認用）"
                      class="form-control"
                      placeholder="入力してください"
                      v-model="re_email"
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
  data() {
    return {
      isLoading: false,
      email: "",
      re_email: "",
      sameEmailValue: "",
    };
  },
  methods: {
    async onSubmit () {
      this.sameEmailValue = this.email
      let result = await this.$refs.formForgotpassword.validate();
      if (result) {
        this.isLoading = true;
        const response = await AuthApi.forgotPassword({
          email: this.email.toLowerCase(),
        });

        if (response && response.status === 200) {
          console.log(response);
          this.$swal.fire(
            "送信しました！",
            "メールを確認し、パスワードをリセットしてください。",
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
