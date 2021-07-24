<template>
  <div>
    <div class="wrapper-content">
      <div class="box-header">
        <i class="fa fa-list mr-2"></i>ユーザー設定
        <button class="btn btn-add-account" @click="onOpenModalUser(user)">
          <i class="fa fa-plus"></i> ユーザーを追加する
        </button>
      </div>
      <hr class="mt-10" />
      <div class="box-content">
        <div class="px-30 py-20">
          <table
            id="userTable"
            class="table display pt-20 mb-20"
            style="width: 100%"
          >
            <thead class="thead-purple">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">メールアドレス</th>
                <th scope="col">ユーザー名</th>
                <th scope="col">名前</th>
                <th scope="col">状態</th>
                <th scope="col">アカウント枠</th>
                <th scope="col">利用期限</th>
                <th scope="col">変更</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="user._id">
                <th scope="row">{{ user.userId }}</th>
                <td>{{ user.email }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.status }}</td>
                <td>
                  {{ user.yahooaccounts.length + "/" + user.maxYahooAccount }}
                </td>
                <td>{{ $moment(user.expired_at).format("DD-MM-YYYY") }}</td>
                <td>
                  <button
                    class="btn btn-md btn-warning mb-1"
                    @click="onOpenModalUser(user, index)"
                  >
                    <i class="fa fa-edit"></i> 修正
                  </button>
                  <br />
                  <button
                    class="btn btn-md btn-danger"
                    @click="onConfirmDeleteUser(user, index)"
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
    <modal-component ref="modalInfoUser">
      <template v-slot:header>
        <h5><i class="fa fa-user-plus"></i> ユーザーを追加する</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">メールアドレス: </label>
          <div class="col-sm-7">
            <input
              :disabled="editId"
              type="text"
              class="form-control input-sm"
              v-model="email"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">ユーザー名: </label>
          <div class="col-sm-7">
            <input
              :disabled="editId"
              type="text"
              class="form-control input-sm"
              v-model="username"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">名前: </label>
          <div class="col-sm-7">
            <input type="text" class="form-control input-sm" v-model="name" />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">状態: </label>
          <div class="col-sm-7">
            <select class="form-control" id="" v-model="status">
              <option
                v-for="(status, index) of STATUS_USER"
                :key="index"
                :value="status"
                >{{ status }}</option
              >
            </select>
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">アカウント枠: </label>
          <div class="col-sm-7">
            <input
              type="number"
              :min="0"
              class="form-control input-sm"
              v-model="maxYahooAccount"
            />
          </div>
        </div>
        <div class="form-group form-line" v-if="editId">
          <label class="col-sm-4 control-label"></label>
          <div class="col-sm-7">
            <div class="form-check">
              <input
                type="checkbox"
                v-model="isResetPassword"
                class="form-check-input"
                id="is-change-pass"
              />
              <label class="form-check-label" for="is-change-pass"
                >パスワードの変更です</label
              >
            </div>
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">パスワード: </label>
          <div class="col-sm-7">
            <input
              :disabled="editId && !isResetPassword"
              type="password"
              class="form-control input-sm"
              v-model="password"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">パスワード（確認）: </label>
          <div class="col-sm-7">
            <input
              type="password"
              class="form-control input-sm"
              :disabled="editId && !isResetPassword"
              v-model="re_password"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">注意: </label>
          <div class="col-sm-7">
            <textarea
              v-model="note"
              class="form-control input-sm"
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">賞味期限: </label>
          <div class="col-sm-7">
            <input
              type="date"
              class="form-control input-sm"
              v-model="expired_at"
              :min="minExpiredAt"
            />
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-2" @click="onSaveUser">
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
import AdminApi from "@/services/AdminApi";
const STATUS_USER = ["LIVE", "LOCKED"];
export default {
  name: "AdminUsers",
  data() {
    return {
      STATUS_USER,
      isResetPassword: false,
      users: [],
      user: {
        username: "",
        name: "",
        status: STATUS_USER[0],
        password: "",
        re_password: "",
        maxYahooAccount: 5,
        email: "",
        note: "",
        expired_at: new Date()
      },
      email: "",
      note: "",
      expired_at: new Date(),
      username: "",
      name: "",
      status: STATUS_USER[0],
      password: "",
      re_password: "",
      editId: "",
      maxYahooAccount: 5,
      tableUser: null
    };
  },
  async mounted() {
    await this.getListUser();
    this.createDatatable();
  },
  computed: {
    minExpiredAt () {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() +1 ;
      let yyyy = today.getFullYear();
      if (dd < 10){
        dd='0'+dd
      } 
      if(mm < 10){
        mm='0'+mm
      } 
      today = yyyy+'-'+mm+'-'+dd;
      return today
    }
  },
  methods: {
    createDatatable() {
      let self = this;
      if (self.$("#userTable").DataTable()) {
        self
          .$("#userTable")
          .DataTable()
          .destroy();
      }
      self.$nextTick(() => {
        self.$("#userTable").DataTable({
          initComplete: function() {
            $(
              this.api()
                .table()
                .container()
            )
              .find("input")
              .parent()
              .wrap("<form>")
              .parent()
              .attr("autocomplete", "off");
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
              sPrevious: "前"
            },
            oAria: {
              sSortAscending: ": 列を昇順に並べ替えるにはアクティブにする",
              sSortDescending: ": 列を降順に並べ替えるにはアクティブにする"
            }
          }
        });
      });
    },
    onCloseModal() {
      this.$refs.modalInfoUser.closeModal();
      this.username = "";
      this.name = "";
      this.status = STATUS_USER[0];
      this.maxYahooAccount = 5;
      this.password = "";
      this.re_password = "";
      this.email = "";
      this.note = "";
      this.expired_at = "";
      this.editId = "";
      this.isResetPassword = false
    },
    async getListUser() {
      let result = await AdminApi.getUsers();
      if (result && result.status === 200) {
        this.users = result.data.users || [];
      }
    },
    onOpenModalUser(user) {
      this.username = user.username;
      this.name = user.name;
      this.status = user.status;
      this.maxYahooAccount = user.maxYahooAccount;
      this.password = "";
      this.re_password = "";
      this.email = user.email;
      this.note = user.note;
      this.expired_at = this.$moment(user.expired_at).format("YYYY-MM-DD");
      this.editId = user._id;
      this.$refs.modalInfoUser.openModal();
    },
    async onSaveUser() {
      let domain = window.location.origin;
      let credential = {
        username: this.username,
        name: this.name,
        status: this.status,
        password: this.password,
        re_password: this.re_password,
        maxYahooAccount: this.maxYahooAccount,
        email: this.email,
        note: this.note,
        expired_at: this.expired_at,
        domain
      };

      if (this.editId) {
        credential._id = this.editId;
        let result = await AdminApi.updateUser(credential);
        if (result && result.status === 200) {
          this.onCloseModal();
          let index = this.users.findIndex(
            user => user._id === result.data.user._id
          );
          this.users[index] = {...this.users[index], ...result.data.user};
          this.users = [...this.users];
          this.createDatatable();
        }
      } else {
        let result = await AdminApi.createUser(credential);
        if (result && result.status === 200) {
          this.onCloseModal();
          this.users.push({ ...result.data.user, yahooaccounts: [] });
          this.createDatatable();
        }
      }
    },
    onConfirmDeleteUser(user, index) {
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
          cancelButtonText: '<i class="fa fa-times"></i>  キャンセル'
        })
        .then(async result => {
          if (result.isConfirmed) {
            let res = await AdminApi.deleteUser(user);
            if (res && res.status == 200) {
              self.users.splice(index, 1);
              this.createDatatable();
              self.$swal.fire(
                "削除されました",
                "ユーザーが削除されました。",
                "success"
              );
            }
          }
        });
    }
  }
};
</script>

<style scoped>
#userTable_length {
  margin-bottom: 20px;
}
</style>
