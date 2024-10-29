
import { nt } from "../../utils/narou-tweaker"
import { getUserIdFromURL, isR18 } from "../../utils/narou"
import { fetchUserApi } from "../../utils/api"

import $ from 'jquery';

export function _profile(){
    $(".l-main .c-panel").attr("id", "introduction")
    const userid = getUserIdFromURL()
    const r18 = isR18()

    if(userid){
        nt.storage.local.get(null).then((data) => {
            /* Disable External Link Warning */
            if (data.mypageDisableExternalURLWarning){
                var elm = $(".c-side-list .c-side-list__item dl dd a")
                if(elm.length){
                    var url = decodeURIComponent(elm.prop("href"))
                    url = url.replace(/^https:\/\/x?mypage\.syosetu\.com\/\?jumplink\=(.*)/g, "$1")
                    elm.prop("href", url)
                }
            }

            /* User Detail */
            if(data.mypageProfileStatics && !r18){
                fetchUserApi(userid, function(d){
                    if(d){
                        $(".c-panel__headline").attr("id", "user-detail-header")
                        $(".c-side-list").attr("id", "user-detail")
                        $(".c-side-list#user-detail").prepend(`
                            <div class="c-side-list__item">
                                <dl>
                                    <dt>ユーザ名</dt>
                                    <dd>${d.name ?? ""}</dd>
                                </dl>
                            </div>
                            <div class="c-side-list__item">
                                <dl>
                                    <dt>ヨミガナ</dt>
                                    <dd>${d.yomikata ?? ""}</dd>
                                </dl>
                            </div>`)
                        
                        $(".c-side-list#user-detail").after("<div class='c-panel__headline' id='user-stats-header'>ユーザ統計</div>")
                        $(".c-panel__headline#user-stats-header").after("<div class='c-side-list' id='user-stats'></div>")
                        $(".c-side-list#user-stats").append(`
                            <div class="c-side-list__item">
                                <dl>
                                    <dt>作品数</dt>
                                    <dd>${(d.novel_cnt ?? 0).toLocaleString()}</dd>
                                </dl>
                            </div>
                            <div class="c-side-list__item">
                                <dl>
                                    <dt>レビュー数</dt>
                                    <dd>${(d.review_cnt ?? 0).toLocaleString()}</dd>
                                </dl>
                            </div>
                            <div class="c-side-list__item">
                                <dl>
                                    <dt>総文字数</dt>
                                    <dd>${(d.novel_length ?? 0).toLocaleString()}</dd>
                                </dl>
                            </div>
                            <div class="c-side-list__item">
                                <dl>
                                    <dt>総獲得pt</dt>
                                    <dd>${(d.sum_global_point ?? 0).toLocaleString()}</dd>
                                </dl>
                            </div>
                        `)
                    }
                });
            }

            /* Auto Url */
            if(data.mypageProfileAutoURL){
                $('.c-panel__item').each(function(_) {
                    var comment = $(this)
                    var lines = comment.html().split(/<br\s*\/?>/i);
            
                    comment.empty();
                    $.each(lines, function(idx, line) {
                        comment.append("<p>" + line + "</p>");
                    });
                    
                    comment.children("p").each(function (idx, elem) {
                        let str = $(elem).html();
                        nt.text.replaceUrl(elem, !data.mypageDisableExternalURLWarning)
                    });
                });
            }

            /* Book List */
            if(data.mypageProfileBooklist){
                const max_amount = 5

                var url = `https://syosetu.com/syuppan/list/?word=${userid}`
                if(r18){
                    url = `https://nl.syosetu.com/syuppan/list/?noc=on&mnlt=on&mid=on&word=${userid}`
                }
                
                chrome.runtime.sendMessage ({action: "fetch", format: "text", data: {url: url, options: {'method': 'GET'}}}, function(response) {
                if(response){   
                    if(response.success && response.action=="fetch"){
                        var list: Array<Record<string,string>> = []
                        var body = $($.parseHTML(response.result))
                        body.find(".p-syuppan-list").each((idx, value)=>{
                            if(max_amount<=idx){
                                return false;
                            }

                            var atag = $(value).find(`.p-syuppan-list__spec-item:nth-child(1) a[href="https://mypage.syosetu.com/${userid}/"], .p-syuppan-list__spec-item:nth-child(1) a[href="https://xmypage.syosetu.com/${userid.toUpperCase()}/"]`)
                            if(atag.length){
                                var title: string = $(value).find("a.p-syuppan-list__title").text()
                                var link: string = $(value).find("a.p-syuppan-list__title").prop("href")
                                var author: string = $(value).find(".p-syuppan-list__writer").text()
                                var publisher: string = ""
                                var label: string = ""
                                var date: string = ""

                                $(value).find(".p-syuppan-list__spec-item").each((_, l)=>{
                                    var text = $(l).find("span.c-label").text().trim()
                                    if(text=="出版社"){
                                        $(l).find("span.c-label").remove()
                                        publisher = $(l).text().trim()
                                    }
                                    else if(text=="レーベル"){
                                        $(l).find("span.c-label").remove()
                                        label = $(l).text().trim()
                                    }
                                    else if(text=="発売日"){
                                        $(l).find("span.c-label").remove()
                                        date = $(l).text().trim()
                                    }
                                })
                                if(r18){
                                    link = link.replace("https://xmypage.syosetu.com/", "https://nl.syosetu.com/")
                                }else{
                                    link = link.replace("https://mypage.syosetu.com/", "https://syosetu.com/")
                                }
                                list.push({
                                    userid: userid,
                                    author: nt.text.escapeHtml(author),
                                    title: nt.text.escapeHtml(title),
                                    link: nt.text.escapeHtml(link),
                                    publisher: nt.text.escapeHtml(publisher),
                                    label: nt.text.escapeHtml(label),
                                    date: nt.text.escapeHtml(date)
                                })
                            }
                        })

                        if(list.length>0){
                            var shoho_url = "https://syosetu.com/syuppan/list/"
                            if(r18){
                                shoho_url = "https://nl.syosetu.com/syuppan/list/"
                            }
                            $(".c-panel#introduction").after(`
                                <div class="c-panel" id="books">
                                    <div class="c-panel__headline" id="book-list">書籍リスト</div>
                                    <div class="c-panel__body">
                                        <div class="c-panel__item">
                                            <p><a href="${shoho_url}">書報</a>に掲載された作品を最大${max_amount}件まで自動的に取得しています。</p>
                                            <div class='p-syuppan-lists'></div>
                                        </div>
                                    </div>
                                </div>
                            `)
                            $.each(list, (_, book)=>{
                                var ls = ""
                                if(book.publisher){
                                    ls += `<div class="p-syuppan-list__spec-item">
                                        <span class="c-label">出版社</span>
                                        ${book.publisher}
                                    </div>`
                                }
                                if(book.label){
                                    ls += `<div class="p-syuppan-list__spec-item">
                                        <span class="c-label">レーベル</span>
                                        ${book.label}
                                    </div>`
                                }
                                if(book.date){
                                    ls += `<div class="p-syuppan-list__spec-item">
                                        <span class="c-label">発売日</span>
                                        ${book.date}
                                    </div>`
                                }
                                $(".p-syuppan-lists").append(`
                                <div class='c-card p-syuppan-list'>
                                    <div class="p-syuppan-list__head">
                                        <a class="p-syuppan-list__title" href="${book.link}">${book.title}</a>
                                        <div class="p-syuppan-list__writer">${book.author}</div>
                                    </div>
                                    <div class="p-syuppan-list__spec">
                                    `+ls+`
                                    </div>
                                </div>`)
                            })
                            $(".c-panel#books .c-panel__item .p-syuppan-lists").after(`<div class="p-syuppan-list__more"><a href="${url}">もっと見る</a></div>`)
                            
                        }
                    }
                    return true;
                }
                });
            }
        
        })
    }
}