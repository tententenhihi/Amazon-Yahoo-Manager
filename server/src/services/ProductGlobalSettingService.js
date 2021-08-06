import ProductGlobalSettingModel from '../models/ProductGlobalSettingModel';

let listTemplate = [
    `<br><center>
    <table width=600 cellpadding=10>
    <tr><td bgcolor=#FFFFFF>
    <table width=100% cellspacing=0 border=0 cellpadding=0>
    <tr><td bgcolor=#CCCCFF valign=top height=32>
     <table width=100% cellspacing=0 border=0 cellpadding=0>
     <tr><td bgcolor=#EEEEFF align=center height=30 width=25%>
     <font color=#333366 size=3><b>
    商品詳細
     </b></font>
     </td>
     <td bgcolor=#FFFFFF width=75%></td>
     </tr>
     </table>
    </td></tr>
    <tr><td>
     <table cellspacing=15 width=100%><tr><td align=left>
     <font color=#333366 size=2>
    
    
    product_description
    
    
     </font>
     </td></tr></table>
    </td></tr>
    </table>
    <table width=100% cellspacing=0 border=0 cellpadding=0>
    <tr><td bgcolor=#CCCCFF valign=top height=32>
     <table width=100% cellspacing=0 border=0 cellpadding=0>
     <tr><td bgcolor=#EEEEFF align=center height=30 width=25%>
     <font color=#333366 size=3><b>
    支払詳細
     </b></font>
     </td>
     <td bgcolor=#FFFFFF width=75%></td>
     </tr>
     </table>
    </td></tr>
    <tr><td>
     <table cellspacing=15 width=100%><tr><td align=left>
     <font color=#333366 size=2>
    
    
     payment_detail
    
    
     </font>
     </td></tr></table>
    </td></tr>
    </table>
    <table width=100% cellspacing=0 border=0 cellpadding=0>
    <tr><td bgcolor=#CCCCFF valign=top height=32>
     <table width=100% cellspacing=0 border=0 cellpadding=0>
     <tr><td bgcolor=#EEEEFF align=center height=30 width=25%>
     <font color=#333366 size=3><b>
    発送詳細
     </b></font>
     </td>
     <td bgcolor=#FFFFFF width=75%></td>
     </tr>
     </table>
    </td></tr>
    <tr><td>
     <table cellspacing=15 width=100%><tr><td align=left>
     <font color=#333366 size=2>
    
    
     delivery_detail
    
    
     </font>
     </td></tr></table>
    </td></tr>
    </table>
    <table width=100% cellspacing=0 border=0 cellpadding=0>
    <tr><td bgcolor=#CCCCFF valign=top height=32>
     <table width=100% cellspacing=0 border=0 cellpadding=0>
     <tr><td bgcolor=#EEEEFF align=center height=30 width=25%>
     <font color=#333366 size=3><b>
    注意事項
     </b></font>
     </td>
     <td bgcolor=#FFFFFF width=75%></td>
     </tr>
     </table>
    </td></tr>
    <tr><td>
     <table cellspacing=15 width=100%><tr><td align=left>
     <font color=#333366 size=2>
    
    
     precaution_detail
    
    
     </font>
     </td></tr></table>
    </td></tr>
    </table>
    </td></tr></table>
    <br>
    </center>
    
    
    <!-- 5555555555555555555 -->
    <CENTER>
    <BR><A HREF=http://auctions.yahoo.co.jp/jp/booth/yahoo_account_username TARGET=new><FONT SIZE=5>クリック→【ほかにも出品しています。よろしければご覧ください】←クリック<BR></FONT></A><BR><BR>
    </CENTER>
    `,
    `
<br><center>
<table border=0 cellpadding=0 cellspacing=0>
<tr>
 <td height=30 width=30 bgcolor=#FF9999></td>
 <td width=30></td>
 <td width=30 bgcolor=#FF9999></td>
 <td></td>
 <td width=30 bgcolor=#FF9999></td>
 <td width=30></td>
 <td width=30 bgcolor=#FF9999></td>
</tr>
<tr>
 <td height=30></td>
 <td bgcolor=#FFCC66></td>
 <td></td>
 <td bgcolor=#CCFF99></td>
 <td></td>
 <td bgcolor=#FFCC66></td>
 <td></td>
</tr>
<tr>
 <td height=30 bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
</tr>
<tr>
 <td></td>
 <td bgcolor=#CCFF99></td>
 <td></td>
 <td width=420>
<table width=100% cellpadding=10><tr><td align=left>
<font color=#FF9999 size=1>■</font>
<font color=#FFCC66 size=1>■</font>
<font color=#660000 size=5><b>商品詳細</b></font>
<font color=#FFCC66 size=1>■</font>
<font color=#FF9999 size=1>■</font>
<br><br>
<font color=#660000 size=3>


product_description


</font>
<br><br>
<font color=#FF9999 size=1>■</font>
<font color=#FFCC66 size=1>■</font>
<font color=#660000 size=5><b>支払詳細</b></font>
<font color=#FFCC66 size=1>■</font>
<font color=#FF9999 size=1>■</font>
<br><br>
<font color=#660000 size=3>


payment_detail


</font>
<br><br>
<font color=#FF9999 size=1>■</font>
<font color=#FFCC66 size=1>■</font>
<font color=#660000 size=5><b>発送詳細</b></font>
<font color=#FFCC66 size=1>■</font>
<font color=#FF9999 size=1>■</font>
<br><br>
<font color=#660000 size=3>


delivery_detail


</font>
<br><br>
<font color=#FF9999 size=1>■</font>
<font color=#FFCC66 size=1>■</font>
<font color=#660000 size=5><b>注意事項</b></font>
<font color=#FFCC66 size=1>■</font>
<font color=#FF9999 size=1>■</font>
<br><br>
<font color=#660000 size=3>

precaution_detail



</font>
<br><br>
<font color=#FF9999 size=1>■</font>
<font color=#FFCC66 size=1>■</font>
<font color=#660000 size=5><b>コメント</b></font>
<font color=#FFCC66 size=1>■</font>
<font color=#FF9999 size=1>■</font>
<br><br>
<font color=#660000 size=3>


product_note


</font>
<br><br>
</td></tr></table>
 </td>
 <td></td>
 <td bgcolor=#CCFF99></td>
 <td></td>
</tr>
<tr>
 <td height=30 bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
</tr>
<tr>
 <td></td>
 <td height=30 bgcolor=#FFCC66></td>
 <td></td>
 <td bgcolor=#CCFF99></td>
 <td></td>
 <td bgcolor=#FFCC66></td>
 <td></td>
</tr>
<tr>
 <td height=30 bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
 <td></td>
 <td bgcolor=#FF9999></td>
</tr>
</table>
<br>
</center>


<!--ここに出品するアカウントのIDをいれる-->
<CENTER>
<BR><A HREF=http://auctions.yahoo.co.jp/jp/booth/yahoo_account_username TARGET=new><FONT SIZE=5>クリック→【ほかにも出品しています。よろしければご覧ください】←クリック<BR></FONT></A><BR><BR>
</CENTER>
    `,
];
export default class ProductGlobalSettingService {
    static async getDescriptionByYahooAccountId(userId, yahoo_account_id, yahoo_account_username, product_description, product_note) {
        let settingData = await ProductGlobalSettingModel.findOne({ user_id: userId, yahoo_account_id });
        if (settingData) {
            let template = listTemplate[settingData.template - 1];
            template = template.replace('product_description', product_description.replace(/\n/g,'</br>'));
            template = template.replace('payment_detail', settingData.payment_detail.replace(/\n/g,'</br>'));
            template = template.replace('delivery_detail', settingData.delivery_detail.replace(/\n/g,'</br>'));
            template = template.replace('precaution_detail', settingData.precaution_detail.replace(/\n/g,'</br>'));
            template = template.replace('product_note', product_note.replace(/\n/g,'</br>'));
            template = template.replace('yahoo_account_username', yahoo_account_username);
            return template;
        }
        return null;
    }

    static async get(userId, yahoo_account_id) {
        try {
            let res = await ProductGlobalSettingModel.find({ user_id: userId, yahoo_account_id }).sort({ _id: -1 }).limit(1);
            if (!res.length) {
                res = await ProductGlobalSettingModel.create({
                    template: 1,
                    user_id: userId,
                    yahoo_account_id,
                });
            }
            return Array.isArray(res) ? res[0] : res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async create(data) {
        try {
            let res = await ProductGlobalSettingModel.create(data);
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
    static async update(data) {
        try {
            let res = await ProductGlobalSettingModel.findOneAndUpdate({ _id: data._id, user_id: data.user_id }, data, { new: true });
            return res._doc;
        } catch (error) {
            console.log(error);
            throw new Error('Error:' + error.message);
        }
    }
}
