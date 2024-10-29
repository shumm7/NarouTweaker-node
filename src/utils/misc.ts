import $ from 'jquery';
import { nt } from './narou-tweaker';

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
export function getCSSRule(key: string, rules: Array<Record<string,string>>): nt.text.CSS_String{
    var style = key + "{"
    rules.forEach(rule => {
        Object.keys(rule).forEach(k => {
            style += k + ":" + rule[k] + " !important;"
        })
    })
    style += "}\n"
    return style
}