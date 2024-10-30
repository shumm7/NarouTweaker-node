import { FontFamiliesV1, FontFamilyV1, localFont, localFontFamilyV1 } from "../utils/v1_font"
import { nt } from "../utils/narou-tweaker"

export function skinListener(){
    makeSkin()

    nt.storage.local.changed(function(changes){
        if(changes?.skins!=undefined ||
            changes?.selectedSkin!=undefined ||
            changes?.fontSelectedFontFamily!=undefined ||
            changes?.fontFontFamilyList!=undefined ||
            changes?.fontFontSize!=undefined ||
            changes?.fontLineHeight!=undefined ||
            changes?.fontTextRendering!=undefined ||
            changes?.fontWidth!=undefined
        ){
            makeSkin()
        }
        if(changes?.skins!=undefined ||
            changes?.workspaceEditorSelectedSkin!=undefined ||
            changes?.workspaceEditorSelectedFontFamily!=undefined ||
            changes?.workspaceEditorFontFamilyList!=undefined ||
            changes?.workspaceEditorFontSize!=undefined ||
            changes?.workspaceEditorLineHeight!=undefined ||
            changes?.workspaceEditorTextRendering!=undefined ||
            changes?.workspaceEditorWidth!=undefined
        ){
            makeEditorSkin()
        }
    })
}

function makeSkin(){
    nt.storage.local.get().then((data) => {
        const skin_idx: number = data.selectedSkin
        const skins: nt.skin.v1.Skins = nt.skin.v1.localSkins.concat(data.skins)
        const skin: nt.skin.v1.Skin = new nt.skin.v1.Skin(skins[skin_idx])

        var rule = ""

        /* Font */
        const selectedFontFamily: number = data.fontSelectedFontFamily
        var fontFamilyList: FontFamiliesV1 = localFontFamilyV1.concat(data.fontFontFamilyList)
        var fontFamily_Current: string
        var fontCss: nt.text.CSS_String

        if(fontFamilyList.length<=selectedFontFamily || selectedFontFamily<0){
            fontFamily_Current = localFontFamilyV1[0].font
            fontCss = ""
        }else{
            fontFamily_Current = fontFamilyList[selectedFontFamily].font
            fontCss = fontFamilyList[selectedFontFamily].css
        }

        const fontSize = data.fontFontSize + localFont["font-size"]
        const lineHeight = data.fontLineHeight + localFont["line-height"]
        const textRendering = data.fontTextRendering
        const width = localFont["width"] * data.fontWidth
        const outerWidth = width + 130
        const widthRatio = data.fontWidth
        const verticalVh = 20 * (1 - widthRatio) + 5
        rule += `
        .p-novel__text {
            line-height: ${lineHeight}% !important;
            font-size: ${fontSize}% !important;
        }
        body:not(.narou-tweaker-vertical) .p-novel__text {
            max-width: 100vw;
            width: ${width}px;
            margin-right: auto;
            margin-left: auto;
        }
        body:not(.narou-tweaker-vertical) .l-main {
            max-width: 100vw;
            width: ${outerWidth}px;
        }

        html body#container,
        .p-novel {
            font-family: ${fontFamily_Current};
            text-rendering: ${textRendering};
        }
        .narou-tweaker--series #container {
            font-family: ${fontFamily_Current};
            text-rendering: ${textRendering};
        }
        .narou-tweaker .novel-titles#ep-0,
        .narou-tweaker .novel-titles#ep-1 {
            font-family: ${fontFamily_Current};
            text-rendering: ${textRendering};
        
        }
        
        #novel_color,
        .contents1 {
            max-width: 100vw;
            width: calc(max(${width}px, 730px));
        }
        .narou-tweaker-vertical #novel_vertical_items {
            padding-top: ${verticalVh}vh !important;
            padding-bottom: ${verticalVh}vh !important;
        }
        `

        /* Option Modal */
        rule += `
        .novel-option--font-button#current {
            font-family: ${fontFamily_Current};
        }
        `

        nt.storage.session.set({
            novelAppliedSkinCSS: nt.text.minifyCss(nt.skin.v1.makeSkinCSS(skin, data.novelCustomStyle)),
            novelAppliedFontCSS: nt.text.minifyCss(rule),
            novelSkinCustomCSS: nt.text.minifyCss(skin.css),
            novelFontCustomCSS: nt.text.minifyCss(fontCss)
        })
    })
}

