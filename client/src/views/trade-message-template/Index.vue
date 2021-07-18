<template>
  <div class="wrapper-content">
    <div class="box-header">
      取引ナビテンプレート管理
      <button class="btn btn-add-account" @click="goToFormTradeMessageTemplate(0)">
        <i class="fa fa-plus"></i>  追加
      </button>
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 py-20">
        <paginate
          v-if="pageCount > 1"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'">
        </paginate>
        <div class="table-responsive">
          <table class="table table-striped display pt-20 mb-20" style="width: 100%">
            <thead class="thead-purple">
              <tr>
                <th scope="col">テンプレート名</th>
                <th scope="col">メッセージ内容</th>
                <th scope="col">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(template, index) in tableData" :key="template._id">
                <td>{{ template.name }}</td>
                <td style="white-space: pre;">{{ template.content }}</td>
                <td>
                  <button class="btn btn-md btn-warning mb-1 mr-1"
                    @click="goToFormTradeMessageTemplate(template._id)">
                    <i class="fa fa-edit"></i> 編集
                  </button>
                  <button class="btn btn-md btn-danger mb-1 mr-1" @click="onConfirmDelete(template, index)">
                    <i class="fa fa-trash"></i> 削除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TradeMessageTemplateApi from '@/services/TradeMessageTemplateApi'
import { mapGetters } from 'vuex'

export default {
  name: 'TradeMessageTemplateList',
  data () {
    return {
      templates: [],
      page: 1
    }
  },
  async mounted () {
    await this.getListTradeMessageTemplate();
  },
  computed: {
    tableData () {
      return this.templates.slice((this.page - 1) * this.$constants.PAGE_SIZE, this.page * this.$constants.PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.templates.length / this.$constants.PAGE_SIZE)
    },
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
    yahooAccountId () {
      return this.selectedYahooAccount._id
    }
  },
  methods: {
    async getListTradeMessageTemplate() {
      try {
        let res = await TradeMessageTemplateApi.get(this.yahooAccountId);
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
            let res = await TradeMessageTemplateApi.delete(template._id);
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
    goToFormTradeMessageTemplate (id) {
      this.$router.push({name: 'FormTradeMessageTemplate', params: {id} })
    },
  }
}
</script>

<style scoped>
table td {
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
