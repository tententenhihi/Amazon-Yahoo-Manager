<template>
  <div class="wrapper">
    <section class="content">
      <div class="login-box">
        <div class="login-box-body">
          <div class="login-logo">
            <a href="javascript:void(0)">ログイン</a>
          </div>
          <ValidationObserver
            tag="form"
            @submit.prevent="onSubmit"
            ref="formLogin"
          >
            <div class="form-group position-relative">
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                tag="div"
                class="form-group position-relative"
              >
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
                <span class="fa fa-user form-control-feedback"></span>
                <div class="error-message" v-if="errors.length">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>

              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                tag="div"
                class="form-group position-relative"
              >
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
                <span class="fa fa-lock form-control-feedback"></span>
                <div class="error-message" v-if="errors.length">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>
              <div class="">
                <div class="col-xs-5" style="width: 100%">
                  <button
                    type="submit"
                    name="submit"
                    class="btn btn-primary btn-block btn-flat"
                  >
                    ログイン&nbsp;<i
                      class="fa fa-sign-in-alt"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </ValidationObserver>
          <div class="text-center">
            <router-link tag="a" :to="{ name: 'ForgotPassword' }"
              >パスワードがわからない方はこちら</router-link
            >
          </div>
        </div>
      </div>
    </section>
    <modal-component
      ref="modalLocked"
      classModalDialog="modal-md"
      styleModalFooter="justify-content: space-between"
    >
      <template v-slot:header>
        <h5 style="word-break: break-all; color: red; ">
          ツール一時停止のお知らせ
        </h5>
      </template>
      <template>
        <div
          class="form-group fs-14"
          v-html="
            `継続決済失敗しておりますので、ツールを一時停止しております。</br>
          再決済メールしてあります　</br>
          ＊新たに決済はせず、かならずメール内のリンクから再決済でお願いいたします。
          </br>
          </br>
          別途メールが送付されております、テレコムクレジットからの、
          メール内の再決済URLから、再決済の対応よろしくお願いします。
          迷惑メールもご確認ください。 
          </br>
          ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
          </br>
          かならずメール内のリンクから再決済でお願いいたします。
          </br>
          ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
          </br>
          </br>
          決済が完了しましたら、チャットワークもしくはメールにてご連絡ください
          決済しただけでは使えるようにはなりません。 
          </br>
          メール：info@y-tool.biz`
          "
        ></div>
      </template>
      <template v-slot:button>
        <div class="text-center" style="width: 100%;">
          <div class="button-group ">
            <button
              class="btn btn-default btn-primary fs-14"
              @click="$refs.modalLocked.closeModal()"
            >
              キャンセル
            </button>
          </div>
        </div>
      </template>
    </modal-component>
    <modal-component
      ref="modalExpired"
      classModalDialog="modal-md"
      styleModalFooter="justify-content: space-between"
    >
      <template v-slot:header>
        <h5 style="word-break: break-all; color: red; ">
          継続課金設定
        </h5>
      </template>
      <template>
        <div
          class="form-group fs-14"
          v-html="
            `ホーム</br>
            継続課金設定</br>
          ×引き続き、利用するには有料課金が必要です。こちらから課金してください。クレカの登録をしたはずなのに、１日たって再度この画面が表示されている場合は、２重決済を防ぐため再度登録はせず、チャットワーク管理者「ゆうき」までご連絡ください。</br>
          ご利用には課金が必要です。下記より継続課金の設定をお願い致します。</br>
          あなたの継続課金決済が確認できない状況になっております。
          </br></br>
          ツールを継続して運用いただくには、再決済が必要です。</br>
          こちらで、決済後</br>
          https://secure.telecomcredit.co.jp/inetcredit/secure/order.pl?clientip=86464&money=24800&rebill_param_id=31day24800yen
          </br></br>
          ＊決済後すぐに使える状態にはなりません。管理側での再開設定が必要になりますので、</br>
          ユーザー認識番号と、</br>決済氏名を明記の上チャットワークまたはメール「info@y-tool.biz」にてご連絡をお願い致します。</br>
          （よく見てるのでチャットワークのほうが対応は早いです）</br>`
          "
        ></div>
      </template>
      <template v-slot:button>
        <div class="text-center" style="width: 100%;">
          <div class="button-group ">
            <button
              class="btn btn-default btn-primary fs-14"
              @click="$refs.modalExpired.closeModal()"
            >
              キャンセル
            </button>
          </div>
        </div>
      </template>
    </modal-component>
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
        password: ""
      }
    };
  },
  methods: {
    async verifyAccount(code) {
      let res = await AuthApi.verifyAccount({ code });
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "アクティベーションに成功しました。 ここでログイン！"
        });
      }
    },
    async onSubmit() {
      let result = await this.$refs.formLogin.validate();
      if (result) {
        this.isLoading = true;

        const response = await AuthApi.login({
          email: this.user.email.toLowerCase(),
          password: this.user.password
        });

        if (response && response.status === 200) {
          if (response.data.locked) {
            this.$refs.modalLocked.openModal();
          } else if (response.data.exprired) {
            this.$refs.modalExpired.openModal();
          } else {
            this.$store.dispatch("setUser", response.data.userData);
            this.$store.commit("SET_YAHOO_ACCOUNT", response.data.yahooAccount);
            if (response.data.yahooAccount.length) {
              this.$store.commit(
                "SET_SELECTED_YAHOO_ACCOUNT",
                response.data.yahooAccount[0]
              );
            }
            if (response.data.userData.type === "admin") {
              this.$router.push({ name: "AdminUsers" });
            } else {
              this.$router.push("/");
            }
          }
        }
        this.isLoading = false;
      }
    }
  },
  async mounted() {
    if (this.$route.query && this.$route.query.code) {
      await this.verifyAccount(this.$route.query.code);
    }
    this.$refs.email.focus();
  }
};
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .wrapper {
    margin-left: -280px;
  }
}
</style>
