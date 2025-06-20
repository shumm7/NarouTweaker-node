import { novelTop } from "./_novelTop"

import $ from "jquery"
import { nt } from "../../utils/narou-tweaker"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function _novel() {
    nt.storage.local.get(null).then((data) => {
        try {
            const pageDetail = nt.api.pageType()
            $("body").addClass("narou-tweaker--custom-skin")
            if (data.novelCustomStyle) {
                $("body").addClass("narou-tweaker--custom-style")
                $("#footer").remove()

                if (pageDetail == "novel") {
                    _novelPage()
                }
            }
            if (data.novelForceMypageLink) {
                _authorLink()
            }
            if (pageDetail == "novel") {
                $("body").addClass("narou-tweaker--novel-page")
                if (data.novelVertical) {
                    _tategaki()
                }
                _autoURL()
                _saveHistory()
                if (data.novelAttentionBanner && nt.api.episode() == 0) {
                    novelTopAttention()
                }
            } else if (pageDetail == "top") {
                $("body").addClass("narou-tweaker--novel-page")
                novelTop()
                _saveHistory()
                if (data.novelShowHistoryOnSublist) {
                    _history()
                }
                if (data.novelAttentionBanner) {
                    novelTopAttention()
                }
            } else if (pageDetail == "series") {
                $("body").addClass("js-customlayout1")
            } else {
                $("body").addClass("narou-tweaker--novelcom-page")
            }
            _cursorHide()
        } catch (e) {
            console.warn(e)
        }
    })
}

function _novelPage() {
    try {
        const ncode = nt.api.ncode.getFromURL()
        const episode = nt.api.episode()
        var title
        var chapter: string | undefined = undefined

        if (episode == 0) {
            title = $(".p-novel__title")
        } else {
            $(".l-container .l-main .c-announce:has(a[href='/" + ncode + "/'])").addClass("c-announce--novel-detail")
            title = $(".c-announce--novel-detail a[href='/" + ncode + "/']")
            if ($(".c-announce--novel-detail span").length) {
                $(".c-announce--novel-detail span").addClass("chapter_title")
                var chapter_elm = $(".c-announce--novel-detail span")
                chapter = chapter_elm.text()
                chapter_elm.remove()
            }
        }

        if (episode == 0) {
            var d_1 = $(`<div class="novel-title"></div>`)
            var d_2 = undefined

            d_1.text(title.text())
            if ($(".p-novel__author a").length) {
                var author = $(".p-novel__author a")
                var a = $(`<a></a>`)
                a.prop("href", author.prop("href"))
                a.text(author.text())
                d_2 = $(`<div class="novel-author"></div>`).append(a)
            } else {
                var m = $(".p-novel__author")
                    .text()
                    .trim()
                    .match(/作者：(.*)/)
                if (m !== null && typeof m[1] === "string") {
                    d_2 = $(`<div class="novel-author"></div>`)
                    d_2.text(m[1])
                }
            }

            var inner = $(`<div class="novel-titles" id="ep-${episode}"></div>`).append(d_1)
            if (d_2 !== undefined) inner.append(d_2)

            $(".l-main > .c-announce-box").append(`<div class="c-announce c-announce--novel-detail"></div>`).append(inner)
            $(".p-novel__title").remove()
            $(".p-novel__author").remove()
        } else {
            title.remove()
            var d = $(`<div class="novel-titles" id="ep-${episode}"></div>`)
            var a = $("<a></a>")
            a.prop("href", title.prop("href"))
            a.text(title.text())

            var d_1 = $(`<div class="novel-title"></div>`).append(a)
            var d_2 = undefined

            if ($(".c-announce--novel-detail a").length) {
                var author = $(".c-announce--novel-detail a")
                var a = $("<a></a>")
                a.prop("href", author.prop("href"))
                a.text(author.text())
                d_2 = $(`<div class="novel-author"></div>`).append(a)
            } else {
                var m = $(".c-announce--novel-detail")
                    .text()
                    .trim()
                    .match(/作者：\s(.*)/)
                if (m !== null && typeof m[1] === "string") {
                    d_2 = $(`<div class="novel-author"></div>`)
                    d_2.text(m[1])
                }
            }
            if (chapter) {
                $(".p-novel__number").after($("<div class='novel-chapter'></div>").text(chapter))
            }

            $(".c-announce--novel-detail").empty()
            $(".c-announce--novel-detail").append(d)
            var r = $(".c-announce--novel-detail .novel-titles")
            r.append(d_1)
            if (d_2 !== undefined) r.append(d_2)
        }
    } catch (e) {
        console.warn(e)
    }
}

