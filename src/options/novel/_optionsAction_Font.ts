import { nt } from "../../utils/option";
import { check } from "../../utils/misc"
import { FontFamiliesV1, FontFamilyV1, generateNoDuplicateFontFamilyName, localFont, localFontFamilyV1 } from "../../utils/v1_font";

import $ from 'jquery';

/* Font Settings */
/* フォントの表示設定 */
export function restoreFont() {
    nt.storage.local.get(null).then((data) => {
        const fontList: FontFamiliesV1 = localFontFamilyV1.concat(data.fontFontFamilyList ?? [])

        $("#font-family-dropdown").empty()
        $.each(fontList, function (i, font) {
            if (font.show == true) {
                var opt = $(`<option value="${i}">${font.name}</option>`)
                opt.css("font-family", font.font)
                $("#font-family-dropdown").append(opt)
            }
        })
        const index: number = data.fontSelectedFontFamily ?? 0
        const selectedFont: FontFamilyV1 = fontList[index]
        $("#font-family-dropdown").val(String(index))
        $("#font-family-dropdown").css("font-family", selectedFont.font)
        $("#font-family-option--editting").text((index + 1) + ": " + selectedFont.name)

        $(".option-font[name='font-name']").val(selectedFont.name)
        $(".option-font[name='font-description']").val(selectedFont.description)
        $(".option-font[name='font-data']").val(selectedFont.font)
        $(".option-font[name='font-css']").val(selectedFont.css)
        $(".option-font[name='font-css']").trigger("input")
        $(".option-font[name='font-license']").val(selectedFont.license)

        if (selectedFont.customizable) {
            $(".option-font").prop("disabled", false)
            $("#font-family-option--buttons button[name='save']").prop("disabled", false)
            $("#font-family-option--buttons button[name='delete']").prop("disabled", false)
        } else {
            $(".option-font").prop("disabled", true)
            $("#font-family-option--buttons button[name='save']").prop("disabled", true)
            $("#font-family-option--buttons button[name='delete']").prop("disabled", true)
        }

        var fSize = data.fontFontSize ?? 0
        if (fSize > 0) {
            $("#font-size-input").val("+" + fSize)
        } else {
            $("#font-size-input").val(fSize)
        }

        var lHeight = data.fontLineHeight ?? 0
        if (lHeight > 0) {
            $("#line-height-input").val("+" + lHeight)
        } else {
            $("#line-height-input").val(lHeight)
        }

        var pWidth = data.fontWidth ?? 1
        $("#page-width-input").val(Number((pWidth * 100).toFixed(1)))
    })
}

/* フィールドからフォントの設定を取得し、Objectを返す */
function getFontData() {
    return new FontFamilyV1({
        name: $("#font-name").val(),
        description: $("#font-description").val(),
        show: true,
        customizable: !$(".option-font").prop("disabled"),
        font: $("#font-data").val(),
        css: $("#font-css").val(),
        license: $("#font-license").val()
    })
}


/* 選択中のフォントを保存 */
function saveSelectedFont() {
    var fontData = getFontData()
    var selectedFont = parseInt(`${$("#font-family-dropdown").val()}`)

    nt.storage.local.get(["fontFontFamilyList"]).then(function (data) {
        var fontList: FontFamiliesV1 = data.fontFontFamilyList
        if (fontData.name.trim().length == 0) { fontData.name = "新規フォント" }
        fontData.name = generateNoDuplicateFontFamilyName(localFontFamilyV1.concat(fontList), fontData.name, selectedFont)

        var key = selectedFont - localFontFamilyV1.length
        if (fontList[key] != undefined) {
            if (fontList[key].customizable) {
                fontList[key] = fontData
                nt.storage.local.set({ fontFontFamilyList: fontList })
            }
        }
    });
}


