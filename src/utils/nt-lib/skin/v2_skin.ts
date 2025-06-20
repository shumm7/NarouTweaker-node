import { __nt_skin_v1__ } from "./v1_skin"
import { __nt_skin__ } from "../skin"
import { __nt_text__, __nt_array__ } from "../utils"
import { __nt_storage__ } from "../storage"

export namespace __nt_skin_v2__ {

    export type SkinSrc = "internal"|"local"|"sync"
    export const maxLocalSkins = 30
    export const maxSyncSkins = 10

    /**
     * スキン(v2)
     * @param {string} name - スキン名
     * @param {string} description - 説明文
     * @param {boolean} customizable - 編集可能かどうか
     * @param {boolean} show - 表示するかどうか
     * @param {Skin_Style} style - スタイルデータのオブジェクト
     * @param {CSS_String} css - カスタムCSS
     */
    export class Skin {
        [key: string]: any
        private readonly keys: string[] = ["name", "description", "preview", "style", "css", "version"]
        readonly version: number = 2

        name: string = "新規スキン"
        description: string = ""
        preview: Skin_Preview = new Skin_Preview()
        style: Array<Skin_Style> = []
        css: __nt_text__.CSS_String = ""

        constructor(data: Skin)
        constructor(data: {name: string, description: string, preview: Skin_Preview, style: Array<Skin_Style>, css: __nt_text__.CSS_String})
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

