import { getLocalOptions } from "../../utils/option"
import { getIcodeFromURL, Icode } from "../../utils/ncode"

export function _image(){
    getLocalOptions(null, function(data){
        // iコードを取得
        if(data.miteminShowIcodeField){
            var info = $(".image_infomation, .ximage_infomation")
            if(info.length){
                var img = getIcodeFromURL()
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