<template>
  <div class="wrapper-content">
    <div class="box-header">
      プロキシ割り当て管理
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <!-- <div class="search-proxy mt-10">
          <div class="form-row">
            <div class="form-group col-md-3">
              <label for="userid">ユーザーID</label>
              <input
                type="text"
                class="form-control"
                id="userid"
                v-model="searchUserId"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="userid">ヤフーID</label>
              <input
                type="text"
                class="form-control"
                id="userid"
                v-model="searchYahooId"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="username">ユーザー名</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="searchUsername"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="proxy">銀行の口座番号:</label>
              <input
                type="text"
                class="form-control"
                id="proxy"
                v-model="searchBankNumber"
              />
            </div>
          </div>
          <button class="btn btn-primary px-4" @click="searchYahooAccount">
            検索
          </button>
        </div> -->
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
        <div class="table-responsive">
          <table id="tablebank" class="table table-striped display pt-10 my-20">
            <thead class="thead-purple">
              <tr>
                <th scope="col">
                  No
                  <input
                    type="checkbox"
                    v-model="isCheckAllProduct"
                    style="cursor: pointer; width: 15px; height: 15px;"
                  />
                </th>
                <th scope="col">Yahoo! オークID</th>
                <th scope="col">対応口座</th>
                <th scope="col">支店名</th>
                <th scope="col">偽口座情報</th>
                <th scope="col">名義カナ名字</th>
                <th scope="col">名義カナ名前</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in tableData" :key="index">
                <td>{{ account.accountId }}</td>
                <td>{{ account.yahoo_id }}</td>
                <td>
                  <span v-if="account.bank[0]">
                    {{ account.bank[0].name }}
                  </span>
                </td>
                <td>
                  <span v-if="account.bank[0]">
                    {{ account.bank[0].branch }}
                  </span>
                </td>
                <td>
                  <span v-if="account.bank[0]">
                    {{ account.bank[0].number }}
                  </span>
                </td>
                <td>
                  <span v-if="account.bank[0]">
                    {{ account.bank[0].first_name }}
                  </span>
                </td>
                <td>
                  <span v-if="account.bank[0]">
                    {{ account.bank[0].last_name }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-warning"
                    @click="setBankToAccount(account)"
                  >
                    銀行を変更する
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <modal-component ref="modelBankAccount">
      <template v-slot:header>
        <h5><i class="fa fa-user-plus"></i> 銀行口座を設定する</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">銀行の口座番号: </label>
          <div class="col-sm-7">
            <select class="form-control" v-model="selectedBank">
              <option
                v-for="(bank, index) in listBank"
                :value="bank._id"
                :key="index"
              >
                {{ bank.name }} - {{ bank.number }} -
                {{ bank.first_name + " " + bank.last_name }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-2" @click="onSetBankToAccount">
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

const PAGE_SIZE = 20;
const STATUS_PROXY = [
  { value: "all", display: "全て" },
  { value: "live", display: "活動中" },
  { value: "used", display: "使用済み" },
  { value: "lock", display: "ロック" },
  { value: "die", display: "壊れた" }
];
export default {
  name: "YahooAccount",
  data() {
    return {
      isCheckAllAccount: false,
      accounts: [],
      listBank: [],
      STATUS_PROXY,
      page: 1,
      selectedBank: null,
      selectAccount: null,
      searchUserId: "",
      searchYahooId: "",
      searchUsername: "",
      searchBankNumber: "",
      searchData: []
    };
  },
  async mounted() {
    await this.getYahooAccounts();
    this.createDatatable();
  },
  computed: {
    tableData() {
      return this.searchData.slice(
        (this.page - 1) * PAGE_SIZE,
        this.page * PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.searchData.length / PAGE_SIZE);
    }
  },
  methods: {
    createDatatable() {
      let self = this;
      if (self.$("#tablebank").DataTable()) {
        self
          .$("#tablebank")
          .DataTable()
          .destroy();
      }
      self.$nextTick(() => {
        self.$("#tablebank").DataTable({
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
    displayStatus(status) {
      return this.STATUS_PROXY.find(item => item.value === status).display;
    },
    async getYahooAccounts() {
      try {
        let res = await YahooAccountApi.getAccountAndBank();
        if (res && res.status === 200) {
          this.accounts = res.data.accounts;
          this.listBank = res.data.listBank;
          this.searchData = this.accounts;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    setBankToAccount(account) {
      this.$refs.modelBankAccount.openModal();
      this.selectAccount = account;
    },

    async onSetBankToAccount() {
      let res = await YahooAccountApi.setBankToAccount({
        _id: this.selectAccount._id,
        bank_id: this.selectedBank
      });
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "銀行の設定が完了しました",
          timer: 500,
          showConfirmButton: false
        });
        await this.getYahooAccounts();
        this.selectedBank = null;
        this.$refs.modelBankAccount.closeModal();
      }
    },
    onCloseModal() {
      this.$refs.modelBankAccount.closeModal();
    },
    searchYahooAccount() {
      this.searchData = this.accounts.filter(account => {
        let condition = true;
        if (this.searchUserId) {
          condition =
            condition &&
            account.users.length > 0 &&
            account.users[0].userId &&
            account.users[0].userId.toString().includes(this.searchUserId);
        }
        if (this.searchYahooId) {
          condition =
            condition &&
            account.users.length &&
            account.accountId.toString().includes(this.searchYahooId);
        }

        if (this.searchUsername) {
          condition =
            condition &&
            account.users.length > 0 &&
            account.users[0].username.includes(this.searchUsername);
        }
        if (this.searchBankNumber) {
          condition =
            condition &&
            account.bank.length > 0 &&
            account.bank[0].ip.includes(this.searchBankNumber);
        }
        if (condition) {
          return account;
        }
      });
      this.page = 1;
    }
  }
};
</script>

<style scoped></style>
