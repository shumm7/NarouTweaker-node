import { check } from "../../utils/misc"
import { correction, restoreCorrectionMode } from "./_correction";
import { nt } from "../../utils/narou-tweaker";

import $ from 'jquery';

export function _optionModal(){
    try{
        /* Option Modal */
        $("body").prepend("<aside id='novel-option'></aside>")
        $("#novel-option").before("<div id='novel-option-background'></div>")
        $("#novel-option").append("<div id='novel-option--header'></div>")
        $("#novel-option").append("<div id='novel-option--contents'></div>")
        
        $("#novel-option-background").on("click", ()=>{
            if($("#novel-option").hasClass("show")){
                $("#novel-option").removeClass("show")
            }else{
                $("#novel-option").addClass("show")
            }
            if($("#novel-option-background").hasClass("show")){
                $("#novel-option-background").removeClass("show")
            }else{
                $("#novel-option-background").addClass("show")
            }
        })

        /* Modal Header */
        $("#novel-option--header").append("<ul></ul>")
        function addTab(index: number, title: string){
            $("#novel-option--header ul").append("<li class='novel-option--header-tab novel-option-tab-"+index+"'><button type='button'><span class='novel-option--header-tab'>"+title+"</span></button></li>")
            $("#novel-option--contents").append("<div class='novel-option--content novel-option-tab-"+index+"'></div>")
            $(".novel-option--header-tab.novel-option-tab-"+index+" button").on("click", ()=>{
                nt.storage.session.set("novelOptionModalSelected", index).then(function(){
                    $("#novel-option .novel-option--header-tab").removeClass("active")
                    $("#novel-option .novel-option--content").removeClass("active")
                    $("#novel-option .novel-option-tab-" + index).addClass("active")
                })
            })
        }

        addTab(0, "表示")
        setOptionContentsDisplay(0)

        addTab(1, "文章校正")
        setOptionContentsCorrection(1)

        //addTab(2, "統計")
        
        if($(".novelrankingtag a:has(img[alt='Narou Tweaker 作者スキン'])").length){
            addTab(99, "作者スキン")
            setOptionContentsAuthorSkin(99)
        }
        
        const scrollElement = document.querySelector("#novel-option--contents");
        if(scrollElement!=null){
            scrollElement.addEventListener("wheel", (e: any) => {
                const deltaY = e.deltaY
                if(deltaY!==undefined){
                    e.preventDefault();
                    scrollElement.scrollTop += e.deltaY;
                }
            });
        }

        nt.storage.session.get("novelOptionModalSelected").then(function(data){
            var tab = $("#novel-option .novel-option-tab-"+data.novelOptionModalSelected)
            if(tab.length){
                tab.addClass("active")
            }else{
                nt.storage.session.set("novelOptionModalSelected", 0).then(function(){
                    $("#novel-option .novel-option-tab-0").addClass("active")
                })
            }
        })
    }catch(e){
        console.warn(e)
    }

}

/* スキン設定のドロップダウンを設定 */
function restoreSkinOptions(skins: nt.skin.v1.Skins, selected: number){
    skins = nt.skin.v1.localSkins.concat(skins)

    $("#novel-option--skin #skin").empty()
    $.each(skins, function(i, skin){
        if(skin.show==true){
            $("#novel-option--skin #skin").append(`<option value="${i}">${nt.text.escapeHtml(skin.name)}</option>`)
        }
    })
    $("#skin").val(String(selected))
    $("#novel-option--skin-description").text((skins[selected] ?? new nt.skin.v1.Skin())?.description)
}

/* フォント設定 */
function restoreFontOptions(){
    nt.storage.local.get(null).then((data)=>{
        var fontlist = nt.font.v1.localFontFamily.concat(data.fontFontFamilyList)

        $("#novel-option--font-family #font-family").empty()
        $.each(fontlist, function(i, font){
            if(font.show==true){
                var opt = $(`<option value="${i}">${font.name}</option>`)
                opt.css("font-family", font.font)
                $("#novel-option--font-family #font-family").append(opt)
            }
        })
        const selected = data.fontSelectedFontFamily
        $("#novel-option--font-family #font-family").val(`${selected}`)
        $("#novel-option--font-family-description").text(fontlist[selected].description)
        $("#novel-option--font-family #font-family").css("font-family", fontlist[selected].font)
        $("#novel-option--font-family-sample").css("font-family", fontlist[selected].font)

        var fSize = data.fontFontSize
        if(fSize>0) {
            $("#novel-option--font-size-input").val(`+${fSize}`)
        }else{
            $("#novel-option--font-size-input").val(`${fSize}`)
        }
        
        var lHeight = data.fontLineHeight
        if(lHeight>0) {
            $("#novel-option--line-height-input").val(`+${lHeight}`)
        }else{
            $("#novel-option--line-height-input").val(`${lHeight}`)
        }

        var pWidth = data.fontWidth
        $("#novel-option--page-width-input").val(Number((pWidth * 100).toFixed(1)))

        check("#novel-option--vertical-toggle", data.novelVertical)
    })
}