function _tategaki() {
    try {
        gsap.registerPlugin(ScrollTrigger)

        $(".p-novel__body").wrap(`<div id="novel_vertical_wrapper" style="position: relative;"><div id="novel_vertical_items">`)
        $("body").addClass("narou-tweaker-vertical")
        var items = $("#novel_vertical_items")

        // Elements (Prepend)
        $(".p-novel__text--preface").prependTo(items)
        $(".p-novel__title").prependTo(items)
        $(".novel-chapter").prependTo(items)
        $(".p-novel__number").prependTo(items)
        $(".c-pager:first-child()").prependTo(items)
        $(".c-announce--novel-detail").prependTo(items)
        $(".p-novel__series").prependTo(items)

        // Elements (Append)
        $(".p-novel__text--afterword").appendTo(items)
        $(".c-pager:last-child()").appendTo(items)

        if ($("#novel_vertical_items").length) {
            const w = $("#novel_vertical_items").width()
            if (w !== undefined) {
                var width = w - 300

                gsap.to("#novel_vertical_items", {
                    x: () => width,
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#novel_vertical_wrapper",
                        start: () => `top top`,
                        end: () => `+=${width}`,
                        scrub: true,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })
            }
        }
    } catch (e) {
        console.warn(e)
    }
}

function _autoURL() {
    /* Auto Url */
    nt.storage.local.get(null).then((data) => {
        try {
            if (data.novelPrefaceAutoURL) {
                $(".p-novel__text--preface p").each(function (idx, elem) {
                    nt.text.replaceUrl(elem, false)
                })
            }

            if (data.novelAfterwordAutoURL) {
                $(".p-novel__text--afterword p").each(function (idx, elem) {
                    nt.text.replaceUrl(elem, false)
                })
            }
        } catch (e) {
            console.warn(e)
        }
    })
}

function _cursorHide() {
    nt.storage.local.get(null).then((data) => {
        try {
            if (data.novelCursorHide) {
                var resizeTimer: NodeJS.Timeout | null = null
                var timeout = data.novelCursorHideTimeout

                if (!isNaN(timeout) || timeout > 0) {
                    $(window).on("load mousemove", function () {
                        if (resizeTimer === null) {
                            clearTimeout(undefined)
                        } else {
                            clearTimeout(resizeTimer)
                        }
                        $("body").removeClass("narou-tweaker-cursor-hide")
                        resizeTimer = setTimeout(function () {
                            $("body").addClass("narou-tweaker-cursor-hide")
                        }, timeout * 1000)
                    })
                }
            }
        } catch (e) {
            console.warn()
        }
    })
}

