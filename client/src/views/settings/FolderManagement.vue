<template>
  <div class="wrapper-content">
    <div class="box-header">
      Folder Management
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 py-20">
        <div class="row my-20">
          <div class="col-md-4">
            <input type="text" v-model="name" class="form-control">
          </div>
          <button class="btn btn-primary" @click="addFolder">Add folder</button>
        </div>
        <div style="width: 600px">
          <button class="btn btn-info mb-1">Sort</button>
          <button class="btn btn-info mb-1">Cancel</button>
          <draggable v-model="folders">
            <transition-group>
              <div v-for="(folder, index) in folders" :key="index">
                {{folder.name}}
              </div>
            </transition-group>
          </draggable>
          <div>
            選択フォルダの出品予定
            <select name="" id="" class="form-control" style="display: unset; width: 40%">
              <option value="1">12</option>
            </select>
            に
            <button class="btn btn-info mb-1">Move</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import FolderApi from '@/services/FolderApi'
export default {
  name: 'FolderManagement',
  data () {
    return {
      name: '',
      folders: []
    }
  },
  components: {
    draggable
  },
  async mounted () {
    this.getFolders();
  },
  computed: {
    sortFolder () {

    }
  },
  methods: {
    async getFolders () {
      let res = await FolderApi.get();
      if (res && res.status === 200) {
        this.folders = res.data.folders
      }
    },
    async addFolder () {
      let res = await FolderApi.create({name: this.name})
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "Add folder successfully",
        });
        this.folders.push(res.data.folder)
      }
    }
  }
}
</script>

<style scoped>
</style>
