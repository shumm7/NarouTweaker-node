import { fixOption, getOptionPageFromID } from "../_utils/optionUI_utils";
import { saveJson } from "../../utils/misc";
import { OptionUI_Pages } from "../_utils/optionUI_items";
import { escapeHtml } from "../../utils/text";
import { nt } from "../../utils/narou-tweaker";
import { getDatetimeString, getDatetimeStringForFilename } from "../../utils/time";
import { OptionUI_Page } from "options/_utils/optionUI_type";

import $ from 'jquery';
import Browser from "webextension-polyfill";

/* 基本設定 */
/* デフォルトページ（ポップアップ時） */
export function general_popupDefaultPage_Dropdown(){
    $("#extPopupDefaultPage_Dropdown").on("change", function(e){
        const pageId = $(this).val()
        if(typeof pageId==="string"){
            if(pageId!=="__auto__"){
                const page: OptionUI_Page|undefined = getOptionPageFromID(pageId)
                if(page?.popup?.defaultPage && page?.title && page?.id){
                    nt.storage.local.set({extPopupDefaultPage: pageId})
                }else{
                    nt.storage.local.set({extPopupDefaultPage: "__auto__"})
                }
            }else{
                nt.storage.local.set({extPopupDefaultPage: pageId})
            }
        }
    })

    function restoreDropdown(value: string){
        var elm = $("#extPopupDefaultPage_Dropdown")
        
        elm.empty()
        elm.append(`<option value="__auto__">自動（閲覧中のページに合わせる）</option>`)
        $.each(OptionUI_Pages, function(_, page){
            if(page.popup){
                if(page.popup.defaultPage && page.title && page.id){
                    elm.append(`<option value="${escapeHtml(page.id)}">ページ「${escapeHtml(page.title)}」</option>`)
                }
            }
        })
        elm.val(value)
    }

    nt.storage.local.get("extPopupDefaultPage").then(function(data){
        restoreDropdown(data.extPopupDefaultPage)
    })

    nt.storage.local.changed("extPopupDefaultPage", function(changes){
        const page = changes.extPopupDefaultPage.newValue
        if(typeof page === "string"){
            restoreDropdown(page)
        }
    })
}

/* 設定データ */
/* 設定データをリセット */
export function general_removeOptionData(){
    $("#removeOptionData").on("click", function(){
        if(window.confirm('スキンを含む、保存されているデータが全てリセットされます。\nこの操作は元に戻せません。')){
            nt.storage.local.get("extNotifications").then((data) => {
                chrome.storage.local.clear().then(()=>{
                    console.log("Reset all options.")
                    nt.storage.local.set(new nt.storage.local.options().get())
                    console.log("Set all options.")

                    /* notify */
                    if(data.extNotifications){
                        chrome.notifications.create("", {
                            iconUrl: "/assets/icons/icon_48.png",
                            type: "basic",
                            title: "Narou Tweakerがリセットされました",
                            message: ``
                        })
                    }
                })
            })
        }
    })
}

/* 設定データを修復 */
export function general_fixOptionData(){
    $("#fixOptionData").on("click", function(){
        if(window.confirm('この操作を行うと、異なるバージョンのNarou Tweakerを利用している他のブラウザで不具合が発生する可能性があります。\n最新版に更新した上で実行してください。')){
            fixOption(true, true)
            
            nt.storage.local.get("extNotifications").then(function(data){
                if(data.extNotifications){
                    chrome.notifications.create("", {
                        iconUrl: "/assets/icons/icon_48.png",
                        type: "basic",
                        title: "Narou Tweakerが修復されました",
                        message: `保存されたデータはそのままです。`
                    })
                }
            })
        }
    })
}

/* 設定データのエクスポート */
export function general_exportOptionData(){
    /* Export Button */
    $("#option-export-json").on("click", (e)=>{
        nt.storage.local.get(null,).then(function(data) {
            var date = getDatetimeStringForFilename()
            if(data){
                saveJson(data.get(), `nt-option-${date}.json`)
            }
        });
    })
    $("#option-export-text").on("click", (e)=>{
        $("#option-export-output").css("display", "block")
        nt.storage.local.get(null).then(function(data) {
            var field = $("#option-export-output--field")
            if(data){
                field.val(JSON.stringify(data.get(), null, "\t"))
                field.trigger("input")
            }
        });
    })
}

