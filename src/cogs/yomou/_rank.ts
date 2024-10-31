import { checkRankPageDetail } from "./utils";
import { nt } from "../../utils/narou-tweaker";

import $ from 'jquery';


export function _rank(){
    const pageDetail = checkRankPageDetail()

    if(pageDetail){
        nt.storage.local.get().then(function(data){
            if(pageDetail.site=="yomou"){
                if(pageDetail.detail=="rank" && pageDetail.type != "top"){
                    $(".p-ranklist-item").each(function(){
                        var url = $(this).find(".p-ranklist-item__title a").prop("href")
                        const ncode = nt.api.ncode.getFromURL(url)?.ncode()
                        
                        if(ncode){
                            // ポイントの単位と数値を別々のspanで囲む
                            var elm = $(this).find(".p-ranklist-item__points")
                            var text = elm.text().match(/([\d,]+)pt/)
                            if(text){
                                var pt = text[1].replace(/,/g, "")
                                elm.text("")
                                elm.append(`<span class="p-ranklist-item__points-value">${nt.text.escapeHtml(pt)}</span><span class="p-ranklist-item__points-unit">pt</span>`)
                            }
        
                            // 要素追加・削除
                            var info = $(this).find(".p-ranklist-item__infomation")
                            info.find("a").addClass("p-ranklist-item__novel-info")
        
                            info.find(".p-ranklist-item__novel-info").after(`
                                <a target="_blank" href="https://kasasagi.hinaproject.com/access/top/ncode/${ncode}/" class="p-ranklist-item__kasasagi p-ranklist-item__separator">アクセス解析</a>
                                <a target="_blank" href="https://rawi-novel.work/writer/ai?ncode=${ncode}" class="p-ranklist-item__novel-rawi p-ranklist-item__separator">RaWi</a>
                            `)

                        }
                    })
    
                }
            }
    
        })
    }
}

export function _rankTop(){
    const pageDetail = checkRankPageDetail()

    if(pageDetail){
        nt.storage.local.get().then(function(data){
            if(pageDetail.site=="yomou"){
                if(pageDetail.detail=="rank" && pageDetail.type == "top"){

                    // ランキングトップ（要素追加）
                    showRankTop_NovelDetails()

                    nt.storage.local.changed("yomouRankTop_ShowDescription", function(changes){
                        nt.storage.local.get().then(function(option){
                            if(option.yomouRankTop_ShowDescription){
                                $(".p-ranktop-item__story").css("display", "")
                            }else{
                                $(".p-ranktop-item__story").css("display", "none")
                            }
                        })
                    })

                }
            }

        })
    }
}