function setOptionContentsDisplay(id: number){
    nt.storage.local.get(null).then((data) => {
        var outer = $(".novel-option--content.novel-option-tab-"+id)

        /* Skin */
        outer.append(`
            <div class='novel-option--content-inner' id='option-skin'>
                <div class='novel-option-header'>スキン</div>
                <div id="novel-option--skin">
                    <div class="dropdown" style="width: 100%;">
                        <select id="skin" name="skin"></select>
                    </div>
                </div>
                <div id="novel-option--skin-description"></div>
            </div>
        `)
        restoreSkinOptions(data.skins, data.selectedSkin)

        $("#novel-option--skin #skin").on("change",() => {
            var v = $("#skin").val()
            if(typeof v === "string"){
                var n = Number(v)
                if(!isNaN(n)){
                    nt.storage.local.set("selectedSkin", n)
                }
            }
        })

        /* Font */
        outer.append(`
            <div class='novel-option--content-inner' id='option-font'>
                <div class='novel-option-header'>本文</div>
                <div id="novel-option--text">
                    <div class='novel-option-subheader'>フォント</div>
                        <div id="novel-option--font-family">
                            <div class="dropdown" style="width: 100%;">
                                <select id="font-family" name="font-family"></select>
                            </div>
                        </div>
                        <div id="novel-option--font-family-description"></div>
                        <div id="novel-option--font-family-sample">
                            あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
                        </div>
                    <div class='novel-option-subheader'>縦書き</div>
                        <div id="novel-option--vertical" style="padding: 10px 0;">
                            <input type="checkbox" id="novel-option--vertical-toggle" class="toggle" name="novelVertical">
                            <label for="novel-option--vertical-toggle" class="toggle">縦書き表示<span style="font-size: 90%"></span></label>
                        </div>
                    <div class='novel-option-subheader'>サイズ</div>
                        <div id="novel-option--font-size">
                            <div style="margin: 0 .5em;">+</div>
                            <div class="novel-option--font-number-change-button" id="novel-option--font-size-minus">-</div>
                            <input name="fontFontSize" class="novel-option--textfield" type="text" id="novel-option--font-size-input">
                            <div class="novel-option--font-number-change-button" id="novel-option--font-size-plus">+</div>
                            <div style="margin: 0 .5em;">%</div>
                        </div>
                    <div class='novel-option-subheader'>行間</div>
                        <div id="novel-option--line-height">
                            <div style="margin: 0 .5em;">+</div>
                            <div class="novel-option--font-number-change-button" id="novel-option--line-height-minus">-</div>
                            <input name="fontLineHeight" class="novel-option--textfield" type="text" id="novel-option--line-height-input">
                            <div class="novel-option--font-number-change-button" id="novel-option--line-height-plus">+</div>
                            <div style="margin: 0 .5em;">%</div>
                        </div>
                    <div class='novel-option-subheader'>横幅</div>
                        <div id="novel-option--page-width">
                            <div style="margin: 0 .5em;">×</div>
                            <div class="novel-option--font-number-change-button" id="novel-option--page-width-minus">-</div>
                            <input name="fontWidth" class="novel-option--textfield" type="text" id="novel-option--page-width-input">
                            <div class="novel-option--font-number-change-button" id="novel-option--page-width-plus">+</div>
                            <div style="margin: 0 .5em;">%</div>
                        </div>
                    </div>
            </div>
        `)
        restoreFontOptions()

        /* Font Family */
        /*
        $(".novel-option--font-button-box").click(function() {
            const key = $(this).parent().prop("id")
            $(".novel-option--font-button.active").removeClass("active")
            $(this).parent().addClass("active")

            nt.storage.local.set({fontFontFamily: key}, () => {})
        })
        */
        $("#novel-option--font-family #font-family").on("change",() => {
            var v = $("#novel-option--font-family #font-family").val()
            if(typeof v === "string"){
                var n = Number(v)
                if(!isNaN(n)){
                    nt.storage.local.set({fontSelectedFontFamily: n})
                }
            }
        })

        /* Vertical */
        $("#novel-option--vertical-toggle").on("click", function(){
            nt.storage.local.set({novelVertical: $(this).prop("checked")})
        })

        /* Font Size */
        function setFontSizeValue(value: number){
            if(nt.font.v1.localFont["font-size"] + value < 50){
                value = 50 - nt.font.v1.localFont["font-size"]
            }else if(nt.font.v1.localFont["font-size"] + value > 300){
                value = 300 - nt.font.v1.localFont["font-size"]
            }
            if(value>0){
                $("#novel-option--font-size-input").val("+" + value)
            }else{
                $("#novel-option--font-size-input").val(value)
            }

            nt.storage.local.set({fontFontSize: Number(value)})
        }

        $("#novel-option--font-size-minus").click(function(){
            var value = Number($("#novel-option--font-size-input").val())
            if(isNaN(value)){
                value = 0
            }else{
                value = Math.floor(value) - (10 - Math.abs(Math.floor(value) % 10))
            }
            
            setFontSizeValue(value)
        })
        $("#novel-option--font-size-plus").click(function(){
            var value = Number($("#novel-option--font-size-input").val())
            if(isNaN(value)){
                value = 0
            }else{
                value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
            }
            setFontSizeValue(value)
        })
        $("#novel-option--font-size-input").change(function(){
            var value = Number($("#novel-option--font-size-input").val())
            if(isNaN(value)){
                value = 0
            }
            setFontSizeValue(value)
        })

        /* Line Height */
        function setLineHeightValue(value: number){
            if(nt.font.v1.localFont["line-height"] + value < 50){
                value = 50 - nt.font.v1.localFont["line-height"]
            }else if(nt.font.v1.localFont["line-height"] + value > 300){
                value = 300 - nt.font.v1.localFont["line-height"]
            }
            if(value>0){
                $("#novel-option--line-height-input").val("+" + value)
            }else{
                $("#novel-option--line-height-input").val(value)
            }

            nt.storage.local.set({fontLineHeight: Number(value)})
        }

        $("#novel-option--line-height-minus").click(function(){
            var value = Number($("#novel-option--line-height-input").val())
            if(isNaN(value)){
                value = 0
            }else{
                value = Math.floor(value) - (10 - Math.abs(Math.floor(value) % 10))
            }
            
            setLineHeightValue(value)
        })
        $("#novel-option--line-height-plus").click(function(){
            var value = Number($("#novel-option--line-height-input").val())
            if(isNaN(value)){
                value = 0
            }else{
                value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
            }
            setLineHeightValue(value)
        })
        $("#novel-option--line-height-input").change(function(){
            var value = Number($("#novel-option--line-height-input").val())
            if(isNaN(value)){
                value = 0
            }
            setLineHeightValue(value)
        })

        /* Width */
        function setWidthValue(value: number){
            if(value < 0){
                value = 0
            }else if(value > 1000){
                value = 100
            }
            $("#novel-option--page-width-input").val(value)

            nt.storage.local.set({fontWidth: Number(value)/100})
        }

        $("#novel-option--page-width-minus").click(function(){
            var value = Number($("#novel-option--page-width-input").val())
            if(isNaN(value)){
                value = 0
            }else{
                value = Math.floor(value) - (10 - Math.abs(Math.floor(value) % 10))
            }
            
            setWidthValue(value)
        })
        $("#novel-option--page-width-plus").click(function(){
            var value = Number($("#novel-option--page-width-input").val())
            if(isNaN(value)){
                value = 0
            }else{
                value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
            }
            setWidthValue(value)
        })
        $("#novel-option--page-width-input").change(function(){
            var value = Number($("#novel-option--page-width-input").val())
            if(isNaN(value)){
                value = 0
            }
            setWidthValue(value)
        })


        /* Header */
        outer.append(`
            <div class='novel-option--content-inner' id='option-header'>
                <div class='novel-option-header'>ヘッダ</div>
                <div class='novel-option-subheader'>追従モード</div>
                <div id="novel-option--header-scroll-mode">
                    <div class="dropdown" style="width: 100%;">
                        <select id="novelCustomHeaderMode">
                            <option value="absolute">上部</option>
                            <option value="fixed">追従</option>
                            <option value="scroll">スクロール</option>
                        </select>
                    </div>
                </div>
            </div>
        `)
        nt.storage.local.get("novelCustomHeaderMode").then((data)=>{
            $("#novelCustomHeaderMode").val(data.novelCustomHeaderMode)
        })
        $("#novelCustomHeaderMode").change(function(){
            nt.storage.local.set({novelCustomHeaderMode: $("#novelCustomHeaderMode").val()})
        })
    })


    /* Storage Listener */
    nt.storage.local.changed(function(changes){
        if(
            changes?.fontSelectedFontFamily!=undefined ||
            changes?.fontFontFamilyList!=undefined ||
            changes?.fontFontSize!=undefined ||
            changes?.fontLineHeight!=undefined ||
            changes?.fontTextRendering!=undefined ||
            changes?.fontWidth!=undefined ||
            changes?.novelVertical!=undefined
        ){
            restoreFontOptions()
        }
        if(changes?.skins!=undefined || changes?.selectedSkin!=undefined){
            nt.storage.local.get(["skins", "selectedSkin"]).then((data)=>{
                restoreSkinOptions(data.skins, data.selectedSkin)
            })
        }

        if(changes?.novelVertical!==undefined){
            location.reload()
        }
    })
}

