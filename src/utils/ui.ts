import $ from 'jquery';

/* Info Icon*/
function balloonGeneral(html:string, icon:string, href?:string){
    var object
    if(href==undefined){
        object = $('<span class="ui-balloon ui-information-balloon"><i class="fa-solid '+icon+' ui-balloon--icon"></i><p class="ui-balloon--text disabled">' + html + '</p></span>')
    }else{
        object = $('<span class="ui-balloon ui-information-balloon"><a href="'+href+'"><i class="fa-solid '+icon+' ui-balloon--icon"></i></a><p class="ui-balloon--text disabled">' + html + '</p></span>')
    }
    object.hover(
        function() {
            const offset: JQueryCoordinates|undefined = $(this).offset();
            const height: number|undefined = $(this).height();
            const width: number|undefined = $(this).children(".ui-balloon--text").width();

            if(offset!==undefined && height!==undefined && width!==undefined){
                const top: number|undefined = offset.top + height + 10
                const left: number|undefined = offset.left - width/2 - 1.5 
                $(this).children(".ui-balloon--text").css({
                    top: `${top}px`,
                    left: `${left}px`
                })
            }
            
            $(this).children('.ui-balloon--text').removeClass("disabled");
        },
        function(){
            $(this).children('.ui-balloon--text').addClass("disabled");
        }
    );
    return object;
}

export function addInfoIconBalloon(html:string, href?:string){
    return balloonGeneral(html, "fa-circle-info", href)
}

export function addQuestionIconBalloon(html:string, href?:string){
    return balloonGeneral(html, "fa-circle-question", href)
}

export function addExclamationIconBalloon(html:string, href?:string){
    return balloonGeneral(html, "fa-circle-exclamation", href)
}