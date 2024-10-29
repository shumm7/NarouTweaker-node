import { Ncode } from "../../utils/ncode"
import { convertRubyTags, convertSasieTags, countLines, countManuscriptPaper, countTime, escapeHtml, countCharacters } from "../../utils/text"
import { fetchNovelApi } from "../../utils/api"
import { nt } from "../../utils/narou-tweaker"
import { setDisplayEvent } from "./_editorCss"
import { _toolCovertKakuyomuRubyDot, _toolExportAll, _toolExportEach, _toolIndent, _toolRuby, _toolRubyDot, _toolSasie, _toolSearch } from "./_editorTools"

import $ from "jquery"
import "@shumm7/jquery.selection"
import Encoding from "encoding-japanese"
import "pickadatejs/lib/picker"
import "pickadatejs/lib/picker.date"
import "pickadatejs/lib/themes/default.css"
import "pickadatejs/lib/themes/default.date.css"

let isEventLocked = false
const formElement = "#usernoveldatamangeForm,#wright_form,#usernoveldatainputForm"

export function _editor(){
    const path = location.pathname
    nt.storage.local.get(null).then(function(data){
        if(data.workspaceCustomEditor){
            if(
                path.match(/^\/usernoveldatamanage\/updateinput\/.*$/) ||
                path.match(/^\/draftepisode\/updateinput\/.*$/) ||
                path.match(/^\/draftepisode\/input\/.*$/)
            ){
                if($("textarea[name='novel']").length){
                    changeEditorPageLikePreview()
                }
            } 
        }
    })
}

