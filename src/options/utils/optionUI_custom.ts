import { OptionUI_CustomElement_general } from "../general/_optionsUI"
import { OptionUI_CustomElement_novel } from "../novel/_optionsUI"
import { OptionUI_CustomElement_workspace } from "../workspace/_optionsUI"

type OptionUI_Custom = Record<string,string>

export const OptionUI_CustomElement: OptionUI_Custom = {
    ui_extSearchBox: `
        <div id="search-box-outer">
            <div id="search-box--text">
                <input type="text" id="search-box">
            </div>
            <div id="search-box--suggestion">
                <div class="search-box--suggestion-item"></div>
            </div>
            <!--
            <div id="search-box--params">
                <div class="search-box--param-item">
                    <input type="checkbox" class="search-target" id="search-target--title" checked>
                    <label for="search-target--title">タイトル</label>
                </div>
                <div class="search-box--param-item">
                    <input type="checkbox" class="search-target" id="search-target--description" checked>
                    <label for="search-target--description">説明</label>
                </div>
                <div class="search-box--param-item">
                    <input type="checkbox" class="search-target" id="search-target--keyword" checked>
                    <label for="search-target--description">キーワード</label>
                </div>
            </div>
            -->
        </div>
    `,

    ... OptionUI_CustomElement_general,
    ... OptionUI_CustomElement_novel,
    ... OptionUI_CustomElement_workspace,
}