function _history() {
    try {
        var n = nt.api.ncode.getFromURL()
        if (n === undefined) {
            return
        }
        const ncode = n.ncode()

        if (ncode) {
            if ($(".p-eplist").length) {
                var outer = $(`<div class="novelview_history-box"></div>`)
                var showHistory = false

                if ($(".novellingindex_bookmarker_no").length) {
                    var elm = $(".novellingindex_bookmarker_no")
                    var link = elm.find("a").prop("href")
                    var text = elm.find("a").text()
                    var outerE = $(`<div class="novelview_history-item" id="novel_siori"/>`)
                    outerE.append(`<i class="fa-solid fa-bookmark"></i>`)
                    outerE.append($(`<a/`).text(text).attr("href", link))
                    outer.append(outerE)
                    showHistory = true
                } else if ($("meta[name='siori']").length) {
                    var elm = $("meta[name='siori']")
                    var _link = elm.attr("content")
                    var _text = elm.attr("property")

                    outer.append(`
                        <div class="novelview_history-item" id="novel_siori">
                            <i class="fa-solid fa-bookmark"></i><a href="${_link}">${_text}</a>
                        </div>
                    `)
                    showHistory = true
                }

                nt.storage.sync.get("novelHistoryData").then(function (h) {
                    const historyData = h.novelHistoryData
                    if (ncode in historyData) {
                        const history = historyData[ncode]
                        if (history) {
                            const episode = history[0]
                            const date = nt.time.getDatetimeStringWithoutSecond(new Date(history[1]))
                            if (episode) {
                                outer.append(`
                                    <div class="novelview_history-item" id="novel_history">
                                        <i class="fa-solid fa-clock-rotate-left"></i><a href="https://ncode.syosetu.com/${ncode}/${episode}/">エピソード${episode}</a><span style="font-size: 90%">（${date}）</span>
                                    </div>
                                `)
                                showHistory = true

                                /* 目次欄にアンダーラインを追加 */
                                var sublist = $(`.index_box .novel_sublist2:has(a[href="/${ncode}/${episode}/"])`)
                                if (sublist.length) {
                                    sublist.addClass("underline")
                                    sublist
                                        .find(".subtitle")
                                        .append(`<span class="history_now" title="${date}"><i class="fa-solid fa-clock-rotate-left"></i></span>`)
                                }
                            }
                        }
                        if (showHistory) {
                            $(".p-eplist").before(outer)
                        }
                    }
                })
            }
        }
    } catch (e) {
        console.warn(e)
    }
}

function _saveHistory() {
    try {
        var n = nt.api.ncode.getFromURL()
        if (n === undefined) {
            return
        }
        const ncode = n.ncode()
        const episode = nt.api.episode()

        if (ncode) {
            nt.storage.sync.get(["novelHistory", "novelHistoryData"]).then(function (data) {
                try {
                    var history = data.novelHistory
                    var novelHistoryData = data.novelHistoryData

                    var new_history = history.filter((n) => n != ncode)
                    new_history.unshift(ncode)
                    if (new_history.length > 300) {
                        const key = new_history.pop()
                        if (key !== undefined && key in novelHistoryData) {
                            delete novelHistoryData[key]
                        }
                    }
                    if (episode) {
                        var episode_name = $(".novel_subtitle").text()
                        if (episode_name.length > 20) {
                            episode_name = episode_name.substr(0, 20) + "…"
                        }
                        novelHistoryData[ncode] = [episode, Date.now(), episode_name]
                    }

                    nt.storage.sync.set({
                        novelHistory: new_history,
                        novelHistoryData: novelHistoryData,
                    })
                } catch (e) {
                    console.warn(e)
                }
            })
        }
    } catch (e) {
        console.warn(e)
    }
}