function changeEditorPageLikePreview(){
    $("body").addClass("narou-tweaker-custom-editor")

    var container = $(".l-container")
    const header = $(".l-breadcrumb .c-up-breadcrumb__item:last").text()
    const curmbs = $(".l-breadcrumb .c-up-breadcrumb__item:has(a):last a").attr("href")
    const ncode = new Ncode($(".js-novel_backup_info").attr("data-ncode"))
    const userid = $(".js-novel_backup_info").attr("data-userid")

    $(".l-header").remove()
    $(".l-breadcrumb").remove()
    $(".l-footer").remove()

    // box
    var elm = $(`
        <div class="nt-container nt-panel-show">
            <div class="nt-editor">
                <div class="nt-editor--outer">
                    <div class="nt-editor--header">
                        <div class="nt-editor--header-items nt-editor-header-left">
                            <button type="button" class="nt-button" id="nt-editor--panel-toggle" title="サイドパネルを開閉">
                                <i class="fa-solid fa-table-columns"></i>
                            </button>
                            <div class="nt-editor--panel-vertical-devide"></div>
                            <div id="nt-editor--panel-undoredo">
                                <button type="button" id="nt-editor--panel-undo" class="nt-button nt-editor--panel-undoredo-button" title="戻す">
                                    <i class="fa-solid fa-angle-left"></i>
                                </button>
                                <button type="button" id="nt-editor--panel-redo" class="nt-button nt-editor--panel-undoredo-button" title="やり直す">
                                    <i class="fa-solid fa-angle-right"></i>
                                </button>
                            </div>
                        </div>
                        <div class="nt-editor--header-items nt-editor-header-middle">${header}</div>
                        <div class="nt-editor--header-items nt-editor-header-right" id="nt-editor--save-button">
                            <a type="button" class="nt-button" id="nt-editor--panel-close" title="編集画面を閉じる">
                                <i class="fa-solid fa-xmark"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="nt-editor--body">
                        <div class="nt-editor--body-content-overlay">
                            <!-- バナー -->
                            <div class="nt-editor--body-content-banner nt-editor--footer-tab-content nt-content-hidden" data="1">
                                <span style="text-decoration: underline; font-weight: bold;">前書き</span>&nbsp;を編集しています。
                            </div>
                            <div class="nt-editor--body-content-banner nt-editor--footer-tab-content nt-content-hidden" data="2">
                                <span style="text-decoration: underline; font-weight: bold;">後書き</span>&nbsp;を編集しています。
                            </div>
                            <div class="nt-editor--body-content-banner nt-editor--footer-tab-content nt-content-hidden" data="3">
                                <span style="text-decoration: underline; font-weight: bold;">フリーメモ</span>&nbsp;を編集しています。<br>
                                エピソードと一緒に保存しておけるメモです。書いたメモは他のユーザには公開されません。詳細は<a href="https://syosetu.com/helpcenter/helppage/helppageid/36/" target="_blank">ヘルプセンター</a>をご確認ください。
                            </div>
                            <div class="nt-editor--body-content-banner nt-editor--footer-tab-content nt-content-hidden" data="4">
                                <span style="text-decoration: underline; font-weight: bold;">プレビュー</span>&nbsp;を表示中（このエピソードの文字数：<span class="nt-editor--textcount" data="1"></span> 字）<br>
                                実際の表示と異なる可能性があります。
                            </div>

                            <div class="nt-editor--reserve-date nt-editor--reserve-date--close nt-editor--footer-tab-content nt-editor--reserve-date--hidden" title="予約掲載設定"  data="0">
                                <div class="nt-editor--reserve-date--header"><i class="fa-solid fa-chevron-right"></i><span class="nt-editor--reserve-date--header-title">予約掲載：2024/05/06 23:10</span></div>
                                <div class="nt-editor--reserve-date--content">
                                    <div class="nt-editor--reserve-date--item nt-editor--reserve-date--date">
                                        <div class="nt-editor--reserve-date--item-headding">投稿日</div>
                                        <div class="nt-editor--reserve-date--item-content">
                                            <input class="nt-editor--reverse-date--date-dummy" type="text" placeholder="掲載日を選択">
                                        </div>
                                    </div>
                                    <div class="nt-editor--reserve-date--item nt-editor--reserve-date--time">
                                        <div class="nt-editor--reserve-date--item-headding">投稿時間</div>
                                        <div class="nt-editor--reserve-date--item-content"></div>
                                    </div>
                                    <div class="nt-editor--reserve-date--item nt-editor--reserve-date--clear">
                                        <div class="nt-editor--reserve-date--item-content"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- コンテンツ -->
                        <input type="hidden" name="nt-editor--selected-content" value="0">
                        <div class="nt-editor--body-content nt-editor--footer-tab-content nt-content-hidden" id="nt-editor--main" data="0">
                            <div class="nt-editor--main-items">
                                <div class="nt-editor--main-title"></div>
                                <div class="nt-editor--main-novel"></div>
                            </div>
                        </div>
                        <div class="nt-editor--body-content nt-editor--footer-tab-content nt-content-hidden" id="nt-editor--preface" data="1">
                            <div class="nt-editor--preface"></div>
                        </div>
                        <div class="nt-editor--body-content nt-editor--footer-tab-content nt-content-hidden" id="nt-editor--postscript" data="2">
                            <div class="nt-editor--postscript"></div>
                        </div>
                        <div class="nt-editor--body-content nt-editor--footer-tab-content nt-content-hidden" id="nt-editor--freememo" data="3">
                            <div class="nt-editor--freememo"></div>
                        </div>
                        <div class="nt-editor--body-content nt-editor--footer-tab-content nt-content-hidden" id="nt-editor--preview" data="4">
                            <div class="nt-editor--preview-items">
                                <div id="nt-preview--novel_subtitle"></div>
                                <div class="nt-editor--preview-contents">
                                    <div id="nt-preview--novel_p" class="novel-view"></div>
                                    <div id="nt-preview--novel_honbun" class="novel-view"></div>
                                    <div id="nt-preview--novel_a" class="novel-view"></div>
                                </div>
                            </div>
                        </div>

                        <!-- ツール -->
                        <!-- 検索・置換 -->
                        <div class="nt-search-box nt-search-box--close nt-content-hidden">
                            <div class="nt-search-box--button nt-search-box--open-replace">
                                <i class="fa-solid fa-chevron-right"></i>
                            </div>
                            <div class="nt-search-box--column">
                                <div class="nt-search-box--row nt-search-box--search">
                                    <div class="nt-search-box--fields">
                                        <div class="nt-search-box--field-dummy-outer">
                                            <input type="text" class="nt-search-box--field-dummy nt-search-box--field-search" name="nt-search" placeholder="検索"/>
                                            <div class="nt-search-box--field-above">
                                                <div class="nt-search-box--button nt-search-box--mode-case nt-search-box--button-toggle" title="大文字・小文字を区別する"><div class='codicon codicon-case-sensitive'></div></div>
                                                <div class="nt-search-box--button nt-search-box--mode-word nt-search-box--button-toggle" title="単語単位で検索する"><div class='codicon codicon-whole-word'></div></div>
                                                <div class="nt-search-box--button nt-search-box--mode-regex nt-search-box--button-toggle" title="正規表現を使用する"><div class='codicon codicon-regex'></div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="nt-search-box--buttons">
                                        <div class="nt-search-box--count nt-search-box--left-align"></div>
                                        <div class="nt-search-box--button nt-search-box--prev-index" title="前の一致項目"><i class="fa-solid fa-arrow-up"></i></div>
                                        <div class="nt-search-box--button nt-search-box--next-index" title="次の一致項目"><i class="fa-solid fa-arrow-down"></i></div>
                                        <div class="nt-search-box--button nt-search-box--close-self" title="閉じる"><i class="fa-solid fa-xmark"></i></div>
                                    </div>
                                </div>
                                <div class="nt-search-box--row nt-search-box--replace">
                                    <div class="nt-search-box--fields">
                                        <input type="text" class="nt-search-box--field nt-search-box--field-replace" name="nt-replace" placeholder="置換"/>
                                    </div>
                                    <div class="nt-search-box--buttons">
                                        <div class="nt-search-box--button nt-search-box--replace-each" title="置換"><div class='codicon codicon-replace'></div></div>
                                        <div class="nt-search-box--button nt-search-box--replace-all" title="全て置換"><div class='codicon codicon-replace-all'></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="nt-editor--footer">
                        <div class="nt-editor--footer-items nt-editor-footer-left">
                            <div class="nt-editor--footer-tab">
                                <span class="nt-editor--footer-tab-item" data="3">
                                    <button type="button" class="nt-editor--footer-tab-button"><i class="fa-regular fa-note-sticky"></i>フリーメモ</button>
                                </span>
                                <span class="nt-editor--footer-tab-item" data="4">
                                    <button type="button" class="nt-editor--footer-tab-button"><i class="fa-solid fa-align-left"></i>プレビュー</button>
                                </span>
                            </div>
                        </div>
                        <div class="nt-editor--footer-items nt-editor-footer-middle">
                            <div class="nt-editor--footer-tab">
                                <span class="nt-editor--footer-tab-item" data="1">
                                    <button type="button" class="nt-editor--footer-tab-button">前書き</button>
                                </span>
                                <span class="nt-editor--footer-tab-item nt-selected" data="0">
                                    <button type="button" class="nt-editor--footer-tab-button">本文</button>
                                </span>
                                <span class="nt-editor--footer-tab-item" data="2">
                                    <button type="button" class="nt-editor--footer-tab-button">後書き</button>
                                </span>
                            </div>
                        </div>
                        <div class="nt-editor--footer-items nt-editor-footer-right">
                            <div class="nt-editor--footer-textcount nt-editor--footer-tab-content" data="0">
                                <div class="nt-editor--textcount nt-editor--footer-textcount-number" data="1"></div>
                                <div class="nt-editor--footer-textcount-unit">文字</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <aside class="nt-panel">
                <div class="nt-panel--header">
                    <div class="nt-panel--tab">
                        <span class="nt-panel--tab-item" data="0">
                            <button type="button" class="nt-panel--tab-button">統計</button>
                        </span>
                        <span class="nt-panel--tab-item" data="1">
                            <button type="button" class="nt-panel--tab-button">表示</button>
                        </span>
                        <span class="nt-panel--tab-item" data="2">
                            <button type="button" class="nt-panel--tab-button">ツール</button>
                        </span>
                        <span class="nt-panel--tab-item" data="3">
                            <button type="button" class="nt-panel--tab-button">フリーメモ</button>
                        </span>
                    </div>
                </div>
                <div class="nt-panel--content">
                    <div class="nt-panel--tab-content" id="nt-panel--tab-stats" data="0">
                        <!--文字数-->
                        <div id="nt-panel--tab-content--textcount">
                            <h4 class="underline">文字数</h4>
                            <p>エピソード本文の文字数を表示しています。</p>
                            <div class="box">
                                <p class="content">
                                    行数：<span class="nt-editor--textcount" data="2"></span> 行<br>
                                    空白・改行含む：<span class="nt-editor--textcount" data="0"></span> 字<br>
                                    空白・改行含まない：<span class="nt-editor--textcount" data="1"></span> 字
                                </p>
                                <div class="border"></div>
                                <p class="content">
                                    読了時間：<span class="nt-editor--textcount" data="4"></span><br>
                                    原稿用紙：<span class="nt-editor--textcount" data="5"></span>枚分
                                </p>
                            </div>
                        </div>

                        <!--作品情報-->
                        <div id="nt-panel--tab-content--info" style="display: none;">
                            <h4 class="underline">作品情報</h4>
                            <p><a id="narou-api-fetch-url">なろうAPI</a>を用いて作品の詳細情報を表示しています。</p>
                            <div class="box">
                                <p class="content">
                                    <span style="font-weight: bold" id="novel-title"></span>
                                </p>
                                <div class="border"></div>
                                <p>
                                    文字数：<span id="novel-length"></span> 字<br>
                                    会話率：<span id="novel-kaiwaritu"></span>%<br>
                                    挿絵数：<span id="novel-sasie"></span><br>
                                    話数：<span id="novel-episode-count"></span>
                                </p>
                                <div class="border"></div>
                                <p>
                                    ブックマーク：<span id="novel-bookmark"></span> 人<br>
                                    評価：<span id="novel-hyoka"></span> pt / <span id="novel-hyoka-count"></span> 人<br>
                                    感想数：<span id="novel-impression"></span><br>
                                    レビュー数：<span id="novel-review"></span><br>
                                    総合評価：<span id="novel-global-point"></span> pt
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="nt-panel--tab-content" id="nt-panel--tab-display" data="1">
                        <div id="nt-panel--tab-content--display-font">
                            <h4 class="underline">執筆時のスキン設定</h4>
                            <p>小説の閲覧画面には影響しません。</p>
                            <div class='box'>
                                <div id="nt-display-option--skin">
                                    <div class="dropdown" style="width: 100%;">
                                        <select id="nt-display-option--skin-dropdown" name="nt-display-option--skin-dropdown"></select>
                                    </div>
                                </div>
                                <div id="nt-display-option--skin-description"></div>
                            </div>
                        </div
                        >
                        <div id="nt-panel--tab-content--display-font">
                            <h4 class="underline">執筆時のフォント設定</h4>

                            <div class='box'>
                                <div id="nt-display-option--font-family">
                                    <div class="dropdown" style="width: 100%;">
                                        <select id="font-family" name="font-family"></select>
                                    </div>
                                </div>
                                <div id="nt-display-option--font-family-description"></div>
                                <div class="nt-display-option--description">サイズ</div>
                                <div id="nt-display-option--font-size">
                                    <div style="margin: 0 .5em;">+</div>
                                    <div class="nt-display-option--font-number-change-button" id="nt-display-option--font-size-minus">-</div>
                                    <input name="fontFontSize" class="nt-display-option--textfield" type="text" id="nt-display-option--font-size-input">
                                    <div class="nt-display-option--font-number-change-button" id="nt-display-option--font-size-plus">+</div>
                                    <div style="margin: 0 .5em;">%</div>
                                </div>
                                <div class="nt-display-option--description">行間</div>
                                <div id="nt-display-option--line-height">
                                    <div style="margin: 0 .5em;">+</div>
                                    <div class="nt-display-option--font-number-change-button" id="nt-display-option--line-height-minus">-</div>
                                    <input name="fontLineHeight" class="nt-display-option--textfield" type="text" id="nt-display-option--line-height-input">
                                    <div class="nt-display-option--font-number-change-button" id="nt-display-option--line-height-plus">+</div>
                                    <div style="margin: 0 .5em;">%</div>
                                </div>
                                <!--
                                <div class="nt-display-option--description">横幅</div>
                                <div id="nt-display-option--page-width">
                                    <div style="margin: 0 .5em;">×</div>
                                    <div class="nt-display-option--font-number-change-button" id="nt-display-option--page-width-minus">-</div>
                                    <input name="fontWidth" class="nt-display-option--textfield" type="text" id="nt-display-option--page-width-input">
                                    <div class="nt-display-option--font-number-change-button" id="nt-display-option--page-width-plus">+</div>
                                    <div style="margin: 0 .5em;">%</div>
                                </div>
                                -->
                            </div>
                        </div>
                    </div>

                    <div class="nt-panel--tab-content" id="nt-panel--tab-tools" data="2">
                        <div id="nt-panel--tab-content--tools-format">
                            <h4 class="underline">記法挿入</h4>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--ruby">
                                <span class="nt-notation-button--label">ルビ</span>
                                <span class="nt-notation-button--sample">
                                    <span class="nt-notation--sample-row nt-notation--sample-parsed"><ruby>加茂川<rp>(</rp><rt>かもがわ</rt><rp>)</rp></ruby>の水</span>
                                    <span class="nt-notation--sample-row nt-notation--sample-code"><span class="code">｜加茂川《かもがわ》の水</span></span>
                                </span>
                            </button>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--rubydot">
                                <span class="nt-notation-button--label">傍点</span>
                                <span class="nt-notation-button--sample">
                                    <span class="nt-notation--sample-row nt-notation--sample-parsed"><ruby>絵<rp>(</rp><rt>・</rt><rp>)</rp></ruby><ruby>画<rp>(</rp><rt>・</rt><rp>)</rp></ruby>の鑑賞</span>
                                    <span class="nt-notation--sample-row nt-notation--sample-code"><span class="code">｜絵《・》｜画《・》の鑑賞</span></span>
                                </span>
                            </button>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--sasie">
                                <span class="nt-notation-button--label">挿絵</span>
                                <span class="nt-notation-button--sample">
                                    <span class="nt-notation--sample-row">みてみんの画像を挿入</span>
                                    <span class="nt-notation--sample-row nt-notation--sample-code"><span class="code">&lt;iコード|ユーザID&gt;</span></span>
                                </span>
                            </button>
                        </div>

                        <div id="nt-panel--tab-content--tools-replace">
                            <h4 class="underline">一括変更</h4>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--search">
                                <i class="fa-solid fa-magnifying-glass"></i>検索・置換
                            </button>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--indent">
                                <i class="fa-solid fa-indent"></i>段落の先頭を字下げ
                            </button>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--kakuyomu-rubydot">
                                <span class="nt-notation-button--sample">
                                    <span class="nt-notation--sample-row">カクヨム記法の傍点を修正</span>
                                    <span class="nt-notation--sample-row nt-notation--sample-code"><span class="code">《《絵画》》</span> <i class="fa-solid fa-arrow-right"></i> <span class="code">｜絵《・》｜画《・》</span></span>
                                </span>
                            </button>
                        </div>

                        <div id="nt-panel--tab-content--tools-backup">
                            <h4 class="underline">バックアップ</h4>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--export-each">
                                <i class="fa-solid fa-file-lines"></i>表示中の項目を保存
                            </button>
                            <button type="button" class="nt-button nt-notation-button" id="nt-tools--export-all">
                                <i class="fa-solid fa-file-zipper"></i>すべての項目を保存
                            </button>
                            <a href="/userwrittingnovel/backup/" target="blank">
                                <button type="button" class="nt-button nt-notation-button" id="nt-tools--backup">
                                    <i class="fa-solid fa-cloud"></i>執筆バックアップを開く
                                </button>
                            </a>
                        </div>
                    </div>

                    <div class="nt-panel--tab-content" id="nt-panel--tab-freememo" data="3">
                        <div id="nt-panel--tab-content--freememo">
                            <h4 class="underline">フリーメモ</h4>
                            <div id="nt-panel--tab-freememo-box">
                                <textarea id="nt-panel--tab-freememo-field" class="nt-check-state" name="freememo-panel"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    `)

    // editor
    elm.find("#nt-editor--panel-toggle").on("click", function(){
        if($(".nt-container").hasClass("nt-panel-show")){
            $(".nt-container").removeClass("nt-panel-show")
        }else{
            $(".nt-container").addClass("nt-panel-show")
        }
    })

    // displays
    elm.find(".nt-editor--main-title").prepend(container.find(".c-up-title-area__title").addClass("nt-editor--main-title-novel"))

    // token
    elm.prepend(container.find("input[name='token']"))
    elm.prepend(container.find("input[name='draftepisodeid']"))

    // buttons
    elm.find("#nt-editor--save-button").append(container.find(".c-button-box-center:has(.js-previewButton)"))
    elm.find(".nt-editor-footer-right").prepend(container.find(".p-up-novel-input__upload").addClass("nt-editor--footer-tab-content").attr("data", 0))
    elm.find(".p-up-novel-input__upload button").text("ファイルから読込（txt）")
    elm.find(".nt-editor-footer-right").prepend(container.find(".js-read_preface_template").addClass("nt-editor--footer-tab-content").attr("data", 1))
    elm.find(".nt-editor-footer-right").prepend(container.find(".js-read_postscript_template").addClass("nt-editor--footer-tab-content").attr("data", 2))
    elm.find("#nt-editor--panel-close").attr("href", curmbs ?? "")

    elm.find(".p-up-novel-input__upload input[name='novel-file']").remove()
    elm.find(".p-up-novel-input__upload").append($(`<input type="file" name="novel-file" hidden="">`).on("change", function(){
        const MAX_FILE_SIZE: number = Number($(this).parent().find(`input[name="MAX_FILE_SIZE"]`).attr("value") ?? 1048576)
        var textfile = $(this).prop('files')[0];
		if(textfile.size > MAX_FILE_SIZE){
			alert('ファイルが大きすぎます。1MB以下のファイルを指定してください。');
			$(this).val('');
			$('.js-upload_file_name').text('');
			return;
		}

		if(textfile.type != 'text/plain'){
			alert('テキストファイル以外は利用できません。');
			$(this).val('');
			$('.js-upload_file_name').text('');
			return;
		}

		var reader = new FileReader();
		reader.addEventListener('loadend', function(){
			if(reader.error){
				alert('ファイルの読み込みに失敗しました。');
				$('input[name="novel-file"]').val('');
				return;
			}

			if(typeof reader.result !=="string"){
                if(!reader.result?.byteLength){
                    alert('ファイルの中身が空です。');
                    $('input[name="novel-file"]').val('');
                    return
                }
            
                var codeArray = new Uint8Array(reader.result);
                var encodingType = Encoding.detect(codeArray);
                
                if(encodingType!==false){
                    var text = Encoding.convert(codeArray,{
                        to: 'UNICODE',
                        from: encodingType,
                        type: 'string',
                    });
        
                    $('textarea[name="novel"]').val(text);
                    $('textarea[name="novel"]').trigger("input")
                }
            }
		});
		reader.readAsArrayBuffer(textfile);
    }))

    // inputs
    if(container.find("input[name='reserve_date']").length){
        elm.find(".nt-editor--reserve-date").removeClass("nt-editor--reserve-date--hidden")
        elm.find(".nt-editor--reserve-date--content .nt-editor--reserve-date--date .nt-editor--reserve-date--item-content").append(container.find("input[name='reserve_date']").addClass("nt-content-hidden"))
        elm.find(".nt-editor--reserve-date--content .nt-editor--reserve-date--time .nt-editor--reserve-date--item-content").append(container.find("select[name='reserve_hour']"))
        elm.find(".nt-editor--reserve-date--content .nt-editor--reserve-date--time .nt-editor--reserve-date--item-content").append(`<span>時</span>`)
        elm.find(".nt-editor--reserve-date--content .nt-editor--reserve-date--time .nt-editor--reserve-date--item-content").append(container.find("select[name='reserve_minutes']"))
        elm.find(".nt-editor--reserve-date--content .nt-editor--reserve-date--time .nt-editor--reserve-date--item-content").append(`<span>分</span>`)
        elm.find(".nt-editor--reserve-date--content .nt-editor--reserve-date--clear .nt-editor--reserve-date--item-content").append(container.find("input.p-up-novel-input__reserve-clear"))
    }
    elm.find(".nt-editor--main-title").append(container.find("input[name='subtitle']").clone(true).attr("placeholder", "エピソードタイトルを入力…").addClass("nt-check-state"))
    elm.find(".nt-editor--main-novel").append(container.find("textarea[name='novel']").clone(true).attr("placeholder", "本文を入力…").addClass("nt-check-state"))
    elm.find(".nt-editor--preface").append(container.find("textarea[name='preface']").clone(true).attr("placeholder", "前書きを入力…").addClass("nt-check-state"))
    elm.find(".nt-editor--postscript").append(container.find("textarea[name='postscript']").clone(true).attr("placeholder", "後書きを入力…").addClass("nt-check-state"))
    elm.find(".nt-editor--freememo").append(container.find("textarea[name='freememo']").clone(true).attr("placeholder", "フリーメモを入力…").addClass("nt-check-state"))
    elm.find(".c-form__textarea").each(function(){
        var elm = $(this)
        elm.attr("rows", 1)
        const ch = elm.height()
        
        elm.on("input", function(){
            if(ch!==undefined){
                $(this).css("padding-bottom", 0)
                const scroll = $(".nt-editor--body").scrollTop()
                const height = $(".nt-editor--body").get(0)?.scrollHeight
                if(scroll!==undefined && height!==undefined){
                    elm.height(ch)
                    var sh = elm.get(0)?.scrollHeight ?? ch
                    elm.height(sh)

                    var sh = $(".nt-editor--body").get(0)?.scrollHeight ?? height
                    $(".nt-editor--body").scrollTop(scroll + (sh - height))
                    novelPadding($(this))
                }
            }
        })
    })

    // Alerts
    container.find(".c-alert").each(function(){
        elm.find(".nt-editor--body").prepend(
            $(this).addClass(["nt-editor--body-content-banner", "nt-editor--body-content-baner-removable", "nt-editor--footer-tab-content"]).attr("data", 0)
        )
    })

    // Utilities
    /* Unload Warnings */
    let isChanged = false
    elm.find("input,textarea").on("input", function(){
        if(!isChanged && !isEventLocked){
            $(window).on('beforeunload', function (event) {
                event.preventDefault()
            })
            isChanged = true
        }
    })
    container.find("form.c-form").on("submit", function(e){
        if(isChanged){
            $(window).off('beforeunload')
        }
    })

    /* Sidepanel Tabs */
    var selectPanelTab = function(index: number|null){
        if(index!==null){
            $(".nt-panel--tab-item").removeClass("nt-selected")
            $(".nt-panel--tab-content").addClass("nt-content-hidden")
            $(`.nt-panel--tab-item[data='${index}']`).addClass("nt-selected")
            $(`.nt-panel--tab-content[data='${index}']`).removeClass("nt-content-hidden")
        }
    }
    elm.find(".nt-panel--tab-item").on("click", function(){
        const idx = Number($(this).attr("data"))
        if(isFinite(idx)){
            selectPanelTab(idx)
        }
    })

    /* Footer Tabs */
    var savedScrollHeight = [0,0,0,0,0]
    var selectFooterTab = function(index: number|null){
        const prev = getSelectedContent()
        const prevScrollHeight = $(".nt-editor--body").scrollTop()
        if(index!==null && prev!==null && prevScrollHeight!==undefined){
            savedScrollHeight[prev] = prevScrollHeight
            const novelTop = $("textarea[name='novel']").position().top
            const previewTop = $("#nt-preview--novel_honbun").position().top
            $(".nt-editor--footer-tab-item").removeClass("nt-selected")
            $(".nt-editor--footer-tab-content").addClass("nt-content-hidden")
            $(`.nt-editor--footer-tab-item[data='${index}']`).addClass("nt-selected")
            $(`.nt-editor--footer-tab-content[data='${index}']`).removeClass("nt-content-hidden")
            $(`input[name="nt-editor--selected-content"]`).val(index)
    
            // Specific Field
            if(index==0){
                novelPadding($("textarea[name='novel']"))
                isEventLocked = true
                $("textarea[name='novel']").trigger("input")
                isEventLocked = false
            }else if(index==1){
                novelPadding($("textarea[name='preface']"))
                isEventLocked = true
                $("textarea[name='preface']").trigger("input")
                isEventLocked = false
            }else if(index==2){
                novelPadding($("textarea[name='postscript']"))
                isEventLocked = true
                $("textarea[name='postscript']").trigger("input")
                isEventLocked = false
            }else if(index==3){
                novelPadding($("textarea[name='freememo']"))
                isEventLocked = true
                $("textarea[name='freememo']").trigger("input")
                isEventLocked = false
            }else if(index==4){
                showPreview()
            }
    
            // Reset Scrolls
            //$(".nt-editor--body").scrollTop($(".nt-editor--body").get(0).scrollHeight)
            if(prev==0 && index==4){ // novel to preview
                const newPreviewTop = $("#nt-preview--novel_honbun").position().top
                const top = prevScrollHeight - novelTop + newPreviewTop - 20
                $(".nt-editor--body").scrollTop(top)
            }else if(prev==4 && index==0){ // preview to novel
                const newNovelTop = $("textarea[name='novel']").position().top
                const top = prevScrollHeight - previewTop + newNovelTop + 20
                $(".nt-editor--body").scrollTop(top)
            }else if(prev==2 && index==4){ // postscript to preview
                const newPostscriptTop = $("#nt-preview--novel_a").position().top
                const top = newPostscriptTop - 20
                $(".nt-editor--body").scrollTop(top)
            }else{
                $(".nt-editor--body").scrollTop(savedScrollHeight[index])
            }
        }
    }
    elm.find(".nt-editor--footer-tab-item").on("click", function(){
        const idx = Number($(this).attr("data"))
        if(isFinite(idx)){
            selectFooterTab(idx)
        }
    })

    /* Banner (Removable) */
    elm.find(".nt-editor--body-content-banner.nt-editor--body-content-baner-removable").each(function(){
        $(this).append($(`
            <div class="nt-editor--body-content-banner--remove-button">
                <i class="fa-solid fa-xmark"></i>
            </div>
            `).on("click", function(){
                $(this).parent().remove()
            })
        )
    })

    /* API */
    var url = "https://api.syosetu.com/novelapi/api/?out=json&libtype=2&ncode=" + ncode
    /*if(r18){
        url = "https://api.syosetu.com/novel18api/api/?out=json&libtype=2&ncode=" + ncode
    }*/

    const localString = (v: number|undefined, def: string = ""): string => {if(v===undefined){return def}else{return v.toLocaleString()}}
    fetchNovelApi(ncode, false, function(data){
        const box = $("#nt-panel--tab-content--info")
        if(data!=undefined && box.length>0){
            box.find("#novel-title").text(data.title ?? "")
            box.find("#novel-length").text(localString(data.length))
            box.find("#novel-episode-count").text(localString(data.general_all_no))
            box.find("#novel-sasie").text(localString(data.sasie_cnt))
            box.find("#novel-kaiwaritu").text(data.kaiwaritu ?? "-")
            box.find("#novel-global-point").text(localString(data.global_point))
            box.find("#novel-hyoka").text(localString(data.all_point))
            box.find("#novel-hyoka-count").text(localString(data.all_hyoka_cnt))
            box.find("#novel-bookmark").text(localString(data.fav_novel_cnt))
            box.find("#novel-impression").text(localString(data.impression_cnt))
            box.find("#novel-review").text(localString(data.review_cnt))
            box.css("display", "block")
            $("#narou-api-fetch-url").prop("href", url)
        }
    });

    // DOM
    var form = container.find(formElement).clone(true).empty().append(elm)

    $("body > div:first-child").after(form)
    $("body").on("scroll", function(e){
        const s = $(this).scrollTop()
        if(s!==undefined){$(".nt-editor--body-content").scrollTop(s)}
    })
    $(".l-container").remove()

    // Initialize
    selectFooterTab(0)
    selectPanelTab(1)
    setDisplayEvent()
    editorSkinChangeEvent()
    textCount()
    insertUtilities()
    stateCheck()
    freememo()
    if(!$(".nt-editor--reserve-date").hasClass("nt-editor--reserve-date--hidden")){
        reserveDate()
    }
}

