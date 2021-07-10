<template>
  <div class="wrapper-content">
    <div class="box-header">
      評価テンプレート管理
      <button class="btn btn-add-account" @click="goToFormRatingTemplate(0)">
        <i class="fa fa-plus"></i> 追加
      </button>
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 py-20">
        <table class="table table-striped display pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">テンプレート名</th>
              <th scope="col">評価</th>
              <th scope="col">コメント</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(template, index) in templates" :key="template._id">
              <td>{{ template.name }}</td>
              <td>{{ displayRating(template.rating) }}</td>
              <td style="white-space: pre;">{{ template.content }}</td>
              <td>
                <button class="btn btn-md btn-warning mb-1 mr-1"
                  @click="goToFormRatingTemplate(template._id)">
                  <i class="fa fa-edit"></i> 編集
                </button>
                <button class="btn btn-md btn-danger" @click="onConfirmDelete(template, index)">
                  <i class="fa fa-trash"></i> 削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import RatingTemplateApi from '@/services/RatingTemplateApi'
const RATING_LIST = [
  { value: 'veryGood', display: '非常に良い' },
  { value: 'good', display: '良い' },
  { value: 'normal', display: 'どちらでもない' },
  { value: 'bad', display: '悪い' },
  { value: 'veryBad', display: '非常に悪い' },
]
export default {
  name: 'RatingTemplateList',
  data () {
    return {
      templates: [],
      RATING_LIST
    }
  },
  async mounted () {
    await this.getListRatingTemplate();
  },
  methods: {
    displayRating (rating) {
      return this.RATING_LIST.find(item => item.value === rating).display
    },
    async getListRatingTemplate() {
      try {
        let res = await RatingTemplateApi.get();
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
    onConfirmDelete(template, index) {
      let self = this;
      self.$swal
        .fire({
          title: "削除",
          text: "本当にこれを削除しますか？",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00a65a",
          cancelButtonColor: "#f39c12",
          confirmButtonText: '<i class="fa fa-check-square"></i> はい',
          cancelButtonText: '<i class="fa fa-times"></i>  番号',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            let res = await RatingTemplateApi.delete(template._id);
            if (res && res.status == 200) {
              self.templates.splice(index, 1);
              self.$swal.fire(
                "削除しました！",
                "商品が削除されました。",
                "success"
              );
            }
          }
        });
    },
    goToFormRatingTemplate (id) {
      this.$router.push({name: 'FormRatingTemplate', params: {id} })
    },
  }
}
</script>

<style scoped>
</style>