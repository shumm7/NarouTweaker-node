import { getNcodeFromURL } from "../../utils/ncode";
import { CustomIconID, CustomIconIDs, getExcludeIcons } from "../../utils/header"
import { storage } from "../../utils/option";
import { getEpisode, getPageType, isR18 } from "../../utils/narou";
import { fetchNovelApi } from "../../utils/api";

import $ from 'jquery';
import QRCode from 'qrcode'

/* Header */
export function _header(){
    storage.local.get(null, (data) => {
        $(".l-scrollheader").after("<div id='novel_header'><ul id='head_nav'></ul></div>")

        const customHeaderType: number = Number(data.novelCustomHeaderType)
        if(customHeaderType!==1 && customHeaderType!==2){
            return
        }

        var n = getNcodeFromURL()
        if(n===undefined){
            return
        }
        const ncode = n.ncode()
        const index = n.index()
        if(ncode!==undefined){
            const episode: number = getEpisode()
            const pageType: string|undefined = getPageType()
            const atom: string = $("link[href^='https://api.syosetu.com/writernovel/'][title='Atom']").prop("href")
            const r18: boolean|undefined = isR18()
            var elm: JQuery<HTMLElement>

            let userid: string|undefined
            if(pageType!="series"){
                if(location.hostname == "ncode.syosetu.com" || location.hostname == "novelcom.syosetu.com"){
                    var m = atom.match(/https:\/\/api\.syosetu\.com\/writernovel\/(\d+)\.Atom/)
                    if(m!==null){
                        userid = m[1]
                    }
                }else if(location.hostname == "novel18.syosetu.com" || location.hostname == "novelcom18.syosetu.com"){
                    var m = atom.match(/https:\/\/api\.syosetu\.com\/writernovel\/(x\d+[a-z]+)\.Atom/)
                    if(m!==null){
                        userid = m[1]
                    }
                }
            }

            $(".c-navigater--tobottom").remove()
            $(".c-navigater--totop-up").remove()

            /* Right Menu Bar */
            if(customHeaderType==1){
                $("body").addClass("narou-tweaker-header--mode-0")
                if(!data.novelLegacyHeaderIcon){
                    $("body").addClass("narou-tweaker-header--hide-icon") //アイコンを隠す
                }

                $(".l-foot-contents").prepend(`<div id="novel_header_right">
                    <ul id="head_nav">
                    </ul>
                </div>`)
                /*
                $("#novelnavi_right").append(`<div class="option" id="menu_on" style="position: fixed;">設定</div>`)
                $("#novelnavi_right .option").on("click", function(){
                    if($("#novel-option").hasClass("show")){
                        $("#novel-option").removeClass("show")
                    }else{
                        $("#novel-option").addClass("show")
                    }
                    if($("#novel-option-background").hasClass("show")){
                        $("#novel-option-background").removeClass("show")
                    }else{
                        $("#novel-option-background").addClass("show")
                    }
                })
            */

                if(pageType=="series"){
                    $(".novel_sublist").after(`<div class="wrap_menu_novelview_after">
                        <div class="box_menu_novelview_after clearfix novel-icon-wrapper">
                            <ul class="menu_novelview_after"></ul>
                        </div>
                    </div>`)
                }else{
                    $(".wrap_menu_novelview_after ul").empty()
                }
            }
            else if(customHeaderType==2){
                $("body").addClass("narou-tweaker-header--mode-1")
                $("#novelnavi_right").remove()

                $("#novel_header").before(`<div id="novel_header_right">
                    <ul id="head_nav">
                    </ul>
                </div>`)
                $(".wrap_menu_novelview_after").empty()
            }

            
            /* Wrapper Tags */
            $("#novel_header").addClass("novel-icon-wrapper")
            $("#novel_header_right").addClass("novel-icon-wrapper")
            $(".c-menu--foot").remove()

            /* scroll mode */
            changeHeaderScrollMode("#novel_header");
            changeHeaderScrollMode("#novel_header_right");

            // Enactiveなアイコンを表示する
            if(data.novelCustomHeaderShowEnactiveItems){
                $("body").addClass("narou-tweaker-header--show-inactive-icon")
            }

            
            /* 初期アイコン */
            if(pageType=="series"){
                $("#novel_header ul").empty()
            }else if(pageType=="top" || pageType=="novel"){
                $(".l-scrollheader .c-menu__body a, .l-scrollheader .c-menu__body form, .l-scrollheader .c-menu__body div").each(function(){
                    if($(this).hasClass("c-menu__item-pdf")){
                        var pdf = $(`<li>`)
                        pdf.append($(this))
                        $("#novel_header #head_nav").append(pdf)
                    }
                    else if($(this).hasClass("c-menu__item") && $(this).hasClass("js-favepisode_list_open_button")){
                        var elm = $(`<li class="favepisode">`)
                        elm.append($(this))
                        $("#novel_header #head_nav").append(elm)
                    }
                    else if($(this).hasClass("c-menu__item--bookmark")){
                        var elm = $("<li class='booklist'>")
                        elm.append($(this).children())
                        $("#novel_header #head_nav").append(elm)
                    }
                    else if($(this).hasClass("c-menu__item--favep")){
                        var elm = $("<li class='favlist_add'>")
                        elm.append($(this).children())
                        $("#novel_header #head_nav").append(elm)
                    }
                    else if($(this).hasClass("c-menu__item--xpost")){
                        //None
                    }
                    else if($(this).hasClass("c-menu__item")){
                        $("#novel_header #head_nav").append(`<li><a href="${$(this).prop("href")}">${$(this).text()}</a></li>`)
                    }
                })
                $(".l-scrollheader").remove()
            }else{
                $("#novel_header li:nth-last-child(1)").remove()
            }

            /* ホーム / ログイン */
            if(pageType!="series"){
                elm = $(`
                    #novel_header li a[href='https://syosetu.com/user/top/'],
                    #novel_header li a[href='https://syosetu.com/login/input/'],
                    #novel_header li a[href='https://syosetu.com/xuser/top/']`
                )
                if(elm.length){
                    text = elm.text()
                    elm.text("")
                    elm.append('<i class="fa-solid fa-house"></i><span class="title">'+text+'</span>')
                    elm.parent().addClass("home")
                }else{
                    // inactive
                    $("#novel_header ul").append('<li class="home"><a href="https://syosetu.com/user/top/"><i class="fa-solid fa-house"></i><span class="title">ホーム</span></a></li>')
                }
            }else{
                elm = $("#novel_header li a")
                if(elm.length){
                    text = elm.text()
                    elm.text("")
                    elm.append('<i class="fa-solid fa-house"></i><span class="title">'+text+'</span>')
                    elm.parent().addClass("home")
                }else{
                    // inactive
                    $("#novel_header ul").append('<li class="home"><a href="https://syosetu.com/user/top/"><i class="fa-solid fa-house"></i><span class="title">ホーム</span></a></li>')
                }

            }

            /* 作品情報 */
            elm = $("#novel_header li a[href^='https://ncode.syosetu.com/novelview/'], #novel_header li a[href^='https://novel18.syosetu.com/novelview/']")
            if(elm.length){
                elm.text("")
                elm.append('<i class="fa-solid fa-circle-info"></i><span class="title">作品情報</span>')
                elm.parent().addClass("info")
            }else{
                // inactive
                $("#novel_header ul").append('<li class="info inactive"><a><i class="fa-solid fa-circle-info"></i><span class="title">作品情報</span></a></li>')
            }

            /* 感想 */
            elm = $("#novel_header li a[href^='https://novelcom.syosetu.com/impression/'], #novel_header li a[href^='https://novelcom18.syosetu.com/impression/']")
            if(elm.length){
                elm.text("")
                elm.append('<i class="fa-solid fa-comments"></i><span class="title">感想</span>')
                elm.parent().addClass("impression")
            }else{
                // inactive
                $("#novel_header ul").append('<li class="impression inactive"><a><i class="fa-solid fa-comments"></i><span class="title">感想</span></a></li>')
            }

            /* レビュー */
            elm = $("#novel_header li a[href^='https://novelcom.syosetu.com/novelreview/'], #novel_header li a[href^='https://novelcom18.syosetu.com/novelreview/']")
            if(elm.length){
                elm.text("")
                elm.append('<i class="fa-solid fa-flag"></i><span class="title">レビュー</span>')
                elm.parent().addClass("review")
            }else{
                // inactive
                $("#novel_header ul").append('<li class="review inactive"><a><i class="fa-solid fa-flag"></i><span class="title">レビュー</span></a></li>')
            }

            /* PDF */
            elm = $("#novel_header li form[action^='https://ncode.syosetu.com/novelpdf/'], #novel_header li form[action^='https://novel18.syosetu.com/novelpdf/']")
            if(elm.length){
                elm.prepend('<i class="fa-solid fa-file-pdf"></i>')
                elm.parent().addClass("pdf")
                $("#novel_header li.pdf form i").on("click", function(){
                    $(this).parent().find("input[type='submit']").trigger("click")
                })
            }else{
                // inactive
                $("#novel_header ul").append('<li class="pdf inactive"><a><i class="fa-solid fa-file-pdf"></i><span class="title">縦書きPDF</span></a></li>')
            }

            /* ブックマーク */
            var is_login = true
            var is_logined_and_self = false
            var text = "ブックマーク"
            if(r18){text = "Xブックマーク"}

            elm = $("#novel_header li.booklist a")
            if(elm.length){
                elm.text("")
                if(elm.hasClass("js-bookmark_setting_button")){ //ブックマーク登録済み
                    if(customHeaderType===2){
                        elm.append(`<i class="fa-solid fa-book-bookmark"></i><span class="title">${text}<br><span style="font-size: 90%;">（設定変更）</span></span>`)
                    }else if(customHeaderType===1){
                        elm.append(`<i class="fa-solid fa-book-bookmark"></i><span class="title">${text}<span style="font-size: 90%;">（設定変更）</span></span>`)
                    }
                }else if(elm.hasClass("js-add_bookmark")){ //ブックマーク未登録
                    if(customHeaderType===2){
                        elm.append(`<i class="fa-solid fa-book"></i><span class="title">${text}<br><span style="font-size: 90%;">（登録）</span></span>`)
                    }else if(customHeaderType===1){
                        elm.append(`<i class="fa-solid fa-book"></i><span class="title">${text}<span style="font-size: 90%;">（登録）</span></span>`)
                    }
                }
                elm.parent().addClass("booklist")
            }
            else if($("#novel_header li.booklist .c-bookmark-button--disabled").length){ //非ログイン状態
                is_login = false
                if(customHeaderType===2){
                    elm = $("#novel_header li.booklist")
                    elm.addClass("inactive")
                    elm.find(".c-bookmark-button--disabled").remove()
                    elm.prepend(`<a><i class="fa-solid fa-book"></i><span class="title">${text}<br><span style="font-size: 90%;">（要ログイン）</span></span></a>`)
                }else if(customHeaderType===1){
                }
            } else { //ログイン済み（自分の作品）
                if(customHeaderType===2){
                    $("#novel_header li.booklist").remove()
                }else if(customHeaderType===1){
                    $("#novel_header ul").append(`
                        <li class="booklist inactive">
                            <span class="c-bookmark-button c-bookmark-button--disabled">${text}に追加</span>
                        </li>
                    `)
                }
                is_logined_and_self = true
            }

            elm = $("#novel_header li.booklist")
            if(!elm.length){
                // inactive
                if(customHeaderType===2){
                    $("#novel_header ul").append('<li class="booklist inactive"><a><i class="fa-solid fa-book"></i><span class="title">ブックマーク</span></a></li>')
                }else if(customHeaderType===1){
                    $("#novel_header ul").append('<li class="booklist inactive"><span class="c-bookmark-button c-bookmark-button--disabled">ブックマークに追加</span></li>')
                }
            }

            /* お気に入りep追加 */
            elm = $("#novel_header li.favlist_add")
            if(elm.length){
                var button = elm.find(".p-favepisode-form__button")
                elm.find(".p-favepisode-form__button").append(`<i class="fa-regular fa-star inactive-icon"></i><i class="fa-solid fa-star active-icon"></i><span class="title">お気に入りep</span>`)
            }else{
                //inactive
                $("#novel_header ul").append('<li class="favlist_add inactive"><a><i class="fa-regular fa-star"></i><span class="title">お気に入りep</span></a></li>')
            }

            /* お気に入りep */
            elm = $("#novel_header li.favepisode a")
            if(elm.length){
                elm.find("span.p-icon").remove()
                elm.text("")
                if(customHeaderType===2){
                    elm.append('<i class="fa-solid fa-table-list"></i><span class="title">お気に入りep<br>一覧</span>')
                }else if(customHeaderType===1){
                    elm.append('<i class="fa-solid fa-table-list"></i><span class="title">お気に入りep一覧</span>')
                }
            }else{
                //inactive
                $("#novel_header ul").append('<li class="favepisode inactive"><a><i class="fa-solid fa-table-list"></i><span class="title">お気に入りep一覧</span></a></li>')
            }

            /* 設定 */
            elm = $('<li class="option"><a><i class="fa-solid fa-gear"></i><span>設定</span></a></li>')
            elm.on("click", function(){
                if($("#novel-option").hasClass("show")){
                    $("#novel-option").removeClass("show")
                }else{
                    $("#novel-option").addClass("show")
                }
                if($("#novel-option-background").hasClass("show")){
                    $("#novel-option-background").removeClass("show")
                }else{
                    $("#novel-option-background").addClass("show")
                }
            })
            $("#novel_header ul").append(elm)


            /* 小説家になろう */
            $("#novel_header ul").append('<li class="narou"><a href="https://syosetu.com/"><i class="fa-solid fa-pen-nib"></i><span class="title">小説家になろう</span></a></li>')
            
            if(r18){
                var url = "https://api.syosetu.com/novel18api/api/?out=json&libtype=2&ncode=" + ncode
                fetchNovelApi(ncode, r18, function(data){
                    if(data){
                        var l = $(".narou")
                        if(data.nocgenre==1){
                            l.find("a").prop("href", "https://noc.syosetu.com/")
                            if(customHeaderType===2){
                                l.find(".title")[0].innerHTML = "ノクターン<br>ノベルズ"
                            }else if(customHeaderType===1){
                                l.find(".title").text("ノクターンノベルズ")
                            }
                        }else if(data.nocgenre==2 || data.nocgenre==3){
                            l.find("a").prop("href", "https://mnlt.syosetu.com/")
                            if(customHeaderType===2){
                                l.find(".title")[0].innerHTML = "ムーンライト<br>ノベルズ"
                            }else if(customHeaderType===1){
                                l.find(".title").text("ムーンライトノベルズ")
                            }
                        }else if(data.nocgenre==4){
                            l.find("a").prop("href", "https://mid.syosetu.com/")
                            if(customHeaderType===2){
                                l.find(".title")[0].innerHTML = "ミッドナイト<br>ノベルズ"
                            }else if(customHeaderType===1){
                                l.find(".title").text("ミッドナイトノベルズ")
                            }
                        }
                    }
                })
            }

            /* ログイン/ログアウト */
            if(is_login){
                $("#novel_header ul").append('<li class="login"><a href="https://syosetu.com/login/logout/"><i class="fa-solid fa-right-from-bracket"></i><span class="title">ログアウト</span></a></li>')
            }else{
                $("#novel_header ul").append('<li class="login"><a href="https://syosetu.com/login/input/"><i class="fa-solid fa-right-to-bracket"></i><span class="title">ログイン</span></a></li>')
            }

            /* 作者マイページ */
            if(userid){
                if(!r18){
                    $("#novel_header ul").append('<li class="author"><a href="https://mypage.syosetu.com/'+userid+'/"><i class="fa-solid fa-user"></i><span class="title">作者</span></a></li>')
                }else{
                    $("#novel_header ul").append('<li class="author"><a href="https://xmypage.syosetu.com/'+userid+'/"><i class="fa-solid fa-user"></i><span class="title">作者</span></a></li>')
                }
            }else{
                // inactive
                $("#novel_header ul").append('<li class="author inactive"><a><i class="fa-solid fa-user"></i><span class="title">作者</span></a></li>')
            }

            /* KASASAGI */
            if(ncode){
                $("#novel_header ul").append('<li class="kasasagi"><a href="https://kasasagi.hinaproject.com/access/top/ncode/'+ncode+'/"><i class="fa-solid fa-chart-line"></i><span class="title">アクセス解析</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="kasasagi inactive"><a><i class="fa-solid fa-chart-line"></i><span class="title">アクセス解析</span></a></li>')
            }

            /* API */
            if(ncode){
                if(!r18){
                    $("#novel_header ul").append('<li class="narou-api"><a href="https://api.syosetu.com/novelapi/api/?libtype=2&out=json&ncode='+ncode+'"><i class="fa-solid fa-file-code"></i><span class="title">なろうAPI</span></a></li>')
                }else{
                    $("#novel_header ul").append('<li class="narou-api"><a href="https://api.syosetu.com/novel18api/api/?libtype=2&out=json&ncode='+ncode+'"><i class="fa-solid fa-file-code"></i><span class="title">なろうAPI</span></a></li>')
                }
            }else{
                // inactive
                $("#novel_header ul").append('<li class="narou-api inactive"><a><i class="fa-solid fa-file-code"></i><span class="title">なろうAPI</span></a></li>')
            }

            /* RSS */
            if(atom){
                $("#novel_header ul").append('<li class="rss"><a href="'+atom+'"><i class="fa-solid fa-rss"></i><span class="title">RSS</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="rss inactive"><a><i class="fa-solid fa-rss"></i><span class="title">RSS</span></a></li>')
            }

            /* TXT */
            if(index){
                if(!r18){
                    $("#novel_header ul").append('<li class="text"><a href="https://ncode.syosetu.com/txtdownload/top/ncode/'+index+'/"><i class="fa-solid fa-file-lines"></i><span class="title">TXT</span></a></li>')
                }else{
                    $("#novel_header ul").append('<li class="text"><a href="https://novel18.syosetu.com/txtdownload/top/ncode/'+index+'/"><i class="fa-solid fa-file-lines"></i><span class="title">TXT</span></a></li>')
                }
            }else{
                // inactive
                $("#novel_header ul").append('<li class="text inactive"><a><i class="fa-solid fa-file-lines"></i>TXT</span></a></li>')
            }


            /* 誤字報告 */
            if(!r18){
                if(episode==0 && pageType=="novel"){
                    $("#novel_header ul").append('<li class="typo"><a href="https://novelcom.syosetu.com/novelreport/input/ncode/'+index+'/"><i class="fa-solid fa-keyboard"></i><span class="title">誤字報告</span></a></li>')
                }else if(pageType=="novel"){
                    $("#novel_header ul").append('<li class="typo"><a href="https://novelcom.syosetu.com/novelreport/input/ncode/'+index+'/no/'+episode+'/"><i class="fa-solid fa-keyboard"></i><span class="title">誤字報告</span></a></li>')
                }else{
                    // inactive
                    $("#novel_header ul").append('<li class="typo inactive"><a><i class="fa-solid fa-keyboard"></i><span class="title">誤字報告</span></a></li>')
                }
            }else{
                if(episode==0 && pageType=="novel"){
                    $("#novel_header ul").append('<li class="typo"><a href="https://novelcom18.syosetu.com/novelreport/input/ncode/'+index+'/"><i class="fa-solid fa-keyboard"></i><span class="title">誤字報告</span></a></li>')
                }else if(pageType=="novel"){
                    $("#novel_header ul").append('<li class="typo"><a href="https://novelcom18.syosetu.com/novelreport/input/ncode/'+index+'/no/'+episode+'/"><i class="fa-solid fa-keyboard"></i><span class="title">誤字報告</span></a></li>')
                }else{
                    // inactive
                    $("#novel_header ul").append('<li class="typo inactive"><a><i class="fa-solid fa-keyboard"></i><span class="title">誤字報告</span></a></li>')
                }
            }

            /* 情報提供 */
            if(index){
                $("#novel_header ul").append('<li class="report"><a href="https://syosetu.com/ihantsuhou/input/ncode/'+index+'/"><i class="fa-solid fa-bullhorn"></i><span class="title">情報提供</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="report inactive"><a><i class="fa-solid fa-bullhorn"></i>情報提供</span></a></li>')
            }
            
            /* 編集 */
            if(is_logined_and_self){
                $("#novel_header ul").append('<li class="edit"><a href="https://syosetu.com/usernovelmanage/top/ncode/'+index+'/"><i class="fa-solid fa-pen-to-square"></i><span class="title">編集</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="edit inactive"><a><i class="fa-solid fa-pen-to-square"></i><span class="title">編集</span></a></li>')
            }

            /* スクロール */
            $("#novel_header ul").append(`
                <li class="scroll" id="scroll-icon">
                    <a id="scroll-down" class="scroll-icon-inner">
                        <i class="fa-solid fa-angles-down"></i>
                        <span class="title">下へ移動</span>
                    </a>
                    <a id="scroll-up" class="scroll-icon-inner disabled">
                        <i class="fa-solid fa-angles-up"></i>
                        <span class="title">上へ移動</span>
                    </a>
                </li>
            `)
            $(window).on("scroll", function () {
                $("#scroll-icon .scroll-icon-inner").removeClass("disabled");
                const scrollTop = $(window).scrollTop()
                if(scrollTop!==undefined){
                    if (scrollTop > 500) {
                        $("#scroll-icon #scroll-down").addClass("disabled");
                    } else {
                        $("#scroll-icon #scroll-up").addClass("disabled");
                    }
                }
            });
            $("#scroll-down").on("click", function(){
                if($(".wrap_menu_novelview_after").length){
                    const offset = $(".wrap_menu_novelview_after").offset()
                    if(offset!==undefined){
                        $(window).scrollTop(offset.top)
                    }
                }else{
                    var a = document.documentElement;
                    var y = a.scrollHeight - a.clientHeight;
                    window.scroll(0, y);
                }
            })
            $("#scroll-up").on("click", function(){
                $(window).scrollTop(0)
            })

            /* 直近の閲覧履歴 */
            if(pageType!="novel"){
                $("#novel_header ul").append('<li class="history"></li>')
                storage.sync.get(["novelHistoryData"], function(sData){
                    const history = sData.novelHistoryData[ncode]
                    if(history){
                        const episode = history[0]
                        if(episode){
                            if(customHeaderType===2){
                                $("li.history").append(`<a href="https://ncode.syosetu.com/${ncode}/${episode}/"><i class="fa-solid fa-clock-rotate-left"></i><span class="title">直近の閲覧履歴<br><span style="font-size: 90%;">（エピソード${episode}）</span></span></a>`)
                            }else if(customHeaderType===1){
                                $("li.history").append(`<a href="https://ncode.syosetu.com/${ncode}/${episode}/"><i class="fa-solid fa-clock-rotate-left"></i><span class="title">直近の閲覧履歴<span style="font-size: 90%;">（エピソード${episode}）</span></span></a>`)
                            }
                        }else{
                            $("li.history").remove()
                        }
                    }else{
                        $("li.history").remove()
                    }
                })
            }else{
                // inactive
                $("#novel_header ul").append('<li class="history inactive"><a><i class="fa-solid fa-clock-rotate-left"></i><span class="title">直近の閲覧履歴</span></a></li>')
            }

            /* 検索 */
            $("#novel_header ul").append('<li class="search"><a><i class="fa-solid fa-magnifying-glass"></i><span class="title">検索</span></a></li>')
            $("body").prepend(`
            <div id="novel_header_search_box">
                <form>
                    <input type="text" id="novel_header_search_field">
                    <button id="novel_header_search_button">検索</button>
                </form>
            </div>
            `)
            $("#novel_header ul li.search>a").on("click", function(){
                var position = $("li.search").offset()
                const scrollLeft = $(window).scrollLeft()
                const scrollTop = $(window).scrollTop()
                if(position!==undefined && scrollLeft!==undefined && scrollTop!==undefined){
                    position.left -= scrollLeft
                    position.top -= scrollTop
                    var box = $("#novel_header_search_box")
                    if(box.hasClass("show")){
                        box.removeClass("show")
                    }else{
                        if(customHeaderType===2){
                            const width = $(window).width()
                            const boxWidth = box.width()
                            if(width!==undefined && boxWidth!==undefined && width/2<position.left){
                                var top = position.top
                                var left = position.left - boxWidth
                                box.css({top: `calc(${top}px - .5em)`, left: `calc(${left}px)`})
                            }else{
                                var top = position.top
                                var left = position.left
                                box.css({top: `calc(${top}px - .5em)`, left: `calc(${left}px + 4em)`})
                            }
                        }else if(customHeaderType===1){
                            const height = $(window).width()
                            const boxWidth = box.width()
                            const boxHeight = box.height()
                            if(boxWidth!==undefined){
                                if(height!==undefined && boxHeight!==undefined && height/2 < position.top){
                                    var top = position.top - boxHeight
                                    var left = position.left - boxWidth/2
                                    box.css({top: `calc(${top}px)`, left: `calc(${left}px + 2em)`})
                                }else{
                                    var top = position.top
                                    var left = position.left - boxWidth/2
                                    box.css({top: `calc(${top}px + 4em)`, left: `calc(${left}px + 2em)`})
                                }
                            }
                        }
                        box.addClass("show")
                    }
                }
            })
            $("#novel_header_search_box > form").submit(function(){
                const s = $("#novel_header_search_field").val()
                if(typeof s === "string"){
                    var keyword = s.trim()
                    if(keyword.length == 0){
                        return false
                    }else{
                        var url = "https://yomou.syosetu.com/search.php?word=" + keyword
                        window.open(url);
                    }
                }
            })


            /* Socials */
            const meta_title: string = $("head meta[property='og:title']").prop("content")
            let meta_url: string = $("head meta[property='og:url']").prop("content")
            if(meta_url && r18){
                meta_url = meta_url.replace(/ncode\.syosetu\.com/, "novel18.syosetu.com")
            }

            /* Twitter */
            var txt: string|undefined
            if(data.novelCustomHeaderSocialShowsBrandName){
                txt = "X"
            }else{
                txt = "ポスト"
            }

            if(meta_title!=undefined && meta_url!=undefined){
                var prefix = ""
                var host = "ncode"
                if(r18){
                    prefix = "【R18】"
                    host = "novel18"
                }

                var uri: string|undefined
                if(!r18){
                    if(pageType=="novel"){
                        uri = `https://twitter.com/intent/post?hashtags=narou,narou${ncode.toUpperCase()}&original_referer=https://ncode.syosetu.com/&text=${meta_title}&url=${meta_url}`
                    }else if(pageType=="top"){
                        uri = `https://twitter.com/intent/post?hashtags=narou,narou${ncode.toUpperCase()}&original_referer=https://ncode.syosetu.com/&text=${meta_title}&url=${meta_url}`
                    }else if(pageType=="info"){
                        uri = `https://twitter.com/intent/post?hashtags=narou,narou${ncode.toUpperCase()}&original_referer=https://ncode.syosetu.com/&text=「${meta_title}」読んだ！&url=${meta_url}`
                    }
                }else{
                    if(pageType=="novel"){
                        uri = `https://twitter.com/intent/post?hashtags=narou,narou${ncode.toUpperCase()}&original_referer=https://novel18.syosetu.com/&text=【R18】${meta_title}&url=${meta_url}`
                    }else if(pageType=="top"){
                        uri = `https://twitter.com/intent/post?hashtags=narou,narou${ncode.toUpperCase()}&original_referer=https://novel18.syosetu.com/&text=【R18】${meta_title}&url=${meta_url}`
                    }else if(pageType=="info"){
                        uri = `https://twitter.com/intent/post?hashtags=narou,narou${ncode.toUpperCase()}&original_referer=https://novel18.syosetu.com/&text=【R18】「${meta_title}」読んだ！&url=${meta_url}`
                    }
                }

                if(uri!=undefined){
                    $("#novel_header ul").append('<li class="twitter"><a href="'+encodeURI(uri)+'"><i class="fa-brands fa-x-twitter"></i><span class="title">'+txt+'</span></a></li>')
                }
            }else{
                // inactive
                $("#novel_header ul").append('<li class="twitter inactive"><a><i class="fa-brands fa-x-twitter"></i><span class="title">'+txt+'</span></a></li>')
            }
            

            /* Facebook */
            var txt: string|undefined
            if(data.novelCustomHeaderSocialShowsBrandName){
                txt = "Facebook"
            }else{
                txt = "シェア"
            }
            if(meta_url!=undefined){
                var uri:string|undefined = `https://www.facebook.com/share.php?u=${meta_url}`
                $("#novel_header ul").append('<li class="facebook"><a href="'+encodeURI(uri)+'"><i class="fa-brands fa-facebook"></i><span class="title">'+txt+'</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="facebook inactive"><a><i class="fa-brands fa-facebook"></i><span class="title">'+txt+'</span></a></li>')
            }

            /* LINE */
            var txt: string|undefined
            if(data.novelCustomHeaderSocialShowsBrandName){
                txt = "LINE"
            }else{
                txt = "シェア"
            }
            if(meta_url!=undefined){
                var uri: string|undefined = "https://social-plugins.line.me/lineit/share?url=" + meta_url
                $("#novel_header ul").append('<li class="line"><a href="'+encodeURI(uri)+'"><i class="fa-brands fa-line"></i><span class="title">'+txt+'</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="line inactive"><a><i class="fa-brands fa-line"></i><span class="title">'+txt+'</span></a></li>')
            }

            /* はてなブックマーク */
            var txt: string|undefined
            if(data.novelCustomHeaderSocialShowsBrandName){
                txt = "はてな<br>ブックマーク"
            }else{
                txt = "ブックマーク"
            }
            if(meta_title!=undefined && meta_url!=undefined){
                var uri: string|undefined
                if(!r18){
                    uri = `https://b.hatena.ne.jp/entry/panel/?url=${meta_url}&btitle=${meta_title}`
                }else{
                    uri = `https://b.hatena.ne.jp/entry/panel/?url=${meta_url}&btitle=【R18】${meta_title}`
                }
                $("#novel_header ul").append('<li class="hatena-bookmark"><a href="'+encodeURI(uri)+'"><i class="fa-brands fa-hatena-bookmark"></i><span class="title">'+txt+'</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="hatena-bookmark inactive"><a><i class="fa-brands fa-hatena-bookmark"></i><span class="title">'+txt+'</span></a></li>')
            }

            /* Feedly */
            var txt: string|undefined
            if(data.novelCustomHeaderSocialShowsBrandName){
                txt = "Feedly"
            }else{
                txt = "フォロー"
            }
            if(atom!=undefined){
                var uri: string|undefined = `https://feedly.com/i/subscription/feed/${atom}`
                $("#novel_header ul").append('<li class="feedly"><a href="'+encodeURI(uri)+'"><i class="fa-brands fa-feedly"></i><span class="title">'+txt+'</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="feedly inactive"><a><i class="fa-brands fa-feedly"></i><span class="title">'+txt+'</span></a></li>')
            }

            if(ncode){
                var uri: string|undefined = "https://www.facebook.com/share.php?u=" + meta_url
                $("#novel_header ul").append('<li class="rawi"><a href="https://rawi-novel.work/writer/ai?ncode='+ncode+'"><i class="fa-solid fa-robot"></i><span class="title">RaWi</span></a></li>')
            }else{
                // inactive
                $("#novel_header ul").append('<li class="rawi inactive"><a><i class="fa-solid fa-robot"></i><span class="title">RaWi</span></a></li>')
            }

            /* コピー */
            let copy_animation_timer: NodeJS.Timeout|null = null;
            $("#novel_header ul").append('<li class="copy-url"><a><i class="fa-solid fa-link"></i><span class="title">URLをコピー</span></a></li>')
            $("#novel_header ul li.copy-url>a").on("click", function(){
                if(meta_url!=undefined){
                    navigator.clipboard.writeText(meta_url)
                }else{
                    navigator.clipboard.writeText(location.href)
                }
                var icon = $("li.copy-url>a i")
                var text = $("li.copy-url>a span.title")
                if(copy_animation_timer!=null){
                    clearTimeout(copy_animation_timer)
                    icon.removeClass("fa-check")
                    icon.addClass("fa-link")
                    text.text("URLをコピー")
                }

                icon.removeClass("fa-link")
                icon.addClass("fa-check")
                text.text("コピーしました")

                copy_animation_timer = setTimeout(function() {
                    icon.removeClass("fa-check")
                    icon.addClass("fa-link")
                    text.text("URLをコピー")
                }, 3000);
            })

            /* QRコード */
            if(data.novelCustomHeaderQRCodeShowURL){
                $("#novel_header").before(`<div id='qrcode-outer'><div id="qrcode-background"></div><div id="qrcode-display"><canvas></canvas><input type="text" id="qrcode-text" readonly></div></div></div>`)
                $("#qrcode-text").on("click", function(){
                    $(this).select()
                })
            }else{
                $("#novel_header").before(`<div id='qrcode-outer'><div id="qrcode-background"></div><div id="qrcode-display"><canvas></canvas></div></div>`)
            }
            $("#qrcode-background").on("click", function(){
                $("#qrcode-outer").removeClass("show")
            })

            var qrcode
            if(data.novelCustomHeaderQRCodeCurrentLocation){
                $("#novel_header ul").append('<li class="qrcode"><a><i class="fa-solid fa-qrcode"></i><span class="title">QRコード</span></a></li>')
                qrcode = QRCode.toCanvas(document.querySelector("#qrcode-display > canvas"), location.href, {width: 250});
                $("#qrcode-text").val(location.href)
            }else{
                if(meta_url!=undefined){
                    $("#novel_header ul").append('<li class="qrcode"><a><i class="fa-solid fa-qrcode"></i><span class="title">QRコード</span></a></li>')
                    qrcode = QRCode.toCanvas(document.querySelector("#qrcode-display > canvas"), meta_url, {width: 250});
                    $("#qrcode-text").val(meta_url)
                }else if(ncode!=undefined){
                    $("#novel_header ul").append('<li class="qrcode"><a><i class="fa-solid fa-qrcode"></i><span class="title">QRコード</span></a></li>')
                    var uri: string|undefined
                    if(!r18){
                        if(episode){
                            uri = `https://ncode.syosetu.com/${ncode}/${episode}/`
                        }else{
                            uri = `https://ncode.syosetu.com/${ncode}/`
                        }
                    }else{
                        if(episode){
                            uri = `https://novel18.syosetu.com/${ncode}/${episode}/`
                        }else{
                            uri = `https://novel18.syosetu.com/${ncode}/`
                        }
                    }
                    if(uri){
                        qrcode = QRCode.toCanvas(document.querySelector("#qrcode-display > canvas"), uri, {width: 250});
                        $("#qrcode-text").val(uri)
                    }
                }
            }

            $("#novel_header ul li.qrcode").on("click", function(){
                var elm = $("#qrcode-outer")
                if(elm.hasClass("show")){
                    elm.removeClass("show")
                }else{
                    elm.addClass("show")
                }
            })
            
            /* Set Position */
            function resetHeader(left: CustomIconIDs, right: CustomIconIDs){
                $("#novel_header ul li.disabled").removeClass("disabled")
                $("#novel_header_right ul li.disabled").removeClass("disabled")
                $(".box_menu_novelview_after ul.menu_novelview_after li.disabled").removeClass("disabled")
                $.each(getExcludeIcons([right, left]), (_, cls)=>{
                    var elm = $(`#novel_header ul li.${cls}, #novel_header_right ul li.${cls}, .box_menu_novelview_after ul.menu_novelview_after li.${cls}`)
                    if(elm.length){
                        elm.addClass("disabled")
                    }
                })
                $.each(right, (_, cls: CustomIconID)=>{
                    var elm = $(`#novel_header ul li.${cls}, #novel_header_right ul li.${cls}, .box_menu_novelview_after ul.menu_novelview_after li.${cls}`)
                    if(elm.length){
                        var ext = "#novel_header_right ul"
                        if($(ext).length){
                            elm.appendTo(ext)
                        }else{
                            elm.addClass("disabled")
                        }
                    }
                })
                $.each(left, (_, cls: CustomIconID)=>{
                    var elm = $(`#novel_header ul li.${cls}, #novel_header_right ul li.${cls}, .box_menu_novelview_after ul.menu_novelview_after li.${cls}`)
                    if(elm.length){
                        var ext = "#novel_header ul"
                        if($(ext).length){
                            elm.appendTo(ext)
                        }else{
                            elm.addClass("disabled")
                        }
                    }
                })
            }
            
            resetHeader(data.novelCustomHeaderLeft, data.novelCustomHeaderRight)

            /* Header Scroll */
            if(customHeaderType===2){
                const scrollElement = document.querySelector("#novel_header, #novel_header_right");
                if(scrollElement!=null){
                    scrollElement.addEventListener("wheel", (e: any) => {
                        const deltaY = e.deltaY
                        if(deltaY!==undefined){
                            if(scrollElement.classList.contains("header-mode--fixed") || scrollElement.classList.contains("header-mode--scroll")){
                                e.preventDefault();
                                scrollElement.scrollTop += deltaY;
                            }
                        }
                    })
                }
            }else if(customHeaderType===1){
                const scrollElement = document.querySelector("#novel_header ul");
                if(scrollElement!=null){
                    scrollElement.addEventListener("wheel", (e: any) => {
                        const deltaX = e.deltaX
                        const deltaY = e.deltaY
                        if(deltaX!==undefined && deltaY!==undefined){
                            if (Math.abs(deltaY) < Math.abs(deltaX)) return;
                            e.preventDefault();
                            scrollElement.scrollLeft += deltaY;
                        }
                    });
                }
                const scrollElementFooter = document.querySelector(".box_menu_novelview_after ul");
                if(scrollElementFooter!=null){
                    scrollElementFooter.addEventListener("wheel", (e: any) => {
                        const deltaX = e.deltaX
                        const deltaY = e.deltaY
                        if(deltaX!==undefined && deltaY!==undefined){
                            if (Math.abs(deltaY) < Math.abs(deltaX)) return;
                            e.preventDefault();
                            scrollElementFooter.scrollLeft += deltaY;
                        }
                    });
                }
            }

            /* Storage Listener */
            chrome.storage.local.onChanged.addListener(function(changes){
                if(changes.novelCustomHeaderLeft!=undefined || changes.novelCustomHeaderRight!=undefined){
                    storage.local.get(["novelCustomHeaderLeft", "novelCustomHeaderRight"], (data) => {
                        resetHeader(data.novelCustomHeaderLeft, data.novelCustomHeaderRight)
                    })
                }else if(changes.novelLegacyHeaderIcon != undefined){
                    storage.local.get(["novelLegacyHeaderIcon"], (data) => {
                        if(!data.novelLegacyHeaderIcon){
                            $("body").addClass("narou-tweaker-header--hide-icon")
                        }else{
                            $("body").removeClass("narou-tweaker-header--hide-icon")
                        }
                    })
                }else if(changes.novelCustomHeaderShowEnactiveItems){
                    storage.local.get(["novelCustomHeaderShowEnactiveItems"], (data) => {
                        if(data.novelCustomHeaderShowEnactiveItems){
                            $("body").addClass("narou-tweaker-header--show-inactive-icon")
                        }else{
                            $("body").removeClass("narou-tweaker-header--show-inactive-icon")
                        }
                    })
                }
            })
        }
    })
}

