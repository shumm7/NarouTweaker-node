import { CSS_String } from "./type"

/**
 * フォントセットリスト(v1)
 */
export type FontFamiliesV1 = Array<FontFamilyV1>

/**
 * フォントセット(v1)
 * @param {string} name - フォント名
 * @param {string} description - 説明文
 * @param {boolean} customizable - 編集可能かどうか
 * @param {boolean} show - 表示するかどうか
 * @param {string} string - FontFamilyの値
 * @param {string} license - ライセンス表示
 * @param {CSS_String} css - カスタムCSS
 */
export class FontFamilyV1 {
    name: string = "新規フォント"
    description: string = ""
    customizable: boolean = true
    show: boolean = true
    font: string = `NTSymbol, "メイリオ", "Meiryo", 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', sans-serif`
    license: string = ""
    css: CSS_String = ""

    constructor(f?: FontFamilyV1|Object|null){
        if(f instanceof Object){
            if("name" in f && typeof f.name === "string"){
                this.name = f.name
                if(this.name.length==0){
                    this.name = "新規フォント"
                }
            }
            if("description" in f && typeof f.description === "string"){
                this.description = f.description
            }
            if("customizable" in f && typeof f.customizable === "boolean"){
                this.customizable = f.customizable
            }
            if("show" in f && typeof f.show === "boolean"){
                this.show = f.show
            }
            if("font" in f && typeof f.font === "string"){
                this.font = f.font
                if(this.font.length==0){
                    this.font = `NTSymbol, "メイリオ", "Meiryo", 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', sans-serif`
                }
            }
            if("license" in f && typeof f.license === "string"){
                this.license = f.license
            }
            if("css" in f && typeof f.css === "string"){
                this.css = f.css
            }
        }
    }
}

/**
 * デフォルトのフォントセット
 */
export const localFontFamilyV1: FontFamiliesV1 = [
    {
        "name": "ゴシック体〔デフォルト〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "メイリオ", "Meiryo", 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', sans-serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "明朝体〔デフォルト〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, '游明朝',YuMincho,'ヒラギノ明朝 Pr6N','Hiragino Mincho Pr6N','ヒラギノ明朝 ProN','Hiragino Mincho ProN','ヒラギノ明朝 StdN','Hiragino Mincho StdN',HiraMinProN-W3,'HGS明朝B','HG明朝B',serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "Noto Sans〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "Noto Sans JP", sans-serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "游ゴシック〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "Yu Gothic", 游ゴシック, YuGothic, 游ゴシック体, sans-serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "源暎エムゴ〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "源暎エムゴ", sans-serif`,
        "css": "",
        "license": `Copyright (c) 2020-2021, おたもん (http://okoneya.jp/font/), with Reserved Font Name '源暎'.\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.`
    },
    {
        "name": "BIZ UDPゴシック〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "BIZ UDPGothic", sans-serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "新コミック体〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "新コミック体", sans-serif`,
        "css": "",
        "license": `Copyright (C) 2014 Adobe Systems Incorporated. All Rights Reserved.\nCopyright (C) 2014 FONT910. All Rights Reserved.\nLicensed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)`
    },
    {
        "name": "DotGothic16〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "DotGothic16", sans-serif`,
        "css": "",
        "license": `Copyright (C) 2014 Adobe Systems Incorporated. All Rights Reserved.\nCopyright (C) 2014 FONT910. All Rights Reserved.\nLicensed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)`
    },
    {
        "name": "Noto Serif〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "Noto Serif JP", serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "BIZ UDP明朝〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "BIZ UDPMincho", serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "さわらび明朝〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "Sawarabi Mincho", serif`,
        "css": "",
        "license": ""
    },
    {
        "name": "源暎こぶり明朝〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "源暎こぶり明朝", serif`,
        "css": "",
        "license": `Copyright (c) 2017-2022, おたもん (http://okoneya.jp/font/), with Reserved Font Name '源暎' and 'GenEi'.\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.`
    },
    {
        "name": "源暎ちくご明朝〔標準〕",
        "description": "Narou Tweaker オリジナル",
        "customizable": false,
        "show": true,
        "font": `NTSymbol, "源暎ちくご明朝", serif`,
        "css": "",
        "license": `Copyright (c) 2017-2022, おたもん (http://okoneya.jp/font/), with Reserved Font Name '源暎' and 'GenEi'.\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.`
    },
]

/**
 * 名前の重複しないフォントセットを作成
 * @param {FontFamiliesV1} fonts - 検索対象フォントセット一覧
 * @param {string} name - フォントセット名
 * @param {number} selected - 選択中のフォントセットのインデックス
 * @returns {string} - フォントセット名
*/
export function generateNoDuplicateFontFamilyName(fonts: FontFamiliesV1, name: string, selected?: number): string{
    if(checkSkinNameDuplicate(fonts, name, selected)){
        for(var i=1; i<=10000; i++){
            if(!checkSkinNameDuplicate(fonts, `${name}(${i})`)){
                name = `${name}(${i})`
                break
            }
        }
    }
    return name

    function checkSkinNameDuplicate(fonts: FontFamiliesV1, name: string, selected?: number){
      var res: boolean = false
      $.each(fonts, (i, font)=>{
          if(font.name===name && i!==selected){
              res = true;
          }
      })
      return res;
  }
}


export const localFont = {
    "font-size": 100,
    "line-height": 180,
    "text-rendering": "optimizeLegibility",
    "width": 600
}