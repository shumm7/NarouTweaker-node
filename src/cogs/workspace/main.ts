import { _editor } from "./_editor"
import { _bookmark } from "./_favorite"
import { _header } from "./_header"
import { _misc } from "./_misc"
import { _reaction } from "./_reaction"

import $ from 'jquery';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/fonts/icomoon/style.css";
import "@vscode/codicons/dist/codicon.css"
import "w3-css/w3.css";
import "../../common.css"
import "./main.css"
import "./_reaction.css"
import "./_editor.css"
import "./_favorite.css"

const path = location.pathname

//ヘッダ
if($(".p-up-header-pc").length){
    _header()
}

//ブックマーク画面
if(path.match(/^\/favnovelmain\/.*/) || path.match(/^\/favnovelmain18\/.*/)){
    _bookmark()
}

//編集画面
_editor()

// リアクション
_reaction()

// その他
_misc()
