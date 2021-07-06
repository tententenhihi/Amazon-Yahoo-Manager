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
                      ref="username"
                      type="text"
                      name="ユーザー名"
                      class="form-control"
                      placeholder="ユーザー名を入力してください。"
                      id="username"
                      rules="required"
                      v-model="user.username"
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
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AuthApi from "../services/auth";

export default {
  data() {
    return {
      errorPassword: false,
      errorUsername: false,
      isLoading: false,
      user: {
        username: "",
        password: "",
      },
      showPassword: false,
      loading: false,
      rules: {
        requiredPasswd: (value) => !!value || "Nhập mật khẩu.",
        requiredUsername: (value) => !!value || "Nhập tài khoản.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },
  methods: {
    async onSubmit () {
      let result = await this.$refs.formLogin.validate();
      if (result) {
        this.isLoading = true;

        const response = await AuthApi.login({
          username: this.user.username.toLowerCase(),
          password: this.user.password,
        });

        if (response && response.status === 200) {
          this.$store.dispatch("setUser", response.data.userData);
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
  mounted() {
    this.$refs.username.focus();
    if (this.$route.query && this.$route.query.isActive) {
      this.$swal.fire({
        icon: "success",
        title: "Kích hoạt thành công. Đăng nhập ngay!",
      });
    }
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
