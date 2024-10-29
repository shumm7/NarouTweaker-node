import { OptionUI_ItemID } from "options/_utils/optionUI_type";
import { getOptionFromID } from "../_utils/optionUI_utils";
import { getOptionElement, optionHide, syntaxHighlight } from "../_utils/utils";
import { restoreOptions, setup } from "../general";
import { nt } from "../../utils/narou-tweaker";

import $ from 'jquery';

setup()
setupContents()

function markFavoriteOptions(list: Array<OptionUI_ItemID>){
    $(".contents-item--button-favorite.selected").removeClass("selected")
    $.each(list, function(_, id){
        $(`.option-outer[name=${id}] > .contents-option-head > .contents-item--buttons .contents-item--button-favorite, .option-outer[name=${id}] > .contents-option > .contents-option-head > .contents-item--buttons .contents-item--button-favorite`).addClass("selected")
    })
}

function setupContents(scroll?: number){
    nt.storage.local.get("extFavoriteOptions").then(function(data){
        var list = data.extFavoriteOptions
        if(!Array.isArray(list)){
            list = []
        }
        $.each(list, function(_, id){
            var option = getOptionFromID(id)
            if(option){
                if(option.location){
                    if(!option.location.hide){
                        const hasParent = option.location.hasParent
                        const parent = option.location.parent

                        var elm = getOptionElement(option, "favorite")

                        /* Placement */
                        if(hasParent){
                            $(`.contents-container[name="general"] .contents-wide[name="${parent}"] .contents-wide-column`).append(elm)
                        }else{
                            $(`.contents-container[name="general"]`).append(elm)
                        }

                        if(option.ui){
                            if(typeof option.ui.action==="function"){
                                option.ui.action()
                            }else if(Array.isArray(option.ui.action)){
                                option.ui.action.forEach(function(func){
                                    if(typeof func==="function"){
                                        func()
                                    }
                                })
                            }
                        }
                    }
                }
            }
        })
        
        syntaxHighlight()
        optionHide()
        restoreOptions()
        markFavoriteOptions(data.extFavoriteOptions)
        
        chrome.storage.local.onChanged.addListener(function(changes){
            if(changes.extFavoriteOptions){
                markFavoriteOptions(changes.extFavoriteOptions.newValue)
            }
        })

        if(scroll!==undefined){
            $(window).scrollTop(scroll)
            $(`.contents-container[name="general"]`).css("height", "")
        }
    })
}



chrome.storage.local.onChanged.addListener(function(changes){
    if(changes.extFavoriteOptions){
        var outer = $(`.contents-container[name="general"]`)
        const scroll = $(window).scrollTop()
        const height = outer.innerHeight()
        if(height!==undefined){
            outer.css("height", height)
            outer.empty()
            setupContents(scroll)
        }
    }
})