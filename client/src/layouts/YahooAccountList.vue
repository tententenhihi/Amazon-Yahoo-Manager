<template>
  <div class="list-yahoo-account" :style="!isShowSidebar ? 'padding-left: 50px' : ''">
    <ul class="list-inline text-center align-items-center">
      <li class="list-inline-item" v-for="(account, index) in yahooAccount"
        :key="index" :class="{'active': selectedYahooAccount._id === account._id}"
        @click="setYahooAccount(account)"  
      >
        {{ account.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: ['isShowSidebar'],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      yahooAccount: 'getYahooAccount',
      selectedYahooAccount: 'getSelectedYahooAccount'
    })
  },
  methods: {
    setYahooAccount (account) {
      this.$store.commit('SET_SELECTED_YAHOO_ACCOUNT', account)
      this.$emit('onChangeYahooAccount')
    }
  }
}
</script>

<style scoped>
.list-yahoo-account {
  padding-left: 280px;
  background-color: #31353D;
  height: 50px;
  line-height: 40px;
  color: #FFFFFF;
  width: 100%;
  overflow-x: auto;
}
.align-items-center {
  -ms-flex-align: center!important;
  align-items: center!important;
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