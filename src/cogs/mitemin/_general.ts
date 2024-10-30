import { nt } from "../../utils/narou-tweaker"

import $ from 'jquery';

export function _image(){
    nt.storage.local.get(null).then(function(data){
        // iコードを取得
        if(data.miteminShowIcodeField){
            var info = $(".image_infomation, .ximage_infomation")
            if(info.length){
                var img = nt.api.icode.getFromURL()
                const icode = img?.icode()
                const userid = img?.userid()
                if(icode && userid)
                info.find("tr:last td:last center").prepend(`
                    ▽この画像のiコード<br>
                    <input type="text" name="url" size="30" style="width:300px;" value="<${icode}|${userid}>" readonly="readonly" onfocus="this.select();"><br>
                    <br>
                `)
            }
        }
    })
}