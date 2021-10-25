<template>
  <div>
    <div class="wrapper-content">
      <div
        class="box-header"
        style="display: flex; justify-content: space-between"
      >
        <span><i class="fa fa-list mr-2"></i>本物口座情報</span>

        <button class="btn btn-success" @click="onOpenModalAccount()">
          <i class="fa fa-plus"></i> 新しい銀行を追加する
        </button>
      </div>
      <hr class="mt-10" />
      <div class="box-content">
        <div class="px-20 py-20">
          <table id="tablebank" class="display pt-20 mb-20" :key="keyTable">
            <thead class="thead-purple">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Bank Code</th>
                <th scope="col">Bank Name</th>
                <th scope="col">Bank Sub Code</th>
                <th scope="col">Bank Sub Name</th>
                <th scope="col">Bank Number</th>
                <th scope="col">Bank Account Name Last</th>
                <th scope="col">Bank Account Name First</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bank, index) in listBank" :key="bank._id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ bank.bkCode }}</td>
                <td>{{ bank.bkName }}</td>
                <td>{{ bank.bkSubCode }}</td>
                <td>{{ bank.bkSubName }}</td>
                <td>{{ bank.bkAccountNum }}</td>
                <td>{{ bank.bkAccountKanaLast }}</td>
                <td>{{ bank.bkAccountKanaFirst }}</td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click="onOpenModalAccount(bank)"
                  >
                    編集
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
        <h5>
          <i class="fa fa-university"></i>
          {{ editId ? "新しい銀行を追加する" : "銀行を編集する" }}
        </h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">番号: </label>
          <div class="col-sm-7">
            <div class="form-control">
              {{ listBank ? listBank.length + 1 : 0 }}
            </div>
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">Bank Code: </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              v-model="newBank.bkCode"
              id="newBank.bkCode"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">Bank Name: </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              v-model="newBank.bkName"
              id="newBank.bkName"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">Bank Sub Code: </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              v-model="newBank.bkSubCode"
              id="newBank.bkSubCode"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">Bank Sub Name: </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              v-model="newBank.bkSubName"
              id="newBank.bkSubName"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label">Bank Number: </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              v-model="newBank.bkAccountNum"
              id="newBank.bkAccountNum"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label"
            >Bank Account Name Last :
          </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              v-model="newBank.bkAccountKanaLast"
              id="newBank.bkAccountKanaLast"
            />
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-form-label"
            >Bank Account Name First:
          </label>
          <div class="col-sm-7">
            <input
              type="text"
              class="form-control"
              v-model="newBank.bkAccountKanaFirst"
              id="newBank.bkAccountKanaFirst"
            />
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-2" @click="onSaveAccount">
            <i class="fa fa-save"></i>
            {{ editId ? "セーブ" : "新しく追加する" }}
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
import BankApi from "@/services/BankApi";

export default {
  name: "YahooAccounts",
  data() {
    return {
      keyTable: 0,
      newBank: {
        bkCode: "",
        bkName: "",
        bkSubCode: "",
        bkSubName: "",
        bkAccountNum: "",
        bkAccountKanaLast: "",
        bkAccountKanaFirst: "",
      },
      editId: "",
      listBank: null,
    };
  },
  async mounted() {
    await this.getListBank();
    this.createDatatable();
  },
  computed: {},
  methods: {
    createDatatable() {
      let self = this;
      if (self.$("#tablebank").DataTable()) {
        self.$("#tablebank").DataTable().destroy();
      }
      self.$nextTick(() => {
        self.$("#tablebank").DataTable({
          initComplete: function () {
            $(this.api().table().container())
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
      this.newBank = {
        bkCode: "",
        bkName: "",
        bkSubCode: "",
        bkSubName: "",
        bkAccountNum: "",
        bkAccountKanaLast: "",
        bkAccountKanaFirst: "",
      };
    },
    async getListBank() {
      let result = await BankApi.get();
      if (result && result.status === 200) {
        this.listBank = result.data.listBank || [];
      }
    },
    onOpenModalAccount(bankEdit) {
      if (bankEdit) {
        this.newBank = bankEdit;
        this.editId = bankEdit._id;
      } else {
        this.newBank = {
          bkCode: "",
          bkName: "",
          bkSubCode: "",
          bkSubName: "",
          bkAccountNum: "",
          bkAccountKanaLast: "",
          bkAccountKanaFirst: "",
        };
        this.editId = null;
      }
      this.$refs.modalInfoAccount.openModal();
    },
    async onSaveAccount() {
      let credential = this.newBank;
      if (this.editId) {
        let result = await BankApi.update(credential);
        if (result && result.status === 200) {
          this.listBank = this.listBank.map((item) => {
            if (item._id === credential._id) {
              return credential;
            }
            return item;
          });
        } else {
          await this.getListBank();
        }
      } else {
        let result = await BankApi.create(credential);
        if (result && result.status === 200) {
          this.listBank.push(result.data.newBank);
        } else {
          await this.getListBank();
        }
      }
      this.createDatatable();
      this.keyTable++;
      this.onCloseModal();
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
  },
};
</script>

<style scoped>
#tablebank_length {
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