function makeEditorSkin(){
    nt.storage.local.get(null).then((data) => {
        let skin_idx: number = data.workspaceEditorSelectedSkin
        const skins: nt.skin.v1.Skins = nt.skin.v1.localSkins.concat(data.skins)
        if(skins.length<skin_idx || skin_idx<0){
            skin_idx = 0
            nt.storage.local.set({workspaceEditorSelectedSkin: skin_idx})
        }
        const skin = skins[skin_idx]
        const s = skin.style
        let skin_rule = ""

        skin_rule += `
        body.narou-tweaker-custom-editor,
        .narou-tweaker-custom-editor .nt-editor .nt-editor--header,
        .narou-tweaker-custom-editor .nt-editor .nt-editor--footer,
        .narou-tweaker-custom-editor .nt-editor--footer .nt-editor--footer-items {
            background-color: ${s.novel.background};
        }
        .narou-tweaker-custom-editor .nt-editor--body,
        .narou-tweaker-custom-editor .nt-editor--main-items,
        .narou-tweaker-custom-editor .nt-editor .nt-editor--header,
        .narou-tweaker-custom-editor .nt-editor .nt-editor--footer,
        .narou-tweaker-custom-editor textarea[name="novel"],
        .narou-tweaker-custom-editor textarea[name="preface"],
        .narou-tweaker-custom-editor textarea[name="postscript"],
        .narou-tweaker-custom-editor textarea[name="freememo"] {
            color: ${s.novel.color};
        }
        .narou-tweaker-custom-editor .nt-editor--footer-textcount .nt-editor--footer-textcount-unit {
            color: ${s.sublist.color};
        }
        .narou-tweaker-custom-editor .nt-editor .nt-editor--header,
        .narou-tweaker-custom-editor .nt-editor .nt-editor--footer {
            border-color: ${s.novel.background_second};
        }
        .narou-tweaker-custom-editor .nt-editor .nt-button {
            border-color: ${s.novel.background_second};
        }
        .narou-tweaker-custom-editor .nt-editor .nt-button:hover,
        .narou-tweaker-custom-editor .nt-editor .nt-editor--footer-tab-item:hover {
            background-color: ${s.novel.background_second};
        }
        .narou-tweaker-custom-editor .nt-editor .nt-button:disabled {
            background-color: ${s.novel.background_second};
            color: ${s.novel.color};
        }
        .narou-tweaker-custom-editor .nt-search-box {
            color: ${s.novel.color};
            background-color: ${s.novel.background_second};
            border-color: ${s.sublist.color};
        }
        .narou-tweaker-custom-editor .nt-search-box--field-dummy-outer,
        .narou-tweaker-custom-editor .nt-search-box--field {
            background-color: ${s.novel.background};
            border-color: ${s.sublist.color};
        }
        `

        const selectedFontFamily: number = data.workspaceEditorSelectedFontFamily ?? 0
        const fontFamilyList: FontFamiliesV1 = localFontFamilyV1.concat(data.fontFontFamilyList ?? [])
        var fontFamily_Current: string
        var fontCss: nt.text.CSS_String

        if(fontFamilyList.length<=selectedFontFamily || selectedFontFamily<0){
            fontFamily_Current = localFontFamilyV1[0].font
            fontCss = ""
        }else{
            fontFamily_Current = fontFamilyList[selectedFontFamily].font
            fontCss = fontFamilyList[selectedFontFamily].css
        }

        const fontSize = data.workspaceEditorFontSize + localFont["font-size"]
        const lineHeight = data.workspaceEditorLineHeight + localFont["line-height"]
        const textRendering = data.workspaceEditorTextRendering
        const width = localFont["width"] * data.workspaceEditorWidth
        const widthRatio = data.workspaceEditorWidth
        let font_rule = ""

        font_rule += `
        .narou-tweaker-custom-editor .nt-editor .nt-editor--body {
            text-rendering: ${textRendering};
            font-family: ${fontFamily_Current};
        }
        .narou-tweaker-custom-editor textarea[name="novel"],
        .narou-tweaker-custom-editor textarea[name="preface"],
        .narou-tweaker-custom-editor textarea[name="postscript"],
        .narou-tweaker-custom-editor textarea[name="freememo"] {
            line-height: ${lineHeight}% !important;
            width: ${width}px;
            max-width: 100%;
        }
        .narou-tweaker-custom-editor .nt-editor--main-novel,
        .narou-tweaker-custom-editor .nt-editor--preface,
        .narou-tweaker-custom-editor .nt-editor--postscript,
        .narou-tweaker-custom-editor .nt-editor--freememo {
            max-width: 100% !important;
            width: ${width}px;
            line-height: ${lineHeight}% !important;
            font-size: ${fontSize}% !important;
        }
        `

        nt.storage.session.set({
            workspaceEditorAppliedSkinCSS: nt.text.minifyCss(skin_rule),
            workspaceEditorAppliedFontCSS: nt.text.minifyCss(font_rule),
            workspaceEditorSkinCustomCSS: nt.text.minifyCss(skin.css),
            workspaceEditorFontCustomCSS: nt.text.minifyCss(fontCss)
        })
    })
}