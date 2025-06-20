import { nt } from "../../utils/narou-tweaker"

import $ from 'jquery';

export function _favuser(){
    nt.storage.local.get(null).then(function(data){
        try{
            $(".p-favuser-list").each(function(){
                const outer = $(this)
    
                if(data.mypageShowFavUserId){
                    const url = outer.find(".p-favuser-list__header a").prop("href")
    
                    var u = new URL(url)
                    var m = u.pathname.match(/^\/(.*)\/+/)
                    if(m!==null){
                        const userid = m[1]
                        outer.find(".p-favuser-list__header").append(`<span class="p-favuser-list__userid">${userid}</span>`)
                    }
                }
            })
        }catch(e){
            console.warn(e)
        }
    })
}