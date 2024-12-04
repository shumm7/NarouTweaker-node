
import { nt } from "../../utils/narou-tweaker"

import $ from 'jquery';

export async function _profile(){
    $(".l-main .c-panel").attr("id", "introduction")
    const userid = nt.api.user.getFromURL()
    const r18 = nt.api.isR18()

    if(userid){
        const data = await nt.storage.local.get(null)
        /* Disable External Link Warning */
        if (data.mypageDisableExternalURLWarning){
            disableExternalURLWarning()
        }

        /* User Detail */
        if(data.mypageProfileStatics && !r18){
            await profileUserInfo(userid).catch((e)=>{console.warn(e)})
        }

        /* Auto Url */
        if(data.mypageProfileAutoURL){
            profileAutoURL(data.mypageDisableExternalURLWarning)
        }

        /* Book List */
        if(data.mypageProfileBooklist){
            await profileBooklist(userid, r18)
        }
    }
}

function disableExternalURLWarning(){
    var elm = $(".c-side-list .c-side-list__item dl dd a")
    if(elm.length){
        var url = decodeURIComponent(elm.prop("href"))
        url = url.replace(/^https:\/\/x?mypage\.syosetu\.com\/\?jumplink\=(.*)/g, "$1")
        elm.prop("href", url)
    }
}

async function profileUserInfo(userid: string|number) {
    const d = await nt.api.user.fetch(userid)
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
}

function profileAutoURL(mypageDisableExternalURLWarning: boolean){
    $('.c-panel__item').each(function(_) {
        var comment = $(this)
        var lines = comment.html().split(/<br\s*\/?>/i);

        comment.empty();
        $.each(lines, function(idx, line) {
            comment.append("<p>" + line + "</p>");
        });
        
        comment.children("p").each(function (idx, elem) {
            let str = $(elem).html();
            nt.text.replaceUrl(elem, !mypageDisableExternalURLWarning)
        });
    });
}

async function profileBooklist(userid: string|number, r18?: boolean){
    let list = await nt.api.booklist.fetch(userid, r18)
    if(list.length>0){
        var shoho_url = r18 ? "https://nl.syosetu.com/syuppan/list/" : "https://syosetu.com/syuppan/list/"
        $(".c-panel#introduction").after(`
            <div class="c-panel" id="books">
                <div class="c-panel__headline" id="book-list">書籍リスト</div>
                <div class="c-panel__body">
                    <div class="c-panel__item">
                        <p><a href="${shoho_url}">書報</a>に掲載された作品を最大${nt.api.booklist.maxFetchCount}件まで自動的に取得しています。</p>
                        <div class='p-syuppan-lists'></div>
                    </div>
                </div>
            </div>
        `)
        $.each(list, (_, book)=>{
            var ls = ""

            // spec
            if(book?.user){
                if(book?.userid){
                    if(r18){
                        ls += `<div class="p-syuppan-list__spec-item">
                            <span class="c-label">ユーザ</span>
                            <a href="https://mypage.syosetu.com/${book.userid}/" target="_blank">${book.user}</a>
                        </div>`
                    }else{
                        ls += `<div class="p-syuppan-list__spec-item">
                            <span class="c-label">ユーザ</span>
                            <a href="https://xmypage.syosetu.com/${book.userid}/" target="_blank">${book.user}</a>
                        </div>`
                    }
                }else{
                    ls += `<div class="p-syuppan-list__spec-item">
                        <span class="c-label">ユーザ</span>
                        ${book.user}
                    </div>`
                }
            }
            if(book?.publisher){
                ls += `<div class="p-syuppan-list__spec-item">
                    <span class="c-label">出版社</span>
                    ${book.publisher}
                </div>`
            }
            if(book?.label){
                ls += `<div class="p-syuppan-list__spec-item">
                    <span class="c-label">レーベル</span>
                    ${book.label}
                </div>`
            }
            if(book?.date){
                ls += `<div class="p-syuppan-list__spec-item">
                    <span class="c-label">発売日</span>
                    ${book?.date}
                </div>`
            }

            // image
            var im = ""
            if(book?.image){
                im = `
                    <a class="p-syuppan-list__image-link" href="${book.url}">
                        <img src="${book.image}" data-original="${book.image}" class="lazy" alt="${book.title}" style="display: inline;">
                    </a>
                `
            }else{
                im = `
                    <a class="p-syuppan-list__image-link p-syuppan-list__image-link--noimage" href="${book.url}">
                        <div class="c-syuppan-noimage">
                            <div class="c-syuppan-noimage__title">${book.title}</div>
                        </div>
                    </a>
                `
            }
            
            // main
            var list = $(`
                <div class='c-card p-syuppan-list'>
                    <div class="p-syuppan-list__image">
                        ${im}
                    </div>
                    <div class="p-syuppan-list__info">
                        <div class="p-syuppan-list__head">
                            <div class="p-syuppan-list__writer">${book.author}</div>
                        </div>
                        <div class="p-syuppan-list__spec">
                            ${ls}
                        </div>
                    </div>
                </div>`
            )
            if(book.url){
                list.find(".p-syuppan-list__head").prepend(`<a class="p-syuppan-list__title" href="${book.url}">${book.title}</a>`)
            }else{
                list.find(".p-syuppan-list__head").prepend(`<span class="p-syuppan-list__title">${book.title}</span>`)
            }
            $(".p-syuppan-lists").append(list)
        })
        
        const fetchUrl: string = r18 ? `https://nl.syosetu.com/syuppan/list/?noc=on&mnlt=on&mid=on&word=${userid}` : `https://syosetu.com/syuppan/list/?word=${userid}`
        $(".c-panel#books .c-panel__item .p-syuppan-lists").after(`<div class="p-syuppan-list__more"><a href="${fetchUrl}">もっと見る</a></div>`)
        
    }
}