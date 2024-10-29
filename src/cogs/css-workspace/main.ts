import $ from "jquery";
import { nt } from "../../utils/option";

nt.storage.local.get(null).then((data)=>{
    /* Skin Custom CSS */
    if("workspaceEditorSkinCustomCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--editor-skin-user" class="narou-tweaker-style"></style>`)
        l.text(data.workspaceEditorSkinCustomCSS)
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--editor-skin-user" class="narou-tweaker-style"></style>`)
    }

    /* Font Custom CSS */
    if("workspaceEditorFontCustomCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--editor-font-user" class="narou-tweaker-style"></style>`)
        l.text(data.workspaceEditorFontCustomCSS)
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--editor-font-user" class="narou-tweaker-style"></style>`)
    }
})

nt.storage.session.get(null).then((data)=>{
    /* Skin */
    if("workspaceEditorAppliedSkinCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--editor-skin" class="narou-tweaker-style"></style>`)
        l.text(data.workspaceEditorAppliedSkinCSS ?? "")
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--editor-skin" class="narou-tweaker-style"></style>`)
    }

    /* Font */
    if("workspaceEditorAppliedFontCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--editor-font" class="narou-tweaker-style"></style>`)
        l.text(data.workspaceEditorAppliedFontCSS ?? "")
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--editor-font" class="narou-tweaker-style"></style>`)
    }
})