import { SkinV1 } from "./v1_skin";
import { SkinV2 } from "./v2_skin";

export function checkSkinVersion(skin: SkinV1|SkinV2|Record<string,any>){
    try{
        if(skin instanceof SkinV1){
            return 1
        }else if(skin instanceof SkinV2){
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