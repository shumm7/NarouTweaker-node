import { check } from "../utils/misc"
import { nt } from "../utils/narou-tweaker";
import { colorPicker, getOptionElement, optionHide, syntaxHighlight } from "./_utils/utils";
import { OptionUI_Items, OptionUI_Pages } from "./_utils/optionUI_items";
import { OptionUI_ItemID, OptionUI_Page, OptionUI_PageID } from "./_utils/optionUI_type";
import { getOptionFromID, getOptionPageFromID } from "./_utils/optionUI_utils";

import $ from 'jquery';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/fonts/icomoon/style.css";
import "w3-css/w3.css";

const manifest = nt.extension.manifest
let currentPage: OptionUI_PageID|undefined

export function setup(){
    var p = $("#option-page-id").val()
    if(typeof p === "string"){
        currentPage = p
    } 

    setupDOM()
    setupContents()
    hideOptionButtons()
    optionHide()
    syntaxHighlight()
    restoreOptions()
    urlScheme()
}

function setupDOM(){
    let currentCategory: OptionUI_Page|undefined

    /* Remove JS error message */
    $('#js-failed').remove();

    /* Sidebars */
    var sidebarDOMItems = ""
    $.each(OptionUI_Pages, function(_, page){
        if(page.sidebar || page.sidebar===undefined){
            var elm
            if(page.separator){
                elm = $(`
                    <div class="sidebar-separator" name="${page.id}"></div>
                `)
            }else{
                var url = `/options/${page.id}/index.html`
                elm = $(`
                    <div class="sidebar-item" name="${page.id}">
                        <a href="${url}" target="_self">
                            <span class="sidebar-item--title">${page.title}</span>
                        </a>
                    </div>
                `)
    
                if(page.icon){
                    elm.find("a").prepend(`<i class="${page.icon}"></i>`)
                }
            }
            if(page.popup){
                if(page.popup.hide){
                    elm.addClass("sidebar-item--hide-on-popup")
                }
            }
            sidebarDOMItems += elm[0].outerHTML
        }


        if(page.id===currentPage){
            currentCategory = page
        }
    })

    if(currentCategory===undefined){
        return
    }

    var sidebar = $(`
        <div id="sidebar-inner">
            <div id="sidebar-header">
                <a href="/options/general/index.html" target="_self"><img class="brand-icon" src="/assets/icons/icon.png" width="30" height="30"/></a>
                <div class="sidebar-icon" id="sidebar-icon--help">
                    <!--<a href="/options/help/index.html"><i class="fa-solid fa-circle-question"></i></a>-->
                </div>
            </div>
            <div id="sidebar-middle">
                <div id="sidebar-search">
                    <input type="text" id="sidebar-search-box" placeholder="検索">
                </div>
                <div id="sidebar-items">
                    ${sidebarDOMItems}
                </div>
            </div>
            <div id="sidebar-bottom">
                <div id="sidebar-toolbox">
                    <div id="sidebar-version">build. ${manifest.version}</div>
                    <div class="sidebar-icon" id="sidebar-icon--hide">
                        <i class="fa-solid fa-angles-left"></i>
                    </div>
                </div>
            </div>
        </div>
        <div id="sidebar-open">
            <div class="sidebar-icon" id="sidebar-icon--show">
                <i class="fa-solid fa-angles-right"></i>
            </div>
        </div>
        `)

    sidebar.find(`.sidebar-item:has(a[href="${location.pathname}"])`).addClass("selected")
    $("#sidebar").append(sidebar)


    /* Sidepanel Events */
    nt.storage.session.get("extOptionSidePanelShow").then(function(data){
        _sidepanelHide(data.extOptionSidePanelShow)
    })
    $("#sidebar-icon--hide").on("click", function(){
        nt.storage.session.set("extOptionSidePanelShow", false)
    })
    $("#sidebar-open").on("click", function(){
        nt.storage.session.set("extOptionSidePanelShow", true)
    })
    nt.storage.session.changed("extOptionSidePanelShow", function(changes){
        _sidepanelHide(changes?.extOptionSidePanelShow?.newValue)
    })
    function _sidepanelHide(mode?: any){
        if(mode==undefined){mode = true}
        if(mode){
            $("#sidebar").removeClass("hide")
        }else{
            $("#sidebar").addClass("hide")
        }
    }

    /* search event */
    $("#sidebar-search-box").on("input", function(){
        const _v = $(this).val()
        
        if(typeof _v == "string"){
            var searchWords: string = _v
            if(currentPage!=="search"){
                const words = searchWords.split(/\s/).filter(w => w.trim().length > 0)
            
                const params = new URLSearchParams(location.search)
                params.set("s", words.join(" "))
                window.history.replaceState(null, "", `${location.pathname}?${params.toString()}`)
            }else{
                $("#search-box").val(searchWords)
                $("#search-box").trigger("input")
            }
        }
    })
    $("#sidebar-search-box").on("keydown", function(e){
        if(e.key === "Enter"){
            if(currentPage!=="search"){
                const _v = $(this).val()
                if(typeof _v == "string"){
                    var searchWords: string = _v
                    const words = searchWords.split(/\s/).filter(w => w.trim().length > 0)
                
                    const params = new URLSearchParams(location.search)
                    params.set("s", words.join(" "))
                    location.assign(`/options/search/index.html?${params.toString()}`)
                }
            }else{
                $("#search-box").focus()
            }
        }
    })

    /* Set Title */
    function getName(id: OptionUI_PageID, _pre?: string): string{
        var cat = getOptionPageFromID(id)
        if(cat===undefined){
            if(_pre){
                return _pre
            }else{
                return "環境設定"
            }
        }
        if(cat.parent === undefined){
            return `${cat.title} < 環境設定`
        }else{
            return `${cat.title} < ${getName(cat.parent, _pre)}`
        }
    }

    $("head title").text(`${getName(currentCategory.id)} ｜ Narou Tweaker`)
    
    
    /* Footer */
    $("#footer").append(`
    <div id="footer-contents">
        <div class="footer-contents--image">
            <a href="https://github.com/shumm7/Narou-Tweaker">
                <img src="/assets/icons/icon.png" width="30" height="30">
            </a>
        </div>
        <div class="footer-contents--text">Narou Tweaker v${manifest.version}</div>
    </div>
    `)

    /* Header Info */
    if(currentCategory.icon){
        $("#header-title--heading").append(`<i class="${currentCategory.icon}"></i>`)
    }
    $("#header-title--heading").append(`<span class="title">${currentCategory.title}</span>`)

    if(currentCategory.targetUrl !== undefined){
        $("#header-title--description").append(`
            <p class="header-title--description-text">
                ${currentCategory.description}<br>
                <span style="font-size:80%;">対象ページ：${currentCategory.targetUrl.join(" / ")}
            </p>
            <div class="header-title--icons">
                <div class="header-title--icons--icon header-title--icons--icon-general">
                    <a href="/options/general/index.html" target="_self"><i class="fa-solid fa-gear"></i></a>
                </div>
                <div class="header-title--icons--icon header-title--icons--icon-search">
                    <a href="/options/search/index.html" target="_self"><i class="fa-solid fa-magnifying-glass"></i></a>
                </div>
                <div class="header-title--icons--icon header-title--icons--icon-favorite">
                    <a href="/options/favorite/index.html" target="_self"><i class="fa-solid fa-heart"></i></a>
                </div>
            </div>
        `)
    }else{
        $("#header-title--description").append(`
            <p class="header-title--description-text">${currentCategory.description}</p>
            <div class="header-title--icons">
                <div class="header-title--icons--icon header-title--icons--icon-general">
                    <a href="/options/general/index.html" target="_self"><i class="fa-solid fa-gear"></i></a>
                </div>
                <div class="header-title--icons--icon header-title--icons--icon-search">
                    <a href="/options/search/index.html" target="_self"><i class="fa-solid fa-magnifying-glass"></i></a>
                </div>
                <div class="header-title--icons--icon header-title--icons--icon-favorite">
                    <a href="/options/favorite/index.html" target="_self"><i class="fa-solid fa-heart"></i></a>
                </div>
            </div>
        `)
    }

    /* Header Tab */
    const scrollElement = document.querySelector("#header-menu-left-items");
    if(scrollElement!=null){
        scrollElement.addEventListener("wheel", (e: any) => {
            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            e.preventDefault();
            scrollElement.scrollLeft += e.deltaY;
        });
    }

    /* Header Tab Items */
    const defaultCategory = currentCategory.defaultCategory
    $.each(currentCategory.categories, function(_, tab){
        $("#main").append(`<div class="contents-container header-menu-target" name="${tab.id}"></div>`)

        if(tab.description){
            var categoryDescription: Array<string> = []
            if(tab.description.text){
                categoryDescription.push(tab.description.text)
            }
            if(tab.description.small){
                categoryDescription.push(`<span style="color: #999; font-size: 80%;">${tab.description.small}</span>`)
            }
            if(tab.description.attention){
                categoryDescription.push(`<span style="color: red; font-weight: bold; font-size: 90%;">${tab.description.attention}</span>`)
            }

            if(categoryDescription.length > 0) {
                $(`.header-menu-target[name="${tab.id}"]`).append(`
                    <div class="contents-wide">
						<p>${categoryDescription.join("<br>")}</p>
					</div>
                `)
            }
        }
        
        if(defaultCategory===tab.id){
            $("#header-menu-left-items").append(`
                <li class="header-menu-item selected" name="${tab.id}">
                    <span class="header-menu-item--title">${tab.title}
                    </span>
                </li>
            `)

            $(`.header-menu-target[name="${tab.id}"]`).addClass("selected")
        }else{
            $("#header-menu-left-items").append(`
                <li class="header-menu-item" name="${tab.id}">
                    <span class="header-menu-item--title">${tab.title}
                    </span>
                </li>
            `)
        }

        if(!currentCategory?.tabs && currentCategory?.tabs!==undefined){
            $("#header-menu").css("display", "none")
        }
        
    })
        
    $(".header-menu-item").on("click", function(){
        var name = $(this).attr("name")
        $(`.header-menu-item.selected`).removeClass("selected")
        $(this).addClass("selected")

        $(`.header-menu-target.selected`).removeClass("selected")
        $(`.header-menu-target[name="${name}"]`).addClass("selected")

        const params = new URLSearchParams(location.search)
        params.set("category", name ?? "")

        window.history.replaceState(null, "", `/options/${currentPage}/index.html?${params.toString()}`)

        /* popup時に自動でタブをスクロール */
        var outer = document.getElementById( "header-menu-left-items")
        var button = $(this)[0]
        if(outer!==undefined && outer!==null){
            const scrollWidth = outer.scrollWidth
            const width = outer.clientWidth
            const buttonSize = button.clientWidth
            if(width < scrollWidth){
                const scrollLeft = outer.scrollLeft //スクロール量
                const absoluteLeft = button.offsetLeft - outer.offsetLeft //オブジェクトの通常位置
                const currentLeft = absoluteLeft - scrollLeft //オブジェクトの現在の位置

                const centerLeft = width/2 - buttonSize/2 //目標とする位置
                const target = centerLeft - currentLeft // 必要なスクロール量
                const canMove =  scrollLeft - target >=0 ? scrollLeft - target : 0 //現在のスクロール量からどれだけスクロールさせればいいか
                outer.scrollLeft = canMove
            }
        }
    })
}

