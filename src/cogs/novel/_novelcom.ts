import { Ncode } from "../../utils/ncode"
import { pushImpressionHiddenList, pushImpressionReadList } from "../../utils/data"
import { storage } from "../../utils/option"

import $ from 'jquery';

export function _novelcom(){
    _readImpression()
}

function _readImpression(){
    try{
        if(location.pathname.match(/^\/impressionres\/confirm\/ncode\/\d+.*\/kanrino\/\d+\/*/)){
            var m = location.pathname.match(/^\/impressionres\/confirm\/ncode\/(\d+).*\/kanrino\/(\d+)\/*/)
            if(m!==null){
                const ncode: string|undefined = new Ncode(m[1]).ncode()
                const kanrino: string|undefined = m[2]
                
                if(ncode!==undefined && kanrino!==undefined){
                    storage.local.get(null, function(data){
                        if(data.workspaceImpressionMarkAsReadWhenReply && data.workspaceImpressionMarkedButton){
                            if($("form #rescomment").length){
                                
                                $(document).on('submit','form:has(#rescomment)', function(){
                                    pushImpressionReadList(ncode, kanrino)
                                    if(data.workspaceImpressionHideButton && data.workspaceImpressionHideWhenMarked){
                                        pushImpressionHiddenList(ncode, kanrino)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    }catch(e){
        console.warn(e)
    }
}