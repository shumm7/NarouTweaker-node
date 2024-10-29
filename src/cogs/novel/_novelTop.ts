import { nt } from "../../utils/narou-tweaker"
import $ from 'jquery';

export function novelTop(){
    nt.storage.local.get(null).then((data) => {
        if(data.novelCustomStyle){
            $("body").addClass("narou-tweaker--custom-skin")
        }
        $("body").addClass("narou-tweaker--novel-top")
    })
    _showAllExtext()
}

function _showAllExtext(){
    nt.storage.local.get(null).then((data) => {
        try{
            if(data.novelShowAllExtext){
                var Extext = $("#novel_ex")
                var hiddenText = $("#novel_ex .hidden")
                if(hiddenText.length && Extext.length){
                    var text = hiddenText[0].innerHTML
                    $("#novel_ex .more").remove()
                    $("#novel_ex .hidden").remove()
                    $("#novel_ex span").remove()
                    Extext[0].innerHTML += text
                }
            }
        }catch(e){
            console.warn(e)
        }
    })
}