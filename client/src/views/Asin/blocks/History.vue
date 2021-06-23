<template>
  <div class="mx-20 mt-50">
    <div class="box-content">
      <div class="">
        <table id="historyTable" class="display pt-20 mb-20" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Group ID</th>
              <th scope="col">Count Asin</th>
              <th scope="col">Count Asin Geted Product</th>
              <th scope="col">Created At</th>
              <th scope="col">Action</th>
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
                  <i class="fa fa-list"></i> Detail
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
              <th>Code</th>
              <th>Status</th>
              <th>Message</th>
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
          <i class="fa fa-times"></i> Cancel
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
      console.log('vao day', this.listAsin);
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