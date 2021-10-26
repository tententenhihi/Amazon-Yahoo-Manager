<template>
  <div class="wrapper-content">
    <div class="box-header"></div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="px-30 pb-20">
        <div class="form-row my-3" style="justify-content: space-between">
          <button
            :disabled="!listAccountSelected || listAccountSelected.length === 0"
            class="btn btn-primary px-4"
            @click="openPayment"
          >
            出金ログを見る
          </button>
          <div>
            <button
              v-if="!isWithDrawRunning"
              :disabled="
                !listAccountSelected || listAccountSelected.length === 0
              "
              class="btn btn-success px-4"
              @click="onStartWithDrawMoney"
            >
              選択したアカウントの出金を実行する
            </button>
            <button
              v-if="isWithDrawRunning"
              :disabled="
                !listAccountSelected || listAccountSelected.length === 0
              "
              class="btn btn-danger px-4"
              @click="onStopWithDrawMoney"
            >
              Stop
            </button>
            <button class="btn btn-primary px-2" @click="refreshAccountPayment">
              <i class="fa fa-sync-alt" style="font-size: 12px"></i>
              最新の情報を反映する
            </button>
          </div>
        </div>
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
                <th name="stt" scope="col">
                  <div style="display: flex; align-items: center">
                    <input
                      class="mr-2"
                      type="checkbox"
                      v-model="isCheckAllAccount"
                      style="cursor: pointer; width: 15px; height: 15px"
                      id="checkAll"
                    />
                    <label style="cursor: pointer" for="checkAll">全選択</label>
                  </div>
                </th>
                <th scope="col">Yahoo! オークID</th>
                <th scope="col">偽口座情報</th>
                <th scope="col">前回出金日</th>
                <th scope="col">出金額</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in tableData" :key="index">
                <td>
                  <div style="display: flex; align-items: center">
                    <input
                      class="mr-2"
                      type="checkbox"
                      v-model="listAccountSelected"
                      :value="account._id"
                      style="cursor: pointer; width: 15px; height: 15px"
                      :id="'account_' + index"
                    />
                    <label style="cursor: pointer" :for="'account_' + index">{{
                      account.accountId
                    }}</label>
                  </div>
                </td>
                <td>{{ account.yahoo_id }}</td>
                <td>
                  <span
                    v-if="account && account.bank && account.bank.length > 0"
                  >
                    {{ account.bank[0].bkAccountNum }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="
                      account &&
                      account.historyWithDraw &&
                      account.historyWithDraw.length > 0
                    "
                  >
                    {{
                      $moment(
                        account.historyWithDraw[
                          account.historyWithDraw.length - 1
                        ].created
                      ).format("YYYY/MM/DD HH:mm")
                    }}
                  </span>
                </td>
                <td>
                  <span>
                    {{ account.amount || 0 }}
                  </span>
                </td>
                <td>
                  <span>
                    {{ account.status_withdraw }}
                    <div
                      v-if="
                        account.status_withdraw &&
                        account.status_withdraw.includes(
                          'Enter Old Bank Number'
                        )
                      "
                    >
                      <input
                        type="text"
                        v-model="account.old_bank_number"
                        placeholder="Enter old bank number"
                      />
                      <button
                        @click="
                          onClickRunAgain(account._id, account.old_bank_number)
                        "
                        class="btn btn-primary btn-sm"
                      >
                        Run again
                      </button>
                    </div>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <modal-component ref="modelHistoryPayment" classModalDialog="modal-lg">
      <template v-slot:header>
        <h5>離脱履歴</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <table id="tablebank" class="table table-striped display pt-10 my-20">
            <thead class="thead-purple">
              <tr>
                <th name="stt" scope="col">
                  <div style="display: flex; align-items: center">
                    <label style="cursor: pointer" for="checkAll">全選択</label>
                  </div>
                </th>
                <th scope="col">Yahoo! オークID</th>
                <th scope="col">偽口座情報</th>
                <th scope="col">前回出金日</th>
                <th scope="col">出金額</th>
                <th scope="col">即時出金</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in listHistoryWithRraw" :key="index">
                <td>
                  <div style="display: flex; align-items: center">
                    {{ index + 1 }}
                  </div>
                </td>
                <td>{{ account.yahoo_id }}</td>
                <td>
                  {{ account.bank_number }}
                </td>
                <td>
                  <span>
                    {{ $moment(account.created).format("YYYY/MM/DD HH:mm") }}
                  </span>
                </td>
                <td>
                  {{ account.amount }}
                </td>
                <td>
                  {{ account.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-warning" @click="onCloseModal">
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>
    <modal-component ref="modalProgressWithdraw" classModalDialog="modal-lg">
      <template v-slot:header>
        <h5>Đang rút tiền</h5>
      </template>
      <template>
        <div>Process Withdraw</div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button
            class="btn btn-warning"
            @click="$refs.modalProgressWithdraw.closeModal()"
          >
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import YahooAccountApi from "@/services/YahooAccountApi";
import io from "socket.io-client";
var socket = null;

const PAGE_SIZE = 20;
const STATUS_PROXY = [
  { value: "all", display: "全て" },
  { value: "live", display: "活動中" },
  { value: "used", display: "使用済み" },
  { value: "lock", display: "ロック" },
  { value: "die", display: "壊れた" },
];
export default {
  name: "YahooAccount",
  data() {
    return {
      isCheckAllAccount: false,
      listAccountSelected: [],
      accounts: [],
      STATUS_PROXY,
      page: 1,
      selectedBank: null,
      selectAccount: null,
      searchUserId: "",
      searchYahooId: "",
      searchUsername: "",
      searchBankNumber: "",
      searchData: [],
      listHistoryWithRraw: [],
    };
  },
  async mounted() {
    await this.getYahooAccounts();
    this.createDatatable();

    socket = io.connect(process.env.SERVER_API);
    socket.on(this.$store.state.user._id + "-PAYMENT", (fetchedData) => {
      console.log(" ###### fetchedData: ", fetchedData);

      this.accounts = this.accounts.map((item) => {
        if (fetchedData.account && fetchedData.account._id === item._id) {
          return fetchedData.account;
        }
        if (item._id === fetchedData.yahoo_account_id) {
          return {
            ...item,
            is_withdraw_running: fetchedData.is_withdraw_running,
            status_withdraw: fetchedData.status,
          };
        }
        return item;
      });
      this.searchData = this.accounts;
    });
  },
  destroyed() {
    if (socket) {
      socket.removeListener(this.$store.state.user._id + "-PAYMENT");
    }
  },
  computed: {
    isWithDrawRunning() {
      let checkIsRunning = this.accounts.find(
        (item) => item.is_withdraw_running
      );
      return checkIsRunning;
    },
    tableData() {
      return this.searchData.slice(
        (this.page - 1) * PAGE_SIZE,
        this.page * PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.searchData.length / PAGE_SIZE);
    },
  },
  methods: {
    async refreshAccountPayment() {
      let res = await YahooAccountApi.refreshAccountPayment();
      await this.getYahooAccounts();
    },
    async onClickRunAgain(yahoo_account_id, old_bank_number) {
      try {
        let res = await YahooAccountApi.setOldBankNumber({
          yahoo_account_id: yahoo_account_id,
          old_bank_number: old_bank_number,
        });
        this.accounts = this.accounts.map((item) => {
          if (item._id === yahoo_account_id) {
            return {
              ...item,
              is_withdraw_running: true,
              status_withdraw: "Waitting...",
            };
          }
          return item;
        });
        this.searchData = this.accounts;
        // this.$refs.modalProgressWithdraw.openModal();
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message,
        });
      }
    },
    async onStopWithDrawMoney() {
      try {
        let res = await YahooAccountApi.stopWithDrawMoney({
          listAccountSelected: this.listAccountSelected,
        });
        this.accounts = this.accounts.map((item) => {
          if (this.listAccountSelected.includes(item._id)) {
            return {
              ...item,
              is_withdraw_running: false,
              status_withdraw: "Stop",
            };
          }
          return item;
        });
        this.searchData = this.accounts;
        // this.$refs.modalProgressWithdraw.openModal();
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message,
        });
      }
    },
    async onStartWithDrawMoney() {
      try {
        console.log(" ####### listAccountSelected: ", this.listAccountSelected);
        let res = await YahooAccountApi.withDrawMoney({
          listAccountSelected: this.listAccountSelected,
        });
        this.accounts = this.accounts.map((item) => {
          if (this.listAccountSelected.includes(item._id)) {
            return {
              ...item,
              is_withdraw_running: true,
              status_withdraw: "Waitting...",
            };
          }
          return item;
        });

        this.searchData = this.accounts;

        // this.$refs.modalProgressWithdraw.openModal();
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message,
        });
      }
    },
    createDatatable() {
      let self = this;
      if (self.$("#tablebank").DataTable()) {
        self.$("#tablebank").DataTable().destroy();
      }
      self.$nextTick(() => {
        self.$("#tablebank").DataTable({
          initComplete: function () {
            // $(this.api().table().container())
            //   .find("input")
            //   .parent()
            //   .wrap("<form>")
            //   .parent()
            //   .attr("autocomplete", "off");
          },
          responsive: true,
          columnDefs: [
            {
              targets: 0,
              orderable: false,
            },
          ],
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
    displayStatus(status) {
      return this.STATUS_PROXY.find((item) => item.value === status).display;
    },
    async getYahooAccounts() {
      try {
        let res = await YahooAccountApi.getAccountAndHistoryWithDraw();
        if (res && res.status === 200) {
          this.accounts = res.data.accounts;
          this.searchData = this.accounts;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message,
        });
      }
    },
    openPayment() {
      let listHistory = [];
      this.listAccountSelected.map((item) => {
        let account = this.accounts.find((itemx) => itemx._id === item);
        account.historyWithDraw.map((itemXX) => {
          listHistory.push({
            yahoo_id: account.yahoo_id,
            bank_number: itemXX.bankNumber,
            ip: itemXX.client,
            created: itemXX.created,
            amount: itemXX.amount,
            status: itemXX.status,
          });
        });
      });
      this.listHistoryWithRraw = listHistory.reverse();
      this.$refs.modelHistoryPayment.openModal();
    },
    onCloseModal() {
      this.$refs.modelHistoryPayment.closeModal();
    },
    searchYahooAccount() {
      this.searchData = this.accounts.filter((account) => {
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
        if (condition) {
          return account;
        }
      });
      this.page = 1;
    },
  },
  watch: {
    isCheckAllAccount: function () {
      if (this.isCheckAllAccount) {
        this.listAccountSelected = this.accounts.map((item) => item._id);
      } else {
        this.listAccountSelected = [];
      }
    },
  },
};
</script>

<style scoped></style>