function _authorLink() {
    try {
        const atom = $("link[href^='https://api.syosetu.com/writernovel/'][title='Atom']")
        const r18 = nt.api.isR18()
        var n = nt.api.ncode.getFromURL()
        if (n === undefined) {
            return
        }
        const ncode = n.ncode()
        const pageDetail = nt.api.pageType()
        const episode = nt.api.episode()
        let userid: string | undefined
        if (atom.length) {
            if (location.hostname == "ncode.syosetu.com") {
                userid = atom.prop("href").match(/https:\/\/api\.syosetu\.com\/writernovel\/(\d+)\.Atom/)[1]
            } else if (location.hostname == "novel18.syosetu.com") {
                userid = atom.prop("href").match(/https:\/\/api\.syosetu\.com\/writernovel\/(x\d+[a-z]+)\.Atom/)[1]
            }
        }

        if (userid) {
            var userid_link: string
            if (r18) {
                userid_link = `https://xmypage.syosetu.com/${userid}/`
            } else {
                userid_link = `https://mypage.syosetu.com/${userid}/`
            }

            if (pageDetail == "top" || (pageDetail == "novel" && episode == 0)) {
                if ($(".p-novel__author").length) {
                    if (!$(".p-novel__author a").length) {
                        var author_text = $(".p-novel__author")
                        var m = author_text.text().match(/作者：(.*)/)
                        var e = author_text.get(0)
                        if (m !== null && e !== undefined) {
                            var author = m[1]
                            e.innerHTML = `作者：<a href="${nt.text.escapeHtml(userid_link)}">${nt.text.escapeHtml(author)}</a>`
                        }
                    }
                } else if ($(".novel_writername").length) {
                    var author_text = $(".novel_writername")
                    if (!author_text.find("a").length) {
                        var m = author_text.text().match(/作者：(.*)/)
                        var e = author_text.get(0)
                        if (m !== null && e !== undefined) {
                            var author = m[1]
                            e.innerHTML = `作者：<a href="${nt.text.escapeHtml(userid_link)}">${nt.text.escapeHtml(author)}</a>`
                        }
                    }
                }
            } else if (pageDetail == "novel") {
                if ($(".novel-author").length) {
                    if (!$(".novel-author a").length) {
                        $(".novel-author").wrapInner(`<a href="${userid_link}">`)
                    }
                } else if ($(".contents1").length) {
                    var outer = $(".contents1").clone()
                    var elm_atteintion = outer.find(".attention")
                    var elm_title = outer.find("a[href='/" + ncode + "/']")
                    var elm_chapter = outer.find(".chapter_title")
                    var elm_atteintion_c = elm_atteintion.clone()
                    var elm_title_c = elm_title.clone()
                    var elm_chapter_c = elm_chapter.clone()

                    elm_atteintion.remove()
                    elm_title.remove()
                    elm_chapter.remove()

                    if (!outer.find("a").length) {
                        var m = $("#container .contents1")
                            .text()
                            .trim()
                            .match(/作者：(.*)/)
                        if (m !== null) {
                            var author = m[1]
                            var outer = $(".contents1")
                            outer.empty()
                            outer.append(elm_atteintion)
                            outer.append(elm_title_c)
                            outer.append(` 作者：`)
                            outer.append($(`<a/>`).text(author).attr("href", userid_link))
                            outer.append(` `)
                            outer.append(elm_chapter_c)
                        }
                    }
                }
            } else if (pageDetail == "info") {
                $("#noveltable1 tr").each(function () {
                    const header = $(this).find("th").text()
                    if (header == "作者名") {
                        var elm = $(this).find("td")
                        if (!elm.find("a").length) {
                            const author = elm.text()
                            elm.empty()
                            elm.append($(`<a/>`).text(author).attr("href", userid_link))
                        }
                    }
                })
            }
        }
    } catch (e) {
        console.warn(e)
    }
}

