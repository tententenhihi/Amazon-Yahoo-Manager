<template>
  <div class="wrapper-content" v-if="isInit">
    <div class="box-header">
      <i class="fa fa-edit mr-2"></i>取引ナビテンプレート管理
    </div>
    <hr />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="form-row">
          <div class="form-group col-md-12">
            <label for="asin">テンプレート名</label>
            <input type="text" class="form-control" id="asin" v-model="template.name">
          </div>
          <div class="form-group col-md-12">
            <label for="name">メッセージ内容</label>
            <textarea class="form-control" id="" cols="30" rows="5" v-model="template.content"></textarea>
          </div>
        </div>
        ※Y!オクの注意事項をよく読みご投稿ください。
        <div class="row mt-20">
          <button class="btn btn-success mb-1 mr-1" @click="onSave()">
            セーブ
          </button>
          <router-link :to="{name: 'TradeMessageTemplate'}" tag="button" class="btn btn-warning mb-1">キャンセル</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TradeMessageTemplateApi from '@/services/TradeMessageTemplateApi'
import { mapGetters } from 'vuex'
export default {
  name: 'FormProduct',
  data () {
    return {
      template: {
        name: '',
        content: '',
      },
      isInit: false
    }
  },
  async mounted () {
    if (this.templateId != 0) {
      let result = await TradeMessageTemplateApi.show(this.templateId)
      if (result && result.status === 200) {
        this.template = result.data
        if (this.template.yahoo_account_id !== this.yahooAccountId) {
          this.$router.push({name: 'RatingTemplate'})
        }
      } else {
        this.$router.push({name: 'TradeMessageTemplate'})
      }
    }
    this.isInit = true
  },
  computed: {
    templateId () {
      return this.$route.params.id || 0
    },
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
    yahooAccountId () {
      return this.selectedYahooAccount._id
    }
  },
  methods: {
    async onSave () {
      let result = null
      this.template.yahoo_account_id = this.yahooAccountId
      if (this.templateId == 0) {
        result = await TradeMessageTemplateApi.create(this.template)
      } else {
        result = await TradeMessageTemplateApi.update(this.template)
      }
      if (result && result.status === 200) {
        this.$swal.fire(
          "成功",
          "アイテムは保存されました。",
          "success"
        );
        this.$router.push({name: 'TradeMessageTemplate'})
      }
    }
  }
}
</script>

<style scoped>

</style>
