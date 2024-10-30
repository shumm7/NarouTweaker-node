import { nt } from "../../utils/narou-tweaker"
import { popImpressionHiddenList, popImpressionReadList, pushImpressionHiddenList, pushImpressionReadList } from "../../utils/data"

import $ from "jquery"

export function _reaction(){
    _impressionRead()
}

function _impressionRead(){
    if(location.pathname.match(/^\/usernovelimpression\/passivelist\/*$/)){
        nt.storage.local.get(null).then(function(data){

            var list = $(".c-up-panel .c-up-panel__list")
            if(list.length){
                if(data.workspaceImpressionHideButton){
                    restoreHide()
                    
                    list.find(".c-up-panel__list-item").each(function(){
                        /* 表示・隠すボタン */

                        var href = $(this).find(".c-button--primary").attr("href")
                        if(href){
                            const url = new URL(href)
                            var m = url.pathname.match(/^\/impressionres\/input\/ncode\/(\d*).*\/kanrino\/(\d*)\/*/)
                            if(m){
                                const ncode = new nt.api.ncode(m[1])
                                const kanrino = m[2]

                                if(ncode && kanrino){
                                    var hide_button = $(`<div class="c-up-markhide"><span class="p-icon p-icon--angle-up" aria-hidden="true"></span>隠す</div>`)
                                    var show_button = $(`<div class="c-up-markshow"><span class="p-icon p-icon--angle-down" aria-hidden="true"></span>表示</div>`)
    
                                    hide_button.on("click", function(){
                                        pushImpressionHiddenList(ncode, kanrino)
                                    })
                                    show_button.on("click", function(){
                                        popImpressionHiddenList(ncode, kanrino)
                                    })
                                    $(this).find(".c-up-reaction-item__menu").before(hide_button)
                                    $(this).find(".c-up-reaction-item__menu").before(show_button)
                                }
                            }
                                
                        }
                    })

                    nt.storage.sync.changed("workspaceImpressionHidden", function(changes){
                        restoreHide()
                    })
                }

                if(data.workspaceImpressionMarkedButton){
                    restoreRead()

                    list.find(".c-up-panel__list-item").each(function(){
                        /* 既読・未読ボタン */
                        var href = $(this).find(".c-button--primary").attr("href")
                        if(href){
                            const url = new URL(href)
                            var m = url.pathname.match(/^\/impressionres\/input\/ncode\/(\d*).*\/kanrino\/(\d*)\/*/)
                            if(m){
                                const ncode = new nt.api.ncode(m[1])
                                const kanrino = m[2]
    
                                if(ncode && kanrino){
                                    var read_button = $(`<div class="c-up-markread"><span class="p-icon p-icon--check" aria-hidden="true"></span>既読にする</div>`)
                                    var unread_button = $(`<div class="c-up-unmarkread"><span class="p-icon p-icon--times" aria-hidden="true"></span>未読にする</div>`)
        
                                    read_button.on("click", function(){
                                        pushImpressionReadList(ncode, kanrino)
                                        if(data.workspaceImpressionHideButton && data.workspaceImpressionHideWhenMarked){
                                            pushImpressionHiddenList(ncode, kanrino)
                                        }
                                    })
                                    unread_button.on("click", function(){
                                        popImpressionReadList(ncode, kanrino)
                                        if(data.workspaceImpressionHideButton && data.workspaceImpressionHideWhenMarked){
                                            popImpressionHiddenList(ncode, kanrino)
                                        }
                                    })
                                    $(this).find(".c-up-reaction-item__menu").before(read_button)
                                    $(this).find(".c-up-reaction-item__menu").before(unread_button)
                                }
                            }
                        }
                    })

                    /* すべて既読・未読ボタン */
                    $(".c-up-list-tools").append(`
                        <div class="c-up-markread-button">
                            <!--
                            <div class="c-up-unmarkread-all">
                                <span class="p-icon p-icon--times" aria-hidden="true"></span>すべて未読にする
                            </div>
                            -->
                            <div class="c-up-markread-all">
                                <span class="p-icon p-icon--check" aria-hidden="true"></span>すべて既読にする
                            </div>
                        </div>
                    `)

                    $(".c-up-unmarkread-all").click(function(){
                        nt.storage.sync.get(null).then(function(l){
                            var readList: [Array<nt.api.ncode>, Array<string>] = [[], []]
                            var hideList: [Array<nt.api.ncode>, Array<string>] = [[], []]

                            $(".c-up-panel__list-item").each(function(){
                                var href = $(this).find(".c-button--primary").attr("href")
                                if(href){
                                    const url = new URL(href)
                                    var m = url.pathname.match(/^\/impressionres\/input\/ncode\/(\d*).*\/kanrino\/(\d*)\/*/)
                                    if(m){
                                        const ncode = new nt.api.ncode(m[1])
                                        const kanrino = m[2]
        
        
                                        if($(this).hasClass("c-up-reaction--read")){
                                            readList[0].push(ncode)
                                            readList[1].push(kanrino)
                                        }
        
                                        if(data.workspaceImpressionHideButton && data.workspaceImpressionHideWhenMarked){
                                            if($(this).hasClass("c-up-reaction--hidden")){
                                                hideList[0].push(ncode)
                                                hideList[1].push(kanrino)
                                            }
                                        }
                                    }
                                }
                            })
                            popImpressionReadList(readList[0], readList[1])
                            popImpressionHiddenList(hideList[0], hideList[1])
                        })
                    })

                    $(".c-up-markread-all").click(function(){
                        nt.storage.sync.get(null).then(function(l){
                            var readList: [Array<nt.api.ncode>, Array<string>] = [[], []]
                            var hideList: [Array<nt.api.ncode>, Array<string>] = [[], []]

                            $(".c-up-panel__list-item").each(function(){
                                var href = $(this).find(".c-button--primary").attr("href")
                                if(href){
                                    const url = new URL(href)
                                    var m = url.pathname.match(/^\/impressionres\/input\/ncode\/(\d*).*\/kanrino\/(\d*)\/*/)
                                    if(m){
                                        const ncode = new nt.api.ncode(m[1])
                                        const kanrino = m[2]
        
                                        if(!$(this).hasClass("c-up-reaction--read")){
                                            readList[0].push(ncode)
                                            readList[1].push(kanrino)
                                        }
        
                                        if(data.workspaceImpressionHideButton && data.workspaceImpressionHideWhenMarked){
                                            if(!$(this).hasClass("c-up-reaction--hidden")){
                                                hideList[0].push(ncode)
                                                hideList[1].push(kanrino)
                                            }
                                        }
                                    }
                                }
                            })
                            pushImpressionReadList(readList[0], readList[1])
                            pushImpressionHiddenList(hideList[0], hideList[1])
                        })
                    })
                    
                    nt.storage.sync.changed("workspaceImpressionMarked", function(changes){
                        restoreRead()
                    })
                }
            }
        })
    }

    function restoreRead(){
        chrome.storage.sync.get(null, function(data){
            let readList = data.workspaceImpressionMarked
            if(readList==undefined){readList = []}
            $(".c-up-panel .c-up-panel__list .c-up-panel__list-item").each(function(){
                $(this).removeClass("c-up-reaction--read")
                var href = $(this).find(".c-button--primary").attr("href")
                if(href){
                    const url = new URL(href)
                    var m = url.pathname.match(/^\/impressionres\/input\/ncode\/(\d*).*\/kanrino\/(\d*)\/*/)
                    if(m){
                        const ncode = new nt.api.ncode(m[1]).ncode()
                        const kanrino = m[2]
    
                        if(ncode && ncode in readList){
                            if(readList[ncode].includes(kanrino)){
                                $(this).addClass("c-up-reaction--read")
                            }
                        }
                    }
                }
            })
        })
    }

    function restoreHide(){
        chrome.storage.sync.get(null, function(data){
            let hideList = data.workspaceImpressionHidden
            if(hideList==undefined){hideList = []}
            $(".c-up-panel .c-up-panel__list .c-up-panel__list-item").each(function(){
                $(this).removeClass("c-up-reaction--hidden")
                var href = $(this).find(".c-button--primary").attr("href")
                if(href){
                    const url = new URL(href)
                    var m = url.pathname.match(/^\/impressionres\/input\/ncode\/(\d*).*\/kanrino\/(\d*)\/*/)
                    if(m){
                        const ncode = new nt.api.ncode(m[1]).ncode()
                        const kanrino = m[2]

                        if(ncode && ncode in hideList){
                            if(hideList[ncode].includes(kanrino)){
                                $(this).addClass("c-up-reaction--hidden")
                            }
                        }
                    }
                }
            })
        })
    }
}