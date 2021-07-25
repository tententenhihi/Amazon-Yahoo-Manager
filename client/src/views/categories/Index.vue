<template>
  <div class="wrapper-content">
    <div class="box-header">
      カテゴリ管理
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="title">
          <i class="fa fa-list"></i> 未設定カテゴリ一覧 <small><i>ヤフーカテゴリID未登録のデータのみを表示しています</i></small>
        </div>
        <p class="mb-10">
          <i>
            全ユーザ共通のカテゴリ管理ページになります。カテゴリを更新する場合は正確な値を入力してください
          </i>
        </p>
        <paginate
          v-if="pageCount > 1"
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :prev-text="'«'"
          :next-text="'»'"
          :container-class="'pagination'"
          :page-class="'page-item'">
        </paginate>
        <div class="table-responsive">
          <table class="table table-striped display pt-20 mb-20" style="width: 100%">
            <thead class="thead-purple">
              <tr>
                <th scope="col">アマゾンカテゴリID</th>
                <th scope="col">ヤフーカテゴリID</th>
                <th scope="col">ASIN</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category, index) in tableData" :key="index">
                <td>{{ category.amazon_cate_id }}</td>
                <td>
                  <input type="number" v-model="category.yahoo_cate_id" class="form-control" />
                </td>
                <td>{{ category.asin }}</td>
                <td>
                  <button class="btn btn-md btn-success" @click="onUpdateCategory(category)">
                    カテゴリを更新する
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
import CategoryApi from '@/services/CategoryApi'
import ProductYahooApi from '@/services/ProductYahooApi'

export default {
  name: 'Categories',
  data () {
    return {
      categories: [],
      page: 1,
      yahooAuctionCategory: null
    }
  },
  async mounted () {
    await this.getCategories();
  },
  computed: {
    tableData () {
      return this.categories.slice((this.page - 1) * this.$constants.PAGE_SIZE, this.page * this.$constants.PAGE_SIZE)
    },
    pageCount () {
      return Math.ceil(this.categories.length / this.$constants.PAGE_SIZE)
    },
  },
  methods: {
    async getCategories() {
      try {
        let res = await CategoryApi.get();
        if (res && res.status === 200) {
          this.categories = res.data.categories;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    async onUpdateCategory (category) {
      let resCheckCateYahoo = await ProductYahooApi.checkCategoryYahoo({
        category_id: category.yahoo_cate_id
      })
      if (resCheckCateYahoo && resCheckCateYahoo.status === 200 && resCheckCateYahoo.data.category ) {
        this.yahooAuctionCategory = resCheckCateYahoo.data.category
        let res = await CategoryApi.update(category);
        if (res && res.status == 200) {
          this.$swal.fire({
            icon: "success",
            title: "更新されました",
            timer: 500,
            showConfirmButton: false,
          });
        }
      } else {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: 'Vui lòng chính xác yahoo category'
        });
      }
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
.title {
  font-size: 16px;
}
</style>
