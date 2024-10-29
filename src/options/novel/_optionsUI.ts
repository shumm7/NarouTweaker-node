import { OptionHideParammeters } from "../_utils/optionUI_type"
const oh = OptionHideParammeters

export const OptionUI_CustomElement_novel: Record<string,string> = {
    ui_novelCustomHeaderDraggable: `
        <div class="draggable_area_container" id="novel_header_icon">
            <div class="draggable_area_outer">
                <div class="title option-hide option-hide--force-hide" ${oh.key}="novelCustomHeaderType" ${oh.value}="2">左</div>
                <div class="title option-hide option-hide--force-hide" ${oh.key}="novelCustomHeaderType novelCustomHeaderType" ${oh.value}="0 1" ${oh.logic}="and">上部</div>
                <div class="draggable_area" id="left" name="novel-header"></div>
            </div>
            <div class="draggable_area_outer">
                <div class="title option-hide option-hide--force-hide" ${oh.key}="novelCustomHeaderType" ${oh.value}="2">右</div>
                <div class="title option-hide option-hide--force-hide" ${oh.key}="novelCustomHeaderType novelCustomHeaderType" ${oh.value}="0 1" ${oh.logic}="and">下部</div>
                <div class="draggable_area" id="right" name="novel-header"></div>
            </div>
            <div class="draggable_area_outer">
                <div class="title">非表示</div>
                <div class="draggable_area" id="disabled" name="novel-header"></div>
            </div>
        </div>
    `,

    ui_novelSkinSelect: `
        <div id="novel-skins">
            <div id="novel-skins--controll">
                <div id="novel-skins--controll-buttons">
                    <div class="novel-skins--controll-button" id="novel-skins--controll-edit" title="編集"><i class="fa-solid fa-pen"></i></div>
                    <div class="novel-skins--controll-button" id="novel-skins--controll-clone" title="複製"><i class="fa-regular fa-clone"></i></div>
                    <div class="novel-skins--controll-button" id="novel-skins--controll-remove" title="削除"><i class="fa-solid fa-trash"></i></div>
                </div>
            </div>
            <div id="novel-skins--lists">
                <div class="novel-skins--list" id="novel-skins--list-available"></div>
                <div class="novel-skins--list" id="novel-skins--list-unavailable"></div>
            </div>
            <button class="button" id="novel-skins--controll-select" type="button">選択中のスキンを適用</button>

        </div>
    `,

    ui_novelSkinExportButtons: `
        <div id="skin-export">
            <div id="skin-export-buttons">
                <button id="skin-export-json" type="button" class="button"><i class="fa-solid fa-download"></i> JSONファイル</button>
                <button id="skin-export-text" type="button" class="button"><i class="fa-solid fa-align-left"></i> テキスト</button>
            </div>
            <div id="skin-export-output" style="display: none;" >
                <textarea class="textarea syntax-highlight autoselect" id="skin-export-output--field" readonly data="json"></textarea>
            </div>
        </div>
    `,

    ui_novelSkinImportButtons: `
        <div id="skin-import">
            <div id="skin-import-buttons">
                <label id="import-options-label">
                    <i class="fa-solid fa-upload"></i> ファイルから読み込む
                    <input id="skin-import-json" type="file" accept="application/json">
                </label>
            </div>
            <div id="skin-import-input">
                <textarea class="textarea syntax-highlight" id="skin-import-input--field" placeholder="ファイルをドロップ" data="json"></textarea>
                <button id="skin-import-input--submit" type="button" class="button"><i class="fa-solid fa-file-import"></i> 取り込む</button>
            </div>
            <div id="skin-import-warnings">
            </div>
        </div>
    `,

    ui_novelAuthorCustomSkinGenerator: `
        <div id="skin-author">
            <div id="skin-author-description">
                <p>
                    このバナーを貼り付けると、作者側で小説のスキンを指定することができます。<br>
                    ただし「作者設定スキン」を有効にしたNarou Tweakerユーザーにしか影響しません。
                </p>
            </div>
            <div id="skin-author-inputs">
                <div class="dropdown">
                    <select id="skin-author-export--type">
                        <option value="tiny-light">極小（ライト）</option>
                        <option value="small-light">小（ライト）</option>
                        <option value="medium-light">中（ライト）</option>
                        <option value="big-light">大（ライト）</option>
                        <option value="tiny-dark">極小（ダーク）</option>
                        <option value="small-dark">小（ダーク）</option>
                        <option value="medium-dark">中（ダーク）</option>
                        <option value="big-dark">大 （ダーク）</option>
                    </select>
                </div>
                <button id="skin-author-export--submit" type="button" class="button">バナーを生成</button>
            </div>
            <div id="skin-author-export">
                <textarea class="textarea syntax-highlight autoselect" id="skin-author-export--field" readonly data="xml"></textarea>
                <p>このコードをランキングタグへコピーしてください。</p>
            </div>
        </div>
    `,

    ui_novelFontSelect: `
        <div class="contents-option-head">
            <div class="contents-item--heading"></div>
            <div class="skin-option--preview">
                <div class="skin-preview">
                    <p>　この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。</p>
                    <p>　Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <div style="height: 1em;"></div>
                    <div id="subtitle-dummy">
                        <div id="link">1.目次テスト</div>
                        <div id="link-visited">2.訪問済み</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="contents-option-content" style="align-items: flex-start;">
            <div id="font-family" class="section" style="padding: 1em; width: 100%;">
                <div id="font-family-selection">
                    <div id="font-family-selection--dropdown">
                        <div class="dropdown">
                            <select id="font-family-dropdown" name="font-family"></select>
                        </div>
                    </div>
                    <div id="font-family-selection--buttons" style="margin-left: 2em;">
                        <button name="new" type="button" class="button">＋</button>
                    </div>
                </div>
                <div id="font-family-option--buttons">
                    <!--<button name="save" type="button" class="button">保存</button>-->
                    <button name="copy" type="button" class="button">複製</button>
                    <button name="delete" type="button" class="button">削除</button>
                    <span id="font-family-option--editting"></span>
                </div>

                <div id="font-family-option--options">
                    <div id="font-family-option--field">
                        <div style="margin-bottom: 1em;">
                            <div class="textfield">
                                <label for="#font-name">名前</label>
                                <input name="font-name" class="option-font" type="text" id="font-name"></input>
                            </div>
                            <div class="textfield">
                                <label for="#font-description">概要</label>
                                <input name="font-description" class="option-font" type="text" id="font-description"></input>
                            </div>
                            <div class="font-detail">
                                <label for="#font-data">フォント設定</label>
                                <textarea class="option-font textarea font-option-field" id="font-data" name="font-data"></textarea>
                            </div>
                            <div class="textfield">
                                <label for="#font-css">追加CSS</label>
                                <textarea class="option-font textarea font-option-field syntax-highlight" id="font-css" name="font-css" style="height: 80px;" disabled data="css"></textarea>
                            </div>
                            <div class="textfield">
                                <label for="#font-license">ライセンス表示</label>
                                <textarea class="option-font textarea font-option-field" id="font-license" name="font-license" style="height: 80px;" disabled></textarea>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,

    ui_novelFontSizeInput: `
        <div id="font-size">
            <div style="margin: 0 .5em;">+</div>
            <div class="font-number-change-button" id="font-size-minus">-</div>
            <input name="fontFontSize" type="text" id="font-size-input">
            <div class="font-number-change-button" id="font-size-plus">+</div>
            <div style="margin: 0 .5em;">%</div>
        </div>
    `,

    ui_novelFontLineHeightInput: `
        <div id="line-height">
            <div style="margin: 0 .5em;">+</div>
            <div class="font-number-change-button" id="line-height-minus">-</div>
            <input name="fontLineHeight" type="text" id="line-height-input">
            <div class="font-number-change-button" id="line-height-plus">+</div>
            <div style="margin: 0 .5em;">%</div>
        </div>
    `,

    ui_novelFontWidthInput: `
        <div id="page-width">
            <div style="margin: 0 .5em;">×</div>
            <div class="font-number-change-button" id="page-width-minus">-</div>
            <input name="fontWidth" type="text" id="page-width-input">
            <div class="font-number-change-button" id="page-width-plus">+</div>
            <div style="margin: 0 .5em;">%</div>
        </div>
    `,

    ui_correctionReplacePatternList: `
        <div class="contents-option-head">
            <div class="contents-item--heading"></div>
            <div class="contents-item--description"></div>
        </div>
        <div class="contents-option-content" style="width: 100%; flex-shrink: 0; align-items: flex-start;">
            <div id="correction-replace--patterns">
                <div id="correction-replace--pattern-box-addition">
                    <i class="fa-solid fa-plus"></i>
                </div>
            </div>
        </div>
    `,
}