/* 文章校正 */
function restoreReplacePattern(){
    nt.storage.local.get("correctionReplacePatterns").then(function(data){
        var elementsAmount = $(".novel-option--correction-replace--pattern-box").length
        var listLength = data.correctionReplacePatterns.length
        if(listLength<elementsAmount){
            for(var i=0; i<(elementsAmount-listLength); i++){
                var idx = listLength + i
                $(".novel-option--correction-replace--pattern-box[data-for='"+idx+"']").remove()
            }
        }

        $.each(data.correctionReplacePatterns, function(idx, pattern){
            var box = $(`.novel-option--correction-replace--pattern-box[data-for="${idx}"]`)
            if(!box.length){
                $("#novel-option--correction-replace--patterns").append(`
                    <div class="novel-option--correction-replace--pattern-box" data-for="${idx}">
                    <div class="novel-option--correction-replace--index">${idx+1}</div>
                        <div class="novel-option--correction-replace--move-buttons">
                            <div class="novel-option--correction-replace--move-front novel-option--correction-replace--icons"><i class="fa-solid fa-sort-up"></i></div>
                            <div class="novel-option--correction-replace--move-back novel-option--correction-replace--icons"><i class="fa-solid fa-sort-down"></i></div>
                        </div>
                        <div class="novel-option--correction-replace--active-button novel-option--correction-replace--icons"><i class="fa-solid fa-circle"></i></div>
                        <div class="novel-option--correction-replace--fields">
                            <input class="novel-option--correction-replace--pattern" type="text">
                            <span><i class="fa-solid fa-angles-right"></i></span>
                            <input class="novel-option--correction-replace--replacement" type="text">
                        </div>
                        <div class="novel-option--correction-replace--regex-button novel-option--correction-replace--icons"><i class="fa-solid fa-asterisk"></i></div>
                        <div class="novel-option--correction-replace--remove-button novel-option--correction-replace--icons"><i class="fa-solid fa-trash"></i></div>
                    </div>
                `)
                box = $(`.novel-option--correction-replace--pattern-box[data-for="${idx}"]`)
            }

            box.find(".novel-option--correction-replace--pattern").val(pattern.pattern)
            box.find(".novel-option--correction-replace--replacement").val(pattern.replacement)
            if(pattern.regex){
                box.find(".novel-option--correction-replace--regex-button").addClass("enabled")
            }else{
                box.find(".novel-option--correction-replace--regex-button").removeClass("enabled")
            }
            if(pattern.active){
                box.find(".novel-option--correction-replace--active-button").addClass("enabled")
            }else{
                box.find(".novel-option--correction-replace--active-button").removeClass("enabled")
            }
        })

        /* Events */
        $(".novel-option--correction-replace--pattern-box .novel-option--correction-replace--move-front").on("click", function(){ // Up Button
            var idx = Number($(this).parent().parent().attr("data-for"))
            if(!isNaN(idx)){
                nt.storage.local.get("correctionReplacePatterns").then(function(data){
                    var patterns = data.correctionReplacePatterns
                    if(idx>0){
                        [patterns[idx], patterns[idx-1]] = [patterns[idx-1], patterns[idx]]
                        nt.storage.local.set({correctionReplacePatterns: patterns})
    
                    }
                })
            }
        })
        $(".novel-option--correction-replace--pattern-box .novel-option--correction-replace--move-back").on("click", function(){ // Down Button
            var idx = Number($(this).parent().parent().attr("data-for"))
            if(!isNaN(idx)){
                nt.storage.local.get(["correctionReplacePatterns"]).then(function(data){
                    var patterns = data.correctionReplacePatterns
                    if(idx<patterns.length-1){
                        [patterns[idx], patterns[idx+1]] = [patterns[idx+1], patterns[idx]]
                        nt.storage.local.set({correctionReplacePatterns: patterns})
                    }
                })
            }
        })
        $(".novel-option--correction-replace--pattern-box .novel-option--correction-replace--regex-button").on("click", function(){ // Regex Button
            var idx = Number($(this).parent().attr("data-for"))
            var elm = $(this)
            if(!isNaN(idx)){
                nt.storage.local.get(["correctionReplacePatterns"]).then(function(data){
                    var patterns = data.correctionReplacePatterns
                    if(elm.hasClass("enabled")){
                        patterns[idx].regex = false
                    }else{
                        patterns[idx].regex = true
                    }
                    nt.storage.local.set({correctionReplacePatterns: patterns})
                })
            }
        })
        $(".novel-option--correction-replace--pattern-box .novel-option--correction-replace--active-button").on("click", function(){ // Active Button
            var idx = Number($(this).parent().attr("data-for"))
            var elm = $(this)
            if(!isNaN(idx)){
                nt.storage.local.get(["correctionReplacePatterns"]).then(function(data){
                    var patterns = data.correctionReplacePatterns
                    if(elm.hasClass("enabled")){
                        patterns[idx].active = false
                    }else{
                        patterns[idx].active = true
                    }
                    nt.storage.local.set({correctionReplacePatterns: patterns})
                })
            }
        })
        $(".novel-option--correction-replace--pattern-box .novel-option--correction-replace--remove-button").on("click", function(){ // Trash Button
            var idx = Number($(this).parent().attr("data-for"))
            if(!isNaN(idx)){
                nt.storage.local.get(["correctionReplacePatterns"]).then(function(data){
                    var patterns = data.correctionReplacePatterns
                    patterns.splice(idx, 1)
                    nt.storage.local.set({correctionReplacePatterns: patterns})
                })
            }
        })
        $(".novel-option--correction-replace--pattern-box .novel-option--correction-replace--pattern").on("change", function(){ // Pattern Fields
            var idx = Number($(this).parent().parent().attr("data-for"))
            var value = $(this).val()
            if(!isNaN(idx)){
                nt.storage.local.get(["correctionReplacePatterns"]).then(function(data){
                    var patterns = data.correctionReplacePatterns
                    if(patterns.length > idx && typeof value=="string"){
                        patterns[idx].pattern = value
                        nt.storage.local.set({correctionReplacePatterns: patterns})
                    }
                })
            }
        })
        $(".novel-option--correction-replace--pattern-box .novel-option--correction-replace--replacement").on("change", function(){ // Replacement Fields
            var idx = Number($(this).parent().parent().attr("data-for"))
            var value = $(this).val()
            if(!isNaN(idx)){
                nt.storage.local.get(["correctionReplacePatterns"]).then(function(data){
                    var patterns = data.correctionReplacePatterns
                    if(patterns.length > idx && typeof value=="string"){
                        patterns[idx].replacement = value
                        nt.storage.local.set({correctionReplacePatterns: patterns})
                    }
                })
            }
        })
    })
}

