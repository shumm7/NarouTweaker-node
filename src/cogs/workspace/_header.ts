import { nt } from "../../utils/narou-tweaker"
import { isR18 } from "../../utils/narou"

import $ from "jquery"

export function _header(){
    headerIcons()
    changeHeaderScrollMode()
    addMenuLink()
}

function changeHeaderScrollMode(){
    var elm = ".l-header"

    $("body > div").each(function(){
        if(!$(this).hasClass("l-header")){
            $(this).addClass("top")
            return false
        }
    })

    function changeMode(elm: HTMLElement|JQuery<HTMLElement>){
        nt.storage.local.get(null).then((data) => {
            const header_mode = data.workspaceCustomHeaderMode
            const hidden_begin = data.workspaceCustomHeaderScrollHidden
            if(!$(elm).length){return}

            $(elm).removeClass("header-mode--fixed")
            $(elm).removeClass("header-mode--absolute")
            $(elm).removeClass("header-mode--scroll")
            $(elm).css({"position": ""})
            $("#novelnavi_right").css({"position": ""})
            $("#novelnavi_right > *").css({"position": ""})

            if(header_mode=="fixed"){
                $(elm).addClass("header-mode--fixed")
            }else if(header_mode=="absolute"){
                $(elm).addClass("header-mode--absolute")
            }else if(header_mode=="scroll"){
                $(elm).addClass("header-mode--scroll")
                if(hidden_begin){
                    $(elm + '.header-mode--scroll').addClass('hide');
                }
            }
        })
    }
    changeMode($(elm))

    var pos = $(window).scrollTop();
    $(window).on("scroll", function(){
        const scrollTop = $(this).scrollTop()
        if(scrollTop!==undefined && pos!==undefined && Math.abs(scrollTop - pos)>100){
            if(scrollTop < pos ){
                $(elm + '.header-mode--scroll').removeClass('hide'); /* Scroll Up */
                $("#novel_header_search_box.show").removeClass("show")
            }else{
                $(elm + '.header-mode--scroll').addClass('hide'); /* Scroll Down */
                $("#novel_header_search_box.show").removeClass("show")
            }
            pos = $(this).scrollTop();
        }
    });

    chrome.storage.local.onChanged.addListener(function(changes){
        if(changes.workspaceCustomHeaderMode!=undefined || changes.workspaceCustomHeaderScrollHidden!=undefined){
            changeMode($(elm))
        }
    })
}

