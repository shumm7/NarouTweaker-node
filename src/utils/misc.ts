import { CSS_String } from "./type";

/**
 * オブジェクトをJSONファイルで保存
 * @param data - オブジェクト
 * @param filename - ファイル名
*/
export function saveJson(data:Object, filename: string): void{
    var url = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 3))))
    chrome.runtime.sendMessage({action: "downloads", data: {url: url, filename: filename}}, function(_response){
        console.log(_response)
    });
}

/**
 * 文字列をファイルで保存
 * @param data - テキスト
 * @param filename - ファイル名
*/
export function saveText(data: string, filename: string){
    var url = 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(data)))
    chrome.runtime.sendMessage({action: "downloads", data: {url: url, filename: filename}}, function(_response){
        
    });
    return true;
}

/**
 * 拡張機能のバージョンを取得
 * @returns バージョン
*/
export function getExtensionVersion(): string{
    return chrome.runtime.getManifest().version
}
/**
 * 拡張機能の作者名を取得
 * @returns 作者名
*/
export function getExtensionAuthor(): string{
    return chrome.i18n.getMessage("extAuthor")
}

/**
 * value が undefined だった場合は、defを出力します
 * @deprecated "value ?? def" 記法を使用してください
 */
export function defaultValue(value: any, def: any){
    if(value==undefined){
        return def
    }
    return value
}

/**
 * 指定したオブジェクトをチェックします
 * @param elm 
 * @param value 
 * @param _default 
 * @deprecated
 */
export function check(elm: any, value: boolean|undefined|null, _default?: boolean) {
    if(value!=true && value!=false){
        if(_default==undefined){
            value = false
        }else{
            value = _default;
        }
    }
    $(elm).prop('checked', value).trigger("change");
  }

/**
 * 
 * @param key キー
 * @param rules CSSパラメータを記述した辞書のリスト
 * @returns CSSルール
 * @deprecated 直接CSSを記述してください。
 */
export function getCSSRule(key: string, rules: Array<Record<string,string>>): CSS_String{
    var style = key + "{"
    rules.forEach(rule => {
        Object.keys(rule).forEach(k => {
            style += k + ":" + rule[k] + " !important;"
        })
    })
    style += "}\n"
    return style
}