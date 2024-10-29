import { getNcodeFromURL } from "../../utils/ncode"
import { isR18 } from "../../utils/narou"
import { nt } from "../../utils/narou-tweaker"

import $ from 'jquery';


export function _general(){
    /* Show User ID */
    nt.storage.local.get(null).then((data) => {
        const m = $(".p-userheader__tab .p-userheader__tab-list-item:nth-child(1) a").attr("href")?.match(`https://${location.hostname}/(.*)/`)
        if (data.mypageShowUserId && m!==undefined && m!==null){
            var userid = m[1].trim()
            if(userid!=undefined){
                $(".p-userheader .p-userheader__inner .p-userheader__username").after("<div class='p-userheader__userid'>" + userid + "</div>")
            }
        }
    })
    
    /* Disable External Link Warning */
    nt.storage.local.get(null).then((data) => {
        if (data.mypageDisableExternalURLWarning){
            var span = $(".p-userheader__tooltip .p-userheader__tooltip-item a > span.p-icon--earth")
            if(span.length){
                var url = decodeURIComponent(span.parent().prop("href"))
                url = url.replace(/^https:\/\/x?mypage\.syosetu\.com\/\?jumplink\=(.*)/g, "$1")
                span.parent().prop("href", url)
            }
        }
    })

    /* User Novel List */
    novellist()
}

function novellist(){
    nt.storage.local.get(null).then(function(data){
        $(".c-novel-list__item").each(function(){
            var outer = $(this)
            const ncode = getNcodeFromURL(outer.find(".c-novel-list__title").attr("href"))
            const r18 = isR18()
            
            if(ncode){
                // KASASAGI
                if(data.mypageNovellistShowKasasagi){
                    outer.find(".c-novel-list__novel-info-button").after(`
                        <a href=https://kasasagi.hinaproject.com/access/top/ncode/${ncode}/" class="c-novel-list__novel-kasasagi-button c-button c-button--outline c-button--sm">アクセス解析</a>
                    `)
                }

                // RaWi
                if(data.mypageNovellistShowRaWi){
                    outer.find(".c-novel-list__novel-info-button").after(`
                        <a href="https://rawi-novel.work/writer/ai?ncode=${ncode}" class="c-novel-list__novel-rawi-button c-button c-button--outline c-button--sm">RaWi</a>
                    `)
                }

                // API
                nt.api.novel.fetch(ncode, r18, function(n){
                    if(n){
                        const all_hyoka_cnt = n.all_hyoka_cnt ?? 0
                        const all_point = n.all_point ?? 0

                        const global_point = n.global_point ?? 0
                        const daily_point = n.daily_point ?? 0
                        const fav_novel_cnt = n.fav_novel_cnt ?? 0
                        const impression_cnt = n.impression_cnt ?? 0
                        const review_cnt = n.review_cnt ?? 0
                        const length = n.length ?? 0
                        const time = n.time ?? 0
                        const keyword = n.keyword ?? ""
                        
                        if(data.mypageNovellistShowReaction){
                            var point_average = Math.round((all_point / 2) / all_hyoka_cnt * 10) / 10
                            if(isNaN(point_average)){
                                point_average = 0
                            }

                            var elm = $(`
                                <div class="c-novel-list__reaction">
                                    <div class="c-novel-list__novel-info c-novel-list__novel-info__points">
                                        <div class="c-novel-list__novel-info__daily-point">日間ポイント：${daily_point.toLocaleString()} pt</div>
                                        <div class="c-novel-list__novel-info__hyoka-avg"></div>
                                    </div>
                                    <div class="c-novel-list__novel-info c-novel-list__novel-info__impressions">
                                        <div class="c-novel-list__novel-info__hyoka-cnt">評価者数：${all_hyoka_cnt.toLocaleString()} 人</div>
                                        <div class="c-novel-list__novel-info__fav-novel-cnt">ブックマーク：${fav_novel_cnt.toLocaleString()} 件</div>
                                        <div class="c-novel-list__novel-info__impression-cnt">感想：${impression_cnt.toLocaleString()} 件</div>
                                        <div class="c-novel-list__novel-info__review-cnt">レビュー：${review_cnt.toLocaleString()} 件</div>
                                    </div>
                                </div>
                            `)

                            var hyoka = elm.find(".c-novel-list__novel-info__hyoka-avg")
                            hyoka.append(`
                                評価：<span style="margin-right: 3px;">${point_average}</span>
                                <span class="c-up-point-star p-up-novelinfo__point-star js-novelpoint_notactive" title="gorgeous"></span>
                            `)
                            var stars = hyoka.find(".c-up-point-star")
                            for(let index = 1; index<=5; index++){
                                if(point_average <= (index-1)){
                                    stars.append(`<span data-alt="${index}" class="is-empty" title="gorgeous"></span>`)
                                }else if(point_average <= (index-0.5)){
                                    stars.append(`<span data-alt="${index}" class="is-half" title="gorgeous"></span>`)
                                }else{
                                    stars.append(`<span data-alt="${index}" class="is-full" title="gorgeous"></span>`)
                                }
                            }

                            outer.find(".c-novel-list__detail").before(elm)

                            // Status
                            outer.find(".c-novel-list__status").append(`
                                <span class="c-novel-list__global-point">
                                    <span class="c-novel-list__point-number">${global_point.toLocaleString()}</span> pt
                                </span>
                            `)
                        }

                        if(!outer.find(".c-novel-list__additional").length && data.mypageNovellistShowLength){
                            outer.find(".c-novel-list__content").append(`
                                <div class="c-novel-list__additional">
                                    <span class="c-novel-list__keyword">${keyword}</span>
                                    <span class="c-novel-list__length">読了時間：約${time.toLocaleString()}分（${length.toLocaleString()}文字）</span>
                                </div>
                            `)
                        }
                    }
                })
            }
        })
    })
}