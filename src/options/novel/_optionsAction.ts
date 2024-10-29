import { storage } from "../../utils/option"
import { ReplacePattern } from "../../utils/data"
import { CustomIconID, CustomIconIDs, getExcludeIcons, novelIconList } from "../../utils/header"
import { addFontEditButtonEvent, restoreFont } from "./_optionsAction_Font"
import { skinEditor } from "./_optionsAction_Skin"

import $ from 'jquery';
import Sortable from 'sortablejs'

/* 全般 */
export function novel_customHeaderSortable(){
    /* Novel Header */
    function storeNovelHeader(){
        storage.local.set(
            {
                novelCustomHeaderLeft: getHeaderIconList("left"),
                novelCustomHeaderRight: getHeaderIconList("right")
            }
        )
    
        function getHeaderIconList(position: "right" | "left" | "disabled"){
            if(position!="right" && position!="left" && position!="disabled") { return }
        
            var list: CustomIconIDs = []
            $(".draggable_area[name='novel-header']#"+position+" .icon-element").each((_, icon)=>{
                const id = $(icon).attr("id")
                if(id!==undefined){
                    list.push(id)
                }
            })
            return list;
        }
    }
    
    if($(".draggable_area[name='novel-header']").length){
        Sortable.create($(".draggable_area[name='novel-header']#left")[0], {
            handle: '.icon-element',
            sort: true,
            group: {
                name: 'header-icon',
                pull: true,
                put: true
            },
            animation: 150,
            onSort: function () {
                storeNovelHeader();
            },
        });
        Sortable.create($(".draggable_area[name='novel-header']#right")[0], {
            handle: '.icon-element',
            sort: true,
            group: {
                name: 'header-icon',
                pull: true,
                put: true
            },
            animation: 150,
            onSort: function () {
                storeNovelHeader();
            },
        });
        Sortable.create($(".draggable_area[name='novel-header']#disabled")[0], {
            handle: '.icon-element',
            animation: 150,
            sort: true,
            group: {
                name: 'header-icon',
                pull: true,
                put: true,
            },
            onSort: function () {
                storeNovelHeader();
            },
        });
    }

    /* Novel Header */
    function getNovelHeaderIconElement(id: CustomIconID){
        let icon = novelIconList[id]
        var text = icon.text

        return `
        <div id="`+id+`" class="icon-element" draggable="true">
            <i class="`+icon.icon+`"></i>
            <span class="title">`+text+`</span>
        </div>`
    }

    function restoreSortable(){
        function restore(data: CustomIconIDs, position: string){
            $(".draggable_area[name='novel-header']#"+position).empty()
            $.each(data, (_, icon)=>{
                if(icon in novelIconList)
                $(".draggable_area[name='novel-header']#"+position).append(getNovelHeaderIconElement(icon))
            })
        }
    
        storage.local.get(["novelCustomHeaderLeft", "novelCustomHeaderRight"], function(data){
            restore(data.novelCustomHeaderLeft, "left")
            restore(data.novelCustomHeaderRight, "right")
            restore(getExcludeIcons([data.novelCustomHeaderLeft, data.novelCustomHeaderRight]), "disabled")
        })
    }
    
    restoreSortable()
    chrome.storage.local.onChanged.addListener(function(changes){
        if(changes.novelCustomHeaderLeft || changes.novelCustomHeaderRight){
            restoreSortable()
        }
    })
}

/* スキン */
export function novel_skinEditor(){
    skinEditor()
}

/* フォント */
export function novel_fontEditor(){
    addFontEditButtonEvent()
    restoreFont()
}

