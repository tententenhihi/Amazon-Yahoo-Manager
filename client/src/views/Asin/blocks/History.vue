<template>
  <div class="mx-20 mt-30">
    <div class="box-content">
      <div class="">
        <div class="row" style="display: flex; justify-content: space-between;">
          <paginate
            v-if="pageCount > 1"
            v-model="page"
            :page-count="pageCount"
            :page-range="3"
            :margin-pages="2"
            :prev-text="'«'"
            :next-text="'»'"
            :container-class="'pagination'"
            :page-class="'page-item'"
          >
          </paginate>

          <button
            :disabled="!selectedProducts.length"
            @click="$refs.modalDeleteProduct.openModal()"
            class="btn btn-danger mx-5 px-4 my-2"
          >
            <i class="far fa-trash-alt mr-1"></i> 削除
          </button>
        </div>

        <table
          id="historyTable"
          class="table table-responive table-striped pt-20 mb-20"
          style="width: 100%"
        >
          <thead class="thead-purple">
            <tr>
              <th class="text-center">
                <input
                  v-model="isCheckAllProduct"
                  type="checkbox"
                  style="cursor: pointer; width: 15px; height: 15px;"
                />
              </th>
              <th scope="col">数</th>
              <th scope="col">ヤフーID</th>
              <th class="text-center" scope="col">ASIN数</th>
              <th class="text-center" scope="col">
                商品情報を取得成功したASIN数
              </th>
              <th class="text-center" scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(group, index) in tableData"
              :key="group._id + '-' + index"
            >
              <td class="text-center" width="50">
                <!-- <div
                  style="cursor: pointer; height: 50px; display: flex; justify-content: center; align-items: center;"
                  @click="$refs.checkBox.click()"
                > -->

                <input
                  type="checkbox"
                  style="cursor: pointer; width: 15px; height: 15px;"
                  v-model="selectedProducts"
                  :value="group"
                  :id="group.query_key"
                />
                <!-- </div> -->
              </td>
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ group.yahoo_id }}</td>
              <td class="text-center">{{ group.countAsin }}</td>
              <td class="text-center">
                {{ group.countAsinGetProductSuccess }}
              </td>
              <td class="text-center">
                <button
                  class="btn btn-outline-info mr-2"
                  @click="openDetailGroup(group)"
                >
                  <i class="fa fa-list"></i> 詳細
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <modal-component ref="modalDetalGroup">
      <template v-slot:header>
        {{ selectedGroup.yahoo_id }}
      </template>
      <template>
        <div style=" overflow-y: scroll; max-height: 500px; ">
          <table class="table">
            <thead>
              <tr>
                <th>コード</th>
                <th>状態</th>
                <th>メッセージ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(asin, index) in selectedGroup.asins"
                :key="asin.code + '-' + index"
              >
                <td>{{ asin.code }}</td>
                <td :class="asin.status ? 'status-success' : 'status-fail'">
                  {{ asin.status }}
                </td>
                <td>{{ asin.statusMessage }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-slot:button>
        <button
          class="btn btn-warning"
          @click="$refs.modalDetalGroup.closeModal()"
        >
          <i class="fa fa-times"></i> キャンセル
        </button>
      </template>
    </modal-component>

    <modal-component ref="modalDeleteProduct" :isModalBody="false">
      <template v-slot:header>
        <h5>ASINを除外しますか？</h5>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-primary mr-1" @click="onDeleteMultipleProduct">
            移動
          </button>
          <button class="btn btn-default" @click="onCloseModal">
            キャンセル
          </button>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import asinApi from "../../../services/asinApi";
const PAGE_SIZE = 10;

export default {
  name: "HistoryAsin",
  props: ["listAsin"],
  data() {
    return {
      groupSelected: [],
      selectedGroup: {},
      page: 1,
      isCheckAllProduct: false,
      selectedProducts: []
    };
  },
  computed: {
    tableData() {
      return this.listAsin.slice(
        (this.page - 1) * PAGE_SIZE,
        this.page * PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.listAsin.length / PAGE_SIZE);
    }
  },
  methods: {
    onCloseModal() {
      this.$refs.modalDeleteProduct.closeModal();
    },

    openDetailGroup(group) {
      this.selectedGroup = group;
      this.$refs.modalDetalGroup.openModal();
    },

    async onDeleteMultipleProduct() {
      let params = {
        query_keys: this.selectedProducts.map(item => item.query_key)
      };
      let res = await asinApi.deleteMulti(params);
      if (res && res.status === 200) {
        this.isCheckAllProduct = false;
        this.selectedProducts = [];
        this.$emit("deleteAsin", params);
        this.onCloseModal();
        this.$swal.fire({
          icon: "success",
          title: "取扱商品フォルダの設定を行いました。"
        });
        if (this.tableData.length === 0) {
          this.page -= 1;
        }
      }
    }
  },
  watch: {
    isCheckAllProduct() {
      if (this.isCheckAllProduct) {
        this.selectedProducts = [...this.tableData];
      } else {
        this.selectedProducts = [];
      }
    }
  }
};
</script>

<style scoped>
.status-fail {
  font-weight: bold;
  color: red;
}
.status-success {
  font-weight: bold;
  color: green;
}
</style>