function setupContents(){
    $.each(OptionUI_Items, function(_, option){
        if(option.location){
            if(option.location.page === currentPage){
                if(!option.location.hide){
                    const category = option.location.category
                    const hasParent = option.location.hasParent
                    const parent = option.location.parent

                    var elm = getOptionElement(option)

                    /* Placement */
                    if(hasParent){
                        $(`.contents-container[name="${category}"] .contents-wide[name="${parent}"] .contents-wide-column`).append(elm)
                    }else{
                        $(`.contents-container[name="${category}"]`).append(elm)
                    }

                    if(option.ui){
                        if(typeof option.ui.action==="function"){
                            option.ui.action()
                        }else if(Array.isArray(option.ui.action)){
                            option.ui.action.forEach(function(func){
                                if(typeof func==="function"){
                                    func()
                                }
                            })
                        }
                    }
                }
            }
        }
    })

    function markFavoriteOptions(list: Array<OptionUI_ItemID>){
        $(".contents-item--button-favorite.selected").removeClass("selected")
        if(Array.isArray(list)){
            $.each(list, function(_, id){
                $(`.option-outer[name=${id}] > .contents-option-head > .contents-item--buttons .contents-item--button-favorite, .option-outer[name=${id}] > .contents-option > .contents-option-head > .contents-item--buttons .contents-item--button-favorite`).addClass("selected")
            })
        }
    }

    nt.storage.local.get("extFavoriteOptions").then(function(data){
        markFavoriteOptions(data.extFavoriteOptions)
    })
    nt.storage.local.changed("extFavoriteOptions", function(changes){
        const list = changes?.extFavoriteOptions?.newValue
        if(Array.isArray(list)){
            markFavoriteOptions(list)
        }else{
            markFavoriteOptions([])
        }
    })
}


