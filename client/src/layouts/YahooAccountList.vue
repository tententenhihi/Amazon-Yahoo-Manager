<template>
  <div
    class="list-yahoo-account"
    :style="!isShowSidebar ? 'padding-left: 50px' : ''"
  >
    <div class="pt-1">
      <select
        @change="setYahooAccount"
        class="custom-select"
        style="width: 200px; font-size: 16px"
      >
        <option
          v-for="(account, index) in yahooAccount"
          :key="index"
          :value="account._id"
        >
          <span class="warning" v-if="account && account.count_error >= 3000"
            >▲</span
          >
          <span class="error" v-if="account && account.status === 'ERROR'"
            >🆇</span
          >

          {{ account.name }}</option
        >
      </select>
    </div>
    <!-- <ul class="list-inline text-center align-items-center">
      <li class="list-inline-item" v-for="(account, index) in yahooAccount"
          :class="{'active': selectedYahooAccount._id === account._id}"
        @click="setYahooAccount(account)"  
      >
        {{ account.name }}
      </li>
    </ul> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["isShowSidebar"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      yahooAccount: "getYahooAccount",
      selectedYahooAccount: "getSelectedYahooAccount"
    })
  },
  methods: {
    setYahooAccount(event) {
      let idAccount = event.target.value;
      let account = this.yahooAccount.find(item => item._id === idAccount);
      this.$store.commit("SET_SELECTED_YAHOO_ACCOUNT", account);
      this.$emit("onChangeYahooAccount");
    }
  }
};
</script>

<style scoped>
.warning {
  color: orange;
}
.error {
  color: red;
}
.list-yahoo-account {
  padding-left: 220px;
  background-color: #31353d;
  height: 50px;
  line-height: 40px;
  color: #ffffff;
  width: 100%;
  overflow-x: auto;
}
.align-items-center {
  -ms-flex-align: center !important;
  align-items: center !important;
  display: flex;
}
.list-inline-item {
  cursor: pointer;
  font-size: 14px;
  margin: 0 10px;
}
.active {
  color: #ff7e7e;
  font-weight: bold;
}
</style>
