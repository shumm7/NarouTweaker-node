import { getNcodeFromURL } from "../../utils/ncode"
import { isR18 } from "../../utils/api"
import { escapeHtml } from "../../utils/text"
import { getLocalOptions } from "../../utils/option"


export function _general(){
    /* Show User ID */
    getLocalOptions(null, (data) => {
        const m = $(".p-userheader__tab .p-userheader__tab-list-item:nth-child(1) a").attr("href")?.match(`https://${location.hostname}/(.*)/`)
        if (data.mypageShowUserId && m!==undefined && m!==null){
            var userid = m[1].trim()
            if(userid!=undefined){
                $(".p-userheader .p-userheader__inner .p-userheader__username").after("<div class='p-userheader__userid'>" + userid + "</div>")
            }
        }
    })
    
    /* Disable External Link Warning */
    getLocalOptions(null, (data) => {
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

    function toInteger(num: string){
        var n: number = parseInt(num)
        if(isNaN(n)){
            n = 0
        }
        return n
    }
    
    getLocalOptions(null, function(data){
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
                let url
                if(r18){
                    url = `https://api.syosetu.com/novel18api/api/?out=json&libtype=2&ncode=${ncode}`
                }else{
                    url = `https://api.syosetu.com/novelapi/api/?out=json&libtype=2&ncode=${ncode}`
                }

                chrome.runtime.sendMessage({action: "fetch", format: "json", data: {url: url, options: {'method': 'GET'}}}, function(response){
                    if(response){
                        if(response.success && response.action=="fetch"){
                            var n = response.result[1]

                            const global_point = toInteger(n.global_point)
                            const daily_point = toInteger(n.daily_point)
                            const fav_novel_cnt = toInteger(n.fav_novel_cnt)
                            const impression_cnt = toInteger(n.impression_cnt)
                            const review_cnt = toInteger(n.review_cnt)
                            const all_hyoka_cnt = toInteger(n.all_hyoka_cnt)
                            const all_point = toInteger(n.all_point)
                            const length = toInteger(n.length)
                            const time = toInteger(n.time)
                            const keyword = escapeHtml(n.keyword)
                            
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
                    }
                })
            }
        })
    })
}