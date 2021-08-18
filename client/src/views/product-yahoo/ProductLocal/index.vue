<template>
  <div class="wrapper-content">
    <div class="box-header">
      <i class="fa fa-list mr-2"></i>Y!オーク取扱商品管理
      <button class="btn btn-add-account" @click="goToFormProduct(0)">
        <i class="fa fa-plus"></i> 新規追加
      </button>
    </div>
    <hr class="mt-10" />
    <div class="box-content">
      <div class="mx-10">
        <div class="py-2">
          Y!オークに出品される商品一覧
        </div>
        <hr />
        <div class="account-infomation">
          <div class="info-title">
            <i class="fa fa-user mr-2"></i>現在のアカウント情報
          </div>
          <div class="table-responsive">
            <table class="table table-striped pt-20">
              <tbody>
                <tr>
                  <td class="title-col">あなたのユーザ識別番号</td>
                  <td>{{ userInfo.userId }}</td>
                </tr>
                <tr>
                  <td class="title-col">現在のアカウント識別番号</td>
                  <td>{{ selectedYahooAccount.accountId }}</td>
                </tr>
                <tr>
                  <td class="title-col">現在のアカウントYahoo!ID</td>
                  <td>{{ selectedYahooAccount.yahoo_id }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mb-10">
            管理者/運営者へのご連絡の際には必ず上記をお知らせ下さい。
          </p>
        </div>
        <div class="form-search">
          <div class="form-row">
            <div class="form-group col-sm-3">
              <label for="folder">出品フォルダ</label>
              <select
                id="folder"
                class="form-control"
                v-model="searchObj.folder"
                @change="onChangeSelectFolder"
              >
                <option :value="null" selected>すべて</option>
                <option
                  v-for="(folder, index) in folders"
                  :key="index"
                  :value="folder._id"
                >
                  {{ folder.name }}
                </option>
              </select>
            </div>
            <div class="form-group col-sm-3">
              <label for="asin_amazon">ASIN </label>
              <input
                type="text"
                class="form-control"
                v-model="searchObj.asin_amazon"
                id="asin_amazon"
                placeholder="キーワード / 仕入元・オークションID"
              />
            </div>
            <div class="form-group col-sm-3">
              <label for="queryString">検索クエリー</label>
              <input
                type="text"
                class="form-control"
                v-model="searchObj.queryString"
                id="queryString"
                placeholder="キーワード / 仕入元・オークションID"
              />
            </div>
            <div class="form-group col-sm-3">
              <label for="listingStatus">出品ステータス</label>
              <select
                id="listingStatus"
                class="form-control"
                v-model="searchObj.listingStatus"
              >
                <option :value="null" selected>すべて</option>
                <option
                  v-for="(status, index) in LISTING_STATUS"
                  :key="index"
                  :value="status.value"
                >
                  {{ status.display }}
                </option>
              </select>
            </div>
          </div>

          <!-- <div class="form-row">
            <div class="form-group col-sm-4">
              <label for="stock">在庫監視</label>
              <select
                id="stock"
                class="form-control"
                v-model="searchObj.watch_stock"
              >
                <option :value="null" selected>すべて</option>
                <option
                  v-for="(option, index) in SWITCH_OPTION"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.display }}
                </option>
              </select>
            </div>
            <div class="form-group col-sm-4">
              <label for="profit">利益監視</label>
              <select
                id="profit"
                class="form-control"
                v-model="searchObj.watch_profit"
              >
                <option :value="null" selected>すべて</option>
                <option
                  v-for="(option, index) in SWITCH_OPTION"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.display }}
                </option>
              </select>
            </div>
            <div class="form-group col-sm-4">
              <label for="prime">プライムのみ監視</label>
              <select
                id="prime"
                class="form-control"
                v-model="searchObj.watch_only_prime"
              >
                <option :value="null" selected>すべて</option>
                <option
                  v-for="(option, index) in SWITCH_OPTION"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.display }}
                </option>
              </select>
            </div>
          </div> -->

          <button class="btn btn-primary px-4" @click="onSearchProduct">
            検索
          </button>
          <button class="btn btn-default" @click="clearSearchProduct">
            リセット
          </button>
        </div>
        <hr />
      </div>
      <div class="alert alert-danger mx-10" v-if="isDieProxy">
        現在プロキシ未割当のため一時的に機能が利用できなくなっております。管理者までお問い合わせ下さい。
      </div>
      <div class="group-button p-10">
        <button
          :disabled="!selectedProducts.length"
          @click="$refs.modalSelectFolder.openModal()"
          class="btn btn-primary"
        >
          <i class="far fa-folder-open mr-1"></i> フォルダ移動
        </button>
        <button
          :disabled="!selectedProducts.length"
          @click="$refs.modalDeleteProduct.openModal()"
          class="btn btn-danger mx-10"
        >
          <i class="far fa-trash-alt mr-1"></i> 削除
        </button>
        <!-- <button
          :disabled="!selectedProducts.length"
          @click="onOpenModalWitchOption('watch_stock')"
          class="btn btn-info"
        >
          在庫監視ON/OFF
        </button>
        <button
          :disabled="!selectedProducts.length"
          @click="onOpenModalWitchOption('watch_profit')"
          class="btn btn-info"
        >
          利益監視ON/OFF
        </button>
        <button
          :disabled="!selectedProducts.length"
          @click="onOpenModalWitchOption('watch_only_prime')"
          class="btn btn-info"
        >
          プライムのみ監視ON/OFF
        </button> -->

        <button
          :disabled="!selectedProducts.length"
          @click="openModalOverLayImage"
          class="btn btn-info"
        >
          <i class="far fa-images mr-1"></i>写真を挿入
        </button>
        <button
          v-if="!selectedYahooAccount.is_lock"
          :disabled="!selectedProducts.length"
          @click="onUploadYahooNow"
          class="btn btn-success mx-10 px-4"
        >
          Yahoo!オークへ出品
        </button>

        <JsonCSV
          style="display: contents;"
          :data="dataExport"
          :fields="[
            '_id',
            'product_yahoo_title',
            'start_price',
            'bid_or_buy_price',
            'ship_fee1',
            'quantity',
            'import_price',
            'count',
            'image_overlay_index',
            'note',
            'description',
            'yahoo_auction_category_id'
          ]"
          :labels="{
            _id: 'ID',
            product_yahoo_title: 'Y！オーク商品の名前',
            start_price: '開始価格',
            bid_or_buy_price: '即決価格',
            ship_fee1: '送料',
            quantity: '数量',
            import_price: '仕入元の値段',
            count: '仕入元の在庫数',
            image_overlay_index: '画像挿入',
            note: '備考',
            description: '商品詳細',
            yahoo_auction_category_id: 'ヤフーカテゴリID'
          }"
          :name="nameFolderSelected + '.csv'"
        >
          <button
            :disabled="!nameFolderSelected"
            class="btn btn-info mx-10 px-3"
            style="float: right;"
          >
            <i class="fa fa-download mr-1"></i>エクスポート
          </button>
        </JsonCSV>

        <!-- <JsonCSV
          style="display: contents;"
          :data="dataExport"
          :fields="[
            '_id',
            'yahoo_auction_category_id',
            'product_yahoo_title',
            'type_import_desciption',
            'description',
            'image1',
            'image2',
            'image3',
            'image4',
            'image5',
            'image6',
            'image7',
            'image8',
            'image9',
            'image10',
            'image_comment1',
            'image_comment2',
            'image_comment3',
            'image_comment4',
            'image_comment5',
            'image_comment6',
            'image_comment7',
            'image_comment8',
            'image_comment9',
            'image_comment10',
            'count',
            'start_price',
            'bid_or_buy_price',
            'offer',

            'duration',
            'closing_time',
            'num_resubmit',
            'xxx1',
            'auto_extension',
            'close_early',
            'min_bid_rating',
            'bad_rating_ratio',
            'bid_credit_limit',
            'status',
            'status_comment',
            'retpolicy',
            'ofretpolicy_commentfer',
            'offer',
            'offer',
            'xxx2',
            'count',
            'count',
            'count',
            'count',
            'count',
            'count',
            'count',
            'count',
            'count',
            'count',
            'xxx3',
            'location',
            'city',
            'shipping',
            'xxx4',
            'ship_schedule',
            'xxx5',
            'xxx6',
            'xxx7',
            'xxx8',
            'xxx9',
            'xxx10',
            'xxx11',
            'xxx12',
            'xxx13',
            'xxx14',
            'ship_name1',
            'xxx15',
            'xxx16',
            'xxx17',
            'xxx18',
            'ship_name2',
            'xxx19',
            'xxx20',
            'xxx21',
            'xxx22',
            'ship_name3',
            'xxx23',
            'xxx24',
            'xxx25',
            'xxx26',
            'ship_name4',
            'xxx27',
            'xxx28',
            'xxx29',
            'xxx30',
            'ship_name5',
            'xxx31',
            'xxx32',
            'xxx33',
            'xxx34',
            'ship_name6',
            'xxx35',
            'xxx36',
            'xxx37',
            'xxx38',
            'ship_name7',
            'xxx39',
            'xxx40',
            'xxx41',
            'xxx42',
            'ship_name8',
            'xxx43',
            'xxx44',
            'xxx45',
            'xxx46',
            'ship_name9',
            'xxx47',
            'xxx48',
            'xxx49',
            'xxx50',
            'ship_name10',
            'xxx51',
            'xxx52',
            'xxx53',
            'xxx',
            'xxx',
            'xxx',
            'xxx',
            'xxx',
            'xxx',
            'xxx',
            'foreign_check',
            'featured_amount',
            'bold',
            'highlight',
            'xxxx',
            'provider',
            'asin_amazon',
            'watch_only_prime',
            'watch_stock',
            'watch_profit',
            'xxx',
            'xxx',
            'start_price',
            'bid_or_buy_price',
            'original_price',
            'listing_status'
          ]"
          :labels="label_csv"
          :name="nameFolderSelected + '.csv'"
        >
          <button
            :disabled="!nameFolderSelected"
            class="btn btn-info mx-10 px-3"
            style="float: right;"
          >
            <i class="fa fa-download mr-1"></i>エクスポート
          </button>
        </JsonCSV> -->
        <button
          @click="$refs.inputCSV.click()"
          class="btn btn-info mx-10 px-3"
          style="float: right;"
        >
          <i class="fa fa-upload mr-1"></i>インポート
        </button>
        <input
          hidden
          type="file"
          ref="inputCSV"
          accept=".csv"
          name="inputCSV"
          id="inputCSV"
          @change="onUploadFileCSV"
        />
      </div>
      <div class="px-10 table-responsive">
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
        <table class="table  table-hover" style="width: 100%">
          <thead class="thead-purple">
            <tr>
              <th class="text-center">
                <input
                  type="checkbox"
                  v-model="isCheckAllProduct"
                  style="cursor: pointer; width: 15px; height: 15px;"
                />
              </th>
              <th width="120">画像</th>
              <th>Y！オーク商品の名前</th>
              <!-- <th class="text-center" width="60">期間<br />(日)<br /></th> -->
              <th class="text-center" width="100">開始価格<br /></th>
              <th class="text-center" width="100">即決価格<br /></th>
              <th class="text-center" width="100">送料<br /></th>
              <!-- <th class="text-center" width="70">出品停止<br />在庫数<br /></th> -->
              <th class="text-center" width="80">数量<br /></th>
              <th class="text-center" width="100">仕入元の<br />値段</th>
              <th class="text-center" width="100">
                想定利益
              </th>
              <th class="text-center" width="70">仕入元の<br />在庫数</th>
              <th class="text-center" width="80">出品中<br /></th>
              <!-- <th class="text-center" width="60">在庫<br />監視<br /></th>
              <th class="text-center" width="60">利益<br />監視<br /></th>
              <th class="text-center" width="70">
                プライム<br />のみ監視<br />
              </th> -->
              <th class="text-center" width="70">
                画像挿入
              </th>
              <th class="text-center" width="70">
                Amazon<br />カテゴリ<br />ID
              </th>
              <th class="text-center" width="70">
                ヤフー<br />カテゴリ<br />ID<br />(出品予定)
              </th>
              <th class="text-center" width="120">
                紐付け情報
              </th>
              <th width="120" class="text-center">
                備考
              </th>
              <th width="120">
                備考
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(product, index) in tableData" :key="product._id">
              <td class="text-center" width="50">
                <!-- <div
                  style="cursor: pointer; height: 50px; display: flex; justify-content: center; align-items: center;"
                  @click="$refs.checkBox.click()"
                > -->
                <input
                  type="checkbox"
                  style="cursor: pointer; width: 15px; height: 15px;"
                  v-model="selectedProducts"
                  :value="product"
                  :id="product._id"
                />
                <!-- </div> -->
              </td>
              <td width="120">
                <img
                  v-if="product.images && product.images.length"
                  :src="
                    product.images[0].includes('http')
                      ? product.images[0]
                      : SERVER_HOST_UPLOAD + product.images[0]
                  "
                  style="min-width: 50px; max-height: 100px; object-fit: contain;"
                />
              </td>
              <td width="200">
                <router-link
                  :to="{
                    name: 'CreateProductYahooLocal',
                    params: { id: product._id }
                  }"
                  >{{ product.product_yahoo_title }}</router-link
                >
                <!-- <a href="#" @click="onClickTitle(product._id)">{{}}</a> -->
              </td>
              <!-- <td class="text-center">{{ product.duration }}</td> -->
              <td class="text-center">
                <span v-if="product.start_price">
                  {{
                    product.start_price
                      ? product.start_price.toLocaleString("ja-JP")
                      : "-"
                  }}{{ product.start_price ? "円" : "" }}
                </span>
                <div v-else>
                  <div>
                    {{
                      product.start_price_temp
                        ? product.start_price_temp.toLocaleString("ja-JP")
                        : "-"
                    }}{{ product.start_price_temp ? "円" : "" }}
                  </div>
                  <span
                    class="p-1"
                    style="background-color: #b7b6b6;font-size: 10px"
                    >自動設定</span
                  >
                </div>
              </td>
              <td class="text-center">
                <span v-if="product.bid_or_buy_price">
                  {{
                    product.bid_or_buy_price
                      ? product.bid_or_buy_price.toLocaleString("ja-JP")
                      : "-"
                  }}{{ product.bid_or_buy_price ? "円" : "" }}
                </span>
                <div v-else>
                  <div>
                    {{
                      product.bid_or_buy_price_temp
                        ? product.bid_or_buy_price_temp.toLocaleString("ja-JP")
                        : "-"
                    }}{{ product.bid_or_buy_price_temp ? "円" : "" }}
                  </div>
                  <span
                    class="p-1"
                    style="background-color: #b7b6b6;font-size: 10px"
                    >自動設定</span
                  >
                </div>
              </td>
              <td class="text-center">
                <span v-if="product.ship_fee1">
                  {{
                    product.ship_fee1
                      ? product.ship_fee1.toLocaleString("ja-JP")
                      : "-"
                  }}{{ product.ship_fee1 ? "円" : "" }}
                </span>
                <div v-else>
                  <div>
                    {{
                      product.ship_fee1_temp
                        ? product.ship_fee1_temp.toLocaleString("ja-JP")
                        : "-"
                    }}{{ product.ship_fee1_temp ? "円" : "" }}
                  </div>
                  <span
                    class="p-1"
                    style="background-color: #b7b6b6;font-size: 10px"
                    >自動設定</span
                  >
                </div>
              </td>
              <!-- <td class="text-center">{{ product.quantity_check }}</td> -->
              <td class="text-center">
                <span v-if="product.quantity">
                  {{
                    product.quantity
                      ? product.quantity.toLocaleString("ja-JP")
                      : "-"
                  }}{{ product.quantity ? "円" : "" }}
                </span>
                <div v-else>
                  <div>
                    {{
                      product.quantity_temp
                        ? product.quantity_temp.toLocaleString("ja-JP")
                        : "-"
                    }}{{ product.quantity_temp ? "円" : "" }}
                  </div>
                  <span
                    class="p-1"
                    style="background-color: #b7b6b6;font-size: 10px"
                    >自動設定</span
                  >
                </div>
              </td>
              <td class="text-center">
                {{ getPriceOriginal(product) }}
                <div>
                  <a
                    class="btn btn-xs btn-warning text-white"
                    :href="`https://www.amazon.co.jp/dp/${product.asin_amazon}`"
                    target="_blank"
                  >
                    購入元
                  </a>
                </div>
              </td>
              <td class="text-center">
                {{
                  product.actual_profit
                    ? product.actual_profit.toLocaleString("ja-JP")
                    : 0
                }}{{ product.actual_profit ? "円" : "" }}
              </td>
              <td class="text-center">{{ product.count }}</td>
              <td class="text-center">
                <span
                  v-if="product.listing_status === 'UNDER_EXHIBITION'"
                  class="label label-info"
                  >出品済み</span
                >
                <span v-else class="label label-danger">未出品</span>
              </td>
              <!-- <td class="text-center">
                <span
                  v-if="product.watch_stock === '1'"
                  class="label label-success"
                  >ON</span
                >
                <span v-else class="label label-danger">OFF</span>
              </td>
              <td class="text-center">
                <span
                  v-if="product.watch_profit === '1'"
                  class="label label-success"
                  >ON</span
                >
                <span v-else class="label label-danger">OFF</span>
              </td>
              <td class="text-center">
                <span
                  v-if="product.watch_only_prime === '1'"
                  class="label label-success"
                  >ON</span
                >
                <span v-else class="label label-danger">OFF</span>
              </td> -->
              <td class="text-center">
                <span
                  v-if="product.image_overlay_index == null"
                  class="label label-danger"
                  >なし</span
                >
                <span v-else class="label label-info">{{
                  product.image_overlay_index
                }}</span>
              </td>
              <td class="text-center">
                {{
                  product.id_category_amazon ? product.id_category_amazon : "-"
                }}
              </td>
              <td class="text-center">
                {{
                  product.yahoo_auction_category_id &&
                  product.yahoo_auction_category_id != 0
                    ? product.yahoo_auction_category_id
                    : "-"
                }}
              </td>
              <td class="text-center">{{ product.asin_amazon }}</td>
              <td class="text-center">{{ product.note }}</td>
              <td class="text-center">
                <button
                  class="btn btn-md btn-warning mb-1 mr-1"
                  @click="onEditProduct(product, index)"
                >
                  <i class="fa fa-edit"></i> 編集
                </button>
                <button
                  class="btn btn-md btn-danger mb-1 mr-1"
                  @click="onConfirmDelete(product, index)"
                >
                  <i class="fa fa-trash"></i> 削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <modal-component ref="modalOverlayImage">
      <template v-slot:header>
        <h5><i class="fa fa-image"></i> 写真を挿入</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label"
            >挿入する画像を選択します。</label
          >
          <div class="ml-5">
            <div
              v-for="(item, index) in imageInsertion"
              :key="index"
              style="align-items: center; display: flex;"
              class="my-2"
            >
              <input
                v-model="selectedImageIndex"
                class="form-check-input"
                type="radio"
                :value="index + 1"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <img
                @click="selectedImageIndex = index + 1"
                for="flexRadioDefault1"
                style="cursor: pointer; border:1px solid gray; margin-left: 10px"
                width="100px"
                height="100px"
                :src="item"
                alt=""
                srcset=""
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-1 px-4" @click="onSaveImageOverlay">
            保存
          </button>
          <button class="btn btn-default" @click="onCloseModal">
            キャンセル
          </button>
        </div>
      </template>
    </modal-component>

    <modal-component ref="modalSwitchOption">
      <template v-slot:header>
        <h5>選択された商品にどの操作を適用しますか？</h5>
      </template>
      <template>
        <div>
          適用する操作のボタンを下記より選んで押して下さい。キャンセルする場合、キャンセルボタンを押して下さい。
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-1" @click="switchOption('1')">
            {{ SWITCH_TYPE[selectedTypeWitch] }}ON
          </button>
          <button class="btn btn-danger mr-1" @click="switchOption('0')">
            {{ SWITCH_TYPE[selectedTypeWitch] }}OFF
          </button>
          <button class="btn btn-default" @click="onCloseModal">
            キャンセル
          </button>
        </div>
      </template>
    </modal-component>

    <modal-component ref="modalSelectFolder">
      <template v-slot:header>
        <h5><i class="fa fa-file"></i> フォルダ管理</h5>
      </template>
      <template>
        <div class="form-group form-line">
          <label class="col-sm-4 control-label">選択フォルダの出品予定</label>
          <div class="col-sm-7">
            <select class="form-control" v-model="selectedFolder">
              <option
                v-for="(folder, index) in folders"
                :value="folder._id"
                :key="index"
                >{{ folder.name }}</option
              >
            </select>
          </div>
          に
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-success mr-1" @click="onMoveProductToFolder">
            移動
          </button>
          <button class="btn btn-default" @click="onCloseModal">
            キャンセル
          </button>
        </div>
      </template>
    </modal-component>

    <modal-component ref="modalDeleteProduct" :isModalBody="false">
      <template v-slot:header>
        <h5>選択された商品を取扱商品から除外しますか？</h5>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button class="btn btn-primary mr-1" @click="onDeleteMultipleProduct">
            移動
          </button>
          <button class="btn btn-default" @click="onCloseModal">
            キャンセル
          </button>
        </div>
      </template>
    </modal-component>

    <modal-component
      ref="modalEditProduct"
      classModalDialog="modal-lg"
      styleModalFooter="justify-content: space-between"
    >
      <template v-slot:header>
        <h5 style="word-break: break-all;">
          「{{ selectedEditProduct.displayName }}」の編集
        </h5>
      </template>
      <template>
        <div class="form-group">
          <div>
            <label for="">Y！オーク商品名</label>
            <input
              type="text"
              class="form-control"
              ref="productYahooTitle"
              v-model="selectedEditProduct.product_yahoo_title"
              @input="onChangeTitlte"
            />
          </div>
          <div v-if="isShowErrorTitle" style="text-align: end;">
            <span style="color: red">入力最大は65文字</span>
          </div>
        </div>
        <div class="form-group">
          <label for="">カテゴリーID</label>
          <input
            type="number"
            class="form-control"
            v-model="selectedEditProduct.yahoo_auction_category_id"
          />
        </div>
        <div class="form-group">
          <label for="">開始価格</label>
          <input
            type="number"
            class="form-control"
            v-model="selectedEditProduct.start_price"
          />
        </div>
        <div class="form-group">
          <label for="">即決価格</label>
          <input
            type="number"
            class="form-control"
            v-model="selectedEditProduct.bid_or_buy_price"
          />
        </div>
        <div class="form-group">
          <label for="">送料</label>
          <input
            type="number"
            class="form-control"
            v-model="selectedEditProduct.ship_fee1"
          />
        </div>
        <div class="form-group">
          <label for="">個数</label>
          <input
            type="number"
            class="form-control"
            v-model="selectedEditProduct.quantity"
          />
        </div>
        <div class="form-group">
          <label for="">出品停止在庫数</label>
          <input
            type="number"
            class="form-control"
            v-model="selectedEditProduct.quantity_check"
          />
        </div>
        <div class="form-group">
          <label for="">商品詳細</label>
          <textarea
            class="form-control"
            id=""
            cols="30"
            rows="7"
            v-model="selectedEditProduct.description"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="">備考</label>
          <textarea
            class="form-control"
            id=""
            cols="30"
            rows="2"
            v-model="selectedEditProduct.note"
          ></textarea>
        </div>
      </template>
      <template v-slot:button>
        <div class="button-group">
          <button
            class="btn btn-primary mr-1 px-4"
            @click="onSaveEditProduct()"
          >
            保存
          </button>
          <button
            class="btn btn-default"
            @click="$refs.modalEditProduct.closeModal()"
          >
            キャンセル
          </button>
        </div>
        <button
          class="btn btn-warning"
          @click="goToFormProduct(selectedEditProduct._id)"
        >
          その他の項目を編集
        </button>
      </template>
    </modal-component>
  </div>