function setOptionContentsCorrection(id: number){
    var outer = $(".novel-option--content.novel-option-tab-"+id)

    outer.append(`
        <div class='novel-option--content-inner' id='option-correction' style='margin-bottom: 100px;'>
        
            <div class='novel-option-header'>文法</div>
            <div id="novel-option--correction-syntax">
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-indent" class="correction_mode toggle" name="correctionIndent">
                    <label for="novel-option--correction-indent" class="toggle">段落下げ</label>
                </div>
            </div>

            <div class='novel-option-header'>記号</div>
            <div id="novel-option--correction-symbols">
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-normalize-ellipses" class="correction_mode toggle" name="correctionNormalizeEllipses">
                    <label for="novel-option--correction-normalize-ellipses" class="toggle">三点リーダーを修正（・・・）</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-normalize-dash" class="correction_mode toggle" name="correctionNormalizeDash">
                    <label for="novel-option--correction-normalize-dash" class="toggle">ダッシュを修正（――）</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-normalize-exclamation" class="correction_mode toggle" name="correctionNormalizeExclamation">
                    <label for="novel-option--correction-normalize-exclamation" class="toggle">感嘆符を修正（！？）</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-repeated-symbols" class="correction_mode toggle" name="correctionRepeatedSymbols">
                    <label for="novel-option--correction-repeated-symbols" class="toggle">句読点の連続（、、）</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-period-with-brackets" class="correction_mode toggle" name="correctionPeriodWithBrackets">
                    <label for="novel-option--correction-period-with-brackets" class="toggle">括弧の後の句点（。」）</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-no-space-exclamation" class="correction_mode toggle" name="correctionNoSpaceExclamation">
                    <label for="novel-option--correction-no-space-exclamation" class="toggle">後ろに空白の無い感嘆符</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-odd-ellipses" class="correction_mode toggle" name="correctionOddEllipses">
                    <label for="novel-option--correction-odd-ellipses" class="toggle">奇数の三点リーダー</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-odd-dash" class="correction_mode toggle" name="correctionOddDash">
                    <label for="novel-option--correction-odd-dash" class="toggle">奇数のダッシュ</label>
                </div>
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-wave-dash" class="correction_mode toggle" name="correctionWaveDash">
                    <label for="novel-option--correction-wave-dash" class="toggle">波ダッシュを繋げる</label>
                </div>
            </div>

            <div class='novel-option-header'>ローカライズ</div>
            <div id="novel-option--correction-numbers">
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-number" class="correction_mode toggle" name="correctionNumber">
                    <label for="novel-option--correction-number" class="toggle">数値</label>
                </div>
            </div>

            <div class='novel-option-header'>その他</div>
            <div id="novel-option--correction-others">
                <div class="novel-option--toggle novel-option--correction-mode">
                    <input type="checkbox" id="novel-option--correction-show-illustration" class="correction_mode toggle" name="correctionShowIllustration">
                    <label for="novel-option--correction-show-illustration" class="toggle">挿絵を表示</label>
                </div>
            </div>

            <div class='novel-option-header'>置換</div>
			<div id="novel-option--correction-replace--patterns-outer">
			    <div id="novel-option--correction-replace--patterns"></div>
            </div>
            <div id="novel-option--correction-replace--patterns-addition">
                <div id="novel-option--correction-replace--pattern-box-addition">
                    <i class="fa-solid fa-plus"></i>
                </div>
			</div>
        </div>
    `)

    restoreCorrectionMode()
    restoreReplacePattern()
    correction()

    /* Toggle Clicked */
    $(".correction_mode.toggle").on("click", function(e){
        var mode: Record<string,any> = {}
        mode[$(this).prop("name")] = $(this).prop("checked")

        nt.storage.local.set(mode)
    })

    /* Scroll Replacement Pattern List */
    /*
    const scrollElement = document.querySelector("#novel-option--correction-replace--patterns-outer");
    if(scrollElement!=null){
        scrollElement.addEventListener("wheel", (e) => {
            e.preventDefault();
            scrollElement.scrollTop += e.deltaY;
        });
    }
    */

    /* Replacement */
    $("#novel-option--correction-replace--pattern-box-addition").on("click", function(){
        nt.storage.local.get(["correctionReplacePatterns"]).then(function(data){
            data.correctionReplacePatterns.push(new nt.storage.local.ReplacePattern())
            nt.storage.local.set({correctionReplacePatterns: data.correctionReplacePatterns})
        })
    })

    /* Storage Listener */
    nt.storage.local.changed([
        "correctionIndent",
        "correctionNormalizeEllipses",
        "correctionNormalizeDash",
        "correctionNormalizeExclamation",
        "correctionRepeatedSymbols",
        "correctionPeriodWithBrackets",
        "correctionNoSpaceExclamation",
        "correctionOddEllipses",
        "correctionOddDash",
        "correctionWaveDash",
        "correctionNumber",
        "correctionNumberShort",
        "correctionNumberLong",
        "correctionNumberSymbol",
        "correctionReplacePatterns",
        "correctionShowIllustration",
        "correctionRemoveIllustrationLink",
        "correctionVerticalLayout_CombineWord",
        "correctionVerticalLayout_CombineNumber",
        "correctionVerticalLayout_IgnoreCombineNumberInWord",
        "correctionVerticalLayout_CombineExclamation",
        "correctionVerticalLayout_SidewayWord",
        "correctionVerticalLayout_SidewayExclamation"
    ], function(changes){
        restoreCorrectionMode()
        restoreReplacePattern()
        correction()
    })
    
}

