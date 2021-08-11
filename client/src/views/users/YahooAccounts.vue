<template>
  <div>
    <div class="wrapper-content">
      <div
        class="box-header"
        style="display: flex;justify-content: space-between;"
      >
        <span><i class="fa fa-list mr-2"></i>アカウント一覧</span>
        <span class="font-weight-bold fs-lg">
          契約枠数（{{ countAccountActive }}/{{ maxYahooAccount }}）</span
        >
        <button
          v-if="!adminViewUser"
          class="btn btn-success"
          @click="onOpenModalAccount()"
        >
          <i class="fa fa-plus"></i> アカウントを追加
        </button>
      </div>
      <hr class="mt-10" />
      <div class="box-content">
        <div class="px-20 py-20">
          <div class="alert alert-danger" v-if="isDieProxy">
            現在プロキシ未割当のため一時的に機能が利用できなくなっております。管理者までお問い合わせ下さい。
          </div>
          <table id="accountTable" class="display pt-20 mb-20" :key="keyTable">
            <thead class="thead-purple">
              <tr>
                <th scope="col">No</th>
                <th scope="col">名前</th>
                <th scope="col">Yahoo! オークID</th>
                <th scope="col">ステータス</th>
                <th scope="col">使用中</th>

                <!-- <th scope="col">Status</th> -->
                <!-- <th scope="col">Status Message</th> -->
                <th scope="col">変更</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in accounts" :key="account._id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ account.name }}</td>
                <td>{{ account.yahoo_id }}</td>
                <td>
                  <div v-if="account.cookie && account.status == 'SUCCESS'">
                    認証
                  </div>
                  <div v-else style="color:red">
                    認証未
                  </div>
                  <button
                    v-if="!adminViewUser"
                    class="btn btn-sm btn-info"
                    @click="onReAuth(account)"
                  >
                    再認証
                  </button>
                </td>
                <td>
                  <div v-if="account.is_lock">
                    <input
                      v-model="account.is_lock"
                      type="checkbox"
                      name="is_lock"
                      id="is_lock"
                      onclick="return false;"
                    />
                    取引のみに使用中
                  </div>
                  <div v-else>
                    枠使用中
                  </div>
                  <div
                    style="position: absolute; top: 0; left: 0; right: 0; border: 0;"
                  ></div>
                </td>
                <!-- <td>{{ account.status }}</td> -->
                <!-- <td>{{ account.statusMessage }}</td> -->
                <td v-if="!adminViewUser">
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
          <label class="col-sm-4 control-label">Yahoo! オークID: </label>
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
              type="text"
              class="form-control input-sm"
              v-model="password"
              id="yahoo_password"
            />
          </div>
        </div>
        <div v-if="editId" class="form-group form-line text-center">
          <label class="col-sm-4 control-label"> </label>
          <input
            v-model="is_lock"
            type="checkbox"
            class="mr-2"
            name="is_lock"
            id="is_lock"
          />
          <label class="font-weight-bold" @click="is_lock = !is_lock">
            取引のみに使用中
          </label>
        </div>
        <div v-if="is_lock">
          <span style="color: red" class="fs-md">
            取引のみに使用にチェックが入った状態で保存をすると、出品中の商品が自動で削除され■取り扱い商品管理■アカウント設定■出金管理■出品した商品管理■取り扱い商品管理のみが表示され、監視の停止・自動出品の停止されます。よろしいですか？
          </span>
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
import { mapGetters } from "vuex";
const PROXY_STATUS_DIE = "die";
export default {
  name: "YahooAccounts",
  data() {
    return {
      keyTable: 0,
      accounts: [],
      account: {
        name: "",
        yahoo_id: "",
        password: ""
      },
      name: "",
      yahooId: "",
      password: "",
      editId: "",
      is_lock: false,
      tableAccount: null
    };
  },
  async mounted() {
    await this.getListAccount();
    this.createDatatable();
  },
  computed: {
    qtyAccount() {
      return this.accounts.length;
    },
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      userInfo: "getUserInfo",
      adminViewUser: "getAdminViewUser"
    }),
    maxYahooAccount() {
      if (!this.userInfo) {
        return 0;
      }
      return this.userInfo.maxYahooAccount;
    },
    countAccountActive() {
      return this.accounts.filter(item => !item.is_lock).length;
    },
    isDieProxy() {
      return this.selectedYahooAccount.proxy &&
        this.selectedYahooAccount.proxy.length
        ? this.selectedYahooAccount.proxy[0].status === PROXY_STATUS_DIE
        : false;
    }
  },
  methods: {
    createDatatable() {
      let self = this;
      if (self.$("#accountTable").DataTable()) {
        self
          .$("#accountTable")
          .DataTable()
          .destroy();
      }
      self.$nextTick(() => {
        self.$("#accountTable").DataTable({
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
          responsive: true,
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
      this.$refs.modalInfoAccount.closeModal();
      this.name = "";
      this.yahooId = "";
      this.password = "";
      this.editId = "";
      this.is_lock = false;
    },
    async getListAccount() {
      let result = await YahooAccountApi.get();
      if (result && result.status === 200) {
        this.accounts = result.data.accounts || [];
      }
    },
    onOpenModalAccount(account) {
      if (account) {
        this.name = account.name;
        this.yahooId = account.yahoo_id;
        this.password = account.password;
        this.is_lock = account.is_lock;
        this.editId = account._id;
      } else {
        this.name = "";
        this.yahooId = "";
        this.password = "";
        this.editId = "";
        this.is_lock = false;

        if (this.countAccountActive >= this.maxYahooAccount) {
          this.$swal.fire({
            icon: "warning",
            title: `<div>
              枠を解除すると契約数をオーバーします。アカウント枠を追加購入してください。<br>
＊新規で取引のみに使用のアカウントは追加できません。もともと登録していたアカウントを取引のみに変更することのみできます。
</div>`
          });
          return;
        }
      }
      this.$refs.modalInfoAccount.openModal();
    },
    async onSaveAccount() {
      let credential = {
        name: this.name,
        yahoo_id: this.yahooId,
        password: this.password,
        is_lock: this.is_lock
      };
      if (this.editId) {
        credential._id = this.editId;
        let result = await YahooAccountApi.update(credential);
        if (result && result.status === 200) {
          let index = this.accounts.findIndex(
            account => account._id === result.data.account._id
          );
          this.$set(this.accounts, index, result.data.account);
          this.$store.commit("SET_YAHOO_ACCOUNT", this.accounts);
          if (this.selectedYahooAccount._id === credential._id) {
            this.$store.commit(
              "SET_SELECTED_YAHOO_ACCOUNT",
              result.data.account
            );
          }
          this.createDatatable();
        } else {
          await this.getListAccount();
        }
        this.onCloseModal();
      } else {
        let result = await YahooAccountApi.create(credential);
        if (result && result.status === 200) {
          this.accounts.push(result.data.account);
        } else {
          await this.getListAccount();
        }
        if (this.accounts.length == 1) {
          this.$store.commit("SET_SELECTED_YAHOO_ACCOUNT", this.accounts[0]);
        }
        this.$store.commit("SET_YAHOO_ACCOUNT", this.accounts);
        this.createDatatable();
        this.keyTable++;
        this.onCloseModal();
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
          cancelButtonText: '<i class="fa fa-times"></i>  キャンセル'
        })
        .then(async result => {
          if (result.isConfirmed) {
            let res = await YahooAccountApi.delete(account);
            if (res && res.status == 200) {
              self.accounts.splice(index, 1);
              self.$store.commit("SET_YAHOO_ACCOUNT", self.accounts);
              if (this.selectedYahooAccount._id === account._id) {
                this.$store.commit(
                  "SET_SELECTED_YAHOO_ACCOUNT",
                  this.accounts[0] || {}
                );
              }
              self.createDatatable();
              self.$swal.fire("削除", "削除成功", "success");
            }
          }
        });
    },
    async onReAuth(account) {
      let result = await YahooAccountApi.update({
        _id: account._id,
        type: "RE_AUTH"
      });
      if (result.status === 200) {
        let newData = result.data.account;
        this.accounts = this.accounts.map(item => {
          if (item._id === newData._id) {
            return newData;
          }
          return item;
        });
      } else {
        this.accounts = this.accounts.map(item => {
          if (item._id === account._id) {
            return { ...account, status: "ERROR" };
          }
          return item;
        });
      }
    }
  }
};
</script>

<style scoped>
#accountTable_length {
  margin-bottom: 20px;
}

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
