import { pushImpressionHiddenList, pushImpressionReadList } from "../../utils/data"
import { nt } from "../../utils/narou-tweaker"

import $ from 'jquery';

export function _novelcom(){
    _readImpression()
}

function _readImpression(){
    try{
        if(location.pathname.match(/^\/impressionres\/confirm\/ncode\/\d+.*\/kanrino\/\d+\/*/)){
            var m = location.pathname.match(/^\/impressionres\/confirm\/ncode\/(\d+).*\/kanrino\/(\d+)\/*/)
            if(m!==null){
                const ncode: string|undefined = new nt.api.ncode(m[1]).ncode()
                const kanrino: string|undefined = m[2]
                
                if(ncode!==undefined && kanrino!==undefined){
                    nt.storage.local.get(null).then(function(data){
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