</template>

<script>
import ProductYahooApi from "@/services/ProductYahooApi";
import FolderApi from "@/services/FolderApi";
import { mapGetters } from "vuex";
import ImageInsertionApi from "@/services/ImageInsertionApi";
import JsonCSV from "vue-json-csv";

const PRODUCT_STATUS = [
  { display: "中古", value: "used" },
  { display: "新品", value: "new" },
  { display: "その他", value: "other" }
];
const HOLDING_PERIOD = [
  { display: "当日終了", value: 0 },
  { display: "1日間", value: 1 },
  { display: "2日間", value: 2 },
  { display: "3日間", value: 3 },
  { display: "4日間", value: 4 },
  { display: "5日間", value: 5 },
  { display: "6日間", value: 6 },
  { display: "7日間", value: 7 }
];
const ENDING_TIME = [
  { display: "午前0時から午前1時", value: 0 },
  { display: "午前1時から午前2時", value: 1 },
  { display: "午前2時から午前3時", value: 2 },
  { display: "午前3時から午前4時", value: 3 },
  { display: "午前4時から午前5時", value: 4 },
  { display: "午前5時から午前6時", value: 5 },
  { display: "午前6時から午前7時", value: 6 },
  { display: "午前7時から午前8時", value: 7 },
  { display: "午前8時から午前9時", value: 8 },
  { display: "午前9時から午前10時", value: 9 },
  { display: "午前10時から午前11時", value: 10 },
  { display: "午前11時から午後0時（正午）", value: 11 },
  { display: "午後0時（正午）から午後1時", value: 12 },
  { display: "午後1時から午後2時", value: 13 },
  { display: "午後2時から午後3時", value: 14 },
  { display: "午後3時から午後4時", value: 15 },
  { display: "午後4時から午後5時", value: 16 },
  { display: "午後5時から午後6時", value: 17 },
  { display: "午後6時から午後7時", value: 18 },
  { display: "午後7時から午後8時", value: 19 },
  { display: "午後8時から午後9時", value: 20 },
  { display: "午後9時から午後10時", value: 21 },
  { display: "午後10時から午後11時", value: 22 },
  { display: "午後11時から午前0時", value: 23 }
];
const PREFECTURE = [
  { value: 1, display: "北海道" },
  { value: 2, display: "青森県" },
  { value: 3, display: "岩手県" },
  { value: 4, display: "宮城県" },
  { value: 5, display: "秋田県" },
  { value: 6, display: "山形県" },
  { value: 7, display: "福島県" },
  { value: 8, display: "茨城県" },
  { value: 9, display: "栃木県" },
  { value: 10, display: "群馬県" },
  { value: 11, display: "埼玉県" },
  { value: 12, display: "千葉県" },
  { value: 13, display: "東京都" },
  { value: 14, display: "神奈川県" },
  { value: 15, display: "新潟県" },
  { value: 16, display: "富山県" },
  { value: 17, display: "石川県" },
  { value: 18, display: "福井県" },
  { value: 19, display: "山梨県" },
  { value: 20, display: "長野県" },
  { value: 21, display: "岐阜県" },
  { value: 22, display: "静岡県" },
  { value: 23, display: "愛知県" },
  { value: 24, display: "三重県" },
  { value: 25, display: "滋賀県" },
  { value: 26, display: "京都府" },
  { value: 27, display: "大阪府" },
  { value: 28, display: "兵庫県" },
  { value: 29, display: "奈良県" },
  { value: 30, display: "和歌山県" },
  { value: 31, display: "鳥取県" },
  { value: 32, display: "島根県" },
  { value: 33, display: "岡山県" },
  { value: 34, display: "広島県" },
  { value: 35, display: "山口県" },
  { value: 36, display: "徳島県" },
  { value: 37, display: "香川県" },
  { value: 38, display: "愛媛県" },
  { value: 39, display: "高知県" },
  { value: 40, display: "福岡県" },
  { value: 41, display: "佐賀県" },
  { value: 42, display: "長崎県" },
  { value: 43, display: "熊本県" },
  { value: 44, display: "大分県" },
  { value: 45, display: "宮崎県" },
  { value: 46, display: "鹿児島県" },
  { value: 47, display: "沖縄県" },
  { value: 48, display: "海外" }
];
const SHIP_SCHEDULE = [
  { display: "１〜２日", value: 1 },
  { display: "２〜３日", value: 7 },
  { display: "３〜７日", value: 2 },
  { display: "７日〜１３日", value: 5 },
  { display: "１４日以降", value: 6 }
];
const CONSPICUOUS_ICON = [
  { display: "美品", value: 2 },
  { display: "非売品", value: 3 },
  { display: "限定品", value: 4 },
  { display: "保証書付", value: 5 },
  { display: "全巻セット", value: 6 },
  { display: "正規店購入", value: 7 },
  { display: "産地直送", value: 8 }
];
const LISTING_STATUS = [
  { display: "未出品", value: "NOT_LISTED" },
  { display: "出品中", value: "UNDER_EXHIBITION" }
];
const SWITCH_OPTION = [
  { display: "OFF", value: "0" },
  { display: "ON", value: "1" }
];
const SWITCH_TYPE = {
  watch_stock: "在庫監視",
  watch_profit: "利益監視",
  watch_only_prime: "プライムのみ監視"
};

