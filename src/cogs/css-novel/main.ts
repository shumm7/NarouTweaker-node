import $ from 'jquery';
import { nt } from '../../utils/narou-tweaker';

$("body").addClass("narou-tweaker--custom-skin")

nt.storage.session.get(null).then((data)=>{
    /* Skin Custom CSS */
    if("novelSkinCustomCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--skin-user" class="narou-tweaker-style"></style>`)
        l.text(data.novelSkinCustomCSS ?? "")
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--skin-user" class="narou-tweaker-style"></style>`)
    }

    /* Font Custom CSS */
    if("novelFontCustomCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--font-user" class="narou-tweaker-style"></style>`)
        l.text(data.novelFontCustomCSS ?? "")
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--font-user" class="narou-tweaker-style"></style>`)
    }

    /* Skin */
    if("novelAppliedSkinCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--skin" class="narou-tweaker-style"></style>`)
        l.text(data.novelAppliedSkinCSS ?? "")
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--skin" class="narou-tweaker-style"></style>`)
    }

    /* Font */
    if("novelAppliedFontCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--font" class="narou-tweaker-style"></style>`)
        l.text(data.novelAppliedFontCSS ?? "")
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--font" class="narou-tweaker-style"></style>`)
    }

    /* Author CSS */
    $("html").append(`<style type="text/css" id="narou-tweaker-style--author-css" class="narou-tweaker-style"></style>`)
})

nt.storage.local.get("novelCustomCSS").then((data)=>{
    /* User CSS */
    if("novelCustomCSS" in data){
        var l = $(`<style type="text/css" id="narou-tweaker-style--user-css" class="narou-tweaker-style"></style>`)
        l.text(data.novelCustomCSS)
        $("html").append(l)
    }else{
        $("html").append(`<style type="text/css" id="narou-tweaker-style--user-css" class="narou-tweaker-style"></style>`)
    }
})

nt.storage.session.changed(function(changes){
    var css = changes.novelSkinCustomCSS.newValue
    var elm = $("#narou-tweaker-style--skin-user")
    if(typeof css === "string" && elm.length){
        elm.text(css)
    }

    var css = changes.novelFontCustomCSS.newValue
    var elm = $("#narou-tweaker-style--font-user")
    if(typeof css === "string" && elm.length){
        elm.text(css)
    }

    var css = changes.novelAppliedSkinCSS.newValue
    var elm = $("#narou-tweaker-style--skin")
    if(typeof css === "string" && elm.length){
        elm.text(css)
    }

    var css = changes.novelAppliedFontCSS.newValue
    var elm = $("#narou-tweaker-style--font")
    if(typeof css === "string" && elm.length){
        elm.text(css)
    }
})

nt.storage.local.changed("novelCustomCSS", function(changes){
    const css = changes.novelCustomCSS.newValue
    var elm = $("#narou-tweaker-style--user-css")
    if(typeof css === "string" && elm.length){
        elm.text(css)
    }
})