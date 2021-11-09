<template>
  <div class="wrapper-content">
    <div class="box-header"><i class="fa fa-key mr-2"></i> Api Keepa - Amz</div>
    <hr />
    <div class="box-content py-20">
      <div class="row mb-2">
        <div class="col-4 label-end-center">Token Keepa</div>
        <div class="col-4">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.token_keepa"
          />
        </div>
      </div>
      <!-- <div class="row mb-2">
        <div class="col-4 label-end-center">Amz REFRESH_TOKEN</div>
        <div class="col-6">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.REFRESH_TOKEN"
          />
        </div>
      </div> -->
      <div class="row mb-2" style="display: flex;align-items: center;">
        <div class="col-4 label-end-center">Amz oauth code:</div>
        <div class="col-4">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.OAUTH_CODE"
          />
        </div>
        <div class="col-2">
          <a
            target="_blank"
            href="https://sellercentral.amazon.com/apps/authorize/consent?application_id=amzn1.sp.solution.618ca4fc-0d50-4c32-bb42-517b8666ce5f&state=sp-api-oauth-tool&version=beta"
            >Click here to get it.!</a
          >
        </div>
      </div>
      <div class="row mb-2" style="display: flex;align-items: center;">
        <div class="col-4 label-end-center">Selling partner id:</div>
        <div class="col-4">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.SELLING_PARTNER_APP_CLIENT_ID"
          />
        </div>
      </div>
      <!-- <div class="row mb-2">
        <div class="col-4 label-end-center">SELLING_PARTNER_APP_CLIENT_ID</div>
        <div class="col-4">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.SELLING_PARTNER_APP_CLIENT_ID"
          />
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4 label-end-center">
          SELLING_PARTNER_APP_CLIENT_SECRET
        </div>
        <div class="col-4">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.SELLING_PARTNER_APP_CLIENT_SECRET"
          />
        </div>
      </div> -->
      <!-- <div class="row mb-2">
        <div class="col-4 label-end-center">AWS_SELLING_PARTNER_ROLE</div>
        <div class="col-6">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.AWS_SELLING_PARTNER_ROLE"
          />
        </div>
      </div> -->
      <!-- <div class="row mb-2">
        <div class="col-4 label-end-center">AWS_ACCESS_KEY_ID</div>
        <div class="col-6">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.AWS_ACCESS_KEY_ID"
          />
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-4 label-end-center">AWS_SECRET_ACCESS_KEY</div>
        <div class="col-6">
          <input
            type="text"
            class="form-control"
            v-model="newApiKey.AWS_SECRET_ACCESS_KEY"
          />
        </div>
      </div> -->

      <div class="row mb-2 justify-content-center my-10 mt-20">
        <button class="btn btn-success mb-1 mr-1" @click="onUpdate">
          <i class="fa fa-save"></i> セーブ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ApiKeyApi from "@/services/ApiKey.js";
import { mapGetters } from "vuex";

export default {
  name: "ChangePassword",
  data() {
    return {
      newApiKey: {
        token_keepa: this.apiKey ? this.apiKey.token_keepa : "",
        OAUTH_CODE: this.apiKey ? this.apiKey.OAUTH_CODE : "",
        REFRESH_TOKEN: this.apiKey ? this.apiKey.REFRESH_TOKEN : "",
        SELLING_PARTNER_APP_CLIENT_ID: this.apiKey
          ? this.apiKey.SELLING_PARTNER_APP_CLIENT_ID
          : "",
        SELLING_PARTNER_APP_CLIENT_SECRET: this.apiKey
          ? this.apiKey.SELLING_PARTNER_APP_CLIENT_SECRET
          : "",
        AWS_SELLING_PARTNER_ROLE: this.apiKey
          ? this.apiKey.AWS_SELLING_PARTNER_ROLE
          : "",
        AWS_ACCESS_KEY_ID: this.apiKey ? this.apiKey.AWS_ACCESS_KEY_ID : "",
        AWS_SECRET_ACCESS_KEY: this.apiKey
          ? this.apiKey.AWS_SECRET_ACCESS_KEY
          : ""
      }
    };
  },
  computed: {
    ...mapGetters({
      apiKey: "getApiKey"
    })
  },
  mounted() {
    this.newApiKey = {
      token_keepa: this.apiKey ? this.apiKey.token_keepa : "",
      OAUTH_CODE: this.apiKey ? this.apiKey.OAUTH_CODE : "",
      REFRESH_TOKEN: this.apiKey ? this.apiKey.REFRESH_TOKEN : "",
      SELLING_PARTNER_APP_CLIENT_ID: this.apiKey
        ? this.apiKey.SELLING_PARTNER_APP_CLIENT_ID
        : "",
      SELLING_PARTNER_APP_CLIENT_SECRET: this.apiKey
        ? this.apiKey.SELLING_PARTNER_APP_CLIENT_SECRET
        : "",
      AWS_SELLING_PARTNER_ROLE: this.apiKey
        ? this.apiKey.AWS_SELLING_PARTNER_ROLE
        : "",
      AWS_ACCESS_KEY_ID: this.apiKey ? this.apiKey.AWS_ACCESS_KEY_ID : "",
      AWS_SECRET_ACCESS_KEY: this.apiKey
        ? this.apiKey.AWS_SECRET_ACCESS_KEY
        : ""
    };
  },
  methods: {
    async onUpdate() {
      let res = await ApiKeyApi.update({
        ...this.newApiKey,
        _id: this.apiKey._id
      });
      if (res && res.status === 200) {
        await this.$store.dispatch("setApiKey", res.data.apiKey);
        this.$swal.fire({
          icon: "success",
          title: "更新しました！"
        });
      }
    }
  }
};
</script>

<style scoped></style>
