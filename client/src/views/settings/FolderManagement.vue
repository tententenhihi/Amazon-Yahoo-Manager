<template>
  <div class="wrapper-content">
    <div class="box-header">
      フォルダ管理
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-50 py-20">
        <div class="d-flex my-20">
          <input type="text" v-model="name" class="form-control col-8 col-lg-4 col-xl-3">
          <button class="btn btn-primary ml-10" @click="addFolder">確認</button>
        </div>
        <div style="max-width: 600px; width:100%">
          <ul class="list-group">
            <draggable v-model="folders" class="folder-list" :options="{disabled : disableDraggable}" @end="onEndDragFolder">
              <li class="list-group-item" v-for="(folder, index) in folders" :key="folder._id">
                <input type="checkbox" :id="folder._id" v-model="selectedFolder" :value="folder">
                <label :for="folder._id" style="height: 36px; line-height: 36px; font-size: 14px">
                  <span v-if="!folder.isEdit">
                    {{ folder.name }} ({{totalProductOfFolder(folder)}})
                  </span>
                  <input v-else type="text" v-model="folder.name" class="form-control" style="padding: 5px">
                </label>
                <div class=group-button>
                  <button class="btn btn-outline-info" v-if="!folder.isEdit" @click="onEditFolder(folder, index)">Edit</button>
                  <template v-if="folder.isEdit">
                    <button class="btn btn-outline-success" @click="onSaveFolder(folder, index)">Save</button>
                    <button class="btn btn-outline-warning" @click="onCancelEditFolder()">Cancel</button>
                  </template>
                </div>
              </li>
            </draggable>
          </ul>
          <div v-if="folders.length">
            選択フォルダの出品予定
            <select v-model="destinationFolder" class="form-control" style="display: unset; width: 175px">
              <option value="">フォルダーを選択</option>
              <option v-for="(folder, index) in folders" :value="folder._id" :key="index">{{folder.name}}</option>
            </select>
            に
            <button class="btn btn-info mb-1" @click="moveProductToFolder">移動</button>
          </div>
          <button v-if="folders.length" class="btn btn-danger mb-1" @click="onDeleteFolder">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import FolderApi from '@/services/FolderApi'
import { mapGetters } from 'vuex'
export default {
  name: 'FolderManagement',
  data () {
    return {
      name: '',
      folders: [],
      disableDraggable: false,
      selectedFolder: [],
      destinationFolder: ''
    }
  },
  components: {
    draggable
  },
  async mounted () {
    this.getFolders();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: 'getSelectedYahooAccount'
    }),
  },
  beforeDestroy () {
    localStorage.removeItem('folders')
  },
  methods: {
    async getFolders () {
      let res = await FolderApi.get(this.selectedYahooAccount._id);
      if (res && res.status === 200) {
        this.folders = res.data.folders
        localStorage.setItem('folders', JSON.stringify(this.folders))
      }
    },
    async addFolder () {
      let res = await FolderApi.create({name: this.name, yahoo_account_id: this.selectedYahooAccount._id})
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "フォルダの追加が成功しました",
          timer: 500,
          showConfirmButton: false,
        });
        this.folders.push({...res.data.folder, productamazons: [], productyahoos: []})
        localStorage.setItem('folders', JSON.stringify(this.folders))
        this.name = ''
      }
    },
    onEditFolder (folder, index) {
      folder.isEdit = true
      this.folders[index] = {...folder}
      this.folders = [...this.folders]
      this.disableDraggable = true
    },
    async onCancelEditFolder () {
      this.folders = JSON.parse(localStorage.getItem('folders'))
      this.disableDraggable = false
    },
    async onSaveFolder (folder, index) {
      let res = await FolderApi.update(folder)
      if (res && res.status === 200) {
        this.folders[index] = {...this.folders[index], ...res.data};
        this.folders[index].isEdit = false
        this.folders = [...this.folders]
      }
      this.disableDraggable = false
    },
    async onEndDragFolder () {
      if (JSON.stringify(this.folders) !== localStorage.getItem('folders')) {
        let res = await FolderApi.sort({folders: this.folders})
        if (res && res.status === 200) {
          this.$swal.fire({
            icon: "success",
            title: "フォルダの順番変更が成功しました",
            timer: 500,
            showConfirmButton: false,
          });
          localStorage.setItem('folders', JSON.stringify(this.folders))
        }
      }
    },
    async onDeleteFolder () {
      if (this.selectedFolder.length) {
        let res = await FolderApi.delete({folders: this.selectedFolder})
        if (res && res.status === 200) {
          this.$swal.fire({
            icon: "success",
            title: "フォルダの削除が成功しました",
            timer: 500,
            showConfirmButton: false,
          });
          for (let index = 0; index < this.selectedFolder.length; index++) {
            const element = this.selectedFolder[index];
            let findIndex = this.folders.findIndex(item => item._id === element._id)
            this.folders.splice(findIndex, 1)
            localStorage.setItem('folders', JSON.stringify(this.folders))
          }
          this.selectedFolder = []
        }
      }
    },
    totalProductOfFolder (folder) {
      return folder.productyahoos.length;
    },
    async moveProductToFolder () {
      if (this.selectedFolder.length === 0 || !this.destinationFolder) {
        this.$swal.fire({
          icon: "warning",
          title: " フォルダ元とフォルダ先を選択してください",
        });
      } else {
        let params = {
          folder_ids: this.selectedFolder.map(item => item._id),
          destination_folder: this.destinationFolder
        }
        let res = await FolderApi.move(params)
        if (res && res.status == 200) {
          this.$swal.fire({
            icon: "success",
            title: "フォルダ移動が完了しました",
            timer: 500,
            showConfirmButton: false,
          });
          this.getFolders()
          this.selectedFolder = []
        }
      }
    }
  }
}
</script>

<style scoped>
.folder-list {
  margin: 10px 0;
  width: 100%;
  max-width: 400px;
  max-height: 400px;
  overflow: auto;
}
.group-button {
  position: absolute;
  top: 15px;
  right: 10px;
}
.group-button .btn {
  padding: 4px 5px;
}
</style>