function showPreview(){
    function isEmpty(elm: JQuery<HTMLElement>){
        if(elm.get(0)?.innerHTML.match(/^ *$/)){
            elm.append("<br/>")
        }
    }

    // subtitle
    $("#nt-preview--novel_subtitle").empty()
    const subtitle = escapeHtml(`${$(`input[name="subtitle"]`).val() ?? ""}`)
    if(subtitle.length>0){
        $("#nt-preview--novel_subtitle").text(subtitle)
    }else{
        $("#nt-preview--novel_subtitle").append(`<span class="empty">エピソードタイトルを入力するとここに表示されます。</span>`)
    }

    // preface
    $("#nt-preview--novel_p").empty()
    const preface = escapeHtml(`${$(`textarea[name="preface"]`).val() ?? ""}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n'))
    if(preface.length>0){
        $.each(preface.split(/\n/), function(i, text){
            var p = $(`<p id="Lp${i+1}">${convertRubyTags(text, true)}</p>`)
            isEmpty(p)
            $("#nt-preview--novel_p").append(p)
        })
    }else{
        $("#nt-preview--novel_p").append(`<span class="empty">前書きを入力するとここに表示されます。</span>`)
    }

    // honbun
    $("#nt-preview--novel_honbun").empty()
    const honbun = escapeHtml(`${$(`textarea[name="novel"]`).val() ?? ""}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n'))
    if(honbun.length>0){
        $.each(honbun.split(/\n/), function(i, text){
            var p = $(`<p id="L${i+1}">${convertRubyTags(text, true)}</p>`)
            convertSasieTags(p)
            isEmpty(p)
            $("#nt-preview--novel_honbun").append(p)
        })
    }else{
        $("#nt-preview--novel_honbun").append(`<span class="empty">本文を入力するとここに表示されます。</span>`)
    }

    // postscript
    $("#nt-preview--novel_a").empty()
    const postscript = escapeHtml(`${$(`textarea[name="postscript"]`).val() ?? ""}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n'))
    if(postscript.length>0){
        $.each(postscript.split(/\n/), function(i, text){
            var p = $(`<p id="La${i+1}">${convertRubyTags(text, true)}</p>`)
            isEmpty(p)
            $("#nt-preview--novel_a").append(p)
        })
    }else{
        $("#nt-preview--novel_a").append(`<span class="empty">後書きを入力するとここに表示されます。</span>`)
    }

}

function textCount(){
    var countText = function(){
        var text = $("textarea[name='novel']").val()
        $(".nt-editor--textcount").each(function(){
            if(typeof text === "string"){
                const mode = $(this).attr("data")
                var number: string|number
                if(mode=="1"){ //空白・改行含まない
                    number = countCharacters(text, false, false, false);
                }else if(mode=="2"){ //行数
                    number = countLines(text)
                }else if(mode=="3"){ //読了時間（分/数値のみ）
                    number = countTime(text)
                }else if(mode=="4"){ //読了時間（hh時間mm分）
                    number = nt.time.minuteStringJapanese(countTime(text))
                }else if(mode=="5"){ //原稿用紙換算
                    number = countManuscriptPaper(text)
                }else{ //空白・改行含む
                    number = countCharacters(text, true, true, true);
                }

                if(typeof number === "string"){
                    var n = parseInt(number)
                    if(isNaN(n)){
                        $(this).text(0)
                    }else{
                        $(this).text(n.toLocaleString())
                    }
                }else{
                    $(this).text(number)
                }
            }
        })
    }
    $("textarea[name='novel']").on("input", countText)
    countText()
}

export function getSelectedContent(){
    const idx = parseInt(`${$(`input[name="nt-editor--selected-content"]`).val() ?? ""}`)
    if(isNaN(idx)){
        return null
    }else{
        return idx
    }
}

function stateCheck(){
    const state: Array<[string, string, JQuerySelection_Range]> = []
    const maxState = 1000
    let currentState = 0
    const firstState: Record<string, [string, string, JQuerySelection_Range]> = {}
    let isTrashedState = false

    function pushState(value: string, name: string, caret: JQuerySelection_Range){
        if(state.length-1 != currentState){
            state.splice(0, currentState)
            currentState = 0
        }
        state.unshift([value, name, caret])
        if(state.length > maxState){
            state.pop()
            isTrashedState = true
        }
        buttonState()
        
    }

    function restoreState(isFirst?: boolean){
        var value, name, caret
        if(isFirst){
            const lastStateName = state[state.length-1][1]

            value = firstState[lastStateName][0]
            name = firstState[lastStateName][1]
            caret = firstState[lastStateName][2]
            $(`.nt-check-state[name='${name}']`).val(value)
            isEventLocked = true
            $(`.nt-check-state[name='${name}']`).trigger("input")
            isEventLocked = false
            $(`.nt-check-state[name='${name}']`).selection("setPos", caret)
        }else{
            if(state.length>0){
                const appliedState = state[currentState]
                value = appliedState[0]
                name = appliedState[1]
                caret = appliedState[2]

                $(`.nt-check-state[name='${name}']`).val(value)
                isEventLocked = true
                $(`.nt-check-state[name='${name}']`).trigger("input")
                isEventLocked = false
                $(`.nt-check-state[name='${name}']`).selection("setPos", caret)
            }
        }
        buttonState()
    }

    function buttonState(){
        if(state.length>0){
            if(currentState==0){
                $("#nt-editor--panel-redo").prop("disabled", true)
            }else{
                $("#nt-editor--panel-redo").prop("disabled", false)
            }
            if(isTrashedState){
                if(currentState>=state.length-1){
                    $("#nt-editor--panel-undo").prop("disabled", true)
                }else{
                    $("#nt-editor--panel-undo").prop("disabled", false)
                }
            }
            else{
                if(currentState>state.length-1){
                    $("#nt-editor--panel-undo").prop("disabled", true)
                }else{
                    $("#nt-editor--panel-undo").prop("disabled", false)
                }
            }
        }else{
            $("#nt-editor--panel-undo, #nt-editor--panel-redo").prop("disabled", true)
        }
    }

    /* buttons */
    function undoClicked(){
        if(!isTrashedState && state.length==currentState+1){
            currentState += 1
            restoreState(true)
        }else if(state.length > 0 && currentState+1 <= state.length){
            currentState += 1
            restoreState()
        }
    }
    function redoClicked(){
        if(state.length > 0 && currentState-1 >= 0){
            currentState -= 1
            restoreState()
        }
    }
    $("#nt-editor--panel-undo").on("click", function(){
        undoClicked()
    })
    $("#nt-editor--panel-redo").on("click", function(){
        redoClicked()
    })
    $("body").keydown(function(e){
        if ((e.ctrlKey || e.metaKey) && e.key == 'z') {
            e.preventDefault();
            undoClicked()
        }
        else if((e.ctrlKey || e.metaKey) && e.key == 'y') {
            e.preventDefault();
            redoClicked()
        }
    });
    buttonState()

    /* changes */
    $(".nt-check-state").on("compositionstart", function(){
        isEventLocked = true
    })
    $(".nt-check-state").on("compositionend", function(){
        isEventLocked = false
        const value = $(this).val()
        const name = $(this).attr("name")
        if(typeof name == "string" && typeof value == "string"){
            pushState(value, name, $(this).selection("getPos"))
        }
    })
    $(".nt-check-state").on("input", function(){
        if(!isEventLocked){
            const value = $(this).val()
            const name = $(this).attr("name")
            if(typeof name == "string" && typeof value == "string"){
                pushState(value, name, $(this).selection("getPos"))
            }
        }
    })

    /* initial state */
    $(".nt-check-state").each(function(){
        const value = $(this).val()
        const name = $(this).attr("name")
        if(typeof name == "string" && typeof value == "string"){
            firstState[name] = [value, name, $(this).selection("getPos")]
        }
    })
}

function freememo(){
    var s = $("textarea[name='freememo']").val()
    if(typeof s === "string"){
        $("#nt-panel--tab-freememo-field").val(s)
    }

    $("textarea[name='freememo']").on("input", function(){
        var s = $(this).val()
        if(typeof s === "string"){
            $("#nt-panel--tab-freememo-field").val(s)
        }
    })
    $("#nt-panel--tab-freememo-field").on("input", function(){
        var s = $(this).val()
        if(typeof s === "string"){
            $("textarea[name='freememo']").val(s)
        }
    })
}

function reserveDate(){
    var datepicker = $("input[name='reserve_date']")

    $(".nt-editor--reverse-date--date-dummy").attr("data-value", `${datepicker.val() ?? ""}`)
    $(".nt-editor--reverse-date--date-dummy").pickadate({
        monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdaysFull: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
        today: '今日',
        clear: 'クリア',
        close: '閉じる',
        labelMonthNext: '翌月',
        labelMonthPrev: '前月',
        labelMonthSelect: '月を選択',
        labelYearSelect: '年を選択',
        format: 'yyyy/mm/dd',
        min: new Date(),
        onSet: (value)=>{
            if(value.clear!==undefined){
                $("input[name='reserve_date']").val("")
            }else if(value.select!==undefined){
                $("input[name='reserve_date']").val(nt.time.getDateString(new Date(value.select), "/"))
            }
            setDateParam()
        }
    })
    $(".picker").insertBefore(".nt-editor")
    

    $(".nt-editor--reserve-date--header").on("click", function(){
        var parent = $(this).parent()
        if(parent.hasClass("nt-editor--reserve-date--close")){
            parent.removeClass("nt-editor--reserve-date--close")
            parent.addClass("nt-editor--reserve-date--open")
            setDateParam()
        }else{
            parent.removeClass("nt-editor--reserve-date--open")
            parent.addClass("nt-editor--reserve-date--close")
            setDateParam()
        }
    })

    $("input.p-up-novel-input__reserve-clear").click(function(){
        $('input[name="reserve_date"]', formElement).val('');
        $('select[name="reserve_hour"]', formElement).val('');
        $('select[name="reserve_minutes"]', formElement).val('');

        var picker = $('.nt-editor--reverse-date--date-dummy', formElement).pickadate('picker')
        picker.clear()
        setDateParam()
    })

    $(`select[name="reserve_hour"], select[name="reserve_minutes"]`).on("change", function(){
        setDateParam()
    })
    

    function emptyToNull(val: string|string[]|number|undefined): number|null{
        if(typeof val === "string"){
            var v = parseInt(val)
            if(isNaN(v)){
                return null
            }else{
                return v
            }
        }else if(typeof val === "number"){
            if(isNaN(val)){
                return null
            }else{
                return val
            }
        }
        return null
    }

    function setDateParam(){
        var text = "予約掲載："
        var submitButton = $("input#novelmanage")
        submitButton.prop("disabled", false)
        const date = $("input[name='reserve_date']").val()
        const hour = emptyToNull($("select[name='reserve_hour']").val())
        const minutes = emptyToNull($("select[name='reserve_minutes']").val())

        var isDisabled = false

        if(typeof date === "string"){
            if(date.length==0 && hour===null && minutes===null){
                text += "今すぐ公開"
            }else{
                if(date.length==0){
                    text += "----/--/-- "
                    isDisabled = true
                }else{
                    text += date + " "
                }
                if(hour===null){
                    text += "--"
                    isDisabled = true
                }else{
                    text += ('0' + hour).slice(-2)
                }
                if(minutes===null){
                    text += ":--"
                    isDisabled = true
                }else{
                    text += ":" + ('0' + minutes).slice(-2)
                }
    
                if(!isDisabled){
                    if(new Date(`${date} ${hour}:${minutes}:00`)<new Date()){
                        isDisabled = true
                    }
                }
            }
            
            $("#novelmanage").prop("disabled", isDisabled)
            $(".nt-editor--reserve-date--header .nt-editor--reserve-date--header-title").text(text)
        }
    }

    setDateParam()
}

function insertUtilities(){
    _toolRuby()
    _toolRubyDot()
    _toolSasie()

    _toolSearch()
    _toolIndent()
    _toolCovertKakuyomuRubyDot()

    _toolExportEach()
    _toolExportAll()
}

function editorSkinChangeEvent(){
    function _triggerInput(){
        var index = getSelectedContent()
        if(index==0){
            novelPadding($("textarea[name='novel']"))
            isEventLocked = true
            $("textarea[name='novel']").trigger("input")
            isEventLocked = false
        }else if(index==1){
            novelPadding($("textarea[name='preface']"))
            isEventLocked = true
            $("textarea[name='preface']").trigger("input")
            isEventLocked = false
        }else if(index==2){
            novelPadding($("textarea[name='postscript']"))
            isEventLocked = true
            $("textarea[name='postscript']").trigger("input")
            isEventLocked = false
        }else if(index==3){
            novelPadding($("textarea[name='freememo']"))
            isEventLocked = true
            $("textarea[name='freememo']").trigger("input")
            isEventLocked = false
        }else if(index==4){

        }
    }

    chrome.storage.session.onChanged.addListener(function(changes){
        if(changes.workspaceEditorSkinCustomCSS!=undefined){
            if($("#narou-tweaker-style--editor-skin-user").length){
                $("#narou-tweaker-style--editor-skin-user").text(changes.workspaceEditorSkinCustomCSS.newValue)
                _triggerInput()
            }
        }
        if(changes.workspaceEditorFontCustomCSS!=undefined){
            if($("#narou-tweaker-style--font-user").length){
                $("#narou-tweaker-style--editor-font-user").text(changes.workspaceEditorFontCustomCSS.newValue)
                _triggerInput()
            }
        }

        if(changes.workspaceEditorAppliedSkinCSS!=undefined){
            if($("#narou-tweaker-style--editor-skin").length){
                $("#narou-tweaker-style--editor-skin").text(changes.workspaceEditorAppliedSkinCSS.newValue)
                _triggerInput()
            }
        }
        if(changes.workspaceEditorAppliedFontCSS!=undefined){
            if($("#narou-tweaker-style--editor-font").length){
                $("#narou-tweaker-style--editor-font").text(changes.workspaceEditorAppliedFontCSS.newValue)
                _triggerInput()
            }
        }
    })
}

function novelPadding(elm: JQuery<HTMLElement>){
    const top = elm.position().top
    const vh = $("body").height()
    const height = elm.height()
    if(height!==undefined && vh!==undefined && isFinite(top)){
        const diffs = vh - (top + height) - 60 - 110
        if(diffs>0){
            $(elm).css("padding-bottom", diffs)
            $(elm).removeClass("nt-active-padding")
            $(elm).addClass("nt-inactive-padding")
        }else{
            $(elm).css("padding-bottom", 200)
            $(elm).removeClass("nt-inactive-padding")
            $(elm).addClass("nt-active-padding")
        }
    }
    
}