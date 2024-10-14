import { LocalOptions } from "utils/option"
import { OptionUI_CustomElement } from "./optionUI_custom"
import { appendFavoriteOption, getOptionCategory, getOptionChildsFromID, getOptionFromID, getOptionPageFromID, moveFavoriteOption, removeFavoriteOption } from "./optionUI_libs"
import { OptionUI_Item, OptionUI_ItemID } from "./optionUI_type"

import "@melloware/coloris/dist/coloris.css";
import { coloris, init } from "@melloware/coloris";
import hljs from 'highlight.js';

export function buttonHide(){
    $(".button-hide").each(function(){
        var name = $(this).attr("name")
        var data_for = $(this).attr("data-for")
        var set_class = $(this).attr("data") ?? ""

        $(this).on("click", function(){
            if(!$(this).hasClass(set_class)){
                $(`.button-hide.${set_class}[name="${name}"]`).removeClass(set_class)
                $(this).addClass(set_class)

                $(`.button-hide-target[name="${name}"]`).addClass("button-hide--hidden")
                $(`.button-hide-target${data_for}[name="${name}"]`).removeClass("button-hide--hidden")
            }
        })
    })
}

export function optionHide(){
    $(".option-hide").each(function(){
        let elm = $(this)
        var data_for
        var action_value
        var action_mode
        var compare_mode
        var data_type

        /* data_for (前提となる設定項目のID) */
        if(elm.is("[data-for]")){
            data_for = $(this).attr("data-for")?.trim().split(/ +/)
        }else{
            return false
        }

        /* data (前提となる設定項目のトリガー値) */
        if(elm.is("[data]")){
            action_value = $(this).attr("data")?.trim().split(/ +/)
        }else{
            return false
        }

        if(data_for.length > action_value.length){
            var k = action_value.length
            for(var i=0; i < data_for.length-action_value.length; i++){
                action_value.push(action_value[k-1])
            }
        }else if(data_for.length < action_value.length){
            action_value = action_value.slice(0, data_for.length)
        }

        /* mode */
        if(elm.is("[mode]")){
            action_mode = $(this).attr("mode")
        }

        /* logic */
        if(elm.is("[data-rule]")){
            compare_mode = $(this).attr("data-rule")
        }

        /* data_type (トリガー値の型) */
        if(elm.is("[data-type]")){
            data_type = $(this).attr("data-type")?.trim().split(/ +/)
        }else{
            data_type = new Array(data_for.length).fill(undefined)
        }

        if(data_for.length > data_type.length){
            var k = data_type.length
            for(var i=0; i < data_for.length-data_type.length; i++){
                data_type.push(undefined)
            }
        }else if(data_for.length < data_type.length){
            data_type = data_type.slice(0, data_for.length)
        }

        function change(value: Array<string>, action_value:Array<string>, type: Array<string>, mode: string|undefined, compare_mode: string|undefined){
            function compare(source: any, value: string, type: string){
                if(type){
                    if(type==="null"){
                        return source === null
                    }
                    else if(type==="boolean"){
                        return source === (value.toLowerCase() === "true")
                    }
                    else if(type==="string"){
                        return source===value
                    }
                    else if(type==="number"){
                        return source===Number(value)
                    }
                }
                return String(source)===String(value)
            }
            

            var bool = false
            if(value.length>0){
                if(compare_mode=="and"){
                    bool = true
                }

                $.each(value, function(k, v){
                    if(compare_mode=="and"){
                        bool = bool && compare(v, action_value[k], type[k])
                    }else{
                        bool = bool || compare(v, action_value[k], type[k])
                    }
                })
            }else{
                bool = false
            }

            if(bool){
                if(mode==="hide"){
                    elm.addClass("option-hide--hidden")
                }
                else if(mode==="inactive"){
                    elm.addClass("option-hide--inactive")
                }
                else if(mode==="active"){
                    elm.removeClass("option-hide--inactive")
                }
                else{ //show
                    elm.removeClass("option-hide--hidden")
                }
            }else{
                if(mode==="hide"){
                    elm.removeClass("option-hide--hidden")
                }
                else if(mode==="inactive"){
                    elm.removeClass("option-hide--inactive")
                }
                else if(mode==="active"){
                    elm.addClass("option-hide--inactive")
                }
                else{ //show
                    elm.addClass("option-hide--hidden")
                }
            }
        }

        chrome.storage.local.get(data_for, function(data){
            var values: Array<OptionUI_ItemID> = []
            var actions: Array<string> = []
            var types: Array<string> = []

            $.each(data_for, function(i, key){
                if(key in data){
                    values.push(data[key])
                    actions.push(action_value[i])
                    types.push(data_type[i])
                }
            })
            if(values.length>0){
                change(values, actions, types, action_mode, compare_mode)
            }
        })

        chrome.storage.local.onChanged.addListener(function(changes){
            var values: Array<string> = []
            var actions: Array<string> = []
            var types: Array<string> = []

            $.each(data_for, function(i, key){
                if(changes[key]){
                    values.push(changes[key].newValue)
                    actions.push(action_value[i])
                    types.push(data_type[i])
                }
            })
            if(values.length>0){
                change(values, actions, types, action_mode, compare_mode)
            }
            
        })
        return 
    })

    
    $(".experimental-hide").each(function(){
        var elm = $(this)

        function change(value){
            $(".option--experimental-message").empty()
            if(value){
                elm.removeClass("option-hide--experimental")
                $(".option--experimental-message").append("<a href='/options/general/index.html?id=extExperimentalFeatures&focus=1&category=config' target='_self'>【実験中の機能】不具合が発生する可能性があります。ご注意ください。</a>")
            }else{
                elm.addClass("option-hide--experimental")
                $(".option--experimental-message").append("<a href='/options/general/index.html?id=extExperimentalFeatures&focus=1&category=config' target='_self'>「実験中の機能」が無効のため使用できません。<br><span style='font-size: 80%;'>※ [全般] → [環境設定] → [実験中の機能]を有効化</span></a>")
            }
        }

        // Elements
        if(!elm.hasClass("option-hide--experimental-processed")){
            if(elm.find(".search-result--items-title").length){
                elm.find(".search-result--items-title").prepend(
                    `<i class="fa-solid fa-flask" style="margin-right: 5px;"></i>`
                )
            }else{
                elm.find(".contents-item--heading:first").prepend(
                    `<i class="fa-solid fa-flask" style="margin-right: 5px;"></i>`
                )
            }
            elm.find(".contents-item--description:first").prepend(
                `<div class="option--experimental-message"></div>`
            )
            elm.addClass("option-hide--experimental-processed")
        }

            
        chrome.storage.local.get(["extExperimentalFeatures"], function(data){
            change(data.extExperimentalFeatures)
        })

        chrome.storage.local.onChanged.addListener(function(changes){
            if(changes.extExperimentalFeatures!=undefined){
                change(changes.extExperimentalFeatures.newValue)
            }
        })
    })

    $(".advanced-hide").each(function(){
        var elm = $(this)

        function change(value){
            $(".option--advanced-message").empty()
            if(value){
                elm.removeClass("option-hide--advanced")
            }else{
                elm.addClass("option-hide--advanced")
            }
        }

        // Elements 
        if(!elm.hasClass("option-hide--advanced-processed")){
            if(elm.find(".search-result--items-title").length){
                elm.find(".search-result--items-title").prepend(
                    `<i class="fa-solid fa-feather" style="margin-right: 5px;"></i>`
                )
            }else{
                elm.find(".contents-item--heading:first").prepend(
                    `<i class="fa-solid fa-feather" style="margin-right: 5px;"></i>`
                )
            }
            elm.addClass("option-hide--advanced-processed")
        }

            
        chrome.storage.local.get(["extAdvancedSettings"], function(data){
            change(data.extAdvancedSettings)
        })

        chrome.storage.local.onChanged.addListener(function(changes){
            if(changes.extAdvancedSettings!=undefined){
                change(changes.extAdvancedSettings.newValue)
            }
        })
    })

    $(".debug-option-hide").each(function(){
        var elm = $(this)

        function change(value){
            $(".option--debug-message").empty()
            if(value){
                elm.removeClass("option-hide--debug")
                $(".option--debug-message").append("【デバッグ機能】開発者向けの機能です。不具合が発生する可能性がありますので、ご注意ください。")
            }else{
                elm.addClass("option-hide--debug")
                $(".option--debug-message").append("「デバッグ機能」が無効のため使用できません。")
            }
        }

        // Elements 
        if(!elm.hasClass("option-hide--debug-processed")){
            if(elm.find(".search-result--items-title").length){
                elm.find(".search-result--items-title").prepend(
                    `<i class="fa-solid fa-bug" style="margin-right: 5px;"></i>`
                )
            }else{
                elm.find(".contents-item--heading:first").prepend(
                    `<i class="fa-solid fa-bug" style="margin-right: 5px;"></i>`
                )
            }
            elm.find(".contents-item--description:first").prepend(
                `<div class="option--debug-message"></div>`
            )
            elm.addClass("option-hide--debug-processed")
        }

            
        chrome.storage.local.get(["extDebug"], function(data){
            change(data.extDebug)
        })

        chrome.storage.local.onChanged.addListener(function(changes){
            if(changes.extDebug!=undefined){
                change(changes.extDebug.newValue)
            }
        })
    })
}

