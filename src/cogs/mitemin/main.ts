import { _image } from "./_general";

if(location.hostname.match(/^\d+\.mitemin\.net$/)){
    if(location.pathname.match(/^\/i\d+\/*$/)){
        _image()
    }
}