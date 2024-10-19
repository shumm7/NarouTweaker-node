import { _blog } from "./_blog.js";
import { _general } from "./_general.js";
import { _favuser } from "./_misc.js";
import { _profile } from "./_profile.js";

import "./local.css"

if($(".p-userheader__tab").length){
    const path = location.pathname;

    /* General */
    _general()

    if(path.match(/^\/mypageblog\/view\/userid\/\d+\/blogkey\/\d+\/*$/) || path.match(/^\/mypageblog\/view\/xid\/x\d+[a-zA-Z]+\/blogkey\/\d+\/*$/)){
        /* Blog Page */
        _blog()
    }
    else if(path.match(/^\/mypage\/profile\/userid\/\d+\/*$/) || path.match(/^\/mypage\/profile\/xid\/x\d+[a-zA-Z]+\/*$/)){
        /* User Profile */
        _profile()
    }
    else if(path.match(/^\/mypagefavuser\/list\/userid\/\d+\/*$/) || path.match(/^\/mypagefavuser18\/list\/xid\/x\d+[a-zA-Z]+\/*$/)){
        /* Favorite Users */
        _favuser()
    }
}