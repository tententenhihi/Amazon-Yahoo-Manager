<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Yahoo Action Selling
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 py-20">
        <table id="productTable" class="display pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">数</th>
              <th scope="col">製品ID</th>
              <th scope="col">名前</th>
              <th scope="col">価格</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ product.product_id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.current_price }}</td>
              <td>
                <!-- <button class="btn btn-md btn-warning mb-1 mr-1">
                  <i class="fa fa-edit"></i> 編集
                </button> -->
                <!-- <button class="btn btn-md btn-danger">
                  <i class="fa fa-trash"></i> Delete
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ProductAuctionApi from '@/services/ProductAuctionApi'
export default {
  name: 'ProductList',
  data () {
    return {
      products: []
    }
  },
  async mounted () {
    await this.getListProduct();
    this.createDatatable()
  },
  methods: {
    async getListProduct() {
      try {
        let res = await ProductAuctionApi.get();
        if (res && res.status === 200) {
          this.products = res.data.products;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    createDatatable () {
      let self = this;
      if (self.$("#productTable").DataTable()) {
        self.$("#productTable").DataTable().destroy();
      }
      self.$nextTick(() => {
        self.$("#productTable").DataTable({});
      });
    },
  }
}
</script>

<style scoped>
</style>