function showRankTop_NovelDetails(){
    nt.storage.local.get().then(function(data){
        var i = 1
        $(".p-ranktop-item").each(function(){
            var outer = $(this)

            var header = outer.find(".p-ranktop-item__header").text().trim()
            var rankType: "daily"|"weekly"|"monthly"|"quarter"|"yearly"|"global"|undefined
            var rankGenre: number|null = null
            if(header=="日間ランキング"){
                rankType = "daily"
            }else if(header=="週間ランキング"){
                rankType = "weekly"
            }else if(header=="月間ランキング"){
                rankType = "monthly"
            }else if(header=="四半期ランキング"){
                rankType = "quarter"
            }else if(header=="年間ランキング"){
                rankType = "yearly"
            }else if(header=="累計ランキング"){
                rankType = "global"
            }else if(header.match(/^\[日間\]/)){
                rankType = "daily"
                const genre = header.match(/^\[日間\](.*)ランキング/)
                if(genre){
                    rankGenre = nt.api.novel.genreNumber(genre[1])
                }
            }

            if(rankType){
                outer.attr("ranking-type", rankType)
            }
            if(rankGenre!==null){
                outer.attr("ranking-genre", rankGenre)
            }
            
            outer.find(".p-ranktop-item__item").each(function(){
                var elem = $(this)
                const ncode = nt.api.ncode.getFromURL(elem.find(".p-ranktop-item__title a").prop("href"))
                const collapsedHeight = 70
                const marginHeight = 16

                if(ncode){
                    nt.api.novel.fetch(ncode).then(function(n){
                        if(n){
                            // あらすじを表示
                            const j = i
                            const story = n.story?.replace(/\r?\n/g, " ") ?? ""

                            // Set element
                            var story_box = $(`
                                <div class="p-ranktop-item__story js-readmore-mypage" data-collapsed-height="${collapsedHeight}">
                                    <div class="c-readmore">
                                        <div class="c-readmore__mask js-readmore-mypage__ellipsis" style="max-height: none;" data-readmore aria-expanded="false" id="rmjs-${i}">
                                            ${story}
                                        </div>
                                        <a class="c-readmore__button-more" href="javascript:void(0);" data-readmore-toggle="rmjs-${i}" aria-controls="rmjs-${i}">
                                            <span class="p-icon p-icon--plus" aria-label="全て表示"></span>
                                        </a>
                                    </div>
                                </div>
                            `)
                            elem.find(".p-ranktop-item__title").after(story_box)

                            // Set Event
                            var inner = $(`.js-readmore-mypage__ellipsis#rmjs-${i}`)
                            var height = inner.height()
                            if(height!==undefined){
                                inner.attr("data-height", Math.ceil(height))
                                inner.css("height", collapsedHeight + "px")

                                if(Math.ceil(height) > collapsedHeight){
                                    $(`.c-readmore__button-more[data-readmore-toggle="rmjs-${j}"]`).on("click", function(t){
                                        const tags = $(this).attr("data-readmore-toggle")
                                        var selfHeight = $(this).height()
                                        if(selfHeight){
                                            var ellipsis = $(`.js-readmore-mypage__ellipsis#${tags}`)
                                            var icon = $(this).find(".p-icon")
                        
                                            if(ellipsis.attr("aria-expanded")=="true"){
                                                ellipsis.attr("aria-expanded", "false")
                                                ellipsis.css("height", `${collapsedHeight}px`)
                                                icon.removeClass("p-icon--minus")
                                                icon.addClass("p-icon--plus")
                                            }else{
                                                ellipsis.attr("aria-expanded", "true")
                                                ellipsis.css("height", `${Number(ellipsis.attr("data-height") ?? "") + selfHeight + marginHeight}px`)
                                                icon.removeClass("p-icon--plus")
                                                icon.addClass("p-icon--minus")
                                            }
                                        }
                                    })
                                }else{
                                    $(`.c-readmore__button-more[data-readmore-toggle="rmjs-${j}"]`).remove()
                                }

                                if(!data.yomouRankTop_ShowDescription){
                                    story_box.css("display", "none")
                                }
                            }
                            i += 1
                                

                            // キーワードを表示
                            elem.find(".p-ranktop-item__infomation").after(`
                                <div class="p-ranktop-item__keyword">
                                    ${n.keyword ?? ""}
                                </div>
                            `)

                            // 文字数・長さを表示
                            var str = ""
                            if(n.time!==undefined){
                                str += `読了時間：約${n.time}分`
                                if(n.length!==undefined){
                                    str += `（${n.length.toLocaleString()}文字）`
                                }
                            }
                            elem.find(".p-ranktop-item__keyword").after(`<div class="p-ranktop-item__length">${str}</div>`)

                            // ポイントを表示
                            if(rankType!==undefined){
                                var point = n[rankType + "_point"]
                                if(point!==undefined && !isNaN(point)){
                                    elem.find(".p-ranktop-item__title").after(`
                                        <div class="p-ranktop-item__points">
                                            <span class="p-ranktop-item__points-value">${point.toLocaleString()}</span><span class="p-ranktop-item__points-unit">pt</span>
                                        </div>
                                    `)
                                }
                            }

                            // RaWiへのリンクを表示
                            elem.find(".p-ranktop-item__infomation").prepend(`
                                <a href="https://rawi-novel.work/writer/ai?ncode=${ncode}" class="p-ranktop-item__novel-rawi p-ranktop-item__list_item">
                                    RaWi
                                </a>
                            `)

                            // アクセス解析へのリンクを表示
                            elem.find(".p-ranktop-item__infomation").prepend(`
                                <a href="https://kasasagi.hinaproject.com/access/top/ncode/${ncode}/" class="p-ranktop-item__kasasagi p-ranktop-item__list_item">
                                    アクセス解析
                                </a>
                            `)

                            // 作品情報へのリンクを表示
                            elem.find(".p-ranktop-item__infomation").prepend(`
                                <a href="https://ncode.syosetu.com/novelview/infotop/ncode/${ncode}/" class="p-ranktop-item__novel-info p-ranktop-item__list_item">
                                    作品情報
                                </a>
                            `)

                            // 最終更新日時を表示
                            var str = ""
                            if(n.general_lastup!==undefined){
                                str = `最終更新日：${nt.time.getDatetimeStringWithoutSecond(nt.time.getDatetimeFromString(n.general_lastup))}`
                            }
                            elem.find(".p-ranktop-item__infomation").append(`
                                <span class="p-ranktop-item__separator p-ranktop-item__update-date">
                                    ${str}
                                </span>
                            `)
                        }
                    });
                }

            })
        })
    })
}

