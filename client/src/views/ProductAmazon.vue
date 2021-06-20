<template>
  <v-container>
    <v-card>
      <v-card-title>
        Product
        <v-spacer></v-spacer>
        <v-text-field
          style="max-width: 200px"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="listProduct"
        :search="search"
        :fixed-header="true"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div>
            <span>{{ item.name }}</span>
          </div>
        </template>
        <template v-slot:[`item.stt`]="{ item }">
          <span>{{ listProduct.indexOf(item) + 1 }}</span>
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <div class="py-1">
            <v-avatar rounded>
              <img :src="item.image" alt="error" style="object-fit: contain;" />
            </v-avatar>
          </div>
        </template>
        <template v-slot:[`item.created`]="{ item }">
          {{ $moment(item.created).format("DD/MM/YYYY") }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon size="18" class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="18" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import ProductAmazonApi from "../services/ProductAmazonApi";

// B08QWXW524
// B08VGLHTR1

export default {
  data() {
    return {
      asinString: "",
      listProduct: [],
      search: "",
      headers: [
        {
          text: "NO",
          value: "stt",
          class: "stt-table",
          align: "center"
        },
        { text: "Image", value: "image", class: "col-image-table" },
        { text: "Name", value: "name" },
        { text: "Price", value: "price", class: "col-image-table" },
        { text: "Delivery", value: "delivery", class: "col-delivery-table" },
        { text: "Count", value: "countProduct", class: "col-image-table" },
        { text: "Asin", value: "asin" },
        { text: "Created", value: "created" },
        { text: "Action", value: "actions", class: "col-image-table" }
      ]
    };
  },
  methods: {
    editItem() {},
    deleteItem() {},
    async getListProduct() {
      try {
        let res = await ProductAmazonApi.get();
        if (res && res.status === 200) {
          this.listProduct = res.data.listProduct;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Errror.!",
          text: error.message
        });
      }
    }
  },
  computed: {},
  mounted() {
    this.getListProduct();
  }
};
</script>

<style scoped>
.tab {
  font-size: 12px;
  font-weight: 500;
  color: #6777ef !important;
  text-transform: none;
}

.active-tab {
  background-color: #6777ef;
  color: #fff !important;
}

.active-table {
  background-color: red;
}
</style>