export function changeHeaderScrollMode(_elm: string){
        
    function changeMode(elm: HTMLElement|JQuery<HTMLElement>){
        storage.local.get(null, (data) => {
            const header_mode = data.novelCustomHeaderMode
            const hidden_begin = data.novelCustomHeaderScrollHidden
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
                    if($(elm).hasClass('header-mode--scroll')){
                        $(elm).addClass('hide');
                    }
                }
            }
        })
    }
    changeMode($(_elm))

    var pos = $(window).scrollTop();
    $(window).on("scroll", function(){
        const scrollTop = $(this).scrollTop()
        if(typeof scrollTop === "number" && typeof pos === "number" && Math.abs(scrollTop - pos)>100 && $(_elm).hasClass("header-mode--scroll")){
            if( scrollTop < pos){
                $(_elm).removeClass('hide'); /* Scroll Up */
                $("#novel_header_search_box.show").removeClass("show")
            }else{
                $(_elm).addClass('hide'); /* Scroll Down */
                $("#novel_header_search_box.show").removeClass("show")
            }
            pos = $(this).scrollTop();
        }
    });

    chrome.storage.local.onChanged.addListener(function(changes){
        if(changes.novelCustomHeaderMode!=undefined || changes.novelCustomHeaderScrollHidden!=undefined){
            changeMode($(_elm))
        }
    })
}
