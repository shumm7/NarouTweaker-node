import { nt } from "./narou-tweaker"
import { checkSkinVersion } from "./skin"
import { minifyCss } from "./text"
import { CSS_String } from "./type"
import { SkinV1 } from "./v1_skin"

export type SkinV2Src = "internal"|"local"|"sync"
export const maxLocalSkins = 30
export const maxSyncSkins = 10

/**
 * スキン(v2)
 * @param {string} name - スキン名
 * @param {string} description - 説明文
 * @param {boolean} customizable - 編集可能かどうか
 * @param {boolean} show - 表示するかどうか
 * @param {SkinV2Style} style - スタイルデータのオブジェクト
 * @param {CSS_String} css - カスタムCSS
 */
export class SkinV2{
    [key: string]: any
    private readonly keys: string[] = ["name", "description", "preview", "style", "css", "version"]
    readonly version: number = 2

    name: string = "新規スキン"
    description: string = ""
    preview: SkinV2Preview = new SkinV2Preview()
    style: Array<SkinV2Style> = []
    css: CSS_String = ""

    constructor(data: SkinV2)
    constructor(data: {name: string, description: string, preview: SkinV2Preview, style: Array<SkinV2Style>, css: CSS_String})
    constructor(data: Record<string,any>);
    constructor(data: string);
    constructor(data?: any) {
        if(typeof data==="string"){
            try{
                var data = JSON.parse(data)
                this.set(data)
            }catch(e){

            }
        }else{
            this.set(data)
        }
    }

    set(key: SkinV2|{name: string, description: string, preview: SkinV2Preview, style: Array<SkinV2Style>, css: CSS_String}): void;
    set(key: SkinV1|Record<string,any>): void;
    set(key: string, value: any): void;
    set(key?: any, value?: any): void{
        if(key instanceof SkinV2){
            this.name = key.name
            if(this.name.length == 0){
                this.name="新規スキン"
            }
            this.description = key.description
            this.preview = key.preview
            this.style = key.style
            this.css = key.css
        }else if(key instanceof SkinV1){
            this.set(convertSkinV1toV2(key))
        }else if(key!==null && typeof key === "object"){
            const v = checkSkinVersion(key)
            if(v === 2){
                for(var k of this.keys){
                    if(k in key){
                        this.set(k, key[k])
                    }
                }
            }else if(v === 1){
                this.set(convertSkinV1toV2(key))
            }
        }else if(typeof key==="string"){
            if("name" === key && typeof value === "string"){
                if(value.length == 0){
                    this.name = "新規スキン"
                }else{
                    this.name = value
                }   
            }
            else if("description" === key && typeof value === "string"){
                this.description = value
            }
            else if("css" === key && typeof value === "string"){
                this.css = value
            }
            else if("preview" === key){
                this.preview = new SkinV2Preview(value)
            }
            else if("style" === key && Array.isArray(value)){
                var ret: SkinV2Style[] = []
                for(var style of value){
                    ret.push(new SkinV2Style(style))
                }
                this.style = ret
            }
        }
    }

    get(): Record<string,any>;
    get(key: string): any;
    get(key?: string){
        if(typeof key==="string"){
            if(key in this.keys){
                return this[key]
            }
        }else{
            return {
                version: this.version,
                name: this.name,
                description: this.description,
                preview: this.preview,
                style: this.style,
                css: this.css
            }
        }
        
    }

    protected toJSON() {
        return this.get()
    }
}
class SkinV2Preview {
    [key: string]: any

    text: string = "#444"
    background: string = "#fff"

    constructor(data: {text?: string, background?: string});
    constructor(data: SkinV2Preview);
    constructor(data: Record<string,any>);
    constructor(data?: any);
    constructor(data?: any) {
        if(data instanceof SkinV2Preview){
            this.text = data.text
            this.background = data.background
        }else if(data!==null && typeof data === "object"){
            if("text" in data && typeof data.text === "string"){
                this.text = data.text
            }
            if("background" in data && typeof data.background === "string"){
                this.background = data.background
            }
        }
    }

    protected get(): Record<string,any> {
        return {
            text: this.text,
            background: this.background,
        }
    }

    protected toJSON() {
        return this.get()
    }
}
class SkinV2Style {
    [key: string]: any

    key?: string
    value?: string
    type?: "c"|"v"

