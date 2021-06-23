<template>
  <div class="wrapper-content">
    <div class="box-header">
        <i class="fa fa-list mr-2"></i>Product List
        <button
          class="btn btn-add-account"
        >
          <i class="fa fa-plus"></i> Add Product
        </button>
      </div>
      <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 py-20">
        <table id="productTable" class="display pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Delivery</th>
              <th scope="col">Count</th>
              <th scope="col">Asin</th>
              <th scope="col">Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <img :src="product.image" alt="">
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.delivery }}</td>
              <td>{{ product.countProduct }}</td>
              <td>{{ product.asin }}</td>
              <td>{{ product.created }}</td>
              <td>
                <button class="btn btn-md btn-warning mb-1 mr-1">
                  <i class="fa fa-edit"></i> Edit
                </button>
                <button class="btn btn-md btn-danger" @click="onConfirmDelete(product, index)">
                  <i class="fa fa-trash"></i> Delete
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
import ProductAmazonApi from '@/services/ProductAmazonApi'
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
        let res = await ProductAmazonApi.get();
        if (res && res.status === 200) {
          this.products = res.data.listProduct;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Errror.!",
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
    onConfirmDelete(product, index) {
      let self = this;
      self.$swal
        .fire({
          title: "Delete",
          text: "Do you really want to remove this product?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00a65a",
          cancelButtonColor: "#f39c12",
          confirmButtonText: '<i class="fa fa-check-square"></i> Yes',
          cancelButtonText: '<i class="fa fa-times"></i>  No',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            let res = await ProductAmazonApi.delete(product);
            if (res && res.status == 200) {
              self.products.splice(index, 1);
              this.createDatatable()
              self.$swal.fire(
                "Deleted!",
                "Your product has been deleted.",
                "success"
              );
            }
          }
        });
    },
  }
}
</script>

<style scoped>

</style>