import { check } from "../../utils/misc"
import { nt } from "../../utils/narou-tweaker"

import $ from "jquery"

export function setDisplayEvent(){

    restoreFontOptions()
    restoreSkinOptions()
    
    /* Skin */
    $("#nt-display-option--skin #nt-display-option--skin-dropdown").on("change",() => {
        var m = $("#nt-display-option--skin-dropdown").val()
        if(typeof m === "string" && isFinite(Number(m))){
            nt.storage.local.set({workspaceEditorSelectedSkin: Number(m)})
        }else{
            nt.storage.local.set({workspaceEditorSelectedSkin: 0})
        }
    })

    /* Font Family */
    $("#nt-display-option--font-family #font-family").on("change",() => {
        var m = $("#nt-display-option--font-family #font-family").val()
        if(typeof m === "string" && isFinite(Number(m))){
            nt.storage.local.set({workspaceEditorSelectedFontFamily: Number(m)})
        }else{
            nt.storage.local.set({workspaceEditorSelectedFontFamily: 0})
        }
    })

    /* Font Size */
    function setFontSizeValue(value: number){
        if(nt.font.v1.localFont["font-size"] + value < 50){
            value = 50 - nt.font.v1.localFont["font-size"]
        }else if(nt.font.v1.localFont["font-size"] + value > 300){
            value = 300 - nt.font.v1.localFont["font-size"]
        }
        var valStr: string
        if(value>0){
            $("#nt-display-option--font-size-input").val("+" + value)
        }else{
            $("#nt-display-option--font-size-input").val(`${value}`)
        }
        nt.storage.local.set({workspaceEditorFontSize: value})
    }

    $("#nt-display-option--font-size-minus").click(function(){
        var value = Number($("#nt-display-option--font-size-input").val())
        if(isNaN(value)){
            value = 0
        }else{
            value = Math.floor(value) - (5 - Math.abs(Math.floor(value) % 5))
        }
        
        setFontSizeValue(value)
    })
    $("#nt-display-option--font-size-plus").click(function(){
        var value = Number($("#nt-display-option--font-size-input").val())
        if(isNaN(value)){
            value = 0
        }else{
            value = Math.floor(value) + (5 - Math.abs(Math.floor(value) % 5))
        }
        setFontSizeValue(value)
    })
    $("#nt-display-option--font-size-input").change(function(){
        var value = Number($("#nt-display-option--font-size-input").val())
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
            $("#nt-display-option--line-height-input").val("+" + value)
        }else{
            $("#nt-display-option--line-height-input").val(value)
        }

        nt.storage.local.set({workspaceEditorLineHeight: value})
    }

    $("#nt-display-option--line-height-minus").click(function(){
        var value = Number($("#nt-display-option--line-height-input").val())
        if(isNaN(value)){
            value = 0
        }else{
            value = Math.floor(value) - (10 - Math.abs(Math.floor(value) % 10))
        }
        
        setLineHeightValue(value)
    })
    $("#nt-display-option--line-height-plus").click(function(){
        var value = Number($("#nt-display-option--line-height-input").val())
        if(isNaN(value)){
            value = 0
        }else{
            value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
        }
        setLineHeightValue(value)
    })
    $("#nt-display-option--line-height-input").change(function(){
        var value = Number($("#nt-display-option--line-height-input").val())
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
        $("#nt-display-option--page-width-input").val(value)

        nt.storage.local.set({workspaceEditorWidth: Number(value)/100})
    }

    $("#nt-display-option--page-width-minus").click(function(){
        var value = Number($("#nt-display-option--page-width-input").val())
        if(isNaN(value)){
            value = 0
        }else{
            value = Math.floor(value) - (10 - Math.abs(Math.floor(value) % 10))
        }
        
        setWidthValue(value)
    })
    $("#nt-display-option--page-width-plus").click(function(){
        var value = Number($("#nt-display-option--page-width-input").val())
        if(isNaN(value)){
            value = 0
        }else{
            value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
        }
        setWidthValue(value)
    })
    $("#nt-display-option--page-width-input").change(function(){
        var value = Number($("#nt-display-option--page-width-input").val())
        if(isNaN(value)){
            value = 0
        }
        setWidthValue(value)
    })

    $(".nt-display-option--textfield").keydown(function(e){
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            return false;
        }
    })
}

function restoreSkinOptions(){
    nt.storage.local.get().then((data)=>{
        const skins = nt.skin.v1.localSkins.concat(data.skins)
        const selected = data.workspaceEditorSelectedSkin

        $("#nt-display-option--skin #nt-display-option--skin-dropdown").empty()
        $.each(skins, function(i, skin){
            if(skin.show==true){
                $("#nt-display-option--skin #nt-display-option--skin-dropdown").append("<option value='"+i+"'>"+skin.name+"</option>")
            }
        })
        $("#nt-display-option--skin-dropdown").val(String(selected))
        $("#nt-display-option--skin-description").text((skins[selected] ?? {})?.description)
    })
}

function restoreFontOptions(){
    nt.storage.local.get().then((data)=>{
        var fontlist = nt.font.v1.localFontFamily.concat(data.fontFontFamilyList)

        $("#nt-display-option--font-family #font-family").empty()
        $.each(fontlist, function(i, font){
            if(font.show==true){
                var opt = $(`<option value="${i}">${font.name}</option>`)
                opt.css("font-family", font.font)
                $("#nt-display-option--font-family #font-family").append(opt)
            }
        })
        const selected = data.workspaceEditorSelectedFontFamily
        $("#nt-display-option--font-family #font-family").val(String(selected))
        $("#nt-display-option--font-family-description").text((fontlist[selected] ?? new nt.font.v1.FontFamily())?.description)
        $("#nt-display-option--font-family #font-family").css("font-family", (fontlist[selected] ?? new nt.font.v1.FontFamily()).font)
        $("#nt-display-option--font-family-sample").css("font-family", (fontlist[selected] ?? new nt.font.v1.FontFamily())?.font)

        var fSize = data.workspaceEditorFontSize
        if(fSize>0) {
            $("#nt-display-option--font-size-input").val("+"+fSize)
        }else{
            $("#nt-display-option--font-size-input").val(`${fSize}`)
        }
        
        var lHeight = data.workspaceEditorLineHeight
        if(lHeight>0) {
            $("#nt-display-option--line-height-input").val("+"+lHeight)
        }else{
            $("#nt-display-option--line-height-input").val(lHeight)
        }

        var pWidth = data.workspaceEditorWidth
        $("#nt-display-option--page-width-input").val(Number((pWidth * 100).toFixed(1)))

        check("#nt-display-option--vertical-toggle", data.novelVertical)
    })
}