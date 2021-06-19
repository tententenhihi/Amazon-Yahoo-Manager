<template>
  <div
    class="d-flex flex-column align-center justify-center"
    style="padding-top: 90px"
  >
    <v-card elevation="0">
      <div class="d-flex flex-column align-center justify-center">
        <v-card-title>Đăng Nhập</v-card-title>
        <div class="d-flex justify-center align-center">
          <span class="pr-3">Tài Khoản</span>
          <div style="max-width: 400px; min-width: 300px">
            <v-text-field
              type="text"
              append-icon="mdi-account"
              label="Nhập tài khoản"
              :rules="[() => !!user || 'This field is required']"
              :error-messages="errorMessages"
              v-model="user"
              require
            ></v-text-field>
          </div>
        </div>
        <div class="d-flex justify-center align-center py-4">
          <span class="pr-3">Mật Khẩu</span>
          <div style="max-width: 400px; min-width: 300px">
            <v-text-field
              label="Nhập mật khẩu"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[() => !!password || 'This field is required']"
              :error-messages="errorMessages"
              :type="show1 ? 'text' : 'password'"
              v-model="password"
              @click:append="show1 = !show1"
              require
            ></v-text-field>
          </div>
        </div>
        <span v-if="errorLogin" class="red-text"
          >Tài khoản hoặc mật khẩu không chính xác !</span
        >
        <div>
          <v-btn color="primary" class="px-4 py-2 mt-3" @click="handleLogin"
            >Đăng Nhập</v-btn
          >
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import AuthenticationService from "../services/auth";
export default {
  data() {
    return {
      show1: false,
      user: "",
      password: "",
      errorMessages: "",
      errorLogin: false,
    };
  },
  methods: {
    async handleLogin() {
      // Check Data

      const response = await AuthenticationService.login({
        username: this.user.toLowerCase(),
        password: this.password,
      });
      if (response && response.status === 200) {
        this.$store.dispatch("setUser", response.data.userData);
        /* let res = await Api.get("api/v1/service/get-data");
        /*  if (res && res.status === 200) {
          let data = res.data.data;
          this.$store.dispatch("setData", data);
        } */
        console.log("access");
        this.$router.push({ name: "Home" });
      } else if (response.status === 400 && response.data.isActive === false) {
        this.errorLogin = true;
        console.log("error");
      }
    },
  },
};
</script>

<style>
</style>