    constructor(data: {key?: string, value?: string, type?: "c"|"v"|"col"|"var"|"color"|"variable"});
    constructor(data: SkinV2Style);
    constructor(data: Record<string,any>);
    constructor(data?: any);
    constructor(data?: any) {
        if(data instanceof SkinV2Preview){
            this.key = data.key
            this.value = data.value
            this.type = data.type
        }else if(data!==null && typeof data === "object"){
            if("key" in data && typeof data.key === "string"){
                this.key = data.key
            }
            if("value" in data && typeof data.value === "string"){
                this.value = data.value
            }
            if(data.type === "c" || data.type === "col" || data.type === "color"){
                this.type = "c"
            }else if(data.type === "v" || data.type === "var" || data.type === "variable"){
                this.type = "v"
            }
        }
    }

    get(): Record<string,any>{
        return {
            key: this.key,
            value: this.value,
            type: this.value
        }
    }

    protected toJSON() {
        return this.get()
    }
}

/** 使用可能スキン */
export interface AvailableSkin {
    src: "internal"|"local"
    key: number
}


export const localSkinsV2: Array<SkinV2> = [
    new SkinV2({
        name: "標準設定〔小説家になろう〕",
        description: "サイトのデフォルト",
        version: 2,
        preview: {
            text: "#444",
            background: "#fff"
        },
        style: [],
        css: ""
    }),
    new SkinV2({
        name: "ダーク（基本）",
        description: "Narou Tweaker オリジナル",
        version: 2,
        preview: {
            text: "rgba(255, 255, 255, 0.92)",
            background: "#1d2020"
        },
        style: [
            {
                key: "00-text",
                value: "rgba(255, 255, 255, 0.92)",
                type: "color",
            },
            {
                key: "01-link",
                value: "rgb(83, 155, 245)",
                type: "color",
            },
            {
                key: "02-link-visited",
                value: "rgb(135, 122, 245)",
                type: "color",
            },
            {
                key: "03-link-hover",
                value: "rgb(152, 189, 235)",
                type: "color",
            },
            {
                key: "04-bg",
                value: "#1d2020",
                type: "color",
            },
            {
                key: "color-custom-link-disabled",
                value: "#666",
                type: "color",
            },
            {
                key: "color-custom-bg--sub",
                value: "#2f2f2f",
                type: "color",
            },
            {
                key: "color-custom-border--sub",
                value: "rgba(255, 255, 255, 0.1)",
                type: "color",
            },
            {
                key: "color-custom-text--danger",
                value: "#ff1f1f",
                type: "color"
            },
            {
                key: "color-custom-epilist-underline-hover",
                value: "rgba(152, 189, 235, 0.7)",
                type: "color",
            },
            {
                key: "color-custom-header-item",
                value: "rgba(255, 255, 255, 0.3)",
                type: "color",
            },
            {
                key: "color-custom-header-item--visited",
                value: "rgba(114, 142, 176, 0.7)",
                type: "color",
            },
            {
                key: "color-custom-header-item--disabled",
                value: "color-custom-border--sub",
                type: "variable"
            },
            {
                key: "color-custom-header-item--hover",
                value: "color-custom-epilist-underline-hover",
                type: "variable"
            },
        ],
        css: ""
    })
]


function convertSkinV1toV2(skin: Record<string,any>|SkinV1): SkinV2{
    skin = new SkinV1(skin)

    return new SkinV2({
        name: skin.name,
        description: skin.description,
        version: 2,
        style: [
            {
                key: "00-text",
                value: skin.style.novel.color,
                type: "color",
            },
            {
                key: "01-link",
                value: skin.style.link.color,
                type: "color",
            },
            {
                key: "02-link-visited",
                value: skin.style.link.visited,
                type: "color",
            },
            {
                key: "03-link-hover",
                value: skin.style.link.hover,
                type: "color",
            },
            {
                key: "04-bg",
                value: skin.style.novel.background,
                type: "color",
            },
            {
                key: "color-custom-bg--sub",
                value: skin.style.novel.background_second,
                type: "color",
            },
            {
                key: "color-custom-border--sub",
                value: skin.style.sublist.color,
                type: "color",
            },
            {
                key: "color-custom-epilist-underline-hover",
                value: skin.style.sublist.hover,
                type: "color",
            },
            {
                key: "color-custom-header-item",
                value: skin.style.sublist.color,
                type: "color",
            },
            {
                key: "color-custom-header-item--visited",
                value: skin.style.sublist.visited,
                type: "color",
            },
            {
                key: "color-custom-header-item--disabled",
                value: "color-custom-border--sub",
                type: "variable"
            },
            {
                key: "color-custom-header-item--hover",
                value: skin.style.sublist.hover,
                type: "color",
            }
        ],
        css: skin.css
    })
}