/* イベントを設定 */
export function addFontEditButtonEvent() {

    /* Font Family */
    /*
    $(".font-button-box").click(function(){
      const key = $(this).parent().prop("id")
      $(".font-button.active").removeClass("active")
      $(this).parent().addClass("active")
  
      nt.storage.local.set({fontFontFamily: key}, function(){})
    })
    */
    $("#font-family-dropdown").change(function () {
        const key = $(this).parent().prop("id")
        $(".font-button.active").removeClass("active")
        $(this).parent().addClass("active")

        nt.storage.local.set({ fontFontFamily: key })
    })
    $("#font-family-dropdown").on("change", () => {
        nt.storage.local.set({ fontSelectedFontFamily: parseInt(`${$("#font-family-dropdown").val()}`) })
    })

    /* New Button */
    $("#font-family-selection--buttons button[name='new']").on("click", (e) => {
        saveSelectedFont()

        nt.storage.local.get(["fontFontFamilyList"]).then(function (data) {
            var fontList: FontFamiliesV1 = data.fontFontFamilyList

            var defaultFont = Object.assign({}, localFontFamilyV1[0])

            defaultFont.customizable = true
            defaultFont.name = generateNoDuplicateFontFamilyName(localFontFamilyV1.concat(fontList), "新規フォント", -1)
            defaultFont.description = ""
            defaultFont.license = ""
            defaultFont.css = ""

            fontList.push(defaultFont)
            nt.storage.local.set({ fontFontFamilyList: fontList, fontSelectedFontFamily: localFontFamilyV1.length + fontList.length - 1 })
        });
    })

    /* Save Button */
    $("#font-family-option--buttons button[name='save']").on("click", (e) => {
        saveSelectedFont()
    })

    /* Copy Button */
    $("#font-family-option--buttons button[name='copy']").on("click", (e) => {
        saveSelectedFont()
        var font = getFontData()

        nt.storage.local.get(["fontFontFamilyList"]).then(function (data) {
            var fontList: FontFamiliesV1 = data.fontFontFamilyList
            font.customizable = true
            font.name = generateNoDuplicateFontFamilyName(localFontFamilyV1.concat(fontList), font.name + " - コピー", -1)
            fontList.push(font)

            nt.storage.local.set({ fontFontFamilyList: fontList, fontSelectedFontFamily: localFontFamilyV1.length + fontList.length - 1 })
        });
    })

    /* Delete Button */
    $("#font-family-option--buttons button[name='delete']").on("click", (e) => {
        nt.storage.local.get(["fontFontFamilyList", "fontSelectedFontFamily"]).then(function (data) {
            var selectedFont: number = data.fontSelectedFontFamily
            var key = selectedFont - localFontFamilyV1.length
            var fontList: FontFamiliesV1 = data.fontFontFamilyList

            if (fontList[key].customizable == true) {
                fontList.splice(key, 1)
                if (selectedFont >= fontList.length + localFontFamilyV1.length - 1) {
                    selectedFont = fontList.length + localFontFamilyV1.length - 1
                }
                nt.storage.local.set({ fontFontFamilyList: fontList, fontSelectedFontFamily: selectedFont })
            }
        });
    })

    /* Auto Save */
    $(".option-font").change(() => {
        saveSelectedFont()
    });

    /* Font Size */
    function setFontSizeValue(value: number) {
        if (localFont["font-size"] + value < 50) {
            value = 50 - localFont["font-size"]
        } else if (localFont["font-size"] + value > 300) {
            value = 300 - localFont["font-size"]
        }
        if (value > 0) {
             $("#font-size-input").val("+" + value)
        }else{
            $("#font-size-input").val(value)
        }

        nt.storage.local.set({ fontFontSize: Number(value) });
    }

    $("#font-size-minus").click(function () {
        var value = Number($("#font-size-input").val())
        if (isNaN(value)) {
            value = 0
        } else {
            value = Math.floor(value) - (10 - Math.abs(Math.floor(value) % 10))
        }

        setFontSizeValue(value)
    })
    $("#font-size-plus").click(function () {
        var value = Number($("#font-size-input").val())
        if (isNaN(value)) {
            value = 0
        } else {
            value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
        }
        setFontSizeValue(value)
    })
    $("#font-size-input").change(function () {
        var value = Number($("#font-size-input").val())
        if (isNaN(value)) {
            value = 0
        }
        setFontSizeValue(value)
    })

    /* Line Height */
    function setLineHeightValue(value: number) {
        if (localFont["line-height"] + value < 50) {
            value = 50 - localFont["line-height"]
        } else if (localFont["line-height"] + value > 300) {
            value = 300 - localFont["line-height"]
        }
        if (value > 0) {
            $("#line-height-input").val("+" + value)
        }else{
            $("#line-height-input").val(value)
        }

        nt.storage.local.set({ fontLineHeight: Number(value) });
    }

    $("#line-height-minus").click(function () {
        var value = Number($("#line-height-input").val())
        if (isNaN(value)) {
            value = 0
        } else {
            value -= 10 - Math.abs(value % 10)
        }

        setLineHeightValue(value)
    })
    $("#line-height-plus").click(function () {
        var value = Number($("#line-height-input").val())
        if (isNaN(value)) {
            value = 0
        } else {
            value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
        }
        setLineHeightValue(value)
    })
    $("#line-height-input").change(function () {
        var value = Number($("#line-height-input").val())
        if (isNaN(value)) {
            value = 0
        }
        setLineHeightValue(value)
    })

    /* Width */
    function setWidthValue(value: number) {
        if (value < 0) {
            value = 0
        } else if (value > 1000) {
            value = 100
        }
        $("#page-width-input").val(value)

        nt.storage.local.set({ fontWidth: Number(value) / 100 });
    }

    $("#page-width-minus").click(function () {
        var value = Number($("#page-width-input").val())
        if (isNaN(value)) {
            value = 0
        } else {
            value = Math.floor(value) - (10 - Math.abs(Math.floor(value) % 10))
        }

        setWidthValue(value)
    })
    $("#page-width-plus").click(function () {
        var value = Number($("#page-width-input").val())
        if (isNaN(value)) {
            value = 0
        } else {
            value = Math.floor(value) + (10 - Math.abs(Math.floor(value) % 10))
        }
        setWidthValue(value)
    })
    $("#page-width-input").change(function () {
        var value = Number($("#page-width-input").val())
        if (isNaN(value)) {
            value = 0
        }
        setWidthValue(value)
    })

    /* Storage Listener */
    chrome.storage.local.onChanged.addListener(function (changes) {
        if (
            changes.fontSelectedFontFamily != undefined ||
            changes.fontFontFamilyList != undefined ||
            changes.fontFontSize != undefined ||
            changes.fontLineHeight != undefined ||
            changes.fontTextRendering != undefined ||
            changes.fontWidth != undefined
        ) {
            restoreFont()
        }
        if (changes.novelVertical != undefined) {
            check("#novelVertical", changes.novelVertical.newValue)
        }
    })
}