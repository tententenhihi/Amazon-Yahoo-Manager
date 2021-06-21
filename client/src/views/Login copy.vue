<template>
  <v-container class="text-center">
    <v-sheet
      style="max-width: 400px; margin: auto; margin-top: 100px;"
      elevation="3"
      rounded="lg"
      class="pa-5 pb-5"
    >
      <h3>Login</h3>
      <v-text-field
        ref="username"
        id="username"
        name="username"
        v-model="user.username"
        label="Tài khoản"
        prepend-inner-icon="mdi-account-circle"
        :rules="[rules.requiredUsername]"
        :error="errorUsername"
        @focus="errorUsername = false"
        :disabled="isLoading"
      ></v-text-field>
      <v-text-field
        ref="password"
        id="password"
        name="password"
        :disabled="isLoading"
        v-model="user.password"
        label="Mật khẩu"
        prepend-inner-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.requiredPasswd]"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
        :error="errorPassword"
        @focus="errorPassword = false"
        @keyup.enter="handleLogin()"
      ></v-text-field>
      <v-btn
        class="mt-5"
        :loading="isLoading"
        :disabled="isLoading"
        color="#1877f2"
        large
        block
        @click="handleLogin()"
      >
        <span style="color: #fff; font-size: 18px" class="font-weight-bold"
          >Đăng nhập</span
        >
        <template v-slot:loader>
          <span class="custom-loader">
            <v-icon light>mdi-cached</v-icon>
          </span>
        </template>
      </v-btn>
      <!-- <div class="mt-4">
        <span class="forgot-password" style="font-size: 14px"
          >Quên mậ khẩu?</span
        >
      </div>
      <v-divider class="my-4"></v-divider>
      <v-btn color="#42b72a" large @click="$refs.signUpModal.show()">
        <span style="color: white; font-size: 15px; font-weight: bold"
          >Tạo tài khoản mới</span
        >
      </v-btn> -->
    </v-sheet>
  </v-container>
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
        password: ""
      },
      showPassword: false,
      loading: false,
      rules: {
        requiredPasswd: value => !!value || "Nhập mật khẩu.",
        requiredUsername: value => !!value || "Nhập tài khoản.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`
      }
    };
  },
  methods: {
    async handleLogin() {
      // Check Data
      if (!this.user.username) {
        this.errorUsername = true;
      }
      if (!this.user.password) {
        this.errorPassword = true;
      }
      if (this.errorPassword || this.errorUsername) {
        return;
      }
      this.isLoading = true;

      const response = await AuthApi.login({
        username: this.user.username.toLowerCase(),
        password: this.user.password
      });

      if (response && response.status === 200) {
        this.$store.dispatch("setUser", response.data.userData);
        this.$router.push("/");
      }
      this.isLoading = false;
    }
  },
  mounted() {
    this.$refs.username.focus();
    if (this.$route.query && this.$route.query.isActive) {
      this.$swal.fire({
        icon: "success",
        title: "Kích hoạt thành công. Đăng nhập ngay!"
      });
    }
  }
};
</script>

<style scoped>
.forgot-password {
  color: #1877f2;
  cursor: pointer;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
