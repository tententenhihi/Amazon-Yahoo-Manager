<template>
  <div class="mx-20 mt-50">
    <div class="box-content">
      <div class="">
        <table id="historyTable" class="display pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">数</th>
              <th scope="col">グループID</th>
              <th scope="col">ASIN数</th>
              <th scope="col">商品情報を取得成功したASIN数</th>
              <th scope="col">で作成された</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(group, index) in listAsin" :key="group._id + '-' + index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ group.groupId }}</td>
              <td>{{ group.countAsin }}</td>
              <td>{{ group.countAsinGetProductSuccess }}</td>
              <td>{{ group.created }}</td>
              <td>
                <button class="btn btn-outline-info mr-2" @click="openDetailGroup(group)">
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
        {{ selectedGroup.groupId }}
      </template>
      <template>
        <table class="table">
          <thead>
            <tr>
              <th>コード</th>
              <th>状態</th>
              <th>メッセージ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(asin, index) in selectedGroup.asins" :key="asin.code + '-' + index">
              <td>{{ asin.code }}</td>
              <td :class="asin.isProductGeted ? 'status-success' : 'status-fail' ">{{ asin.status }}</td>
              <td>{{ asin.statusMessage  }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:button>
        <button class="btn btn-warning" @click="$refs.modalDetalGroup.closeModal()">
          <i class="fa fa-times"></i> キャンセル
        </button>
      </template>
    </modal-component>
  </div>
</template>

<script>
export default {
  name: 'HistoryAsin',
  props: ["listAsin"],
  data () {
    return {
      selectedGroup: {}
    }
  },
  mounted () {
  },
  methods: {
    openDetailGroup (group) {
      this.selectedGroup = group;
      this.$refs.modalDetalGroup.openModal();
    }
  },
  watch: {
    listAsin () {
      let self = this;
      self.$nextTick(() => {
        if (self.$("#historyTable").DataTable()) {
          self.$("#historyTable").DataTable().destroy();
        }
        self.$("#historyTable").DataTable({});
      });
    }
  }
}
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