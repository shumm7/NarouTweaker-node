import { _image } from "./_general.js";

import jQuery from "jquery";
Object.assign(window, { $: jQuery, jQuery });

if(location.hostname.match(/^\d+\.mitemin\.net$/)){
    if(location.pathname.match(/^\/i\d+\/*$/)){
        _image()
    }
}