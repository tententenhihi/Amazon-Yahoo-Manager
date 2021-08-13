<template>
  <div class="wrapper-content">
    <div class="box-header"><i class="fa fa-edit mr-2"></i>商品追加</div>
    <hr />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="form-row">
          <div class="col-md-10 col-12">
            <div
              class="row"
              v-for="(image, index) in this.imageInsertion.images"
              :key="index"
            >
              <div class="col-5 text-align-end">
                商品画像 : <br />
                <small>
                  (挿入画像は5枚まで可能/アップロードは1回につき全画像合計20Mまで)
                </small>
              </div>
              <div class="col-7 product-image">
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  class="ml-2 d-none"
                  :ref="'inputImage-' + index"
                  @change="onUploadImage(index)"
                />
                <img
                  :src="
                    image ? image : require('@/assets/images/no_product.png')
                  "
                  :id="`image_${index}_preview`"
                  @click="onClickReUploadImage(index)"
                  style="width:200px; border:1px solid #d2d6de"
                />
                <i
                  class="fa fa-times image_icon_remove"
                  @click="onRemoveImage(index)"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-20 justify-content-center">
          <button
            class="btn btn-success mb-1 mr-1 px-4"
            @click="onSaveImages()"
          >
            <i class="fa fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageInsertionApi from "@/services/ImageInsertionApi";
import { mapGetters } from "vuex";

export default {
  name: "ImageInsertion",
  data() {
    return {
      imageInsertion: {},
      SERVER_HOST_UPLOAD: process.env.SERVER_API + "uploads/",
      files: []
    };
  },
  async mounted() {
    await this.getImageInsertion();
    this.isInit = true;
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      adminViewUser: "getAdminViewUser"
    }),
    yahooAccountId() {
      return this.selectedYahooAccount._id;
    }
  },
  methods: {
    async getImageInsertion() {
      let res = await ImageInsertionApi.get(this.yahooAccountId);
      if (res && res.status == 200) {
        this.imageInsertion = res.data.imageInsertion;
        this.imageInsertion.images = this.imageInsertion.images.map(image => {
          return this.SERVER_HOST_UPLOAD + image;
        });
        this.files = this.imageInsertion.images.map(item => "");
      }
    },
    onUploadImage(index) {
      let file = this.$refs[`inputImage-${index}`][0].files[0];
      if (file) {
        this.files[index] = file;
        this.imageInsertion.images[index] = URL.createObjectURL(file);
        this.imageInsertion = { ...this.imageInsertion };
      }
    },
    onClickReUploadImage(index) {
      this.$refs["inputImage-" + index][0].click();
    },
    onRemoveImage(index) {
      this.imageInsertion.images[index] = "";
      this.imageInsertion = { ...this.imageInsertion };
    },
    async onSaveImages() {
      let formData = new FormData();
      let payload = {
        ...this.imageInsertion,
        images: this.imageInsertion.images.map(item =>
          item.replace(this.SERVER_HOST_UPLOAD, "")
        )
      };
      formData.append("payload", JSON.stringify(payload));
      for (let index = 0; index < this.imageInsertion.images.length; index++) {
        if (this.files[index]) {
          formData.append(`image-${index}`, this.files[index]);
        }
      }
      let result = await ImageInsertionApi.update(formData);
      if (result && result.status === 200) {
        this.$swal.fire("成功", "更新が成功しました", "success");
      }
    }
  }
};
</script>

<style scoped>
.row {
  margin: 10px 0;
}
.product-image {
  position: relative;
}
.image_icon_remove {
  position: absolute;
  top: 5px;
  left: 188px;
  font-size: 22px;
  cursor: pointer;
}
</style>