/* 設定データのインポート */
export function general_importOptionData(){
    $("#option-import-json").on("change", (evt: any)=>{
        $("#option-import-warnings").empty()

        try{
            var f = evt.target.files[0]
            var reader = new FileReader();
            reader.onload = function(e){
                try{
                    var field = $("#option-import-input--field")
                    field.val(`${e.target?.result ?? ""}`)
                    field.trigger("input")
                }catch(e){
                    console.warn(e)
                }
            }
            reader.readAsText(f);
        }catch(e){}
    })
    $('#option-import').on('dragenter', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    });
    $('#option-import').on('dragover', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    });
    $("#option-import").on("drop", (evt: any)=>{
        evt.stopPropagation();
        evt.preventDefault();
        $("#option-import-warnings").empty()

        try{
            var f = evt.originalEvent.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function(e){
                try{
                    var field = $("#option-import-input--field")
                    field.val(`${e.target?.result ?? ""}`)
                    field.trigger("input")
                }catch(e){
                    console.warn(e)
                }
            }
            reader.readAsText(f);
        }catch(e){}
    })

    $("#option-import-input--submit").on("click", (e)=>{
        if(window.confirm('スキンを含む、既存のデータが全て上書きされます。\nこの操作は元に戻せません。')){
            $("#option-import-warnings").empty()
            try{
                const lines = $("#option-import-input--field").val()
                if(typeof lines === "string"){
                    var raw = JSON.parse(lines)
                    var option = new nt.storage.local.options(raw)
                    if(option){
                        nt.storage.local.set(option.get()).then(() => {
                            var field = $("#option-import-input--field")
                            field.val("")
                            field.trigger("input")
    
                            /* notify */
                            chrome.notifications.create("", {
                                iconUrl: "/assets/icons/icon_48.png",
                                type: "basic",
                                title: "Narou Tweakerがアップデートされました",
                                message: `ユーザによるデータインポート`
                            })
                        })
                    }
                }

            }catch(e){
                $("#option-import-warnings").append(`<div class="option-import-warning">データの読み取りに失敗しました。</div>`)
                console.warn(e)
                return
            }

        }
    })
}


/* デバッグ機能 */
/* 設定データを閲覧 */
export function general_exportOptionText() {
    var whitelist = false

    /* local */
    function changeLocal(){
        Browser.storage.local.get(null).then((data)=>{
            try{
                if(whitelist){
                    const input = $("#exportLocalOptionText_Input_Whitelist")
                    const lines = input.val()
                    var ret: Record<string,any> = {}
                    if(typeof lines === "string"){
                        const appears = lines.split(/\s/)
                        $.each(appears, function(_, elm){
                            if(elm in data){
                                ret[elm] = data[elm]
                            }
                        })
                    }
                    data = ret
                    
                }else{
                    const input = $("#exportLocalOptionText_Input_Blacklist")
                    const lines = input.val()
                    if(typeof lines === "string"){
                        const ignores = lines.split(/\s/)
                        $.each(ignores, function(_, elm){
                            if(elm in data){
                                delete data[elm]
                            }
                        })
                    }
                    
                }

                var text = JSON.stringify(data, null, 4)
                var field = $("#exportLocalOptionText_Output")
                field.text(text)
                field.trigger("input")
            }catch(e){
                console.warn(e)
            }
        })
    }

    /* sync */
    function changeSync(){
        Browser.storage.sync.get(null).then((data)=>{
            try{
                if(whitelist){
                    var input = $("#exportSyncOptionText_Input_Whitelist")
                    const lines = input.val()
                    var ret: Record<string,any> = {}
                    if(typeof lines === "string"){
                        const appears = lines.split(/\s/)
                        $.each(appears, function(_, elm){
                            if(elm in data){
                                ret[elm] = data[elm]
                            }
                        })
                    }
                    data = ret

                }else{
                    var input = $("#exportSyncOptionText_Input_Blacklist")
                    const lines = input.val()
                    if(typeof lines === "string"){
                        const ignores = lines.split(/\s/)
                        $.each(ignores, function(_, elm){
                            if(elm in data){
                                delete data[elm]
                            }
                        })
                    }
                }

                var text = JSON.stringify(data, null, 4)
                var field = $("#exportSyncOptionText_Output")
                field.text(text)
                field.trigger("input")
            }catch(e){
                console.warn(e)
            }
        })
    }

    /* session */
    function changeSession(){
        Browser.storage.session.get(null).then((data)=>{
            try{
                if(whitelist){
                    var input = $("#exportSessionOptionText_Input_Whitelist")
                    const lines = input.val()
                    var ret: Record<string,any> = {}
                    if(typeof lines === "string"){
                        const appears = lines.split(/\s/)
                        $.each(appears, function(_, elm){
                            if(elm in data){
                                ret[elm] = data[elm]
                            }
                        })
                    }
                    data = ret
                }else{
                    var input = $("#exportSessionOptionText_Input_Blacklist")
                    const lines = input.val()
                    if(typeof lines === "string"){
                        const ignores = lines.split(/\s/)
                        $.each(ignores, function(_, elm){
                            if(elm in data){
                                delete data[elm]
                            }
                        })
                    }
                }

                var text = JSON.stringify(data, null, 4)
                var field = $("#exportSessionOptionText_Output")
                field.text(text)
                field.trigger("input")
            }catch(e){
                console.warn(e)
            }
        })
    }
    
    try{
        changeLocal()
        nt.storage.local.changed(function(changes){
            changeLocal()
        })
        $("#exportLocalOptionText_Input_Blacklist, #exportLocalOptionText_Input_Whitelist").on("input", function(e){
            changeLocal()
        })

        changeSync()
        nt.storage.sync.changed(function(changes){
            changeSync()
        })
        $("#exportSyncOptionText_Input_Blacklist, #exportSyncOptionText_Input_Black_Whitelist").on("input", function(e){
            changeSync()
        })

        changeSession()
        nt.storage.session.changed(function(changes){
            changeSession()
        })
        $("#exportSessionOptionText_Input_Blacklist, #exportSessionOptionText_Input_Whitelist").on("input", function(e){
            changeSession()
        })

        // モード切替
        $("#option-list--mode-whitelist").on("change", function(){
            whitelist = $(this).prop("checked")
            if(whitelist){
                $(".option-list--show-whitelist").css("display", "")
                $(".option-list--show-blacklist").css("display", "none")
            }else{
                $(".option-list--show-whitelist").css("display", "none")
                $(".option-list--show-blacklist").css("display", "")
            }
            changeLocal()
            changeSync()
            changeSession()
        })

    }catch(e){
        console.warn(e)
    }
}