        set(key: Skin|{name: string, description: string, preview: Skin_Preview, style: Array<Skin_Style>, css: __nt_text__.CSS_String}): void;
        set(key: __nt_skin_v1__.Skin|Record<string,any>): void;
        set(key: string, value: any): void;
        set(key?: any, value?: any): void{
            if(key instanceof Skin){
                this.name = key.name
                if(this.name.length == 0){
                    this.name="新規スキン"
                }
                this.description = key.description
                this.preview = key.preview
                this.style = key.style
                this.css = key.css
            }else if(key instanceof __nt_skin_v1__.Skin){
                this.set(convertSkinV1toV2(key))
            }else if(key!==null && typeof key === "object"){
                const v = __nt_skin__.checkVersion(key)
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
                    this.preview = new Skin_Preview(value)
                }
                else if("style" === key && Array.isArray(value)){
                    var ret: Skin_Style[] = []
                    for(var style of value){
                        ret.push(new Skin_Style(style))
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

    class Skin_Preview {
        [key: string]: any

        text: string = "#444"
        background: string = "#fff"

        constructor(data: {text?: string, background?: string});
        constructor(data: Skin_Preview);
        constructor(data: Record<string,any>);
        constructor(data?: any);
        constructor(data?: any) {
            if(data instanceof Skin_Preview){
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

    class Skin_Style {
        [key: string]: any

        key?: string
        value?: string
        type?: "c"|"v"

        constructor(data: {key?: string, value?: string, type?: "c"|"v"|"col"|"var"|"color"|"variable"});
        constructor(data: Skin_Style);
        constructor(data: Record<string,any>);
        constructor(data?: any);
        constructor(data?: any) {
            if(data instanceof Skin_Preview){
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


    export const internalSkins: Array<Skin> = [
        new Skin({
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
        new Skin({
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


    function convertSkinV1toV2(skin: Record<string,any>|__nt_skin_v1__.Skin): Skin{
        skin = new __nt_skin_v1__.Skin(skin)

        return new Skin({
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
    export function makeSkinCSS(skin: Skin, local?: __nt_storage__.local.options){
        function generateSkinVariable(style: Array<any>){
            var root = ""
        
            /* .js-customlayout */
            style.forEach(function(_s){
                const s = new Skin_Style(_s)
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


        return __nt_text__.minifyCss(rule)
    }

    /* ツール */
    /**
     * キーとストレージを指定して、スキンデータを取得。
     * @param src 対象のストレージ
     * @param key キー
     * @param storage local/syncストレージ
     * @returns スキンデータ（存在しない場合は`undefined`）
     */
    export function getSkin(src: "internal", key: number, storage?: any): Skin|void
    export function getSkin(src: "local", key: number, local: __nt_storage__.local.options): Skin|void
    export function getSkin(src: "sync", key: number, sync: __nt_storage__.sync.options): Skin|void
    export function getSkin(src: SkinSrc, key: number, storage: __nt_storage__.local.options|__nt_storage__.sync.options): Skin|void;
    export function getSkin(src: SkinSrc, key: number): Promise<Skin|void>;
    export function getSkin(src: SkinSrc, key: number, storage?: __nt_storage__.local.options|__nt_storage__.sync.options): Skin|void|Promise<Skin|void>{
        if(src === "internal"){
            return internalSkins.at(key)
        }else if(src === "local"){
            if(storage instanceof __nt_storage__.local.options){
                return storage.novelSkins.at(key)
            }else{
                return __nt_storage__.local.get("novelSkins").then((local)=>{return local.novelSkins.at(key)}).catch(()=>{return})
            }
        }else if(src === "sync"){
            if(storage instanceof __nt_storage__.sync.options){
                return storage.novelSkins.at(key)
            }else{
                return __nt_storage__.sync.get("novelSkins").then((sync)=>{return sync.novelSkins.at(key)}).catch(()=>{return})
            }
        }
    }

    
    /**
     * 特定のストレージに含まれるスキンデータをすべて取得。
     * @param src 対象のストレージ
     * @param storage local/syncストレージ
     * @returns スキンデータの配列
     */
    export function getSkinList(src: "internal"): Array<Skin>;
    export function getSkinList(src: "local", local: __nt_storage__.local.options): Array<Skin>;
    export function getSkinList(src: "sync", sync: __nt_storage__.sync.options): Array<Skin>
    export function getSkinList(src: SkinSrc, storage: __nt_storage__.local.options|__nt_storage__.sync.options): Array<Skin>;
    export function getSkinList(src: SkinSrc): Promise<Array<Skin>>;
    export function getSkinList(src: SkinSrc, storage?: __nt_storage__.local.options|__nt_storage__.sync.options): Array<Skin>|Promise<Array<Skin>>{
        if(src === "internal"){
            return internalSkins
        }else if(src === "local"){
            if(storage instanceof __nt_storage__.local.options){
                return storage.novelSkins
            }else{
                return __nt_storage__.local.get("novelSkins").then((local)=>{return local.novelSkins}).catch((e)=>{return []})
            }
        }else if(src === "sync"){
            if(storage instanceof __nt_storage__.sync.options){
                return storage.novelSkins
            }else{
                return __nt_storage__.sync.get("novelSkins").then((sync)=>{return sync.novelSkins}).catch((e)=>{return []})
            }
        }
        return []
    }

    /**
     * 「使用可能なスキンリスト」からインデックスを指定して、スキンを取得。
     * @param i インデックス
     * @param local localストレージ
     * @returns スキンデータ（存在しない場合は`undefined`）
     */
    export function getSkinFromIndex(i: number): Promise<Skin|void>
    export function getSkinFromIndex(i: number, local: __nt_storage__.local.options): Skin|void
    export function getSkinFromIndex(i: number, local?: __nt_storage__.local.options): Skin|void|Promise<Skin|void>{
        if(local===undefined){
            return __nt_storage__.local.get(null).then((l)=>{
                return getSkinFromIndex(i, l)
            })

        }else{
            const l = local.novelSkinsAvailable.at(i)
            if(l!==undefined){
                return getSkin(l.src, l.key, local)
            }
        }
    }

    /**
     * 適用中のスキンを取得。
     * @param local localストレージ
     * @returns スキンデータ（存在しない場合は`undefined`）
     */
    export function getSelectedSkin(): Promise<Skin|void>
    export function getSelectedSkin(local: __nt_storage__.local.options): Skin|void
    export function getSelectedSkin(local?: __nt_storage__.local.options): Skin|void|Promise<Skin|void>{
        if(local===undefined){
            return __nt_storage__.local.get(null).then((l)=>{
                return getSelectedSkin(l)
            })
        }else{
            return getSkin(local.novelSkinSelected.src, local.novelSkinSelected.key, local)
        }
    }

    /**
     * 「使用可能なスキンリスト」でのインデックスを取得。
     * @param src 対象のストレージ
     * @param key キー
     * @param local localストレージ
     * @returns インデックス（取得できなかった場合は`undefined`）
     */
    export function getSkinIndex(src: SkinSrc, key: number, local: __nt_storage__.local.options): number|void;
    export function getSkinIndex(src: SkinSrc, key: number): Promise<number|void>;
    export function getSkinIndex(src: SkinSrc, key: number, local?: __nt_storage__.local.options): number|void|Promise<number|void> {
        if(local===undefined){
            return __nt_storage__.local.get(null).then((l)=>{
                return getSkinIndex(src, key, l)
            })
        }else{
            const list = local.novelSkinsAvailable
            for(let i=0; i<list.length; i++){
                if(list[i].src===src && list[i].key===key){
                    return i
                }
            }
            return
        }
    }

    /**
     * 適用中のスキンの「使用可能なスキンリスト」でのインデックスを取得。
     * @param local localストレージ
     * @returns インデックス（取得できなかった場合は`undefined`）
     */
    export function getSelectedSkinIndex(local: __nt_storage__.local.options): number|void;
    export function getSelectedSkinIndex(): Promise<number|void>;
    export function getSelectedSkinIndex(local?: __nt_storage__.local.options): number|void|Promise<number|void> {
        if(local===undefined){
            return __nt_storage__.local.get(null).then((l)=>{
                return getSelectedSkinIndex(l)
            })
        }else{
            const selected = local.novelSkinSelected
            return getSkinIndex(selected.src, selected.key, local)
        }
    }

    /**
     * 新規スキンを保存する
     * @param skin スキンデータ
     * @param src 対象のストレージ
     * @param addAvailableList 「使用可能なスキンリスト」に追加するかどうか
     */
    export async function addSkin(skin: Skin, src: "local", addAvailableList?: boolean): Promise<number|undefined>;
    /**
     * 新規スキンを保存する
     * @param skin スキンデータ
     * @param src 対象のストレージ
     */
    export async function addSkin(skin: Skin, src: "sync"): Promise<number|void>;
    export async function addSkin(skin: Skin, src: "local"|"sync", addAvailableList: boolean = false): Promise<number|void>{
        if(src==="local"){
            let local = await __nt_storage__.local.get(null)
            const key: number = __nt_array__.putin(local.novelSkins, skin)
            if(addAvailableList){
                local.novelSkinsAvailable.push({src: src, key: key})
                return await __nt_storage__.local.set(local.get([`novelSkin_${key}`, "novelSkinsAvailable"])).then(()=>{return key}).catch()
            }else{
                return await __nt_storage__.local.set(local.get([`novelSkin_${key}`])).then(()=>{return key}).catch()
            }
        }else if(src==="sync"){
            let sync = await __nt_storage__.sync.get(null)
            const key: number = __nt_array__.putin(sync.novelSkins, skin)
            return await __nt_storage__.sync.set(sync.get([`novelSkin_${key}`])).then(()=>{return key}).catch()
        }
    }

    /**
     * スキンを削除する。
     * @param src 対象のストレージ
     * @param key キー
     */
    export async function removeSkin(src: number|SkinSrc, key?: number): Promise<void>{
        if(typeof src==="number"){
            const i = src
            let local = await __nt_storage__.local.get(null)
            const availableSkin = local.novelSkinsAvailable.at(i)
            if(availableSkin!==undefined){
                return await removeSkin(availableSkin.src, availableSkin.key)
            }

        }else if(typeof src==="string" && typeof key==="number"){
            if(src==="local"){
                let local = await __nt_storage__.local.get(null)
                const skin = local.novelSkins.at(key)
                if(skin!==undefined){
                    const i = getSkinIndex("local", key, local)
                    var result = false
                    if(i!==undefined){
                        result = _inactivateSkin(i, local)
                    }

                    __nt_array__.removeAt(local.novelSkins, key)
                    if(result){
                        await __nt_storage__.local.remove(`novelSkin_${key}`)
                        await __nt_storage__.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
                    }else{
                        await __nt_storage__.local.remove(`novelSkin_${key}`)
                    }
                }
            }else if(src==="sync"){
                let sync = await __nt_storage__.sync.get(null)
                const skin = sync.novelSkins.at(key)
                if(skin!==undefined){
                    await __nt_storage__.sync.remove(`novelSkin_${key}`)
                }

            }else if(src==="internal"){
                await inactivateSkin(src, key)
            }
        }
    }

    /**
     * 「使用可能なスキンリスト」にスキンを追加（有効化）
     * @param src 対象のストレージ
     * @param key キー
     * @param selectThis スキンを有効化した時に、そのスキンを選択するかどうか
     */
    export async function activateSkin(src: "internal"|"local", key: number, selectThis: boolean = true): Promise<void>{
        let local = await __nt_storage__.local.get(null)
        if(src === "internal"){
            activate(internalSkins.at(key), selectThis, local)
            await __nt_storage__.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
        }else if(src === "local"){
            activate(local.novelSkins.at(key), selectThis, local)
            await __nt_storage__.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
        }

        function activate(skin: Skin|undefined, selectThis: boolean, local: __nt_storage__.local.options){
            const selectedIndex = getSelectedSkinIndex(local)
            if(skin!==undefined){
                const p = __nt_array__.putin(local.novelSkinsAvailable, {src: src, key: key})
                if(selectThis){
                    local.novelSkinSelected = {src: src, key: key}
                }else if(selectedIndex !==undefined && p <= selectedIndex && selectedIndex + 1 < local.novelSkinsAvailable.length){
                    local.novelSkinSelected = local.novelSkinsAvailable[selectedIndex + 1]
                }
            }
        }
    }

    /**
     * 「使用可能なスキンリスト」からスキンを削除（無効化）
     * @param i インデックス
     */
    export async function inactivateSkin(i: number): Promise<void>;
    /**
     * 「使用可能なスキンリスト」からスキンを削除（無効化）
     * @param src 対象のストレージ
     * @param key キー
     */
    export async function inactivateSkin(src: "internal"|"local", key: number): Promise<void>;
    export async function inactivateSkin(src: number|"internal"|"local", key?:number): Promise<void>{
        let local = await __nt_storage__.local.get(null)
        if(typeof src === "number"){
            if(_inactivateSkin(src, local)){
                await __nt_storage__.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
            }
            
        }else if(typeof src==="string" && typeof key==="number"){
            const i = getSkinIndex(src, key, local)
            if(i!==undefined){
                if(_inactivateSkin(i, local)){
                    await __nt_storage__.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
                }
            }
        }
    }

    function _inactivateSkin(i: number, local: __nt_storage__.local.options): boolean{
        const selectedIndex = getSelectedSkinIndex(local)
        if(local.novelSkinsAvailable!==undefined && local.novelSkinsAvailable.length > 1 && local.novelSkinsAvailable.at(i)!==undefined){
            __nt_array__.removeAt(local.novelSkinsAvailable, i)
            if(selectedIndex!==undefined){
                if(selectedIndex-1 >= 0 && selectedIndex-1 < local.novelSkinsAvailable.length){
                    local.novelSkinSelected = local.novelSkinsAvailable[selectedIndex-1]
                }else if(selectedIndex-1 < 0 && local.novelSkinsAvailable.length > 0){
                    local.novelSkinSelected = local.novelSkinsAvailable[0]
                }else{
                    local.novelSkinSelected = {src: "internal", key: 0}
                }
            }
            return true
        }
        return false
    }

    /**
     * 「使用可能なスキンリスト」のデータを入れ替える
     * @param from 移動元のインデックス
     * @param to 移動先のインデックス
     */
    export async function swapAvailableSkin(from: number, to: number): Promise<void>{
        let local = await __nt_storage__.local.get(null)
        const selectedIndex = getSelectedSkinIndex(local)
        let fromData = local.novelSkinsAvailable.at(from)
        let toData = local.novelSkinsAvailable.at(to)

        if(fromData!==undefined && toData!==undefined){
            if(selectedIndex === from){
                local.novelSkinSelected = toData
            }else if(selectedIndex === to){
                local.novelSkinSelected = fromData
            }
            __nt_array__.swap(local.novelSkinsAvailable, from, to)
            await __nt_storage__.local.set(local.get(["novelSkinsAvailable", "novelSkinSelected"]))
        }
    }

    /**
     * 「使用可能なスキンリスト」のデータを移動する
     * @param i 移動元のインデックス
     * @param moveCount 移動量を表す正の整数（正の場合はリストの後ろへ、負の場合はリストの前へ）
     */
    export async function moveAvailableSkin(i: number, moveCount: number): Promise<void>{
        let local = await __nt_storage__.local.get(null)
        const to = i + moveCount

        if(local.novelSkinsAvailable.at(i)!==undefined && local.novelSkinsAvailable.at(to)!==undefined){
            __nt_array__.move(local.novelSkinsAvailable, i, to)
            await __nt_storage__.local.set(local.get(["novelSkinsAvailable"]))
        }
    }


    /**
     * 既存のスキンをsyncストレージへ追加する
     * @param i 「使用可能なスキンリスト」のインデックス
     */
    export async function uploadSkin(i: number): Promise<number|void>;
    /**
     * 既存のスキンをsyncストレージへ追加する
     * @param src 対象のストレージ
     * @param key キー
     */
    export async function uploadSkin(src: "internal"|"local", key:number): Promise<number|void>;
    export async function uploadSkin(src: number|"internal"|"local", key?:number): Promise<number|void>{
        if(typeof src==="string" && typeof key==="number"){
            if(src==="internal"){
                const skin =  __nt_skin_v2__.internalSkins.at(key)
                if(skin!==undefined){
                    await addSkin(skin, "sync")
                }

            }else if(src==="local"){
                let local = await __nt_storage__.local.get(null)
                const skin = local.novelSkins.at(key)
                if(skin!==undefined){
                    await addSkin(skin, "sync")
                }
            }

        }else if(typeof src==="number"){
            const i = src
            const local = await __nt_storage__.local.get(null)
            const skin = getSkinFromIndex(i, local)
            if(skin!==undefined){
                return addSkin(skin, "sync")
            }
        }
    }

    /**
     * syncストレージのスキンをlocalストレージに保存する
     * @param key キー
     * @param addAvailableList 追加したスキンを選択するかどうか
     */
    export async function downloadSkin(key: number, addAvailableList?: boolean): Promise<number|undefined>{
        const sync = await __nt_storage__.sync.get(null)
        const skin = sync.novelSkins.at(key)
        if(skin!==undefined){
            return addSkin(skin, "local", addAvailableList)
        }
    }
}