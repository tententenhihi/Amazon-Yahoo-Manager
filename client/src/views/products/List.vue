<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Product List
      <button class="btn btn-add-account" @click="goToFormProduct(0)">
        <i class="fa fa-plus"></i> Add Product
      </button>
    </div>
    <div class="csv-button ml-20">
      <button class="btn btn-outline-info mr-1 mb-1" @click="$refs.importCSV.click()">Import CSV</button>
      <input type="file" hidden ref="importCSV" accept=".csv" name="" @change="onChangeFileCSV">
      <button class="btn btn-outline-primary mb-1" @click="onClickExportCSV">Export CSV</button>
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
                <button class="btn btn-md btn-warning mb-1 mr-1" @click="goToFormProduct(product._id)">
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
            let res = await ProductAmazonApi.delete(product._id);
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
    goToFormProduct (id) {
      this.$router.push({name: 'FormProduct', params: {id} })
    },
    onChangeFileCSV (event) {
      try {
        let file = event.target.files[0];
        let reader = new FileReader();
        let self = this
        reader.onload = async function(e) {
          let arrLines = e.target.result.split('\n');
          let contentCsv = arrLines.slice(1, arrLines.length)
          let productList = [];
          contentCsv.forEach(line => {
            if (line.trim().replaceAll(',', '').replace('\r', '').replace('\n', '')) {
              let pros = line.trim().split('","');
              productList.push({
                asin: pros[0],
                name: pros[1],
                url: pros[2],
                price: pros[3],
                countProduct: parseInt(pros[4]),
                delivery: pros[5],
                type: pros[6],
                status: pros[7],
                image: pros[8],
              })
            }
          });
          let result = await ProductAmazonApi.createByCsv(productList);
          if (result && result.status === 200) {
            self.$swal.fire(
              "Successful!",
              "Your product has been updated.",
              "success"
            );
            self.products = self.products.concat(result.data.products)
            self.createDatatable()
          }
        };
        reader.readAsText(file);

        event.target.value = "";
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Errror.!",
          text: error.message
        });
      }
    },
    onClickExportCSV () {
      let data = []
      data.push([
        'Asin"',
        '"Name"',
        '"Url"',
        '"Price"',
        '"Count Product"',
        '"Delivery"',
        '"Type"',
        '"Status"',
        '"Image"',
        '"Created At"',
      ])
      this.products.map((product) => {
        let item = [
          product.asin + '"',
          '"' + product.name + '"',
          '"' + product.url + '"',
          '"' + product.price + '"',
          '"' + product.countProduct + '"',
          '"' + product.delivery + '"',
          '"' + product.type + '"',
          '"' + product.status + '"',
          '"' + product.image + '"',
          '"' + this.$moment(product.created).format("YYYY/MM/DD") + '"',
        ]
        data.push(item)
      })
      this.$helpers.exportToCSV(data)
    },
  }
}
</script>

<style scoped>
</style>