function setOptionContentsAuthorSkin(id: number){
    var outer = $(".novel-option--content.novel-option-tab-"+id)

    /* Author Skin */
    outer.append(`
        <div class='novel-option--content-inner' id='option-skin'>
            <div class='novel-option-header'>作者スキン</div>
            <p style="font-weight: bold;">この小説は、作者によってスキンが設定されています。</p>
            <div id="novel-option--author-skin" style="margin-top: 20px;">
                <input type="checkbox" id="novel-option--novel-author-skin" class="toggle" name="novelAuthorCustomSkin">
                <label for="novel-option--novel-author-skin" class="toggle">作者スキン</label>
            </div>
            <div class="novel-option--import-author-skin" style="margin-top: 20px;">
                <button type="button" id="novel-option--import-author-skin-button">この作者スキンをインポート</button>
                <div id="novel-option--import-author-skin-notice" style="margin-top: 10px;"></div>
            </div>
        </div>
    `)

    /* Restore Values */
    restoreAuthorSkin()
    nt.storage.local.changed("novelAuthorCustomSkin", function(changes){
        restoreAuthorSkin()
    })

    function restoreAuthorSkin(){
        nt.storage.local.get(null).then((data) => {
            check("#novel-option--novel-author-skin", data.novelAuthorCustomSkin)
        })
    }

    /* Event */
    // Click Toggle
    $("#novel-option--novel-author-skin").on("click", function(e){
        nt.storage.local.set({novelAuthorCustomSkin: $(this).prop("checked")})
    })

    // Import Button
    $("#novel-option--import-author-skin-button").on("click", function(e){
        var banner = $(".novelrankingtag a:has(img[alt='Narou Tweaker 作者スキン'])")
        if(banner.length){
            var span = banner.find("span")
            if(span.length){
                try{
                    // Escape HTML Tags
                    var p = $("<p>")
                    var node = (span.get(0)?.firstChild as HTMLElement).nodeValue
                    if(node!==null){
                        p.text(node)
                        var text = p.text()
                        
                        // Parse to Tags
                        var l = JSON.parse(text)
                        const ncode = nt.api.ncode.getFromURL()?.ncode()
                        if(ncode){
                            l.name = `インポートされた作者スキン-${ncode.toUpperCase()}-${nt.time.getDatetimeString()}`
                            l.description = `${nt.time.getDatetimeString()} に ${ncode.toUpperCase()} でインポートされた作者スキン`
                            var skin = new nt.skin.v1.Skin(l)
        
                            // Import Skin
                            nt.storage.local.get("skins").then(function(data) {
                                var skins = data.skins
                                skin.name = nt.skin.v1.generateNoDuplicateSkinName(nt.skin.v1.localSkins.concat(skins), skin.name, -1)
                                skins.push(skin)
                                
                                nt.storage.local.set({skins: skins}).then(function(){
                                    pushSkinImportInfo(`インポートに成功しました (${skin.name})`, "info")
                                })
                            })
                        }
                    }

                }catch(e){
                    pushSkinImportInfo(`インポートに失敗しました`, "warn")
                    console.warn(e)
                }
            }
        }
    })

    function pushSkinImportInfo(message:string, type:string){
        $("#novel-option--import-author-skin-notice").empty()
        if(type=="warn"){
            $("#novel-option--import-author-skin-notice").append(`
                <div class="novel-option--import-author-skin--notice-warn"><i class="fa-solid fa-triangle-exclamation"></i> ${nt.text.escapeHtml(message)}</div>
            `)
        }else{
            $("#novel-option--import-author-skin-notice").append(`
                <div class="novel-option--import-author-skin--notice-info"><i class="fa-solid fa-circle-check"></i> ${nt.text.escapeHtml(message)}</div>
            `)
        }
    }
}