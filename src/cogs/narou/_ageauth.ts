import { nt } from "../../utils/narou-tweaker";

import $ from 'jquery';

export async function ageauth(){
    const data = await nt.storage.local.get(null)
    if(data.narouSkipAgeauth){
        if(location.hostname=="nl.syosetu.com"){
            if(location.pathname.match(/^\/redirect\/ageauth\/*/)){
                await _ageauthNl()
            }
        }else if(location.hostname=="noc.syosetu.com"){
            if(location.pathname.match(/^\/*$/)){
                var yes18 = $('#enter');
                if(yes18.length){
                    location.assign(yes18.prop('href'));
                }
            }
        }else if(location.hostname=="mnlt.syosetu.com"){
            if(location.pathname.match(/^\/*$/)){
                var yes18 = $('#enter');
                if(yes18.length){
                    location.assign(yes18.prop('href'));
                }
            }
        }else if(location.hostname=="mid.syosetu.com"){
            if(location.pathname.match(/^\/*$/)){
                var yes18 = $('#enter');
                if(yes18.length){
                    location.assign(yes18.prop('href'));
                }
            }
        }else if(location.hostname=="mid.syosetu.com"){
            if(location.pathname.match(/^\/*$/)){
                var yes18 = $('#enter');
                if(yes18.length){
                    location.assign(yes18.prop('href'));
                }
            }
        }else if(location.hostname=="eparet.net"){
            if(location.pathname.match(/^\/*$/)){
                _ageauthEparet()
            }
        }
    }
}

async function _ageauthNl(){
    var yes18 = $('#yes18');

    if(yes18.length){
        var expire = new Date()
        expire.setFullYear(expire.getFullYear() + 1)

        const cookieDetails = {
            url: location.origin,
            path:'/',
            domain:'.syosetu.com',
            expirationDate: expire.getTime(),
            name: 'over18',
            value: 'yes'
        }
        await nt.cookie.set(cookieDetails)
        location.assign(yes18.data('url'));
    }
}

function _ageauthEparet(){
    location.assign("/index/top/");
}