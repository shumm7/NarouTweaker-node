import { setup } from "../general";
import { escapeHtml } from "../../utils/text";
import { getExtensionVersion } from "../../utils/misc";
import { nt } from "../../utils/option";

import $ from 'jquery';

setup()
debugMode()
showPatchnotes()

/* パッチノート */
function showPatchnotes(){

    fetch('https://raw.githubusercontent.com/shumm7/Narou-Tweaker/main/patchnote.json').then(response => response.json())
    .then(res => {
        var outer = $(".contents-container[name='version']")

        $.each(res.data, function(_, data){
            const lang = "ja"

            var box = $(`
                <div class="contents-wide">
                    <div class="contents-option">
                        <div class="contents-option-head">
                            <div class="contents-item--heading"></div>
                            <div class="contents-item--description">
                                <span class="release-icons"></span>
                            </div>
                        </div>

                        <div class="contents-option-content">
                            <div class="version">
                            </div>
                        </div>
                    </div>
                </div>
            `)

            const currentVersion = getExtensionVersion()
            const version = escapeHtml(data?.version)
            const date = escapeHtml(data?.date ?? "")
            const url = escapeHtml(data?.url ?? `https://github.com/shumm7/Narou-Tweaker/releases/tag/${version}`)
            const release = data?.release
            const patchnote = data?.patchnote[lang]
            const headerList = {
                ja: {
                    narou: "🏡 小説家になろう",
                    novel: "📗 小説ページ",
                    workspace: "🖊️ ユーザホーム",
                    mypage: "👤 ユーザページ",
                    yomou: "👑 小説を読もう！",
                    mitemin: "🎨 みてみん",
                    kasasagi: "📊 KASASAGI",
                    general: "⚒️ 全般"
                }
            }

            box.find(".contents-item--heading").append(`<a href="${url}">${version}</a>`)
            box.find(".contents-item--description").prepend(`<span class="release-date">${date}</span>`)

            if(version == currentVersion){
                box.find(".contents-item--heading").append(`<span class="current-version">使用中</span>`)
            }

            if(release.chrome){
                box.find(".contents-item--description .release-icons").append(`<i class="fa-brands fa-chrome"></i>`)
            }
            if(release.gecko){
                box.find(".contents-item--description .release-icons").append(`<i class="fa-brands fa-firefox-browser"></i>`)
            }

            $.each(headerList[lang], function(key, header){
                if(patchnote[key]!=undefined){
                    var list = $(`<ul></ul>`)
                    $.each(patchnote[key], function(_, text){
                        var item = $(`<li></li>`)
                        item.text(text)
                        list.append(item)
                    })

                    var row = $(`
                        <p>
                            <b>${header}</b>
                        </p>
                    `)
                    row.append(list)
                    box.find(".version").append(row)
                }

            })
            outer.append(box)

            if(getExtensionVersion() == version){
                $(".extension-version").append(`<a href="${url}">${version}</version>`)
            }
        })
    }).catch(error => {
        $("#footer").append(`
            <div id="js-failed">
                Failed to load patchnote.json: ${error}
            </div>
        `)
    });
}

/* デバッグモード */
function debugMode(){
    /* change debug mode */
    function tabMode(isDebug?: boolean){
        var tab = $(`.header-menu-item[name="debug"]`)

        if(tab.length){
            if(isDebug){
                tab.css("display", "")
            }else{
                tab.css("display", "none")
                if(tab.hasClass("selected")){
                    $(`.header-menu-item[name="config"]`).trigger("click")
                }
            }
        }
    }

    /* デバッグモードを表示 */
    nt.storage.local.get(["extDebug"]).then(function(data){
        tabMode(data.extDebug)

        if(data.extDebug){
            $(`.contents-wide[name="extDebug"]`).css("display", "")
        }else{
            $(`.contents-wide[name="extDebug"]`).css("display", "none")
        }
    })
    chrome.storage.local.onChanged.addListener(function(changes){
        if(changes.extDebug!=undefined){
            tabMode(changes.extDebug.newValue)

            if(changes.extDebug.newValue){
                $(`.contents-wide[name="extDebug"]`).css("display", "")
            }else{
                $(`.contents-wide[name="extDebug"]`).css("display", "none")
            }
        }
    })

    /* Ctrl + Alt + O でデバッグモードオプションを表示 */
    $(window).on("keydown", function(e){
        if(e.ctrlKey && e.altKey && e.key === "o"){
            $(`.contents-wide[name="extDebug"]`).css("display", "")
        }
    });
}