import { __nt_skin_v1__ } from "./skin/v1_skin";
import { __nt_skin_v2__ } from "./skin/v2_skin";
import { __nt_font_v1__ } from "./skin/v1_font";


export namespace __nt_skin__ {
    export function checkSkinVersion(skin: __nt_skin_v1__.Skin|__nt_skin_v2__.Skin|Record<string,any>){
        try{
            if(skin instanceof __nt_skin_v1__.Skin){
                return 1
            }else if(skin instanceof __nt_skin_v2__.Skin){
                return 2
            }else{
                if(skin.version===2){
                    return 2
                }else{
                    return 1
                }
            }
        }catch{
            return 1
        }
    }

    export import v1 = __nt_skin_v1__
    export import v2 = __nt_skin_v2__
}

export namespace __nt_font__ {
    export import v1 = __nt_font_v1__
}