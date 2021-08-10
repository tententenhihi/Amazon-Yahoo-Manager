var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductGlobalSetting = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    yahoo_account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YahooAccount',
        default: '',
    },
    template: {
        type: Number,
        required: true,
        default: 1,
    },
    payment_detail: {
        type: String,
        default: `○ Yahoo!かんたん決済
        ※他のお支払方法には対応いたしかねますのでご了承ください。`,
    },
    delivery_detail: {
        type: String,
        default: `■ 発送について
        ■ ご入金確認後、3営業日以内発送
        ■配送方法：ヤマト運輸または郵便局　沖縄・北海道含む　送料は全国一律 『1300円』
        
        
        年末年始の発送は、業者も休みになる関係でいつもより遅れます。あらかじめご了承ください `,
    },
    precaution_detail: {
        type: String,
        default: `■ 他商品同梱について
        同日落札商品のみ　2点目以降送料1100円
        
        [例]
        A商品落札＝1300円
        同じ商品2個落札、A商品B商品落札、同梱＝1300+1100＝2400円
        同じ商品3個落札、A商品B商品C商品落札、同梱＝1300+1100+1100＝3500円`,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var ProductGlobalSettingSchema = mongoose.model('ProductGlobalSetting', ProductGlobalSetting);
module.exports = ProductGlobalSettingSchema;