function novelTopAttention() {
    try {
        var attention = $(".c-announce-box .c-announce:not(.c-announce--note):has(.c-announce__emphasis)")
        if (attention.length) {
            attention.empty()
        } else {
            $(".c-announce-box").append(`<div class="c-announce c-announce__attention"></div>`)
            attention = $(".c-announce.c-announce__attention")
        }

        const ncode = nt.api.ncode.getFromURL()
        const r18 = nt.api.isR18()

        nt.api.novel.fetch(ncode, r18).then(function (data) {
            try {
                if (data) {
                    let tags = (data.keyword ?? "").split(/\s/)
                    var site = data.nocgenre

                    function removeItem(item: string) {
                        tags = tags.filter((n: any) => n != item)
                    }

                    /*
                    nt.storage.session.get("novelOfficialTags").then((data) => {
                        if(data.novelOfficialTags){
                            setTags(data.novelOfficialTags)
                        }else{
                            nt.runtime.action({action: "fetch", format: "text", data: {url: "https://yomou.syosetu.com/", options: {'method': 'GET'}}}).then(function(response){
                                if(response){
                                if(response.success && response.action=="fetch"){
                                    var html = $($.parseHTML(response.result))
                                    var t: Array<string> = []
                                    html.find(".p-search-novel .p-search-novel__keyword .p-search-novel__keyword-item").each(function(){
                                        var tag = $(this).text()
                                        t.push(tag)
                                    })
                                    nt.storage.local.set({novelOfficialTags: t})
                                    setTags(t)
                                }
                                }
                            })
                        }
                    })
                    setTags(data)
                    */

                    function setTags(data: nt.api.novel.data, officialTagList?: Array<string>) {
                        if (r18) {
                            attention.append(
                                `<span class="nt-novel-attention-label nt-novel-attention-label--rating-r18"><a href="${nt.api.search.novelSearchURL(
                                    site
                                )}">R18</a></span>`
                            )
                        }
                        if (tags.includes("R15")) {
                            attention.append(
                                `<span class="nt-novel-attention-label nt-novel-attention-label--rating-r15"><a href="${nt.api.search.novelSearchURL(site, {
                                    isr15: 1,
                                })}">R15</a></span>`
                            )
                            removeItem("R15")
                        }

                        if (tags.includes("二次創作")) {
                            attention.append(
                                `<span class="nt-novel-attention-label"><a href="${nt.api.search.novelTagURL(
                                    "二次創作",
                                    site
                                )}"><i class="fa-solid fa-code-merge"></i>二次創作</a></span>`
                            )
                            removeItem("二次創作")
                        }
                        if (data.iszankoku) {
                            attention.append(
                                `<span class="nt-novel-attention-label"><a href="${nt.api.search.novelSearchURL(site, {
                                    iszankoku: 1,
                                })}"><i class="fa-solid fa-gun"></i>残酷な描写あり</a></span>`
                            )
                            removeItem("残酷な描写あり")
                        }
                        if (data.isbl) {
                            attention.append(
                                `<span class="nt-novel-attention-label"><a href="${nt.api.search.novelSearchURL(site, {
                                    isbl: 1,
                                })}"><i class="fa-solid fa-mars-double"></i>ボーイズラブ</a></span>`
                            )
                            removeItem("ボーイズラブ")
                        }
                        if (data.isgl) {
                            attention.append(
                                `<span class="nt-novel-attention-label"><a href="${nt.api.search.novelSearchURL(site, {
                                    isgl: 1,
                                })}?isgl=1"><i class="fa-solid fa-venus-double"></i>ガールズラブ</a></span>`
                            )
                            removeItem("ガールズラブ")
                        }
                        if (data.istensei) {
                            attention.append(
                                `<span class="nt-novel-attention-label"><a href="${nt.api.search.novelSearchURL(site, {
                                    istensei: 1,
                                })}"><i class="fa-solid fa-earth-americas"></i>異世界転生</a></span>`
                            )
                            removeItem("異世界転生")
                        }
                        if (data.istenni) {
                            attention.append(
                                `<span class="nt-novel-attention-label"><a href="${nt.api.search.novelSearchURL(site, {
                                    istenni: 1,
                                })}"><i class="fa-solid fa-earth-americas"></i>異世界転移</a></span>`
                            )
                            removeItem("異世界転移")
                        }

                        /*
                        if(!r18 && officialTagList!==undefined){
                            $.each(officialTagList, function(_, tag){
                                if(tags.includes(tag)){
                                    attention.append(`<span class="nt-novel-attention-label nt-novel-attention-label--official"><a href="${getNovelTagURL(tag, site)}"><i class="fa-solid fa-flag"></i>${tag}</a></span>`)
                                    removeItem("tag")
                                }
                            })
                        }
                        */
                    }
                }
            } catch (e) {
                console.warn(e)
            }
        })
    } catch (e) {
        console.warn(e)
    }
}

export function _setCookie() {
    nt.storage.local.get(null).then(function (data) {
        if (data.novelCustomStyle) {
            var expire = new Date()
            expire.setFullYear(expire.getFullYear() + 1)

            const cookieDetails = {
                url: location.origin,
                path: "/",
                domain: ".syosetu.com",
                expirationDate: expire.getTime(),
                name: "novellayout",
                value: "1",
            }
            nt.cookie.set(cookieDetails)
        }
    })
}
