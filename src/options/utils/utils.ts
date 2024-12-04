import { nt } from "../../utils/narou-tweaker"
import { OptionUI_CustomElement } from "./optionUI_custom"
import { appendFavoriteOption, getOptionCategory, getOptionChildsFromID, getOptionFromID, getOptionPageFromID, moveFavoriteOption, removeFavoriteOption } from "./optionUI_utils"
import { OptionHideParammeters, OptionUI_Item, OptionUI_ItemID } from "./optionUI_type"

import $ from 'jquery';
import "@melloware/coloris/dist/coloris.css";
import { coloris, init } from "@melloware/coloris";
import "highlight.js/styles/github.css"
import hljs from 'highlight.js';

/**o
 * オプション（storage.local）の状態によって、要素の表示/非表示を切り替える
 * 対象の要素に「option-hide」クラスを追加する。
 * @param {OptionID} data - オプションID（複数の場合は半角スペース区切り）
 * @param data-for - オプションが取る値（この値のときにトリガーする）
 * @param mode - トリガー時に行うアクション（show/hide/inactive/active）
 * @param logic - トリガーの比較方法（or（デフォルト）/and/nor/nand）
 */
export function optionHide(){
    $(".option-hide").each(function(){
        const p = OptionHideParammeters
        let elm = $(this)
        let keys: Array<string> = []
        let values: Array<string> = []
        let mode: string = "show"
        let logic: string = "or"
        let types: Array<string> = []

        /* data_for (前提となる設定項目のID) */
        var s = $(this).attr(p.key)
        if(s){keys = s.trim().split(/ +/)}

        /* data (前提となる設定項目のトリガー値) */
        s = $(this).attr(p.value)
        if(s){values = s.trim().split(/ +/)}

        /* mode（トリガー時のアクション） */
        s = $(this).attr(p.mode)
        if(s){mode = s}

        /* logic */
        s = $(this).attr(p.logic)
        if(s){logic = s}

        /* types (トリガー値の型) */
        s = $(this).attr(p.type)
        if(s){types = s.trim().split(/ +/)}

        if(keys.length > values.length){
            /* キーが値よりも多い場合は、値をキーと同じ数まで追加 */
            const k = values.length
            for(var i=0; i < keys.length-values.length; i++){
                values.push(values[k-1])
            }
        }else if(keys.length < values.length){
            /* 値がキーよりも多い場合は、値をキーと同じ数まで削除 */
            values = values.slice(0, keys.length)
        }

        if(keys.length > types.length){
            for(var i=0; i < keys.length-types.length; i++){
                types.push("")
            }
        }else if(keys.length < types.length){
            types = types.slice(0, keys.length)
        }

        nt.storage.local.get(keys).then(function(data){
            var _o: Array<any> = []
            var _v: Array<string> = []
            var _t: Array<string> = []

            $.each(keys, function(i, key){
                const param = data[key]
                if(param){
                    _o.push(param)
                    _v.push(values[i])
                    _t.push(types[i])
                }
            })
            if(_o.length>0){
                change(_o, _v, _t, mode, logic)
            }
        })

        chrome.storage.local.onChanged.addListener(function(changes){
            var _o: Array<any> = []
            var _v: Array<string> = []
            var _t: Array<string> = []

            $.each(keys, function(i, key){
                if(changes[key]){
                    _o.push(changes[key].newValue)
                    _v.push(values[i])
                    _t.push(types[i])
                }
            })
            if(_o.length>0){
                change(_o, _v, _t, mode, logic)
            }
        })


        function compare(_original: any, _value: string, _type: string){
            if(_type){
                if(_type==="null"){ return _original === null }
                else if(_type==="undefined"){ return _original === undefined }
                else if(_type==="boolean"){ return _original === (_value.toLowerCase() === "true") }
                else if(_type==="string"){ return _original===_value }
                else if(_type==="number"){
                    if(isNaN(_original)){
                        return isNaN(Number(_value))
                    }else{
                        return _original===Number(_value)
                    }
                }
            }
            return String(_original)===String(_value)
        }

        function change(_originals: Array<any>, _values:Array<string>, _types: Array<string>, _mode: string, _logic: string){
            /* 論理値 */
            let condition: boolean = false
            if(_originals.length>0){
                if(_logic=="and"){ condition = true }

                $.each(_originals, function(i, _original){
                    if(_logic=="and" || _logic=="nand"){
                        condition = condition && compare(_original, _values[i], _types[i])
                    }else{ // or - nor
                        condition = condition || compare(_original, _values[i], _types[i])
                    }
                })
                if(_logic == "nor" || _logic == "nand"){
                    condition = !condition
                }
            }

            /* クラス追加 */
            if(condition){
                if(_mode==="hide"){
                    elm.addClass("option-hide--hidden")
                }
                else if(_mode==="inactive"){
                    elm.addClass("option-hide--inactive")
                }
                else if(_mode==="active"){
                    elm.removeClass("option-hide--inactive")
                }
                else{ //show
                    elm.removeClass("option-hide--hidden")
                }
            }else{
                if(_mode==="hide"){
                    elm.removeClass("option-hide--hidden")
                }
                else if(_mode==="inactive"){
                    elm.removeClass("option-hide--inactive")
                }
                else if(_mode==="active"){
                    elm.addClass("option-hide--inactive")
                }
                else{ //show
                    elm.addClass("option-hide--hidden")
                }
            }
        }
    })

    additionalHide()
}