const PROXY_STATUS_DIE = "die";

export default {
  name: "YahooAuctionProducts",
  components: {
    JsonCSV
  },
  data() {
    return {
      label_csv: {
        _id: "ID",
        yahoo_auction_category_id: "★カテゴリID",
        product_yahoo_title: "Y！オーク商品の名前",
        type_import_desciption: "説明の入力方式(0:直接入力/1:ファイル)",
        description: "★商品説明またはファイル",
        image1: "画像1ファイル",
        image2: "画像2ファイル",
        image3: "画像3ファイル",
        image4: "画像4ファイル",
        image5: "画像5ファイル",
        image6: "画像6ファイル",
        image7: "画像7ファイル",
        image8: "画像8ファイル",
        image9: "画像9ファイル",
        image10: "画像10ファイル",
        image_comment1: "画像1コメント",
        image_comment2: "画像2コメント",
        image_comment3: "画像3コメント",
        image_comment4: "画像4コメント",
        image_comment5: "画像5コメント",
        image_comment6: "画像6コメント",
        image_comment7: "画像7コメント",
        image_comment8: "画像8コメント",
        image_comment9: "画像9コメント",
        image_comment10: "画像10コメント",
        count: "個数",
        start_price: "★開始価格",
        bid_or_buy_price: "即決価格",
        offer: "値下げ交渉",

        duration: "★開催期間",
        closing_time: "★終了時刻",
        num_resubmit: "値下げ交渉",
        xxx: "自動値下げ率(0)",
        auto_extension: "自動延長",
        close_early: "早期終了",
        min_bid_rating: "入札者制限",
        bad_rating_ratio: "悪い評価",
        bid_credit_limit: "本人確認",
        status: "★商品状態(0:中古/1:新品/2:その他)",
        status_comment: "状態の備考",
        retpolicy: "返品可否(0:不可/1:可)",
        retpolicy_comment: "返品の備考",
        xxx: "Yahoo!かんたん決済",
        xxx: "みずほ銀行(3611464/0001)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "(未設定)",
        xxx: "出品者情報開示前チェック",
        location: "★出品地域(1:北海道～47:沖縄/48:海外)",
        city: "市区町村",
        shipping: "送料負担(0:落札者/1:出品者)",
        xxx: "送料入力方式(0:落札後/1:出品時/2:着払い)",
        ship_schedule: "発送までの日数(1:1～2日/2:3～7日/3:8日以降)",
        xxx: "ヤフネコ!(宅急便)",
        xxx: "ヤフネコ!(宅急便コンパクト)",
        xxx: "ヤフネコ!(ネコポス)",
        xxx: "ゆうパック(おてがる版)",
        xxx: "ゆうパケット(おてがる版)",
        xxx: "(未使用)",
        xxx: '"はこBOON mini"',
        xxx: "荷物のサイズ(1～7)",
        xxx: "荷物のサイズ(1～7)",
        xxx: "荷物の重さ(1～7)",
        ship_name1: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name2: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name3: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name4: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name5: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name6: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name7: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name8: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name9: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        ship_name10: "配送方法1",
        xxx: "全国一律",
        xxx: "北海道",
        xxx: "沖縄",
        xxx: "離島",
        xxx: "着払い[ゆうパック]",
        xxx: "着払い[ゆうメール]",
        xxx: "着払い[ゆうメール]",
        xxx: "着払い[宅急便(ヤマト運輸)]",
        xxx: "着払い[飛脚宅配便(佐川急便)]",
        xxx: "着払い[カンガルー便(西濃運輸)]",
        foreign_check: "海外対応",
        featured_amount: "注目オプション(有料)",
        bold: "太字(有料)",
        highlight: "背景色(有料)",
        xxx: "アフィリエイト(有料)",
        provider: "仕入れ先",
        asin_amazon: "仕入れ先ID",
        watch_only_prime: "プライムのみ監視",
        watch_stock: "在庫監視",
        watch_profit: "利益監視",
        xxx: "枠デザイン",
        xxx:
          "発送日数(1:１~２日/7:２～３日/2:３～７日/5:７日～１３日/6:１４日以降)",
        start_price: "想定開始価格",
        bid_or_buy_price: "想定即決価格",
        original_price: "仕入れ金額",
        listing_status: "出品中"
      },
      products: [],
      HOLDING_PERIOD,
      ENDING_TIME,
      PREFECTURE,
      SHIP_SCHEDULE,
      CONSPICUOUS_ICON,
      PRODUCT_STATUS,
      SERVER_HOST_UPLOAD: process.env.SERVER_API + "uploads/",
      page: 1,
      searchProducts: [],
      searchObj: {
        folder: null,
        queryString: "",
        asin_amazon: "",
        listingStatus: null,
        watch_stock: null,
        watch_profit: null,
        watch_only_prime: null
      },
      nameFolderSelected: null,
      folders: [],
      LISTING_STATUS,
      SWITCH_OPTION,
      selectedProducts: [],
      isCheckAllProduct: false,
      selectedTypeWitch: "",
      SWITCH_TYPE,
      selectedFolder: null,
      selectedEditProduct: {},
      imageInsertion: [],
      selectedImageIndex: null,
      isShowErrorTitle: false
    };
  },
  async mounted() {
    await this.getListProduct();
    await this.getImageInsertion();
    this.getFolders();
  },
  computed: {
    ...mapGetters({
      selectedYahooAccount: "getSelectedYahooAccount",
      userInfo: "getUserInfo",
      adminViewUser: "getAdminViewUser"
    }),
    yahooAccountId() {
      return this.selectedYahooAccount._id;
    },
    tableData() {
      return this.searchProducts.slice(
        (this.page - 1) * this.$constants.PAGE_SIZE,
        this.page * this.$constants.PAGE_SIZE
      );
    },
    pageCount() {
      return Math.ceil(this.searchProducts.length / this.$constants.PAGE_SIZE);
    },
    isDieProxy() {
      return this.selectedYahooAccount.proxy &&
        this.selectedYahooAccount.proxy.length
        ? this.selectedYahooAccount.proxy[0].status === PROXY_STATUS_DIE
        : false;
    },
    dataExport() {
      let dataExport = this.products.filter(product => {
        let condition = true;
        if (this.searchObj.folder) {
          condition = condition && product.folder_id === this.searchObj.folder;
        }
        return condition;
      });

      dataExport = dataExport.map(item => {
        return {
          ...item,
          xxx: "",
          _id: "_id|" + item._id,
          yahoo_auction_category_id: item.yahoo_auction_category_id || "",
          product_yahoo_title: item.product_yahoo_title || "",
          type_import_desciption: item.type_import_desciption || "",
          description: item.description || "",
          image1: item.image1 || "",
          image2: item.image2 || "",
          image3: item.image3 || "",
          image4: item.image4 || "",
          image5: item.image5 || "",
          image6: item.image6 || "",
          image7: item.image7 || "",
          image8: item.image8 || "",
          image9: item.image9 || "",
          image10: item.image10 || "",
          image_comment1: item.image_comment1 || "",
          image_comment2: item.image_comment2 || "",
          image_comment3: item.image_comment3 || "",
          image_comment4: item.image_comment4 || "",
          image_comment5: item.image_comment5 || "",
          image_comment6: item.image_comment6 || "",
          image_comment7: item.image_comment7 || "",
          image_comment8: item.image_comment8 || "",
          image_comment9: item.image_comment9 || "",
          image_comment10: item.image_comment10 || "",
          count: item.count || "",
          start_price: item.start_price || "",
          bid_or_buy_price: item.bid_or_buy_price || "",
          offer: item.offer || "",
          duration: item.duration || "",
          closing_time: item.closing_time || "",
          num_resubmit: item.num_resubmit || "",
          auto_extension: item.auto_extension || "",
          close_early: item.close_early || "",
          min_bid_rating: item.min_bid_rating || "",
          bad_rating_ratio: item.bad_rating_ratio || "",
          bid_credit_limit: item.bid_credit_limit || "",
          status: item.status || "",
          status_comment: item.status_comment || "",
          retpolicy: item.retpolicy || "",
          retpolicy_comment: item.retpolicy_comment || "",
          offer: item.offer || "",
          location: item.location || "",
          city: item.city || "",
          shipping: item.shipping || "",
          ship_schedule: item.ship_schedule || "",
          ship_name1: item.ship_name1 || "",
          ship_name2: item.ship_name2 || "",
          ship_name3: item.ship_name3 || "",
          ship_name4: item.ship_name4 || "",
          ship_name5: item.ship_name5 || "",
          ship_name6: item.ship_name6 || "",
          ship_name7: item.ship_name7 || "",
          ship_name8: item.ship_name8 || "",
          ship_name9: item.ship_name9 || "",
          ship_name10: item.ship_name10 || "",
          foreign_check: item.foreign_check || "",
          featured_amount: item.featured_amount || "",
          bold: item.bold || "",
          highlight: item.highlight || "",
          provider: item.provider || "",
          asin_amazon: item.asin_amazon || "",
          watch_only_prime: item.watch_only_prime || "",
          watch_stock: item.watch_stock || "",
          watch_profit: item.watch_profit || "",
          start_price: item.start_price || "",
          bid_or_buy_price: item.bid_or_buy_price || "",
          original_price: item.original_price || "",
          listing_status:
            item.listing_status === "UNDER_EXHIBITION" ? "出品済み" : "未出品"
        };
      });
      return dataExport;
    }
  },
  methods: {
    getPriceOriginal(product) {
      if (product.import_price && product.amazon_shipping_fee) {
        return `${product.import_price.toLocaleString("ja-JP")}円 + 送料${
          product.amazon_shipping_fee
        }円`;
      } else if (product.import_price) {
        return `${product.import_price.toLocaleString("ja-JP")}円`;
      }
      return "-";
    },
    onClickTitle(idProduct) {
      this.$router.push({
        name: "CreateProductYahooLocal",
        params: { id: idProduct }
      });
    },
    onChangeSelectFolder(event) {
      let _id = event.target.value;
      if (_id) {
        let folderSelected = this.folders.find(item => item._id === _id);
        if (folderSelected) {
          this.nameFolderSelected = folderSelected.name;
        } else {
          this.nameFolderSelected = "";
        }
      } else {
        this.nameFolderSelected = "";
      }
    },
    readFileText(file) {
      return new Promise((resolve, reject) => {
        try {
          let reader = new FileReader();
          reader.onload = async function(e) {
            let arrLines = e.target.result
              .split("_id|")
              .filter(item => item !== "");
            let contentCsv = arrLines.slice(1, arrLines.length);
            let productList = [];
            contentCsv.forEach(line => {
              if (line) {
                let pros = line.trim().split(",");
                let start_price = pros[2].replace(/\D+/, "");
                let bid_or_buy_price = pros[3].replace(/\D+/, "");
                let ship_fee1 = pros[4].replace(/\D+/, "");
                let quantity = pros[5].replace(/\D+/, "");
                let import_price = pros[6].replace(/\D+/, "");
                let count = pros[7].replace(/\D+/, "");
                let image_overlay_index = pros[8].replace(/\D+/, "");
                start_price = start_price ? parseInt(start_price) : start_price;
                bid_or_buy_price = bid_or_buy_price
                  ? parseInt(bid_or_buy_price)
                  : bid_or_buy_price;
                ship_fee1 = ship_fee1 ? parseInt(ship_fee1) : ship_fee1;
                quantity = quantity ? parseInt(quantity) : quantity;
                import_price = import_price
                  ? parseInt(import_price)
                  : import_price;
                count = count ? parseInt(count) : count;
                image_overlay_index = image_overlay_index
                  ? parseInt(image_overlay_index)
                  : image_overlay_index;

                let data = {
                  _id: pros[0],
                  product_yahoo_title: pros[1],
                  start_price,
                  bid_or_buy_price,
                  ship_fee1,
                  quantity,
                  import_price,
                  count,
                  image_overlay_index,
                  note: pros[9],
                  description: pros[10],
                  yahoo_auction_category_id: pros[11]
                };
                productList.push(data);
              }
            });
            resolve(productList);
          };
          reader.readAsText(file);
        } catch (error) {
          reject(error);
        }
      });
    },
    async onUploadFileCSV(event) {
      let files = event.target.files;
      let listProduct = [];

      const file = files[0];

      if (file.type !== "application/vnd.ms-excel") {
        return this.$swal.fire({
          icon: "error",
          title: "エラー",
          text:
            "CSVファイルしかアップ出来ません。CSVファイルを選択してください。!"
        });
      }

      let data = await this.readFileText(file);
      listProduct = [...listProduct, ...data];
      if (listProduct.length > 0) {
        let res = await ProductYahooApi.updateDataByCsv({ listProduct });
        if (res && res.status === 200) {
          let listResult = res.data.listResult;
          this.products = this.products.map(item => {
            let newData = listResult.find(x => x._id === item._id);
            if (newData) {
              return newData;
            }
            return item;
          });
          this.searchProducts = this.products;
          this.$swal.fire({
            icon: "success",
            title: "更新成功"
          });
        }
      }
      event.target.value = "";
    },
    async onChangeTitlte(value, text) {
      if (
        this.selectedEditProduct &&
        this.selectedEditProduct.product_yahoo_title &&
        this.selectedEditProduct.product_yahoo_title.length > 65
      ) {
        this.selectedEditProduct.product_yahoo_title = this.selectedEditProduct.product_yahoo_title.substring(
          0,
          65
        );
        this.isShowErrorTitle = true;
      } else {
        this.isShowErrorTitle = false;
      }
    },
    async getImageInsertion() {
      let res = await ImageInsertionApi.get(this.yahooAccountId);
      if (res && res.status == 200) {
        this.imageInsertion = res.data.imageInsertion.images.map(image => {
          return this.SERVER_HOST_UPLOAD + image;
        });
      }
    },

    openModalOverLayImage() {
      this.$refs.modalOverlayImage.openModal();
    },
    async getFolders() {
      let res = await FolderApi.get(this.selectedYahooAccount._id);
      if (res && res.status === 200) {
        this.folders = res.data.folders;
        if (this.folders.length) {
          this.selectedFolder = this.folders[0]._id;
        }
      }
    },
    async getListProduct() {
      try {
        let res = await ProductYahooApi.get(this.yahooAccountId);
        if (res && res.status === 200) {
          this.products = res.data.products;
          this.searchProducts = this.products;
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "エラー",
          text: error.message
        });
      }
    },
    onEditProduct(product, index) {
      this.selectedEditProduct = {
        ...product,
        displayName: product.product_yahoo_title
      };
      this.$refs.modalEditProduct.openModal();
    },
    async onSaveEditProduct() {
      let params = {
        ...this.selectedEditProduct
      };
      let formData = new FormData();
      formData.append("payload", JSON.stringify(params));
      let res = await ProductYahooApi.update(
        this.selectedEditProduct._id,
        formData
      );
      if (res && res.status === 200) {
        this.$swal.fire({
          icon: "success",
          title: "商品情報を変更しました。",
          timer: 500,
          showConfirmButton: false
        });
        this.$refs.modalEditProduct.closeModal();
        let findIndex = this.searchProducts.findIndex(
          item => item._id === this.selectedEditProduct._id
        );
        this.searchProducts[findIndex] = { ...res.data.result };
        this.searchProducts = [...this.searchProducts];
      }
    },
    onConfirmDelete(product, index) {
      let self = this;
      self.$swal
        .fire({
          title: "削除",
          text: "この製品を本当に削除しますか？",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00a65a",
          cancelButtonColor: "#f39c12",
          confirmButtonText: '<i class="fa fa-check-square"></i> はい',
          cancelButtonText: '<i class="fa fa-times"></i>  番号'
        })
        .then(async result => {
          if (result.isConfirmed) {
            let res = await ProductYahooApi.delete(product._id);
            if (res && res.status == 200) {
              let findIndex = this.searchProducts.findIndex(
                item => item._id === product._id
              );
              this.searchProducts.splice(findIndex, 1);
              if (this.tableData.length === 0) {
                this.page -= 1;
              }

              this.selectedProducts = this.selectedProducts.filter(
                item => item._id !== product._id
              );
              self.$swal.fire(
                "削除しました！",
                "商品が削除されました。",
                "success"
              );
            }
          }
        });
    },
    goToFormProduct(id) {
      if (
        (id &&
          confirm(
            "ページを移動します。ページを移動すると、未保存の編集内容は破棄されます、本当によろしいですか？"
          )) ||
        !id
      ) {
        this.$router.push({ name: "CreateProductYahooLocal", params: { id } });
      }
    },
    displayProductStatus(product) {
      return this.PRODUCT_STATUS.find(item => item.value === product.status)
        ? this.PRODUCT_STATUS.find(item => item.value === product.status)
            .display
        : "";
    },
    displayDuration(product) {
      return this.HOLDING_PERIOD.find(item => item.value === product.duration)
        ? this.HOLDING_PERIOD.find(item => item.value === product.duration)
            .display
        : "";
    },
    displayEndingTime(product) {
      return this.ENDING_TIME.find(item => item.value === product.closing_time)
        ? this.ENDING_TIME.find(item => item.value === product.closing_time)
            .display
        : "";
    },
    displayLocation(product) {
      return this.PREFECTURE.find(item => item.value === product.location)
        ? this.PREFECTURE.find(item => item.value === product.location).display
        : "";
    },
    onSearchProduct() {
      this.searchProducts = this.products.filter(product => {
        let condition = true;
        if (this.searchObj.folder) {
          condition = condition && product.folder_id === this.searchObj.folder;
        }
        if (this.searchObj.queryString) {
          condition =
            condition &&
            product.product_yahoo_title.includes(this.searchObj.queryString);
        }
        if (this.searchObj.asin_amazon) {
          condition =
            condition &&
            product.asin_amazon.includes(this.searchObj.asin_amazon);
        }

        if (this.searchObj.listingStatus) {
          condition =
            condition &&
            product.listing_status === this.searchObj.listingStatus;
        }
        if (Number.isInteger(parseInt(this.searchObj.watch_stock))) {
          condition =
            condition && product.watch_stock === this.searchObj.watch_stock;
        }
        if (Number.isInteger(parseInt(this.searchObj.watch_profit))) {
          condition =
            condition && product.watch_profit === this.searchObj.watch_profit;
        }
        if (Number.isInteger(parseInt(this.searchObj.watch_only_prime))) {
          condition =
            condition &&
            product.watch_only_prime === this.searchObj.watch_only_prime;
        }
        if (condition) {
          return product;
        }
      });
      this.page = 1;
    },
    clearSearchProduct() {
      this.searchObj = {
        folder: null,
        queryString: "",
        listingStatus: null,
        watch_stock: null,
        watch_profit: null,
        watch_only_prime: null
      };
      this.searchProducts = [...this.products];
    },
    onOpenModalWitchOption(type) {
      this.selectedTypeWitch = type;
      this.$refs.modalSwitchOption.openModal();
    },
    async switchOption(value) {
      let params = {
        ids: this.selectedProducts.map(item => item._id),
        type: this.selectedTypeWitch,
        value
      };
      let res = await ProductYahooApi.switchWatchOption(params);
      if (res && res.status === 200) {
        let title = "";
        switch (this.selectedTypeWitch) {
          case "watch_stock":
            title = "選択された商品の在庫監視設定を変更しました。";
            break;
          case "watch_profit":
            title = "選択された商品の利益監視設定を変更しました。";
            break;
          case "watch_only_prime":
            title = "選択された商品のプライムのみ監視設定を変更しました。";
            break;
          default:
            break;
        }
        this.selectedProducts = this.selectedProducts.map(item => {
          item[this.selectedTypeWitch] = value;
          return item;
        });
        this.isCheckAllProduct = false;
        this.onCloseModal();
        this.$swal.fire({
          icon: "success",
          title: title
        });
      }
    },
    onCloseModal() {
      this.$refs.modalSwitchOption.closeModal();
      this.$refs.modalSelectFolder.closeModal();
      this.$refs.modalDeleteProduct.closeModal();
      this.$refs.modalOverlayImage.closeModal();
    },
    async onMoveProductToFolder() {
      let params = {
        ids: this.selectedProducts.map(item => item._id),
        folder_id: this.selectedFolder
      };
      let res = await ProductYahooApi.changeProductFolder(params);
      if (res && res.status === 200) {
        this.selectedProducts = this.selectedProducts.map(item => {
          item.folder_id = this.selectedFolder;
          return item;
        });
        this.onCloseModal();
        this.$swal.fire({
          icon: "success",
          title: "取扱商品フォルダの設定を行いました。"
        });
      }
    },
    async onSaveImageOverlay() {
      let params = {
        ids: this.selectedProducts.map(item => item._id),
        selectedImageIndex: this.selectedImageIndex
      };
      let res = await ProductYahooApi.setOverlayImage(params);
      if (res && res.status === 200) {
        this.isCheckAllProduct = false;
        this.onCloseModal();

        this.selectedProducts = this.selectedProducts.map(item => {
          item.image_overlay_index = this.selectedImageIndex;
          return item;
        });

        this.selectedProducts = [];
        this.$swal.fire({
          icon: "success",
          title: "更新成功"
        });
      }
    },
    async onDeleteMultipleProduct() {
      let params = {
        ids: this.selectedProducts.map(item => item._id)
      };
      let res = await ProductYahooApi.deleteMultipleProduct(params);
      if (res && res.status === 200) {
        this.selectedProducts.forEach(item => {
          let findIndex = this.searchProducts.findIndex(
            product => product._id === item._id
          );
          this.searchProducts.splice(findIndex, 1);
        });

        this.isCheckAllProduct = false;
        this.selectedProducts = [];
        this.onCloseModal();
        this.$swal.fire({
          icon: "success",
          title: "取扱商品フォルダの設定を行いました。"
        });
        if (this.tableData.length === 0) {
          this.page -= 1;
        }
      }
    },
    async onUploadYahooNow() {
      let params = {
        ids: this.selectedProducts.map(item => item._id),
        yahoo_account_id: this.yahooAccountId
      };
      let res = await ProductYahooApi.uploadProductNow(params);
      if (res && res.status === 200) {
        let results = res.data.results;
        // results.map(item => {
        //   if (item.success) {
        //   } else {
        //   }
        // });

        let html = `
        <div>
          <span style="font-weight: bold; color: green">成功:  ${
            results.filter(item => item.success).length
          }</span>
        </div>
        <div>
          <span style="font-weight: bold; color: red">エラー: ${
            results.filter(item => !item.success).length
          }</span>
        </div>
        `;
        this.isCheckAllProduct = false;
        this.selectedProducts = this.selectedProducts.map(item => {
          for (const result of results) {
            if (result.product_id === item._id && result.success) {
              item.listing_status = "UNDER_EXHIBITION";
            }
          }
          return item;
        });
        this.selectedProducts = [];
        this.$swal.fire({
          icon: "success",
          html
        });
      }
    }
  },
  watch: {
    isCheckAllProduct() {
      if (this.isCheckAllProduct) {
        this.selectedProducts = [...this.tableData];
      } else {
        this.selectedProducts = [];
      }
    },
    selectedProducts() {
      if (
        this.selectedProducts.length &&
        this.selectedProducts.length == this.tableData.length
      ) {
        this.isCheckAllProduct = true;
      } else {
        this.isCheckAllProduct = false;
      }
    },
    page() {
      this.isCheckAllProduct = false;
      this.selectedProducts = [];
    }
  }
};
</script>

<style scoped>
.form-search {
  padding: 20px 0;
}
label {
  font-weight: bold;
  margin-bottom: 5px;
}
.info-title {
  font-size: 20px;
  margin: 20px 0 5px;
}
.title-col {
  width: 200px;
}
</style>
