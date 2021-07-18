<template>
  <div class="wrapper-content" v-if="isInit">
    <div class="box-header">
      <i class="fa fa-edit mr-2"></i>{{ productId ? 'Edit product' : 'Add new product'}}
    </div>
    <hr />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="asin">ASIN</label>
            <input type="text" class="form-control" id="asin" v-model="product.asin" placeholder="Asin">
          </div>
          <div class="form-group col-md-6">
            <label for="name">名前</label>
            <input type="text" class="form-control" id="name" v-model="product.name" placeholder="Name">
          </div>
          <div class="form-group col-md-6">
            <label for="url">URL</label>
            <input type="text" class="form-control" id="url" v-model="product.url" placeholder="Url">
          </div>
          <div class="form-group col-md-6">
            <label for="price">価格(¥)</label>
            <input type="number" class="form-control" id="price" v-model="product.price" placeholder="Price">
          </div>
          <div class="form-group col-md-6">
            <label for="countProduct">製品を数える</label>
            <input type="number" class="form-control" id="countProduct" v-model="product.countProduct" placeholder="Count product">
          </div>
          <div class="form-group col-md-6">
            <label for="delivery">配達</label>
            <input type="text" class="form-control" id="delivery" v-model="product.delivery" placeholder="Delivery">
          </div>
          <div class="form-group col-md-6">
            <label for="type">Folder</label>
            <select id="type" class="form-control" v-model="product.folder_id">
              <template v-for="(folder, index) in folders">
                <option :value="folder._id" :key="index">{{folder.name}}</option>
              </template>
            </select>
          </div>
          <div class="form-group col-md-6">
          </div>
          <!-- <div class="form-group col-md-6">
            <label for="type">タイプ</label>
            <select id="type" class="form-control" v-model="product.type">
              <template v-for="(type, index) in $constants.PRODUCT_TYPE">
                <option :value="type" :key="index">{{type}}</option>
              </template>
            </select>
          </div>
          <div class="form-group col-md-6">
            <label for="status">状態</label>
            <select id="status" class="form-control" v-model="product.status">
              <template v-for="(status, index) in $constants.PRODUCT_STATUS">
                <option :value="status" :key="index">{{status}}</option>
              </template>
            </select>
          </div> -->
          <div class="form-group col-md-6">
            <label for="status">Description</label>
            <textarea v-model="product.description" class="form-control" cols="30" rows="5"></textarea>
          </div>
          <div class="col-md-6"></div>
          <div class="form-group col-md-6">
            <label for="image">画像</label>
            <input type="file" class="form-control" id="image" multiple ref="imageProduct" @change="onUploadImage">
          </div>
          <div class="row mb-20 images">
            <template v-for="(image, index) in previewImages">
              <div class="col-md-3 image-item" :key="index">
                <img :src="image.preview_url" alt="">
                <i class="fa fa-times image_icon_remove" @click="onRemoveImage(index)"></i>
              </div>
            </template>
          </div>
        </div>
        <!-- <label for="name" class="form-row">
          情報詳細 <button class="btn btn-primary btn-add-info ml-2 mb-2" @click="addNewInfoDetail()">+</button>
        </label>
        <template v-for="(info, index) in product.infoDetail">
          <div class="row my-1" :key="index">
            <div class="col-md-4">
              <input type="text" class="form-control" v-model="info.name" placeholder="Name">
            </div>
            <div class="col-md-4">
              <input type="text" class="form-control" v-model="info.value" placeholder="Value">
            </div>
            <div class="col-md-4">
              <button class="btn btn-warning" @click="deleteInfoDetail(index)">x</button>
            </div>
          </div>
        </template> -->
        <div class="row mt-20">
          <button class="btn btn-success mb-1 mr-1" @click="onSaveProduct()">
            セーブ
          </button>
          <router-link :to="{name: 'Products'}" tag="button" class="btn btn-warning mb-1">キャンセル</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductAmazonApi from '@/services/ProductAmazonApi'
import FolderApi from '@/services/FolderApi'
import { mapGetters } from 'vuex';
export default {
  name: 'FormProduct',
  data () {
    return {
      product: {
        asin: '',
        name: '',
        url: '',
        price: '',
        countProduct: '',
        delivery: '',
        type: this.$constants.PRODUCT_TYPE[0],
        status: this.$constants.PRODUCT_STATUS[0],
        image: '',
        infoDetail: [],
        description: ''
      },
      previewImages: [],
      folders: [],
      isInit: false,
    }
  },
  async mounted () {
    this.getFolders();
    if (this.productId != 0) {
      let result = await ProductAmazonApi.show({_id: this.productId})
      if (result && result.status === 200) {
        this.product = result.data
        if (this.product.yahoo_account_id !== this.yahooAccountId) {
          this.$router.push({name: 'Products'})
        }
        this.previewImages = this.product.images.map(item => {
          return {
            preview_url: item.includes('http') ? item : process.env.SERVER_API + 'uploads/' + item
          }
        })
      } else {
        this.$router.push({name: 'Products'})
      }
    }
    this.isInit = true
  },
  computed: {
    productId () {
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
    async getFolders () {
      let res = await FolderApi.get(this.yahooAccountId);
      if (res && res.status == 200) {
        this.folders = res.data.folders
      }
    },
    addNewInfoDetail () {
      this.product.infoDetail.push({
        name: '',
        value: ''
      })
    },
    deleteInfoDetail (index) {
      this.product.infoDetail.splice(index, 1)
    },
    onUploadImage (e) {
      let self = this;
      const images = e.target.files;
      console.log(images);
      for (let index = 0; index < images.length; index++) {
        const ele = images[index];
        let reader = new FileReader();
        reader.readAsDataURL(ele);
        reader.onload = event =>{
          self.previewImages.push({
            file: ele,
            preview_url: event.target.result
          });
        };
      }
    },
    onRemoveImage (index) {
      this.previewImages.splice(index, 1);
    },
    async onSaveProduct () {
      this.product.yahoo_account_id = this.selectedYahooAccount._id
      this.product.image_length = this.previewImages.length
      let formData = new FormData();
      formData.append('payload', JSON.stringify(this.product));
      for (let index = 0; index < this.product.image_length; index++) {
        formData.append(`image-${index}`, this.previewImages[index].file)
      }
      let result = null
      if (this.productId == 0) {
        result = await ProductAmazonApi.create(formData)
      } else {
        result = await ProductAmazonApi.update(this.productId, formData)
      }
      if (result && result.status === 200) {
        this.$swal.fire(
          "成功",
          "製品が更新されました。",
          "success"
        );
        this.$router.push({name: 'Products'})
      }
    }
  }
}
</script>

<style scoped>
.btn-add-info {
  width: 26px;
  padding: 0;
}
.images {
  position: relative;
  display: flex;
}

.image_icon_remove {
  position: absolute;
  top: 0;
  right: 30px;
  font-size: 22px;
}
</style>
