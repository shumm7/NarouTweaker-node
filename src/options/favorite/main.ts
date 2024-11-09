import { OptionUI_ItemID } from "options/utils/optionUI_type";
import { getOptionFromID } from "../utils/optionUI_utils";
import { getOptionElement, optionHide, syntaxHighlight } from "../utils/utils";
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
                        const parent = option.location.parent

                        var elm = getOptionElement(option, "favorite")

                        /* Placement */
                        if(parent){
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
        
        nt.storage.local.changed("extFavoriteOptions", function(changes){
            const array = changes?.extFavoriteOptions?.newValue
            if(Array.isArray(array)){
                markFavoriteOptions(array)
            }else{
                markFavoriteOptions([])
            }
        })

        if(scroll!==undefined){
            $(window).scrollTop(scroll)
            $(`.contents-container[name="general"]`).css("height", "")
        }
    })
}



nt.storage.local.changed("extFavoriteOptions", function(changes){
    var outer = $(`.contents-container[name="general"]`)
    const scroll = $(window).scrollTop()
    const height = outer.innerHeight()
    if(height!==undefined){
        outer.css("height", height)
        outer.empty()
        setupContents(scroll)
    }
})