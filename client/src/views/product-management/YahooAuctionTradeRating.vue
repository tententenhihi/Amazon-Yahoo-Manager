<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク 評価
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20 table-responsive">
        <template v-if="postedRate.length">
          <div class="title">
            投稿した評価
          </div>
          <table class="table table-striped pt-20 mb-30" style="width: 100%">
            <thead class="thead-purple">
              <tr>
                <th scope="col">評価</th>
                <th scope="col">コメント</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in postedRate" :key="index">
                <td>非常に良い</td>
                <td>スムーズに取引できました。ありがとうございました。</td>
              </tr>
            </tbody>
          </table>
        </template>

        <div style="font-size:16px; margin: 5px 0">
          このオークションの取引について、落札者への満足度を採点してください。 <br>
          評価の内容は、今後の取引にあたっての参考として、落札者の評価一覧ページに公開されます。
        </div>
        <div>
          <div class="input-group mb-2">
            <select v-model="selectedTemplate" id="" class="form-control">
              <option :value="selectedTemplate" selected>テンプレートを選択</option>
              <option :key="index" v-for="(template, index) in templates" :value="template">{{template.name}}</option>
            </select>
            <div class="input-group-prepend">
              <div class="input-group-btn">
                <router-link tag="button" class="btn btn-primary btn-management" :to="{name: 'RatingTemplate'}">管理</router-link>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="evaluation">評価</label>
            <select class="form-control" v-model="selectedTemplate.rating" id="">
              <option v-for="(rate,index) in RATING_LIST" :key="index" :value="rate.value">{{rate.display}}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="comment">コメント</label>
            <textarea class="form-control" v-model="selectedTemplate.content" id="" cols="30" rows="5"></textarea>
          </div>
          <p>
            ※名前やメールアドレスなど、個人情報の入力は禁止です（評価は公開されます）。Y!オクの注意事項をよく読みご投稿ください。
          </p>
          <button class="btn btn-primary mt-20">評価を送信</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RatingTemplateApi from '@/services/RatingTemplateApi'
const RATING_LIST = [
  { value: 'veryGood', display: '非常に良い' },
  { value: 'good', display: '良い' },
  { value: 'normal', display: 'どちらでもない' },
  { value: 'bad', display: '悪い' },
  { value: 'veryBad', display: '非常に悪い' },
]
export default {
  name: 'YahooAuctionTradeRating',
  data () {
    return {
      postedRate: [1],
      RATING_LIST,
      templates: [],
      selectedTemplate: {
        rating: RATING_LIST[0],
        content: ''
      },
    }
  },
  async mounted () {
    this.getListRatingTemplate()
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
    yahooAccountId () {
      return this.selectedYahooAccount._id
    }
  },
  methods: {
    displayRating (rating) {
      return this.RATING_LIST.find(item => item.value === rating).display
    },
    async getListRatingTemplate() {
      try {
        let res = await RatingTemplateApi.get(this.yahooAccountId);
        if (res && res.status === 200) {
          this.templates = res.data.templates;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
  }
}
</script>

<style scoped>
.btn-management {
  height: calc(2.25rem + 2px);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.title {
  font-size: 20px;
  margin: 10px 0;
}
</style>