function headerIcons(){
    var headerParent = $(".p-up-header-pc .p-up-header-pc__nav")
    function getLink(selector: string){
        var g = $(".p-up-header-pc__gmenu-list").find(selector)
        if(g.length){
            return g.clone()[0].outerHTML
        }
        return ``
    }

    function getList(selector: string){
        var g = $(".p-up-header-pc__gmenu-list").find(selector)
        if(g.length){
            return "<li>" + g.clone()[0].outerHTML + "</li>"
        }
        return ``
    }

    // ユーザ
    var elm = $(".p-up-header-pc__nav-item:has(.p-up-header-pc__account)")
    if(elm.length){
        elm.addClass("user")
    }

    //メッセージ
    var elm = $(".p-up-header-pc__nav-item:has(.p-icon--envelope)")
    if(elm.length){
        elm.addClass("message")
    }

    //ユーザホーム
    var elm = $(".p-up-header-pc__nav-item:has(a > .p-icon--home)")
    if(elm.length){
        elm.addClass("home")
    }

    //メニュー
    var elm = $(".p-up-header-pc__nav-item:has(.p-up-header-pc__gmenu)")
    if(elm.length){
        elm.addClass("menu")
    }

    /* 複数カテゴリ */
    //お気に入り
    headerParent.append(`
        <li class="p-up-header-pc__nav-item favorite">
            <div class="p-up-header-pc__account">
                <span class="p-up-header-pc__nav-label p-up-header-pc__username">
                    <span class="p-icon p-icon--star-line p-up-header-pc__nav-icon" aria-hidden="true"></span>お気に入り
                </span>
                <div class="p-up-header-pc__account-menu">
                    <ul class="p-up-header-pc__account-menu-list">
                        ${getList("a[href='https://syosetu.com/favnovelmain/list/'], a[href='https://syosetu.com/favnovelmain18/list/']")}
                        ${getList("a[href='https://syosetu.com/favuser/list/'], a[href='https://syosetu.com/favuser18/list/']")}
                    </ul>
                </div>
            </div>
        </li>
    `)

    //ブックマーク
    var elm = $(`
        <li class="p-up-header-pc__nav-item favnovel">
            ${getLink("a[href='https://syosetu.com/favnovelmain/list/'], a[href='https://syosetu.com/favnovelmain18/list/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<i class="fa-solid fa-book-bookmark"></i>`)
    headerParent.append(elm)

    //更新通知
    var g = $(".p-up-header-pc__gmenu-list").find("a[href='https://syosetu.com/xuser/top/'], a[href='https://syosetu.com/user/top/']")
    let r18: boolean|undefined
    if(g.length){
        var href = g.prop("href").trim()
        r18 = isR18(href)
    }
    if(r18){
        elm = $(`
            <li class="p-up-header-pc__nav-item noticelist">
                <a class="p-up-header-pc__nav-label" href="https://syosetu.com/favnovelmain18/isnoticelist/"><span class="p-icon p-icon--bell p-up-header-pc__nav-icon" aria-hidden="true"></span>更新通知</a>
            </li>
        `)
    }else{
        elm = $(`
            <li class="p-up-header-pc__nav-item noticelist">
                <a class="p-up-header-pc__nav-label" href="https://syosetu.com/favnovelmain/isnoticelist/"><span class="p-icon p-icon--bell p-up-header-pc__nav-icon" aria-hidden="true"></span>更新通知</a>
            </li>
        `)
    }
    headerParent.append(elm)

    //お気に入りユーザ
    var elm = $(`
        <li class="p-up-header-pc__nav-item favuser">
            ${getLink("a[href='https://syosetu.com/favuser/list/'], a[href='https://syosetu.com/favuser18/list/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<i class="fa-solid fa-heart"></i>`)
    headerParent.append(elm)

    //投稿
    headerParent.append(`
        <li class="p-up-header-pc__nav-item edit">
            <div class="p-up-header-pc__account">
                <span class="p-up-header-pc__nav-label p-up-header-pc__username">
                    <span class="p-icon p-icon--pen p-up-header-pc__nav-icon" aria-hidden="true"></span>投稿
                </span>
                <div class="p-up-header-pc__account-menu">
                    <ul class="p-up-header-pc__account-menu-list">
                        ${getList("a[href='https://syosetu.com/usernovel/list/']")}
                        ${getList("a[href='https://syosetu.com/novelseriesmanage/list/'], a[href='https://syosetu.com/novelseries18manage/list/']")}
                        ${getList("a[href='https://syosetu.com/novelinitialsetting/updateinput/']")}
                        ${getList("a[href='https://syosetu.com/userwrittingnovel/backup/']")}
                    </ul>
                </div>
            </div>
        </li>
    `)

    //作品の作成・編集
    var elm = $(`
        <li class="p-up-header-pc__nav-item usernovel">
            ${getLink("a[href='https://syosetu.com/usernovel/list/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<span class="p-icon p-icon--plus p-up-header-pc__nav-icon" aria-hidden="true"></span>`)
    headerParent.append(elm)

    //シリーズ設定
    var elm = $(`
        <li class="p-up-header-pc__nav-item novelseries">
            ${getLink("a[href='https://syosetu.com/novelseriesmanage/list/'], a[href='https://syosetu.com/novelseries18manage/list/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<span class="p-icon p-icon--list-ul p-up-header-pc__nav-icon" aria-hidden="true"></span>`)
    headerParent.append(elm)

    //活動報告
    var elm = $(`
        <li class="p-up-header-pc__nav-item blog">
            ${getLink("a[href='https://syosetu.com/userblog/list/'], a[href='https://syosetu.com/userxblog/list/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<span class="p-icon p-icon--article p-up-header-pc__nav-icon" aria-hidden="true"></span>`)
    headerParent.append(elm)

    //リアクション
    headerParent.append(`
        <li class="p-up-header-pc__nav-item reaction">
            <div class="p-up-header-pc__account">
                <span class="p-up-header-pc__nav-label p-up-header-pc__username">
                    <span class="p-icon p-icon--comment-dots-line p-up-header-pc__nav-icon" aria-hidden="true"></span>リアクション
                </span>
                <div class="p-up-header-pc__account-menu">
                    <ul class="p-up-header-pc__account-menu-list">
                        ${getList("a[href='https://syosetu.com/usernovelimpression/passivelist/']")}
                        ${getList("a[href='https://syosetu.com/usernovelreview/passivelist/']")}
                        ${getList("a[href='https://syosetu.com/userblogcomment/passivelist/'], a[href='https://syosetu.com/userxblogcomment/passivelist/']")}
                        ${getList("a[href='https://syosetu.com/usernovelreport/passivelist/']")}
                    </ul>
                </div>
            </div>
        </li>
    `)

    //感想
    var elm = $(`
        <li class="p-up-header-pc__nav-item impression">
            ${getLink("a[href='https://syosetu.com/usernovelimpression/passivelist/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<span class="p-icon p-icon--comment-square-pen p-up-header-pc__nav-icon" aria-hidden="true"></span>`)
    headerParent.append(elm)

    //イチオシレビュー
    var elm = $(`
        <li class="p-up-header-pc__nav-item review">
            ${getLink("a[href='https://syosetu.com/usernovelreview/passivelist/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<i class="fa-solid fa-flag"></i>`)
    headerParent.append(elm)

    //活動報告コメント
    var elm = $(`
        <li class="p-up-header-pc__nav-item blogcomment">
            ${getLink("a[href='https://syosetu.com/userblogcomment/passivelist/'], a[href='https://syosetu.com/userxblogcomment/passivelist/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<i class="fa-regular fa-newspaper"></i>`)
    headerParent.append(elm)

    //誤字報告
    var elm = $(`
        <li class="p-up-header-pc__nav-item novelreport">
            ${getLink("a[href='https://syosetu.com/usernovelreport/passivelist/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<i class="fa-solid fa-keyboard"></i>`)
    headerParent.append(elm)

    //ブロック・ミュート
    headerParent.append(`
        <li class="p-up-header-pc__nav-item block-mute">
            <div class="p-up-header-pc__account">
                <span class="p-up-header-pc__nav-label p-up-header-pc__username">
                    <span class="p-icon p-icon--block p-up-header-pc__nav-icon" aria-hidden="true"></span>ブロック・ミュート
                </span>
                <div class="p-up-header-pc__account-menu">
                    <ul class="p-up-header-pc__account-menu-list">
                        ${getList("a[href='https://syosetu.com/userblock/list/'], a[href='https://syosetu.com/xuserblock/list/']")}
                        ${getList("a[href='https://syosetu.com/mute/list/'], a[href='https://syosetu.com/mute18/list/']")}
                    </ul>
                </div>
            </div>
        </li>
    `)

    //Xユーザホーム
    var elm = $(`
        <li class="p-up-header-pc__nav-item x-home">
            ${getLink("a[href='https://syosetu.com/xuser/top/'], a[href='https://syosetu.com/user/top/']")}
        </li>
    `)
    elm.find("a").addClass("p-up-header-pc__nav-label").prepend(`<span class="p-icon p-icon--home p-up-header-pc__nav-icon" aria-hidden="true"></span>`)
    headerParent.append(elm)
    
    //作品を探す
    headerParent.append(`
        <li class="p-up-header-pc__nav-item find">
            <div class="p-up-header-pc__account">
                <span class="p-up-header-pc__nav-label p-up-header-pc__username">
                    <span class="p-icon p-icon--search p-up-header-pc__nav-icon" aria-hidden="true"></span>作品を探す
                </span>
                <div class="p-up-header-pc__account-menu">
                    <ul class="p-up-header-pc__account-menu-list">
                        ${getList("a[href='https://yomou.syosetu.com/search.php']")}
                        ${getList("a[href='https://yomou.syosetu.com/rireki/list/']")}
                        ${getList("a[href='https://yomou.syosetu.com/rank/top/']")}
                        ${getList("a[href='https://yomou.syosetu.com/reviewlist/list/']")}
                        ${getList("a[href='https://syosetu.com/pickup/list/']")}
                        ${getList("a[href='https://noc.syosetu.com/top/top/']")}
                        ${getList("a[href='https://mnlt.syosetu.com/top/top/']")}
                        ${getList("a[href='https://mid.syosetu.com/top/top/']")}
                        ${getList("a[href='https://noc.syosetu.com/rireki/list/']")}
                        ${getList("a[href='https://mnlt.syosetu.com/rireki/list/']")}
                        ${getList("a[href='https://mid.syosetu.com/rireki/list/']")}
                    </ul>
                </div>
            </div>
        </li>
    `)

    //お困りの方は
    headerParent.append(`
        <li class="p-up-header-pc__nav-item support">
            <div class="p-up-header-pc__account">
                <span class="p-up-header-pc__nav-label p-up-header-pc__username">
                    <span class="p-icon p-icon--question p-up-header-pc__nav-icon" aria-hidden="true"></span>お困りの方は
                </span>
                <div class="p-up-header-pc__account-menu">
                    <ul class="p-up-header-pc__account-menu-list">
                        ${getList("a[href='https://syosetu.com/helpcenter/top/']")}
                        ${getList("a[href='https://syosetu.com/bbs/top/'], a[href='https://nl.syosetu.com/bbs/top/']")}
                        ${getList("a[href='https://syosetu.com/inquire/input/']")}
                    </ul>
                </div>
            </div>
        </li>
    `)



    //ヘッダ設定
    function resetHeader(){
        $(".p-up-header-pc__nav .p-up-header-pc__nav-item").addClass("disabled")
        nt.storage.local.get(null).then((data) => {
            $.each(data.workspaceCustomHeader, function(_, key){
                var elm = $(".p-up-header-pc__nav-item."+key)
                if(elm.length){
                    elm.removeClass("disabled")
                    $(".p-up-header-pc__nav").append(elm)
                }
            })
        })
    }
    resetHeader()

    /* Storage Listener */
    chrome.storage.local.onChanged.addListener(function(changes){
        if(changes.workspaceCustomHeader!=undefined){
            resetHeader()
        }
    })
}

