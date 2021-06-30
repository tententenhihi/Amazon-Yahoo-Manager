<template>
  <div>
    <div class="wrapper-content">
      <div class="box-header">
        <i class="fa fa-list mr-2"></i>アカウント一覧
        <button
          class="btn btn-add-account"
          @click="onOpenModalAccount(account)"
        >
          <i class="fa fa-plus"></i> アカウントを追加
        </button>
      </div>
      <hr class="mt-10" />
      <div class="box-content">
        <div class="px-30 py-20">
          <table id="accountTable" class="display pt-20 mb-20" style="width: 100%">
            <thead class="thead-purple">
              <tr>
                <th scope="col">No</th>
                <th scope="col">名前</th>
                <th scope="col">Yahoo! オークID</th>
                <th scope="col">ステータス</th>
                <th scope="col">Status</th>
                <th scope="col">Status Message</th>
                <th scope="col">変更</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in accounts" :key="account._id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ account.name }}</td>
                <td>{{ account.yahoo_id }}</td>
                <td>
                  <div v-if="account.cookies_auction.length > 4">
                    認証
                    <!-- <button class="btn btn-sm btn-info">再認証</button> -->
                  </div>
                  <div v-else style="color:red">
                    認証未
                  </div>
                </td>
                <td>{{ account.status }}</td>
                <td>{{ account.statusMessage }}</td>
                <td>
                  <button
                    class="btn btn-md btn-warning mb-1"
                    @click="onOpenModalAccount(account, index)"
                  >
                    <i class="fa fa-edit"></i> 修正
                  </button>
                  <br />
                  <button
                    class="btn btn-md btn-danger"
                    @click="onConfirmDeleteAccount(account, index)"
                  >
                    <i class="fa fa-trash"></i> 削除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <modal-component ref="modalInfoAccount">
      <template v-slot:header>
        <h5><i class="fa fa-user-plus"></i> 新規アカウント</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">番号: </label>
          <div class="col-sm-7">
            <div class="form-control">{{ qtyAccount + 1 }}</div>
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">名前: </label>
          <div class="col-sm-7">
            <input type="text" class="form-control" v-model="name" id="name" />
            <!-- 名前は必須です。 -->
            <!-- 名前の長さは64です。 -->
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-12 control-label">Yahooヤフーオークの情報</label>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">Yahoo ID: </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control input-sm"
              v-model="yahooId"
              id="yahoo_id"
            />
            <!-- Yahoo IDの長さは64です。 -->
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">パスワード: </label>
          <div class="col-sm-7">
            <input
              type="password"
              class="form-control input-sm"
              v-model="password"
              id="yahoo_password"
            />
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-2" @click="onSaveAccount">
            <i class="fa fa-save"></i> セーブ
          </button>
          <button class="btn btn-warning" @click="onCloseModal">
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import YahooAccountApi from "@/services/YahooAccountApi";
export default {
  name: "YahooAccounts",
  data() {
    return {
      accounts: [],
      account: {
        name: "",
        yahoo_id: "",
        password: "",
      },
      name: "",
      yahooId: "",
      password: "",
      editId: "",
      tableAccount: null,
    };
  },
  async mounted() {
    await this.getListAccount();
    this.createDatatable()
  },
  computed: {
    qtyAccount() {
      return this.accounts.length;
    },
  },
  methods: {
    createDatatable () {
      let self = this;
      if (self.$("#accountTable").DataTable()) {
        self.$("#accountTable").DataTable().destroy();
      }
      self.$nextTick(() => {
        self.$("#accountTable").DataTable({
          initComplete: function() {
            $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
          },
          language: {
            sEmptyTable: "テーブルにデータがありません",
            sInfo: " _TOTAL_ 件中 _START_ から _END_ まで表示",
            sInfoEmpty: " 0 件中 0 から 0 まで表示",
            sInfoFiltered: "（全 _MAX_ 件より抽出）",
            sInfoThousands: ",",
            sLengthMenu: "_MENU_ 件表示",
            sLoadingRecords: "読み込み中...",
            sProcessing: "処理中...",
            sSearch: "検索:",
            sZeroRecords: "一致するレコードがありません",
            oPaginate: {
              sFirst: "先頭",
              sLast: "最終",
              sNext: "次",
              sPrevious: "前",
            },
            oAria: {
              sSortAscending: ": 列を昇順に並べ替えるにはアクティブにする",
              sSortDescending: ": 列を降順に並べ替えるにはアクティブにする",
            },
          },
        });
      });
    },
    onCloseModal() {
      this.$refs.modalInfoAccount.closeModal();
      this.name = "";
      this.yahooId = "";
      this.password = "";
      this.editId = "";
    },
    async getListAccount() {
      let result = await YahooAccountApi.get();
      if (result && result.status === 200) {
        this.accounts = result.data.accounts || [];
      }
    },
    onOpenModalAccount(account) {
      this.name = account.name;
      this.yahooId = account.yahoo_id;
      this.password = account.password;
      this.editId = account._id;
      this.$refs.modalInfoAccount.openModal();
    },
    async onSaveAccount() {
      let credential = {
        name: this.name,
        yahoo_id: this.yahooId,
        password: this.password,
      };
      if (this.editId) {
        credential._id = this.editId;
        let result = await YahooAccountApi.update(credential);
        if (result && result.status === 200) {
          this.onCloseModal();
          let index = this.accounts.findIndex(
            (account) => account._id === result.data._id
          );
          this.accounts[index] = result.data;
          this.createDatatable()
        }
      } else {
        let result = await YahooAccountApi.create(credential);
        if (result && result.status === 200) {
          this.onCloseModal();
          this.accounts.push(result.data);
          this.createDatatable()
        }
      }
    },
    onConfirmDeleteAccount(account, index) {
      let self = this;
      self.$swal
        .fire({
          title: "警告",
          text: "あなたは本当にこのユーザを削除したいですか？",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00a65a",
          cancelButtonColor: "#f39c12",
          confirmButtonText: '<i class="fa fa-check-square"></i> はい',
          cancelButtonText: '<i class="fa fa-times"></i>  キャンセル',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            let res = await YahooAccountApi.delete(account);
            if (res && res.status == 200) {
              self.accounts.splice(index, 1);
              this.createDatatable()
              self.$swal.fire(
                "Deleted!",
                "Your account has been deleted.",
                "success"
              );
            }
          }
        });
    },
  },
};
</script>

<style scoped>
#accountTable_length {
  margin-bottom: 20px;
}
</style>
