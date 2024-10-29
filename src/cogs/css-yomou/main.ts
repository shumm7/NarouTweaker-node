import { nt } from "../../utils/narou-tweaker";
import { checkRankPageDetail } from "../yomou/utils"
import $ from 'jquery';

const pageDetail = checkRankPageDetail()

if(pageDetail?.site=="yomou"){
    if(pageDetail.detail=="rank" && pageDetail.type == "top"){
        nt.storage.session.get(["yomouRankTop_AppliedCSS"]).then((data)=>{
            /* Styles */
            if("yomouRankTop_AppliedCSS" in data){
                var l = $(`<style type="text/css" id="narou-tweaker-style--rank-css" class="narou-tweaker-style"></style>`)
                l.text(data.yomouRankTop_AppliedCSS ?? "")
                $("html").append(l)
            }else{
                $("html").append(`<style type="text/css" id="narou-tweaker-style--rank-css" class="narou-tweaker-style"></style>`)
            }
        })
        nt.storage.local.get(["yomouRankTop_CustomCSS"]).then((data)=>{
            /* User CSS */
            if("yomouRankTop_CustomCSS" in data){
                var l = $(`<style type="text/css" id="narou-tweaker-style--rank-user-css" class="narou-tweaker-style"></style>`)
                l.text(data.yomouRankTop_CustomCSS)
                $("html").append(l)
            }else{
                $("html").append(`<style type="text/css" id="narou-tweaker-style--rank-user-css" class="narou-tweaker-style"></style>`)
            }
        })

        nt.storage.session.changed("yomouRankTop_AppliedCSS", function(changes){
            const css = changes.yomouRankTop_AppliedCSS.newValue
            var elm = $("#narou-tweaker-style--rank-css")
            if(typeof css === "string" && elm.length){
                $("#narou-tweaker-style--rank-css").text(css)
            }
        })
        nt.storage.local.changed("yomouRankTop_CustomCSS", function(changes){
            const css = changes.yomouRankTop_CustomCSS.newValue
            var elm = $("#narou-tweaker-style--rank-user-css")
            if(typeof css === "string" && elm.length){
                elm.text(css)
            }
        })
    }
    
    else if(pageDetail.detail=="rank" && pageDetail.type != "top"){
        nt.storage.session.get(["yomouRank_AppliedCSS"]).then((data)=>{
            /* Styles */
            if("yomouRank_AppliedCSS" in data){
                var l = $(`<style type="text/css" id="narou-tweaker-style--rank-css" class="narou-tweaker-style"></style>`)
                l.text(data.yomouRank_AppliedCSS ?? "")
                $("html").append(l)
            }else{
                $("html").append(`<style type="text/css" id="narou-tweaker-style--rank-css" class="narou-tweaker-style"></style>`)
            }
        })
        
        nt.storage.local.get(["yomouRank_CustomCSS"]).then((data)=>{
            /* User CSS */
            if("yomouRank_CustomCSS" in data){
                var l = $(`<style type="text/css" id="narou-tweaker-style--rank-user-css" class="narou-tweaker-style"></style>`)
                l.text(data.yomouRank_CustomCSS)
                $("html").append(l)
            }else{
                $("html").append(`<style type="text/css" id="narou-tweaker-style--rank-user-css" class="narou-tweaker-style"></style>`)
            }
        })

        chrome.storage.session.onChanged.addListener(function(changes){
            if(changes.yomouRank_AppliedCSS!=undefined){
                if($("#narou-tweaker-style--rank-css").length){
                    $("#narou-tweaker-style--rank-css").text(changes.yomouRank_AppliedCSS.newValue)
                }
            }
        })
        chrome.storage.local.onChanged.addListener(function(changes){
            if(changes.yomouRank_CustomCSS!=undefined){
                if($("#narou-tweaker-style--rank-user-css").length){
                    $("#narou-tweaker-style--rank-user-css").text(changes.yomouRank_CustomCSS.newValue)
                }
            }
        })
    }
}