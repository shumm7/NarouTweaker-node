import { localFont, localFontFamilyV1 } from "../../utils/v1_font";
import { defaultValue, getCSSRule, saveJson } from "../../utils/misc";
import { generateNoDuplicateSkinName, localSkinsV1, SkinsV1, SkinV1 } from "../../utils/v1_skin";
import { nt } from "../../utils/option";
import { AvailableSkin, getSkin, getSkinFromIndex } from "../../utils/v2_skin";
import { escapeHtml } from "../../utils/text";

import $ from 'jquery';
import Sortable from 'sortablejs'

export function skinEditor(){
    if($("#novel-skins--list-available").length){
        Sortable.create($("#novel-skins--list-available")[0], {
            handle: '.novel-skins--list-item ',
            sort: true,
            group: {
                name: 'skin-list-item',
                pull: true,
                put: true
            },
            animation: 150,
            onSort: function () {
                skinEditor_storeAvailableSkinList()
            },
        });
        skinEditor_restoreList()

        chrome.storage.local.onChanged.addListener(function(changes){
            if(changes.novelSkinsAvailable!==undefined ||
                changes.novelSkinSelected!==undefined
            ){
                skinEditor_restoreList()
            }
        })
    }
}

function skinEditor_restoreList(){
    nt.storage.local.get(null).then(function(local){
        const list = local.novelSkinsAvailable
        const selected = local.novelSkinSelected
        $("#novel-skins").attr("data-selected-src", selected.src)
        $("#novel-skins").attr("data-selected-key", selected.key)
        const focusedSrc = $("#novel-skins").attr("data-focused-src")
        const focusedKey = Number($("#novel-skins").attr("data-focused-key"))
        var outer = $("#novel-skins--list-available")
        outer.empty()

        for(let i = 0; i<list.length; i++){
            var skin = getSkin(list[i].src, list[i].key, local)
            if(skin!==undefined){
                var skinElm = $(`
                    <div class="novel-skins--list-item" data-src="${list[i].src}" data-key="${list[i].key}">
                        <div class="novel-skins--list-item--preview">あAa</div>
                        <div class="novel-skins--list-item--title">
                            <div class="novel-skins--list-item--title-storage"></div>
                            <div class="novel-skins--list-item--title-name">${escapeHtml(skin.name)}</div>
                        </div>
                        <div class="novel-skins--list-item--buttons"></div>
                    </div>
                `).on("click", function(e: any){
                    const src = $(this).attr("data-src")
                    const key = Number($(this).attr("data-key"))
                    if((src==="internal" || src==="local") && isFinite(key)){
                        if($(this).hasClass("focused")){
                            $(".novel-skins--list-item").removeClass("selected")
                            $(this).addClass("selected")
                            $("#novel-skins").attr("data-selected-src", src)
                            $("#novel-skins").attr("data-selected-key", key)
                            nt.storage.local.set({"novelSkinSelected": {src: src, key: key}})
                        }else{
                            $(".novel-skins--list-item").removeClass("focused")
                            $(this).addClass("focused")
                            $("#novel-skins").attr("data-focused-src", src)
                            $("#novel-skins").attr("data-focused-key", key)
                        }
                    }
                })

                if(list[i].src==="internal"){
                    skinElm.find(".novel-skins--list-item--title-storage").text("標準スキン")
                }else if(list[i].src==="local"){
                    skinElm.find(".novel-skins--list-item--title-storage").text("ユーザスキン")
                }

                skinElm.find(".novel-skins--list-item--preview").css("background", skin.preview.background)
                skinElm.find(".novel-skins--list-item--preview").css("color", skin.preview.text)
    
                if(list[i].src===selected.src && list[i].key===selected.key){
                    skinElm.addClass("selected")
                }
                if((focusedSrc==="internal" || focusedSrc==="local") && isFinite(focusedKey) && list[i].src === focusedSrc && focusedKey===list[i].key){
                    skinElm.addClass("focused")
                }

                outer.append(skinElm)
            }
        }
    })
}

function skinEditor_storeAvailableSkinList(){
    var list: Array<AvailableSkin> = []
    $("#novel-skins--list-available .novel-skins--list-item").each(function(){
        const src = $(this).attr("data-src")
        const key = Number($(this).attr("data-key"))
        if((src==="internal" || src==="local") && isFinite(key)){
            list.push({src: src, key: key})
        }
    })

    nt.storage.local.set({novelSkinsAvailable: list})
}