/* Restore Options */
function restoreValues(data: Record<string,any>){
    $.each(data, function(name: string, value: any){
      var elm = $(`.options[id="${name}"]`)
      if(elm.length && value!==undefined && value!==null){
        const tagName = elm.prop("tagName").toLowerCase()
        const type = elm.prop("type")
        
        if(tagName == "input" && type=="checkbox"){ // Toggle
          check("#" + elm.prop("id"), value)
        }
        else if(tagName == "input" && type=="text" && elm.hasClass("color")){ // Input Text
            elm.val(value)
            document.querySelectorAll('.color').forEach(input => {
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
        else if(tagName == "input" && (type=="text" || type=="number")){ // Input Text
            elm.val(value)
        }
        else if(tagName=="select"){ // DropDown
            elm.val(value)
        }
        else if(tagName=="textarea"){ // TextArea
            elm.val(value)
            if(elm.hasClass("syntax-highlight")){
                elm.trigger("input")
            }
        }
      }
    })
  }

export function restoreOptions(){
    nt.storage.local.changed(function(_changes){
      chrome.storage.local.get(null, function(data) {
        restoreValues(data)
      })
    })
  
    chrome.storage.local.get(null, function(data) {
       restoreValues(data)
       colorPicker()
    });

    /* On Click Elements */
    $(".options").on("click", function(){
        const name = $(this).prop("id")
        const tagName = $(this).prop("tagName").toLowerCase()
        const type = $(this).prop("type")
    
        var value: Record<string,any> = {}
        if(tagName=="input" && type=="checkbox"){
            value[name] = $(this).prop('checked')
        }else if(tagName=="select"){
            value[name] = $(this).val()
        }
    
        if(value[name]!=undefined){
            nt.storage.local.set(value);
        }
    });

    /* On Change Elements */
    $(".options").on("change", function(){
        const name = $(this).prop("id")
        const tagName = $(this).prop("tagName").toLowerCase()
        const type = $(this).prop("type")
    
        var value: Record<string,any> = {}
        if(tagName=="textarea"){
            value[name] = $(this).val()
        }else if(tagName=="input" && type=="text"){
            value[name] = $(this).val()
        }else if(tagName=="input" && type=="number"){
            var min = parseFloat($(this).prop("min"))
            var max = parseFloat($(this).prop("max"))
            var v = parseFloat(`${$(this).val() ?? ""}`)
            if(isNaN(v)){
                v = 0
                $(this).val(v)
            }
            if(!isNaN(min)){
                if(min>v){
                    v = min
                    $(this).val(v)
                }
            }
            if(!isNaN(max)){
                if(max<v){
                    v = max
                    $(this).val(v)
                }
            }

            value[name] = v
        }
    
        if(value[name]!=undefined){
            nt.storage.local.set(value);
        }
    });

    /* Auto Select */
    $(".autoselect").each(function(){
        $(this).on("click", function(){
            $(this).select()
        })
    })
}

/* Hide Option Buttons */
function hideOptionButtons(){
    function toggle(mode?: any){
        if(mode){
            $(".contents-item--buttons").css("display", "")
        }else{
            $(".contents-item--buttons").css("display", "none")
        }
    }

    nt.storage.local.get("extOptionPageButtons").then(function(data){
        toggle(data.extOptionPageButtons)
    })
    nt.storage.local.changed("extOptionPageButtons", function(changes){
        toggle(changes?.extOptionPageButtons?.newValue)
    }) 
}


/* URL Scheme */
function urlScheme(){
    var params = new URLSearchParams(location.search)
    const p_id = params.get("id")
    const p_category = params.get("category")
    const p_force = params.get("force")
    const p_panel = params.get("panel")
    const p_focus = params.get("focus")

    if(p_id){
        const p_dataOption = getOptionFromID(p_id)
        if(p_dataOption){
            if(p_dataOption.location){
                if(p_dataOption.location.page!==currentPage && p_force==="1"){
                    params.set("category", p_dataOption.location.category)
                    location.replace(`/options/${p_dataOption.location.page}/index.html?${params.toString()}`)
                }else if(p_dataOption.location.page===currentPage){
                    var elm = $(`*[name="${p_id}"]`)
                    if(elm.length){
                        var tab = $(`.header-menu-item[name="${p_dataOption.location.category}"]`)
                        if(tab.length){
                            tab.trigger("click")
                            const offset = elm.offset()
                            if(offset!==undefined){
                                $(window).scrollTop(offset.top)
                            }
                        }
                    }
                }

                if(p_focus==="1"){
                    var elm = $(`*[name="${p_id}"]`)
                    if(elm.length){
                        elm.addClass("search-focused")
                        elm.find(".options").eq(0).focus()
                    }
                }
            }
        }
    }else{
        if(p_category){
            var tab = $(`.header-menu-item[name="${p_category}"]`)
            if(tab.length){
                tab.trigger("click")
            }
        }
    }
    if(p_panel!==null){
        nt.storage.session.get(["extOptionSidePanelShow"]).then((d) =>{
            if(p_panel==="1"){
                if(!d.extOptionSidePanelShow){
                    nt.storage.session.set({extOptionSidePanelShow: true})
                }
            }else if(p_panel==="0"){
                if(d.extOptionSidePanelShow){
                    nt.storage.session.set({extOptionSidePanelShow: false})
                }
            }

        })
    }

    /* search */
    const p_search = params.get("s")
    if(currentPage=="search"){
        if(p_search){
            $("#search-box").val(p_search)
            $("#search-box").trigger("input")
        }
    }
    if(p_search){
        $("#sidebar-search-box").val(p_search)
    }
}