export function colorPicker(){
    init();

    /* Color Picker */
    coloris({
        el: '.color',
        theme: 'polaroid',
        formatToggle: true,
        alpha: true,
        closeButton: true,
        clearButton: true,
        clearLabel: 'クリア',
        closeLabel: '閉じる'
    });
    document.querySelectorAll('.color').forEach(input => {
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    $(".color").on("change", function(){
        document.querySelectorAll('.color').forEach(input => {
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
    })
    
}

export function syntaxHighlight(){
    var i = 1
    $(".syntax-highlight").each(function(){
        var textarea = $(this)
        var language = textarea.attr("data")
        textarea.wrap(`<div class="syntax-highlight-wrap" id="highlight-${i}"></div>`)
        textarea.after(`<pre><code class="${language}"></code></pre>`)

        var wrapper = textarea.parent()
        var dummyWrapper = wrapper.find("pre")
        var dummy = dummyWrapper.find("code")

        resizeTextArea()
        textarea.on("input", function(){
            var r = textarea.val()
            if(r && language){
                dummy[0].innerHTML = hljs.highlight(r + "\u200b", {language: language}).value
            }
        })
        textarea.on("scroll", function(e){
            dummyWrapper.scrollTop(e.target.scrollTop)
        })

        var resizeInt: NodeJS.Timeout|null = null;
        var resizeEvent = function() {
            var h = textarea.height()
            if(h!==undefined){
                dummyWrapper.height(h);
            }
        };
        textarea.on("mousedown", function() {
            resizeInt = setInterval(resizeEvent, 1);
        })
        $(window).on("mouseup", function() {
            if (resizeInt != null) {
                clearInterval(resizeInt)
            }
        });

        function resizeTextArea() {
            var elm = dummy.get(0)
            if(elm!==undefined){
                dummy.addClass("resizing");
                wrapper.css("height", `${elm.scrollHeight+ 20}px`)
                dummy.removeClass("resizing");
            }
        }
    })
}

type optionType = "search" | "favorite"
export function getOptionElement(option: OptionUI_Item, mode?: optionType){
    const page = option.location?.page
    const category = option.location?.category
    const id = option.id
    const title = option.title
    const style = option.style
    const elmClass = option.class
    const description = option.description
    const uiType = option.ui?.type
    const uiName = option.ui?.name
    const uiData = option.ui?.data
    const uiStyle = option.ui?.style
    const uiClass = option.ui?.class
    const uiPrefix = option.ui?.prefix ?? ""
    const uiSuffix = option.ui?.suffix ?? ""
    const buttons = option.value?.buttons
    const requirement = option.value?.requirement
    const isExperimental = option.value?.isExperimental
    const isAdvanced = option.value?.isAdvanced
    const isDebug = option.value?.isDebug
    const hasParent = option.location?.hasParent
    const parent = option.location?.parent

    var elm
    
    /* Outer */
    if(hasParent && mode!=="search"){
        elm = $(`<div class="contents-option" name="${id}"></div>`)
    }else{
        elm = $(`<div class="contents-wide" name="${id}"><div class="contents-option"></div></div>`)
    }
    
    elm.addClass("option-outer")
    if(mode==="search"){
        elm.addClass(["search-result-box", "search-result--option"])
    }
    
    /* Option Items */
    if(uiType == "parent"){
        elm.append(`
            <div class="contents-option-head"></div>
            <div class="contents-wide-column"></div>
        `)
        
    }else{
        if(elm.hasClass("contents-option")){
            elm.append(`<div class="contents-option-head"></div>`)
        }else{
            elm.find(".contents-option").append(`<div class="contents-option-head"></div>`)
        }

        /* Contents */
        if(uiType === "toggle"){
            if(elm.hasClass("contents-option")){
                elm.append(`<div class="contents-option-content"></div>`)
            }else{
                elm.find(".contents-option").append(`<div class="contents-option-content"></div>`)
            }

            if(uiName==="default" || uiName === "toggle" || uiName===undefined){
                var item = $(`<input type="checkbox" id="${id}" class="options toggle">`)
                if(uiStyle){
                    item.css(uiStyle)
                }
                if(uiClass){
                    item.addClass(uiClass)
                }

                var toggleElm = $(`
                    ${uiPrefix}
                    ${item[0].outerHTML}
                    <label for="${id}" class="toggle"></label>
                    ${uiSuffix}
                `)

                elm.find(".contents-option-content").append(toggleElm)
            }else if(uiName==="checkbox"){
                var item = $(`<input type="checkbox" id="${id}" class="options ui-checkbox">`)
                if(uiStyle){
                    item.css(uiStyle)
                }
                if(uiClass){
                    item.addClass(uiClass)
                }

                var toggleElm = $(`
                    ${uiPrefix}
                    ${item[0].outerHTML}
                    <label for="${id}" class="tui-checkbox">${uiSuffix}</label>
                `)

                elm.find(".contents-option-content").append(toggleElm)
            }
        }
        else if(uiType === "dropdown"){
            if(elm.hasClass("contents-option")){
                elm.append(`<div class="contents-option-content"></div>`)
            }else{
                elm.find(".contents-option").append(`<div class="contents-option-content"></div>`)
            }

            if(uiName==="default" || uiName===undefined){
                var dropdownElm = $(`
                    <div class="dropdown">
                        ${uiPrefix}
                        <select id="${id}" class="options">
                        </select>
                        ${uiSuffix}
                    </div>
                `)

                if(uiStyle){
                    dropdownElm.css(uiStyle)
                }
                if(uiClass){
                    dropdownElm.addClass(uiClass)
                }

                $.each(uiData, function(_, val){
                    var value = ""
                    var title = ""
                    if(val.value){
                        value = val.value
                    }else{
                        return true
                    }
                    if(val.title){
                        title = val.title
                    }else{
                        if(value){
                            title = value
                        }else{
                            return true
                        }
                    }

                    dropdownElm.find("select").append(`
                        <option value="${value}">${title}</option>
                    `)
                })

                elm.find(".contents-option-content").append(dropdownElm)
            }
        }
        else if(uiType === "input"){
            if(elm.hasClass("contents-option")){
                elm.append(`<div class="contents-option-content"></div>`)
            }else{
                elm.find(".contents-option").append(`<div class="contents-option-content"></div>`)
            }

            if(uiName==="default" || uiName===undefined || uiName==="text" || uiName==="number"){
                var item = $(`
                    <div class="textfield">
                        ${uiPrefix}<input class="options" type="text" id="${id}">${uiSuffix}
                    </div>
                `)

                if(uiStyle){
                    item.css(uiStyle)
                }
                if(uiClass){
                    item.addClass(uiClass)
                }

                elm.find(".contents-option-content").append(item)
            }
            else if(uiName==="integer"){
                var item = $(`
                    <div class="textfield">
                        <label>${uiPrefix}</label>
                        <input class="options" type="number" id="${id}">
                        <label>${uiSuffix}</label>
                    </div>
                `)
                
                if(uiData){
                    if(uiData.min){
                        item.find("input").attr("min", uiData.min)
                    }
                    if(uiData.max){
                        item.find("input").attr("max", uiData.max)
                    }
                }

                if(uiStyle){
                    item.css(uiStyle)
                }
                if(uiClass){
                    item.addClass(uiClass)
                }

                elm.find(".contents-option-content").append(item)
            }
            else if(uiName==="color"){
                var item = $(`
                    <div class="textfield">
                        <label>${uiPrefix}</label>
                        <input class="options color" type="text" id="${id}" data-coloris>
                        <label>${uiSuffix}</label>
                    </div>
                `)

                if(uiStyle){
                    item.css(uiStyle)
                }
                if(uiClass){
                    item.addClass(uiClass)
                }

                elm.find(".contents-option-content").append(item)
            }
        }
        else if(uiType === "textarea"){
            if(elm.hasClass("contents-option")){
                elm.append(`<div class="contents-option-content"></div>`)
            }else{
                elm.find(".contents-option").append(`<div class="contents-option-content"></div>`)
            }

            if(uiName==="default" || uiName===undefined){
                var item = $(`
                    <div class="textarea-outer">
                        <label>${uiPrefix}</label>
                        <textarea class="textarea options" id="${id}"></textarea>
                        <label>${uiSuffix}</label>
                    </div>
                `)

                if(uiStyle){
                    item.css(uiStyle)
                }
                if(uiClass){
                    item.addClass(uiClass)
                }

                elm.find(".contents-option-content").append(item)
            }else if(uiName === "syntax-highlight"){
                var item = $(`
                    <div class="textarea-outer">
                        <label>${uiPrefix}</label>
                        <textarea class="textarea options syntax-highlight" id="${id}" data="${uiData}"></textarea>
                        <label>${uiSuffix}</label>
                    </div>
                `)

                if(uiStyle){
                    item.css(uiStyle)
                }
                if(uiClass){
                    item.addClass(uiClass)
                }

                elm.find(".contents-option-content").append(item)
            }
        }
        else if(uiType === "custom"){
            if(elm.hasClass("contents-option")){
                elm.append(`<div class="contents-option-content"></div>`)
            }else{
                elm.find(".contents-option").append(`<div class="contents-option-content"></div>`)
            }
            
            if(uiName==="default" || uiName===undefined){
                if(OptionUI_CustomElement[uiData]){
                    elm.find(".contents-option-content").append(OptionUI_CustomElement[uiData])
                }
            }else if(uiName==="wide"){
                if(OptionUI_CustomElement[uiData]){
                    elm.empty()
                    elm.append(OptionUI_CustomElement[uiData])
                }
            }
        }
        /*
        else if(mode==="search"){ //検索用例外設定
            if(elm.hasClass("contents-option")){
                elm.append(`<div class="contents-option-content"></div>`)
            }else{
                elm.find(".contents-option").append(`<div class="contents-option-content"></div>`)
            }

            elm.addClass("search-result--option-disabled")
            var item = $(`
                <div class="search-result--items">
                    <div class="search-result--items-disabled">
                            <a href="/options/${page}/index.html?id=${id}&focus=1" target="_self">
                                <div class="search-result--items-disabled-box">このオプションはここでは設定できません。</div>
                            </a>
                        </span>
                    </div>
                </div>
            `)

            elm.find(".contents-option-content").append(item)
        }
        */
    }

    /* Title / Description */
    if((title || description) && page){
        const pageData = getOptionPageFromID(page)
        const categoryData = getOptionCategory(pageData, category)

        //title
        if(title){
            if(mode === "favorite"){
                if(!elm.find(".contents-item--heading").length){
                    elm.find(".contents-option-head").append(`<div class="contents-item--heading"><a href="/options/${page}/index.html?id=${id}&focus=1" target="_self">${title}</a></div>`)
                }else{
                    elm.find(".contents-item--heading").empty()
                    elm.find(".contents-item--heading").append(`<a href="/options/${page}/index.html?id=${id}&focus=1" target="_self">${title}</a>`)
                }
            }
            else if(mode==="search" && pageData && categoryData){
                var crumbs = ""
                var optionTag = ""
                /*
                optionTag = `
                    <span class="search-result--items-crumbs-item search-result--items-id">
                        <a class="search-result--items-id-tag" href="/options/${page}/index.html?id=${id}&focus=1" target="_self">${id}</a>
                    </span>
                `
                */

                if(hasParent && parent){
                    const parentData = getOptionFromID(parent)
                    if(parentData){
                        crumbs = `
                            <div class="search-result--items-crumbs">
                                <span class="search-result--items-crumbs-item"><a href="/options/${pageData.id}/index.html" target="_self">${pageData.title}</a></span>
                                <span class="search-result--items-crumbs-item"><a href="/options/${pageData.id}/index.html?category=${categoryData.id}" target="_self">${categoryData.title}</a></span>
                                <span class="search-result--items-crumbs-item"><a href="/options/${pageData.id}/index.html?id=${parentData.id}" target="_self">${parentData.title}</a></span>
                                ${optionTag}
                            </div>
                        `
                    }else{
                        crumbs = `
                            <div class="search-result--items-crumbs">
                                <span class="search-result--items-crumbs-item"><a href="/options/${pageData.id}/index.html" target="_self">${pageData.title}</a></span>
                                <span class="search-result--items-crumbs-item"><a href="/options/${pageData.id}/index.html?category=${categoryData.id}" target="_self">${categoryData.title}</a></span>
                                ${optionTag}
                            </div>
                        `
                    }
                }else{
                    crumbs = `
                        <div class="search-result--items-crumbs">
                            <span class="search-result--items-crumbs-item"><a href="/options/${pageData.id}/index.html" target="_self">${pageData.title}</a></span>
                            <span class="search-result--items-crumbs-item"><a href="/options/${pageData.id}/index.html?category=${categoryData.id}" target="_self">${categoryData.title}</a></span>
                            ${optionTag}
                        </div>
                    `
                }

                if(!elm.find(".contents-item--heading").length){
                    elm.find(".contents-option-head").append(`
                        <div class="contents-item--heading">
                            ${crumbs}
                            <div class="search-result--items-title">
                                <a href="/options/${page}/index.html?id=${id}&focus=1" target="_self">${title}</a>
                            </div>
                        </div>
                    `)
                }else{
                    elm.find(".contents-item--heading").empty()
                    elm.find(".contents-item--heading").append(`
                        ${crumbs}
                        <div class="search-result--items-title">
                            <a href="/options/${page}/index.html?id=${id}&focus=1" target="_self">${title}</a>
                        </div>
                    `)
                }
            }
            else{
                if(!elm.find(".contents-item--heading").length){
                    elm.find(".contents-option-head").append(`<div class="contents-item--heading">${title}</div>`)
                }else{
                    elm.find(".contents-item--heading").empty()
                    elm.find(".contents-item--heading").append(title)
                }
            }
        }
        
        // description
        var descriptionText: Array<string> = []

        if(description){
            if(description.text){
                descriptionText.push(`<div class="contents-item--description-item">${description.text}</div>`)
            }
            if(description.small){
                descriptionText.push(`<div class="contents-item--description-item description-small">${description.small}</div>`)
            }
            if(description.attention){
                descriptionText.push(`<div class="contents-item--description-item description-attention">${description.attention}</div>`)
            }
        }

        if(descriptionText.length > 0){
            if(!elm.find(".contents-item--description").length){
                elm.find(".contents-option-head").append(`<div class="contents-item--description">${descriptionText.join("")}</div>`)
            }else{
                elm.find(".contents-item--description").empty()
                elm.find(".contents-item--description").append(descriptionText.join(""))
            }
        }
    }

    /* Buttons */
    if(buttons){
        var buttonElm = $(`<div class="contents-item--buttons"></div>`)

        if(buttons.favorite){
            /* favorite buttons */
            var buttonOuterElm = $(`<div class="contents-item--button-item contents-item--button-favorite"></div>`)

            if(mode==="favorite"){
                /* arrows */
                if(!hasParent){
                    var buttonIconElm_Up = $(`
                        <div class="contents-item--button-icon contents-item--button-favorite--prev">
                            <i class="fa-solid fa-arrow-up"></i>
                        </div>
                    `).on("click", function(){
                        moveFavoriteOption(id, -1)
                    })
        
                    var buttonIconElm_Down = $(`
                        <div class="contents-item--button-icon contents-item--button-favorite--next">
                            <i class="fa-solid fa-arrow-down"></i>
                        </div>
                    `).on("click", function(){
                        moveFavoriteOption(id, 1)
                    })
        
                    buttonElm.append(buttonIconElm_Up)
                    buttonElm.append(buttonIconElm_Down)
                    buttonElm.append(`<div class="contents-item--button-item contents-item--button-separator"></div>`)
                }

                
                /* remove button */
                var buttonIconElm_On = $(`
                    <div class="contents-item--button-icon contents-item--button-favorite-icon contents-item--button-favorite--on">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                `).on("click", function(){
                    removeFavoriteOption(id)
                })
    
                buttonOuterElm.append(buttonIconElm_On)
                buttonElm.append(buttonOuterElm)

            }else{
                var buttonIconElm_Off = $(`
                    <div class="contents-item--button-icon contents-item--button-favorite-icon contents-item--button-favorite--off">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                `).on("click", function(){
                    appendFavoriteOption(id)
                })
    
                var buttonIconElm_On = $(`
                    <div class="contents-item--button-icon contents-item--button-favorite-icon contents-item--button-favorite--on">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                `).on("click", function(){
                    removeFavoriteOption(id)
                })
    
                buttonOuterElm.append(buttonIconElm_Off)
                buttonOuterElm.append(buttonIconElm_On)
                buttonElm.append(buttonOuterElm)
            }
        }

        // separator
        if(buttons.favorite && buttons.reset){
            buttonElm.append(`<div class="contents-item--button-item contents-item--button-separator"></div>`)
        }

        // reset button
        if(buttons.reset){
            var buttonElm_Reset = $(`
                <div class="contents-item--button-item contents-item--button-reset">
                    <div class="contents-item--button-icon contents-item--button-reset-icon">
                        <i class="fa-solid fa-rotate-left"></i>
                    </div>
                </div>
            `).on("click", function(){
                if(window.confirm(`この設定データをリセットします。よろしいですか？\n項目：${title}`)){

                    var reset = (option: OptionUI_Item|undefined, ret: Object) => {
                        if(option?.value){
                            if(Array.isArray(option.value.related)){
                                var defaultOption = new LocalOptions().get()
                                $.each(option.value.related, function(_, key){
                                    if(key in defaultOption){
                                        ret[key] = defaultOption[key]
                                    }
                                })
                            }else if(option.value.related === "child"){
                                var childs = getOptionChildsFromID(option.id)
                                $.each(childs, function(_, child){
                                    ret = reset(child, ret)
                                })
                            }
                        }
                        return ret
                    }

                    var ret = {}
                    var option = getOptionFromID(id)
                    ret = reset(option, ret)
                    chrome.storage.local.set(ret, function(){})
                }
            })

            buttonElm.append(buttonElm_Reset)
        }

        
        
        /* place elements */
        elm.find(".contents-option-head").append(buttonElm)
        var p = buttonElm.clone(true)
        p.addClass("contents-item--buttons-vertical")
        elm.find(".contents-option-head").prepend(p)

    }

    /* Hide Settings */
    if(requirement){
        var hsDataFor = requirement.dataFor
        var hsData = requirement.data
        var hsMode = requirement.mode
        var hsRule = requirement.rule

        if(!Array.isArray(hsDataFor)){
            hsDataFor = [hsDataFor]
        }

        const len = hsDataFor.length
        if(!Array.isArray(hsData)){
            hsData = new Array(len).fill(hsData)
        }

        var hsDataType = new Array(len)
            .fill(undefined)
            .map((_, k) => {
                var t = typeof hsData[k]
                if(t==="boolean" || t==="number" || t==="string"){
                    return t
                }else if(hsData[k]===null){
                    return "null"
                }else{
                    return "undefined"
                }
            })
        
        elm.addClass("option-hide")
        elm.attr("data-for", hsDataFor.join(" "))
        if(hsData){
            elm.attr("data", hsData.join(" "))
        }
        if(hsMode){
            elm.attr("mode", hsMode)
        }
        if(hsDataType){
            elm.attr("data-type", hsDataType.join(" "))
        }
        if(hsRule){
            elm.attr("data-rule", hsRule)
        }
    }

    /* Advanced / Experimental settings */
    if(isAdvanced){
        elm.addClass("advanced-hide")
    }
    if(isExperimental){
        elm.addClass("experimental-hide")
    }
    if(isDebug){
        elm.addClass("debug-option-hide")
    }

    /* Style */
    if(style){
        elm.css(style)
    }

    /* Class */
    if(elmClass){
        elm.addClass(elmClass)
    }

    return elm
}