/* 文章校正 */
export function novel_replacePattern(){
    /* Add Button */
    $("#correction-replace--pattern-box-addition").on("click", function(){
        storage.local.get(["correctionReplacePatterns"], function(data){
            data.correctionReplacePatterns.push(new ReplacePattern)
            storage.local.set({correctionReplacePatterns: data.correctionReplacePatterns}, function(){})
        })
    })

    /* Storage Listener */
    chrome.storage.local.onChanged.addListener(function(changes){
        if(changes.correctionReplacePatterns!=undefined){
            restoreReplacePattern()
        }
    })

    restoreReplacePattern()

    function restoreReplacePattern(){
        storage.local.get(["correctionReplacePatterns"], function(data){
            var elementsAmount = $(".correction-replace--pattern-box").length
            var listLength = data.correctionReplacePatterns.length
            if(listLength<elementsAmount){
                for(var i=0; i<(elementsAmount-listLength); i++){
                    var idx = listLength + i
                    $(".correction-replace--pattern-box[data-for='"+idx+"']").remove()
                }
            }

            $.each(data.correctionReplacePatterns, function(idx: number, pattern){
                var box = $(`.correction-replace--pattern-box[data-for="${idx}"]`)
                if(!box.length){
                    $("#correction-replace--patterns #correction-replace--pattern-box-addition").before(`
                        <div class="correction-replace--pattern-box" data-for="${idx}">
                            <div class="correction-replace--move-buttons">
                                <div class="correction-replace--move-front correction-replace--icons"><i class="fa-solid fa-sort-up"></i></div>
                                <div class="correction-replace--move-back correction-replace--icons"><i class="fa-solid fa-sort-down"></i></div>
                            </div>
                            <div class="correction-replace--active-button correction-replace--icons"><i class="fa-solid fa-circle"></i></div>
                            <div class="correction-replace--fields">
                                <input class="correction-replace--pattern" type="text">
                                <span><i class="fa-solid fa-angles-right"></i></span>
                                <input class="correction-replace--replacement" type="text">
                            </div>
                            <div class="correction-replace--regex-button correction-replace--icons"><i class="fa-solid fa-asterisk"></i></div>
                            <div class="correction-replace--remove-button correction-replace--icons"><i class="fa-solid fa-trash"></i></div>
                        </div>
                    `)
                    box = $(`.correction-replace--pattern-box[data-for="${idx}"]`)
                }

                box.find(".correction-replace--pattern").val(pattern.pattern)
                box.find(".correction-replace--replacement").val(pattern.replacement)
                if(pattern.regex){
                    box.find(".correction-replace--regex-button").addClass("enabled")
                }else{
                    box.find(".correction-replace--regex-button").removeClass("enabled")
                }
                if(pattern.active){
                    box.find(".correction-replace--active-button").addClass("enabled")
                }else{
                    box.find(".correction-replace--active-button").removeClass("enabled")
                }
            })

            /* Events */
            $(".correction-replace--pattern-box .correction-replace--move-front").on("click", function(){ // Up Button
                const _v = $(this).parent().parent().attr("data-for")
                if(typeof _v === "string"){
                    const idx: number = Number(_v)
                    if(!isNaN(idx)){
                        storage.local.get(["correctionReplacePatterns"], function(data){
                            var patterns = data.correctionReplacePatterns
                            if(idx>0){
                                [patterns[idx], patterns[idx-1]] = [patterns[idx-1], patterns[idx]]
                                storage.local.set({correctionReplacePatterns: patterns}, function(){})
    
                            }
                        })
                    }
                }
            })
            $(".correction-replace--pattern-box .correction-replace--move-back").on("click", function(){ // Down Button
                const _v = $(this).parent().parent().attr("data-for")
                if(typeof _v === "string"){
                    const idx: number = Number(_v)
                    if(!isNaN(idx)){
                        storage.local.get(["correctionReplacePatterns"], function(data){
                            var patterns = data.correctionReplacePatterns
                            if(idx<patterns.length-1){
                                [patterns[idx], patterns[idx+1]] = [patterns[idx+1], patterns[idx]]
                                storage.local.set({correctionReplacePatterns: patterns}, function(){})
                            }
                        })
                    }
                }
            })
            $(".correction-replace--pattern-box .correction-replace--regex-button").on("click", function(){ // Regex Button
                const _v = $(this).parent().attr("data-for")
                var elm = $(this)
                if(typeof _v === "string"){
                    const idx: number = Number(_v)
                    if(!isNaN(idx)){
                        storage.local.get(["correctionReplacePatterns"], function(data){
                            var patterns = data.correctionReplacePatterns
                            if(elm.hasClass("enabled")){
                                patterns[idx].regex = false
                            }else{
                                patterns[idx].regex = true
                            }
                            storage.local.set({correctionReplacePatterns: patterns}, function(){})
                        })
                    }
                }
            })
            $(".correction-replace--pattern-box .correction-replace--active-button").on("click", function(){ // Active Button
                const _v = $(this).parent().attr("data-for")
                var elm = $(this)
                if(typeof _v === "string"){
                    const idx: number = Number(_v)
                    if(!isNaN(idx)){
                        storage.local.get(["correctionReplacePatterns"], function(data){
                            var patterns = data.correctionReplacePatterns
                            if(elm.hasClass("enabled")){
                                patterns[idx].active = false
                            }else{
                                patterns[idx].active = true
                            }
                            storage.local.set({correctionReplacePatterns: patterns}, function(){})
                        })
                    }
                }
            })
            $(".correction-replace--pattern-box .correction-replace--remove-button").on("click", function(){ // Trash Button
                const _v = $(this).parent().attr("data-for")
                if(typeof _v === "string"){
                    const idx: number = Number(_v)
                    if(!isNaN(idx)){
                        storage.local.get(["correctionReplacePatterns"], function(data){
                            var patterns = data.correctionReplacePatterns
                            patterns.splice(idx, 1)
                            storage.local.set({correctionReplacePatterns: patterns}, function(){})
                        })
                    }
                }
            })
            $(".correction-replace--pattern-box .correction-replace--pattern").on("change", function(){ // Pattern Fields
                const _v = $(this).parent().parent().attr("data-for")
                if(typeof _v === "string"){
                    const idx: number = Number(_v)
                    if(!isNaN(idx)){
                        var value = $(this).val()
                        storage.local.get(["correctionReplacePatterns"], function(data){
                            var patterns = data.correctionReplacePatterns
                            if(typeof value === "string"){
                                patterns[idx].pattern = value
                                storage.local.set({correctionReplacePatterns: patterns}, function(){})
                            }
                        })
                    }
                }
            })
            $(".correction-replace--pattern-box .correction-replace--replacement").on("change", function(){ // Replacement Fields
                const _v = $(this).parent().parent().attr("data-for")
                if(typeof _v === "string"){
                    const idx: number = Number(_v)
                    if(!isNaN(idx)){
                        var value = $(this).val()
                        storage.local.get(["correctionReplacePatterns"], function(data){
                            var patterns = data.correctionReplacePatterns
                            if(typeof value === "string"){
                                patterns[idx].replacement = value
                                storage.local.set("correctionReplacePatterns", patterns, function(){})
                            }
                        })
                    }
                }
            })
        })
    }

}