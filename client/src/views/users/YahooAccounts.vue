<template>
  <div>
    <div class="wrapper-table">
      <div class="box-header">
        <i class="fa fa-list mr-2"></i>アカウント一覧
        <button class="btn btn-add-account" @click="onOpenModalAccount">
          <i class="fa fa-plus"></i> アカウントを追加
        </button>
      </div>
      <hr class="mt-10">
      <div class="box-content">
        <div class="row px-20 mt-20">
          <div class="col-sm-6 d-flex align-items-center">
            <select name="" id="" class="form-control" style="width: 100px">
              <option value="123">123</option>
            </select>
            <div class="ml-2">件表示</div>
          </div>
          <div class="col-sm-6 d-flex align-items-center">
            <div class="mr-2">検索: </div>
            <input type="text" class="form-control" style="width: 90%">
          </div>
        </div>
        <div class="row px-30 mt-20">
          <table class="table">
            <thead class="thead-purple">
              <tr>
                <th scope="col">No</th>
                <th scope="col">名前</th>
                <th scope="col">Yahoo! オークID</th>
                <th scope="col">ステータス</th>
                <th scope="col">変更</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in accounts" :key="account._id">
                <th scope="row">{{index + 1}}</th>
                <td>{{account.name}}</td>
                <td>{{account.yahoo_id}}</td>
                <td>
                  <div>認証</div> 
                  <!-- 認証未 -->
                  <button class="btn btn-sm btn-info">
                    再認証
                  </button>
                </td>
                <td>
                  <button class="btn btn-md btn-warning mb-1" @click="onOpenModalAccount(account, index)">
                    <i class="fa fa-edit"></i> 修正
                  </button> <br>
                  <button class="btn btn-md btn-danger" @click="onConfirmDeleteAccount(account, index)">
                    <i class="fa fa-trash"></i> 削除
                  </button>
                </td>
              </tr>
            </tbody>
            <!-- <tfoot>
              <td colspan="3">
                8 件中 1 から 8 まで表示
              </td>
              <td colspan="2">
                phan trang
              </td>
            </tfoot> -->
          </table>
        </div>
      </div>
    </div>
    <modal-component ref="modalInfoAccount">
      <template v-slot:header>
        <h5>
          <i class="fa fa-user-plus"></i> 新規アカウント
        </h5>
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
            <input type="text" class="form-control" v-model="account.name" id="name" />
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
            <input type="text" class="form-control input-sm" v-model="account.yahoo_id" id="yahoo_id" />
          <!-- Yahoo IDの長さは64です。 -->
          </div>
        </div>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">パスワード: </label>
          <div class="col-sm-7">
            <input type="password" class="form-control input-sm" v-model="account.password" id="yahoo_password">
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-2" @click="onSaveAccount">
            <i class="fa fa-save"></i> セーブ
          </button>
          <button class="btn btn-warning" @click="$refs.modalInfoAccount.closeModal()">
            <i class="fa fa-times"></i> キャンセル
          </button>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import YahooAccountApi from '@/services/YahooAccountApi'
export default {
  name: "YahooAccounts",
  data() {
    return {
      accounts: [],
      account: {
        name: '',
        yahoo_id: '',
        password: ''
      }
    };
  },
  async mounted () {
    await this.getListAccount()
  },
  computed: {
    qtyAccount () {
      return this.accounts.length
    }
  },
  methods: {
    async getListAccount() {
      let result = await YahooAccountApi.get();
      if (result && result.status === 200) {
        this.accounts = result.data.accounts || []
      }
    },
    onOpenModalAccount (account) {
      this.account = account
      this.$refs.modalInfoAccount.openModal();
    },
    async onSaveAccount () {
      if (this.account._id) {
        let result = await YahooAccountApi.update(this.account)
        if (result && result.status === 200) {
          this.$refs.modalInfoAccount.closeModal();
          this.account = {
            name: '',
            yahoo_id: '',
            password: ''
          }
          let index = this.accounts.findIndex(account => account._id === this.account._id)
          this.accounts[index] = result.data
        }
      } else {
        let result = await YahooAccountApi.create(this.account)
        if (result && result.status === 200) {
          this.$refs.modalInfoAccount.closeModal();
          this.account = {
            name: '',
            yahoo_id: '',
            password: ''
          }
          this.accounts.push(result.data)
        }
      }
    },
    onConfirmDeleteAccount (account, index) {
      this.$swal.fire({
        title: '警告',
        text: "あなたは本当にこのユーザを削除したいですか？",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00a65a',
        cancelButtonColor: '#f39c12',
        confirmButtonText: '<i class="fa fa-check-square"></i> はい',
        cancelButtonText: '<i class="fa fa-times"></i>  キャンセル'
      }).then( async (result) => {
        if (result.isConfirmed) {
          let res = await YahooAccountApi.delete(account);
          if (res && res.status == 200) {
            this.accounts.splice(index, 1)
            this.$swal.fire(  
              'Deleted!',
              'Your account has been deleted.',
              'success'
            )
          }
        }
      })
    }
  },
};
</script>

<style scoped>
.wrapper-table {
  background-color: #ffffff;
  margin: 20px;
}
.wrapper-table .box-header {
  position: relative;
  padding: 20px;
}
.wrapper-table .box-header .btn-add-account {
  position: absolute;
  right: 20px;
  top: 15px;
  background-color: #00a65a;
  border-color: #00a65a;
  color: #ffffff;
}
.form-line {
  display: flex;
  justify-content: end;
  align-items: center;
}
.form-line label {
  text-align: end;
}
.thead-purple {
  background-color: #605ca8;
  color: #fff;
}
</style>
