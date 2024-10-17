import { Ncode } from "utils/ncode"
import { popHiddenList, popReadList, pushHiddenList, pushReadList } from "../workspace/_reactionTools"

export function _novelcom(){
    _readImpression()
}

function _readImpression(){
    if(location.pathname.match(/^\/impressionres\/confirm\/ncode\/\d+.*\/kanrino\/\d+\/*/)){
        var m = location.pathname.match(/^\/impressionres\/confirm\/ncode\/(\d+).*\/kanrino\/(\d+)\/*/)
        if(m!==null){
            const ncode: string|undefined = new Ncode(m[1]).ncode()
            const kanrino: string|undefined = m[2]
            
            if(ncode!==undefined && kanrino!==undefined){
                chrome.storage.local.get(null, function(data){
                    if(data.workspaceImpressionMarkAsReadWhenReply && data.workspaceImpressionMarkedButton){
                        if($("form #rescomment").length){
                            
                            $(document).on('submit','form:has(#rescomment)', function(){
                                pushReadList(ncode, kanrino)
                                if(data.workspaceImpressionHideButton && data.workspaceImpressionHideWhenMarked){
                                    pushHiddenList(ncode, kanrino)
                                }
                            })
                        }
                    }
                })
            }
        }
    }
}