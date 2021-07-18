<template>
  <div class="wrapper">
    <section class="content">
      <div class="login-box">
        <div class="login-box-body">
          <div class="login-logo">
            <a href="javascript:void(0)">ログイン</a>
          </div>
          <ValidationObserver tag="form" @submit.prevent="onSubmit" ref="formLogin">
            <div class="form-group position-relative">
              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="form-group position-relative">
                <div class="input-group_nouse">
                  <div class="form-group text">
                    <input
                      ref="email"
                      type="text"
                      name="ユーザー名"
                      class="form-control"
                      placeholder="Emailを入力してください。"
                      id="email"
                      rules="required"
                      v-model="user.email"
                    />
                  </div>
                </div>
                <span
                  class="fa fa-user form-control-feedback"
                ></span>
                <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
              </ValidationProvider>

              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="form-group position-relative">
                <div class="input-group_nouse">
                  <div class="form-group password">
                    <input
                      type="password"
                      name="パスワード"
                      class="form-control"
                      placeholder="パスワードを入力してください。"
                      id="password"
                      v-model="user.password"
                    />
                  </div>
                </div>
                <span
                  class="fa fa-lock form-control-feedback"
                ></span>
                <div class="error-message" v-if="errors.length">{{errors[0]}}</div>
              </ValidationProvider>
              <div class="">
                <div class="col-xs-5" style="width: 100%">
                  <button
                    type="submit"
                    name="submit"
                    class="btn btn-primary btn-block btn-flat"
                  >
                    ログイン&nbsp;<i class="fa fa-sign-in-alt" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </ValidationObserver>
          <div class="text-center">
            <router-link tag="a" :to="{name: 'ForgotPassword'}">パスワードがわからない方はこちら</router-link>
          </div>
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
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async verifyAccount (code) {
      let res = await AuthApi.verifyAccount({code});
      if (res && res.status === 200) {
        this.$swal.fire({
        icon: "success",
        title: "アクティベーションに成功しました。 ここでログイン！",
      });
      }
      console.log(res);
    },
    async onSubmit () {
      let result = await this.$refs.formLogin.validate();
      if (result) {
        this.isLoading = true;

        const response = await AuthApi.login({
          email: this.user.email.toLowerCase(),
          password: this.user.password,
        });

        if (response && response.status === 200) {
          this.$store.dispatch("setUser", response.data.userData);
          this.$store.commit('SET_YAHOO_ACCOUNT', response.data.yahooAccount)
          this.$store.commit('SET_SELECTED_YAHOO_ACCOUNT', response.data.yahooAccount[0] || {})
          if (response.data.userData.type === 'admin') {
            this.$router.push({name: 'AdminUsers'});
          } else {
            this.$router.push("/");
          }
        }
        this.isLoading = false;
      }
    },
  },
  async mounted () {
    if (this.$route.query && this.$route.query.code) {
      await this.verifyAccount(this.$route.query.code)
    }
    this.$refs.email.focus();
  },
};
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .wrapper {
    margin-left: -280px;
  }
}
</style>
