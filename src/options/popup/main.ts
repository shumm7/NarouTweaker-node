import { nt } from "../../utils/narou-tweaker";

import $ from 'jquery';

openDropdown()


function openDropdown(){
    chrome.tabs.query({active: true, lastFocusedWindow:true}, tabs => {
        nt.storage.local.get("extPopupDefaultPage").then(function(data){
            if(data.extPopupDefaultPage === "__auto__"){
                const tab = tabs[0]
                try{
                    if(tab.url!==undefined){
                        const url = new URL(tab.url)

                        if(url.hostname == "ncode.syosetu.com" || url.hostname=="novelcom.syosetu.com" || url.hostname == "novel18.syosetu.com" || url.hostname=="novelcom18.syosetu.com" ){
                            $("#option-popup").attr("src", `../index.html?page=novel`)
                        }
                        else if(url.hostname == "mypage.syosetu.com" || url.hostname==" xmypage.syosetu.com" ){
                            $("#option-popup").attr("src", `../index.html?page=mypage`)
                        }
                        else if(url.hostname == "kasasagi.hinaproject.com" ){
                            $("#option-popup").attr("src", `../index.html?page=kasasagi`)
                        }
                        else if(url.hostname == "syosetu.com" ){
                            $("#option-popup").attr("src", `../index.html?page=workspace`)
                        }
                        else if(url.hostname == "yomou.syosetu.com" || url.hostname=="noc.syosetu.com" || url.hostname == "mnlt.syosetu.com" || url.hostname=="mid.syosetu.com" ){
                            $("#option-popup").attr("src", `../index.html?page=yomou`)
                        }
                        else if(url.hostname == "mitemin.net" || url.hostname.match(/^\d+\.mitemin\.net$/) || url.hostname == "eparet.net" ){
                            $("#option-popup").attr("src", `../index.html?page=mitemin`)
                        }
                    }
                }catch(e){

                }

            }else{
                $("#option-popup").attr("src", `../index.html?page=${data.extPopupDefaultPage}`)
            }
        })
    })
}