function addMenuLink(){
    function getLink(parent: JQuery<HTMLElement>, selector: string, callback?: (element: JQuery<HTMLElement>)=>void){
        var g = parent.find(selector)
        if(g.length){
            var ret = g.clone()
            if(callback!=undefined){
                callback(ret)
            }
            return ret[0].outerHTML
        }
        return ``
    }

    function getHeadlineType(elm: JQuery<HTMLElement>){
        if(elm.find(".p-icon--star-line").length){
            return "favorite"
        }
        else if(elm.find(".p-icon--pen").length){
            return "edit"
        }
        else if(elm.find(".p-icon--article").length){
            return "blog"
        }
        else if(elm.find(".p-icon--comment-dots-line").length){
            return "reaction"
        }
        else if(elm.find(".p-icon--block").length){
            return "block-mute"
        }
        else if(elm.find(".p-icon--home").length){
            return "x-home"
        }
        else if(elm.find(".p-icon--search").length){
            return "find"
        }
        else if(elm.find(".p-icon--question").length){
            return "support"
        }
    }
    var parents = $(".p-up-header-pc__nav-item .p-up-header-pc__gmenu-list")

    // Set Wrapper Class
    parents.append(`<div class="p-up-header-pc__gmenu-column" id="p-up-header-pc__gmenu-column--hidden"></div>`)
    var parentLeft = parents.find(".p-up-header-pc__gmenu-column:nth-child(1)")
    var parentMiddle = parents.find(".p-up-header-pc__gmenu-column:nth-child(2)")
    var parentRight = parents.find(".p-up-header-pc__gmenu-column:nth-child(3)")
    var parentHidden = parents.find(".p-up-header-pc__gmenu-column#p-up-header-pc__gmenu-column--hidden")
    parentLeft.prop("id", "p-up-header-pc__gmenu-column--left")
    parentMiddle.prop("id", "p-up-header-pc__gmenu-column--middle")
    parentRight.prop("id", "p-up-header-pc__gmenu-column--right")

    // Set Elements
    parents.find(".p-up-header-pc__gmenu-column").each(function(){
        var column = $(this)
        var tag:string|undefined = undefined
        column.find(".p-up-header-pc__gmenu-headline, .p-up-header-pc__gmenu-item").each(function(){
            if($(this).hasClass("p-up-header-pc__gmenu-headline")){
                if(tag!=undefined){
                    $(`.p-up-header-pc__gmenu-column .p-up-header-pc__temporary-class-${tag}`).wrapAll(`<div class="p-up-header-pc__gmenu-list-items ${tag}">`)
                    $(`.p-up-header-pc__gmenu-column .p-up-header-pc__temporary-class-${tag}`).removeClass(`p-up-header-pc__temporary-class-${tag}`)
                }

                tag = getHeadlineType($(this))
                $(this).addClass(`p-up-header-pc__temporary-class-${tag}`)
            }
            else if($(this).hasClass("p-up-header-pc__gmenu-item")){
                $(this).addClass(`p-up-header-pc__temporary-class-${tag}`)
            }
        })

        $(`.p-up-header-pc__gmenu-column .p-up-header-pc__temporary-class-${tag}`).wrapAll(`<div class="p-up-header-pc__gmenu-list-items ${tag}">`)
        $(`.p-up-header-pc__gmenu-column .p-up-header-pc__temporary-class-${tag}`).removeClass(`p-up-header-pc__temporary-class-${tag}`)
    })

    // User
    parentHidden.append(`
        <div class="p-up-header-pc__gmenu-list-items user">
            <div class="p-up-header-pc__gmenu-headline">
                <span class="p-icon p-icon--user" aria-hidden="true"></span>ユーザ
            </div>
            <div class="p-up-header-pc__gmenu-item">
                ${getLink($(".p-up-header-pc__nav-item.user"), `a[href="https://syosetu.com/useredit/input/"]`)}
            </div>
            <div class="p-up-header-pc__gmenu-item">
                ${getLink($(".p-up-header-pc__nav-item.user"), `a[href^="https://mypage.syosetu.com/"], a[href^="https://xmypage.syosetu.com/"]`)}
            </div>
            <div class="p-up-header-pc__gmenu-item">
                ${getLink($(".p-up-header-pc__nav-item.user"), `a[href="https://syosetu.com/login/logout/"]`, (elm)=>{
                    elm.find("span.p-icon").remove()
                    elm.text(elm.text().trim())
                })
            }
            </div>
        </div>
    `)

    // Message
    parentHidden.append(`
        <div class="p-up-header-pc__gmenu-list-items message">
            <div class="p-up-header-pc__gmenu-headline">
                <span class="p-icon p-icon--envelope" aria-hidden="true"></span>メッセージ
            </div>
            <div class="p-up-header-pc__gmenu-item">
                ${getLink($(".p-up-header-pc__nav-item.message"), `a`, (elm)=>{
                    elm.find("span.p-icon").remove()
                    elm.text(elm.text().trim())
                })}
            </div>
        </div>
    `)
    
    // Home
    parentHidden.append(`
        <div class="p-up-header-pc__gmenu-list-items home">
            <div class="p-up-header-pc__gmenu-headline">
                <span class="p-icon p-icon--home" aria-hidden="true"></span>${$(".p-up-header-pc__nav-item.home a").text().trim().replace("ユーザホーム", "ユーザページ")}
            </div>
            <div class="p-up-header-pc__gmenu-item">
                ${getLink($(".p-up-header-pc__nav-item.home"), `a`, (elm)=>{
                    elm.find("span.p-icon").remove()
                    elm.text(elm.text().trim())
                })}
            </div>
        </div>
    `)


    // Setting Menu
    function resetMenu(){
        $(".p-up-header-pc__gmenu .p-up-header-pc__gmenu-column .p-up-header-pc__gmenu-list-items").appendTo(".p-up-header-pc__gmenu .p-up-header-pc__gmenu-column#p-up-header-pc__gmenu-column--hidden")
        nt.storage.local.get(null).then((data) => {
            $.each(data.workspaceCustomMenu_Left, function(_, key){
                var elm = $(".p-up-header-pc__gmenu .p-up-header-pc__gmenu-column .p-up-header-pc__gmenu-list-items."+key)
                if(elm.length){
                    $("#p-up-header-pc__gmenu-column--left").append(elm)
                }
            })
            
            $.each(data.workspaceCustomMenu_Middle, function(_, key){
                var elm = $(".p-up-header-pc__gmenu .p-up-header-pc__gmenu-column .p-up-header-pc__gmenu-list-items."+key)
                if(elm.length){
                    $("#p-up-header-pc__gmenu-column--middle").append(elm)
                }
            })
            
            $.each(data.workspaceCustomMenu_Right, function(_, key){
                var elm = $(".p-up-header-pc__gmenu .p-up-header-pc__gmenu-column .p-up-header-pc__gmenu-list-items."+key)
                if(elm.length){
                    $("#p-up-header-pc__gmenu-column--right").append(elm)
                }
            })
        })
    }
    resetMenu()

    /* Storage Listener */
    chrome.storage.local.onChanged.addListener(function(changes){
        if(changes.workspaceCustomMenu_Left!=undefined || changes.workspaceCustomMenu_Middle!=undefined || changes.workspaceCustomMenu_Right!=undefined){
            resetMenu()
        }
    })
}