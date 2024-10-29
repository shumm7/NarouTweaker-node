import { nt } from "../../utils/option";
import { replaceUrl } from "../../utils/text";

import $ from 'jquery';

export function _blog(){
    /* Blog Auto Url */
    nt.storage.local.get(null).then((data) => {
        if(data.mypageBlogAutoURL){
            var header = $('.p-blogview__info')[0].outerHTML;
            $('.p-blogview__info').remove()
            var lines = $('.c-panel__item').html().split(/<br\s*\/?>/i);

            $('.c-panel__item').empty();
            $('.c-panel__item').append($.parseHTML(header));
            $.each(lines, function(idx, line) {
                $('.c-panel__item').append("<p>"+line + "</p>");
            });

            $('.c-panel__item p').each(function (idx, elem) {
                replaceUrl(elem, !data.mypageDisableExternalURLWarning)
            });
        }
    })

    /* Blog Comment Auto Url */
    nt.storage.local.get(null).then((data) => {
        if(data.mypageBlogCommentAutoURL){
            $('.p-blogview__comment-main').each(function(_) {
                var comment = $(this)
                var lines = comment.html().split(/<br\s*\/?>/i);
        
                comment.empty();
                $.each(lines, function(idx, line) {
                    comment.append("<p>" + line + "</p>");
                });
                
                comment.children("p").each(function (idx, elem) {
                    replaceUrl(elem, !data.mypageDisableExternalURLWarning)
                });
            });
        }
    })
}