/* スキン用CSSを生成 */
export function makeSkinCSS(skin: SkinV2, local?: nt.storage.local.options){
    function generateSkinVariable(style: Array<any>){
        var root = ""
    
        /* .js-customlayout */
        style.forEach(function(_s){
            const s = new SkinV2Style(_s)
            if(s){
                if(typeof s.value ==="string" && typeof s.key ==="string"){
                    if(s.type=="v"){
                        root += `--${s.key}:var(--${s.value})!important;`
                    }else if(s.type=="c"){
                        root += `--${s.key}:${s.value}!important;`
                    }
                }
            }
        })
        return `:root,body,*[class^="js-customlayout"],.narou-tweaker--custom-skin[class^="js-customlayout"]{${root}}`
    }

    
    var rule = ""

    /* データからスキンを生成 */
    rule += generateSkinVariable(skin.style)

    /* 簡易的なスキン */
    if(local?.novelCustomStyle){
        var customStyle = [
            {key: "color-custom-border", value: "color-custom-body-bg", type: "variable"},
            {key: "color-custom-border--sub", value: "color-custom-pager-border-disabled", type: "variable"},
            {key: "color-custom-attention-text", value: "color-custom-text", type: "variable"},
            {key: "color-custom-attention-bg", value: "color-custom-body-bg", type: "variable"},
            {key: "color-custom-attention-border", value: "color-custom-border--sub", type: "variable"},
            
            {key: "color-custom-novelinfo-datatable-border", value: "color-custom-border--sub", type: "variable"},
            {key: "color-custom-novelinfo-table-border", value: "color-custom-border--sub", type: "variable"},
            {key: "color-custom-novelinfo-header-border", value: "color-custom-border", type: "variable"},
            {key: "color-custom-novelinfo-noveltype-text", value: "color-custom-text", type: "variable"},
            {key: "color-custom-novelinfo-noveltype-bg", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelinfo-noveltype-border", value: "color-custom-border--sub", type: "variable"},
            {key: "color-custom-novelcom-box-bg", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelcom-box-border", value: "color-custom-border--sub", type: "variable"},
            {key: "color-custom-novelcom-box-bg--res", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelcom-box-border--res", value: "color-custom-border--sub", type: "variable"},
            {key: "color-custom-novelcom-box-text--res", value: "color-custom-text", type: "variable"},
            {key: "color-custom-novelcom-box-bg--review", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelcom-box-border--review", value: "color-custom-border--sub", type: "variable"},
            {key: "color-custom-novelcom-form-bg", value: "transparent", type: "color"},
            {key: "color-custom-novelcom-form-border", value: "color-custom-border--sub", type: "variable"},
            {key: "color-custom-novelcom-form-text", value: "color-custom-text", type: "variable"},
            {key: "color-custom-novelcom-episode-bg", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelcom-episode-text", value: "color-custom-text--sub", type: "variable"},
            {key: "color-custom-novelcom-warning-bg", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelreport-highlight", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelreport-box-bg", value: "color-custom-bg--sub", type: "variable"},
            {key: "color-custom-novelreport-box-border", value: "color-custom-border--sub", type: "variable"},
        ]
        rule = generateSkinVariable(customStyle) + rule
    }

    // スキンが適用されるまでの一時的な繋ぎ（画面のチラツキ防止）
    rule += `
        body:not(.narou-tweaker--custom-skin) {
            background: var(--color-custom-body-bg);
            color: var(--color-custom-text);
        }
        body:not(.narou-tweaker--custom-skin) {
            a:link {
                color: var(--color-custom-link);
            }
            a:visited {
                color: var(--color-custom-link-visited);
            }
            a:hover {
                color: var(--color-custom-link-hover);
            }
        }
    `
    rule += `
        .c-announce-box {
            background-color: var(--color-custom-body-bg);
            color: var(--color-custom-text);
        }
    `
    if(local?.novelCustomStyle){
        rule += `
        .novel-titles .novel-title,
        .novel-titles .novel-author,
        .novel-chapter {
            color: var(--color-custom-text--sub) !important;
        }
        .novel-titles#ep-0 .novel-title,
        .novel-titles#ep-1 .novel-title {
            color: var(--color-custom-text) !important;
        }

        .novel-titles {
            line-height: normal;
            word-break: break-word;
            text-align: left;
        }
        .novel-titles .novel-title {
            line-height: normal;
            font-weight: bold;
            word-break: break-word;
            word-break: auto-phrase;
        }
        .novel-titles .novel-author {
            margin-top: .5em;
            font-size: 90%;
        }
        .novel-titles#ep-0,
        .novel-titles#ep-1 {
            text-align: center;
            margin-top: 4em;
            margin-bottom: 4em;
        }
        .novel-titles#ep-0 .novel-title,
        .novel-titles#ep-1 .novel-title {
            font-size: 3em;
        }
        .novel-titles#ep-0 .novel-author,
        .novel-titles#ep-1 .novel-author {
            text-align: center;
            font-size: 2em;
            margin-top: .5em;
        }
        .novel-chapter {
            text-align: center;
            font-size: 90%;
        }
        .novel-titles a,
        #novel_vertical_items .novel-titles a {
            color: inherit !important;
        }
        `
    }

    /* ヘッダ有効化時の残像を非表示 */
    if(Number(local?.novelCustomHeaderType) == 1 || Number(local?.novelCustomHeaderType)==2){
        rule += `
        .l-scrollheader,
        .l-scrollheader {
            display: none !important;
        }
        `
    }


    return minifyCss(rule)
}

/* ツール */
export function getSkin(src: "internal", key: number): SkinV2|undefined
export function getSkin(src: "local", key: number, local?: nt.storage.local.options): SkinV2|undefined
export function getSkin(src: "sync", key: number, sync?: nt.storage.sync.options): SkinV2|undefined
export function getSkin(src: SkinV2Src, key: number, local?: nt.storage.local.options|nt.storage.sync.options, sync?: nt.storage.sync.options): SkinV2|undefined;
export function getSkin(src: SkinV2Src, key: number, local?: nt.storage.local.options|nt.storage.sync.options, sync?: nt.storage.sync.options): SkinV2|undefined{
    if(src === "internal"){
        return localSkinsV2.at(key)
    }else if(src === "local" && local instanceof nt.storage.local.options){
        return local.novelSkins.at(key)
    }else if(src === "sync" && local instanceof nt.storage.sync.options){
        return local.novelSkins.at(key)
    }else if(src === "sync" && sync instanceof nt.storage.sync.options){
        return sync.novelSkins.at(key)
    }
}

export function getSkinList(src: "internal"): Array<SkinV2>
export function getSkinList(src: "local", local?: nt.storage.local.options): Array<SkinV2>
export function getSkinList(src: "sync", sync?: nt.storage.sync.options): Array<SkinV2>
export function getSkinList(src: SkinV2Src, local?: nt.storage.local.options|nt.storage.sync.options, sync?: nt.storage.sync.options): Array<SkinV2>;
export function getSkinList(src: SkinV2Src, local?: nt.storage.local.options|nt.storage.sync.options, sync?: nt.storage.sync.options): Array<SkinV2>{
    if(src === "internal"){
        return localSkinsV2
    }else if(src === "local" && local instanceof nt.storage.local.options){
        return local.novelSkins
    }else if(src === "sync" && local instanceof nt.storage.sync.options){
        return local.novelSkins
    }else if(src === "sync" && sync instanceof nt.storage.sync.options){
        return sync.novelSkins
    }
    return []
}

export function getSkinFromIndex(i: number, local: nt.storage.local.options): SkinV2|undefined{
    const l = local.novelSkinsAvailable.at(i)
    if(l!==undefined){
        return getSkin(l.src, l.key, local)
    }
}

export function getSelectedSkin(local: nt.storage.local.options): SkinV2|undefined{
    return getSkin(local.novelSkinSelected.src, local.novelSkinSelected.key, local)
}

export function getSelectedSkinIndex(local: nt.storage.local.options): number|undefined {
    const list = local.novelSkinsAvailable
    const selected = local.novelSkinSelected
    for(let i=0; i<list.length; i++){
        if(list[i].src===selected.src && list[i].key===selected.key){
            return i
        }
    }
    return undefined
}


export function addSkin(skin: SkinV2, src: "local"): void{
    if(src==="local"){
        nt.storage.local.get(null).then((local)=>{
            const key: number = nt.lib.array.putIn(local.novelSkins, skin)
            local.novelSkinsAvailable.push({src: src, key: key})
            nt.storage.local.set(local.get([`novelSkin_${key}`, "novelSkinsAvailable"]))
        })
    }
}

export function removeSkin(i: number){
    nt.storage.local.get(null).then((local)=>{
        const list = local.novelSkinsAvailable.at(i)

        const selectedIndex = getSelectedSkinIndex(local)
        if(list!==undefined && list.src!=="internal" && local.novelSkinsAvailable.length>1){
            if(selectedIndex!==undefined){
                if(selectedIndex-1 >= 0 && selectedIndex-1 < local.novelSkinsAvailable.length){
                    local.novelSkinSelected = local.novelSkinsAvailable[selectedIndex-1]
                }else if(selectedIndex-1 < 0 && local.novelSkinsAvailable.length > 0){
                    local.novelSkinSelected = local.novelSkinsAvailable[0]
                }else{
                    local.novelSkinSelected = {src: "internal", key: 0}
                }
            }

            if(list.src==="local"){
                local.novelSkinsAvailable = local.novelSkinsAvailable.filter((v)=>{return v?.src!==list.src || v?.key!==list.key})
                nt.storage.local.remove(`novelSkin_${list.key}`).then(()=>{
                    nt.storage.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
                })
            }
        }

    })
}

export function activateSkin(src: "internal"|"local", key: number, selectThis?: boolean){
    nt.storage.local.get(null).then((local)=>{
        const selectedIndex = getSelectedSkinIndex(local)
        if(src === "internal"){
            if(localSkinsV2.at(key)!==undefined){
                const p = nt.lib.array.putIn(local.novelSkinsAvailable, {src: src, key: key})
                if(selectThis){
                    local.novelSkinSelected = {src: src, key: key}
                }else if(selectedIndex !==undefined && p <= selectedIndex && selectedIndex + 1 < local.novelSkinsAvailable.length){
                    local.novelSkinSelected = local.novelSkinsAvailable[selectedIndex + 1]
                }
                nt.storage.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
            }
        }else if(src === "local"){
            if(local.novelSkins.at(key)!==undefined){
                const p = nt.lib.array.putIn(local.novelSkinsAvailable, {src: src, key: key})
                if(selectThis){
                    local.novelSkinSelected = {src: src, key: key}
                }else if(selectedIndex !==undefined && p <= selectedIndex && selectedIndex + 1 < local.novelSkinsAvailable.length){
                    local.novelSkinSelected = local.novelSkinsAvailable[selectedIndex + 1]
                }
                nt.storage.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
            }
        }
    })
}

export function inactivateSkin(i: number){
    nt.storage.local.get(null).then((local)=>{
        const selectedIndex = getSelectedSkinIndex(local)
        if(local.novelSkinsAvailable!==undefined && local.novelSkinsAvailable.length > 1){
            nt.lib.array.removeAt(local.novelSkinsAvailable, i)
            if(selectedIndex!==undefined){
                if(selectedIndex-1 >= 0 && selectedIndex-1 < local.novelSkinsAvailable.length){
                    local.novelSkinSelected = local.novelSkinsAvailable[selectedIndex-1]
                }else if(selectedIndex-1 < 0 && local.novelSkinsAvailable.length > 0){
                    local.novelSkinSelected = local.novelSkinsAvailable[0]
                }else{
                    local.novelSkinSelected = {src: "internal", key: 0}
                }

            }

            nt.storage.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
        }
    })
}

export function swapAvailableSkin(from: number, to: number){
    nt.storage.local.get(null).then((local)=>{
        const selectedIndex = getSelectedSkinIndex(local)
        let toData = local.novelSkinsAvailable.at(to)
        let fromData = local.novelSkinsAvailable.at(from)
        if(fromData!==undefined && toData!==undefined){
            if(selectedIndex === from){
                local.novelSkinSelected = toData
            }else if(selectedIndex === to){
                local.novelSkinSelected = fromData
            }
            nt.lib.array.swap(local.novelSkinsAvailable, from, to)
            nt.storage.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
        }
    })
}