/* 設定データの変更履歴 */
export function general_monitorOptionChanged(){
    try{
        function addText(storageName: "local"|"sync"|"session", changes: Record<string,any>){
            var field = $("#option-monitor--output")

            var currentLine: string = ""
            if(!$("#option-monitor--mode-reset").prop('checked')){
                var c = field.val()
                if(typeof c === "string"){
                    currentLine = c
                }
            }

            var keys = Object.keys(changes)
            if(keys.length>1){
                var addLine = `# [${storageName}] ${getDatetimeString()} @ ${keys.length} values changed\n`
            }else{
                var addLine = `# [${storageName}] ${getDatetimeString()} @ ${keys.length} value changed\n`
            }
            $.each(keys, function(_, key){
                try{
                    addLine += `\t${key}: ` + JSON.stringify(changes[key]) + "\n"
                }catch{

                }
            })
            addLine += "\n"
            field.val(currentLine + addLine)
        }

        $("#option-monitor--clear").on("click", function(e){
            $("#option-monitor--output").val("")
        })
        nt.storage.local.changed(function(changes){
            if($("#option-monitor--option-local").prop('checked')){
                addText("local", changes)
            }
        })
        nt.storage.sync.changed(function(changes){
            if($("#option-monitor--option-sync").prop('checked')){
                addText("sync", changes)
            }
        })
        nt.storage.session.changed(function(changes){
            if($("#option-monitor--option-session").prop('checked')){
                addText("session", changes)
            }
        })
    }catch(e){
        console.warn(e)
    }
}

/* 設定データの直接変更 */
export function general_insertOptionData(){
    try {
        $("#option-insert--button").on("click", function(){
            try {
                $("#option-insert--error").text("")
                const storage = $("#option-insert--storage").val()
                const key = $("#option-insert--key").val()
                const value = $("#option-insert--value").val()
                var json: string
                if(typeof storage==="string" && typeof key==="string" && typeof value === "string"){
                    if(key.length==0){
                        json = value
                    }
                    else{
                        json = `{"${key}":${value}}`
                    }
                    if(value.length==0){
                        if(window.confirm('値が指定されていません。指定されたキーの設定データを削除しますが、よろしいですか？')){
                            if(storage=="local"){
                                nt.storage.local.remove(key)
                            }else if(storage=="sync"){
                                nt.storage.sync.remove(key)
                            }else if(storage=="session"){
                                nt.storage.session.remove(key)
                            }else{
                                $("#option-insert--error").text(`不正なストレージが指定されました: ${key}`)
                                return false
                            }
                        }else{
                            $("#option-insert--error").text(`操作がキャンセルされました`)
                            return false
                        }
                    }else{
                        var dict
                        try {
                            dict = JSON.parse(json)
                        }catch(e){
                            $("#option-insert--error").text(`構文の解釈に失敗しました: ${e}`)
                            console.warn(e)
                            return false
                        }

                        if(storage=="local"){
                            nt.storage.local.set(dict)
                        }else if(storage=="sync"){
                            nt.storage.sync.set(dict)
                        }else if(storage=="session"){
                            nt.storage.session.set(dict)
                        }else{
                            $("#option-insert--error").text(`不正なストレージが指定されました: ${key}`)
                            return false
                        }
                    }
                }else{
                    $("#option-insert--error").text(`入力値の取得に失敗しました: ${key}`)
                    return false
                }

            }catch(e){
                $("#option-insert--error").text(`操作に失敗しました: ${e}`)
                console.warn(e)
            }
        })
    }catch(e){
        $("#option-insert--error").text(`操作に失敗しました: ${e}`)
        console.warn(e)
    }
}