function additionalHide(){
    /* Experimental */
    $(".experimental-hide").each(function(){
        var elm = $(this)

        function change(value: any){
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

            
        nt.storage.local.get(["extExperimentalFeatures"]).then(function(data){
            change(data.extExperimentalFeatures)
        })

        nt.storage.local.changed("extExperimentalFeatures", function(changes){
            change(changes?.extExperimentalFeatures?.newValue)
        })
    })

    $(".advanced-hide").each(function(){
        var elm = $(this)

        function change(value: any){
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

            
        nt.storage.local.get(["extAdvancedSettings"]).then(function(data){
            change(data.extAdvancedSettings)
        })

        nt.storage.local.changed("extAdvancedSettings", function(changes){
            change(changes?.extAdvancedSettings?.newValue)
        })
    })

    $(".debug-option-hide").each(function(){
        var elm = $(this)

        function change(value: any){
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

            
        nt.storage.local.get(["extDebug"]).then(function(data){
            change(data.extDebug)
        })

        nt.storage.local.changed("extDebug", function(changes){
            change(changes?.extDebug?.newValue)
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
        const textarea = $(this)
        var language = textarea.attr("data")
        textarea.wrap(`<div class="syntax-highlight-wrap" id="highlight-${i}"></div>`)
        textarea.after(`<pre><code class="${language}"></code></pre>`)

        var wrapper = textarea.parent()
        var dummyWrapper = wrapper.find("pre")
        var dummy = dummyWrapper.find("code")

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
    const uiClass = option.ui?.class
    const uiPrefix = option.ui?.prefix ?? ""
    const uiSuffix = option.ui?.suffix ?? ""
    const buttons = option.value?.buttons
    const requirement = option.value?.requirement
    const isExperimental = option.value?.isExperimental
    const isAdvanced = option.value?.isAdvanced
    const isDebug = option.value?.isDebug
    const parent = option.location?.parent

    var elm
    
    /* Outer */
    if(parent && mode!=="search"){
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

                if(parent){
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
                if(!parent){
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

                    var reset = (option: OptionUI_Item|undefined, ret: Record<string,any>) => {
                        if(option?.value){
                            if(Array.isArray(option.value.related)){
                                const defaultOption = new nt.storage.local.options().get()
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
                    nt.storage.local.set(ret)
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