<template>
  <div class="wrapper-content" v-if="isInit">
    <div class="box-header">
      <i class="fa fa-edit mr-2"></i>評価テンプレート管理
    </div>
    <hr />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="form-row">
          <div class="form-group col-md-12">
            <label for="name">テンプレート名</label>
            <input type="text" class="form-control" id="name" v-model="template.name">
          </div>
          <div class="form-group col-md-12">
            <label for="rating">評価</label>
            <select class="form-control" v-model="template.rating" id="">
              <option v-for="(rate,index) in RATING_LIST" :key="index" :value="rate.value">{{rate.display}}</option>
            </select>
          </div>
          <div class="form-group col-md-12">
            <label for="content">コメント</label>
            <textarea class="form-control" id="" cols="30" rows="5" v-model="template.content"></textarea>
          </div>
        </div>
        ※名前やメールアドレスなど、個人情報の入力は禁止です（評価は公開されます）。Y!オクの注意事項をよく読みご投稿ください。
        <div class="row mt-20">
          <button class="btn btn-success mb-1 mr-1" @click="onSave()">
            セーブ
          </button>
          <router-link :to="{name: 'RatingTemplate'}" tag="button" class="btn btn-warning mb-1">キャンセル</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RatingTemplateApi from '@/services/RatingTemplateApi'
import { mapGetters } from 'vuex'
const RATING_LIST = [
  { value: 'veryGood', display: '非常に良い' },
  { value: 'good', display: '良い' },
  { value: 'normal', display: 'どちらでもない' },
  { value: 'bad', display: '悪い' },
  { value: 'veryBad', display: '非常に悪い' },
]
export default {
  data () {
    return {
      RATING_LIST,
      template: {
        name: '',
        content: '',
        rating: RATING_LIST[0].value
      },
      isInit: false
    }
  },
  async mounted () {
    if (this.templateId != 0) {
      let result = await RatingTemplateApi.show(this.templateId)
      if (result && result.status === 200) {
        this.template = result.data
        if (this.template.yahoo_account_id !== this.yahooAccountId) {
          this.$router.push({name: 'RatingTemplate'})
        }
      } else {
        this.$router.push({name: 'RatingTemplate'})
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
        result = await RatingTemplateApi.create(this.template)
      } else {
        result = await RatingTemplateApi.update(this.template)
      }
      if (result && result.status === 200) {
        this.$swal.fire(
          "成功",
          "アイテムは保存されました。",
          "success"
        );
        this.$router.push({name: 'RatingTemplate'})
      }
    }
  }
}
</script>

<style scoped>

</style>
