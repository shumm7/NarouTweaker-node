import { getOptionFromID, getOptionPageFromID } from "../../options/_utils/optionUI_utils"
import { OptionID, OptionUI_Item, OptionUI_ItemID } from "../../options/_utils/optionUI_type"

import { __nt_text__ } from "./utils"
import { __nt_extension__ } from "./process"
import { __nt_skin_v1__ } from "./skin/v1_skin"
import { __nt_skin_v2__ } from "./skin/v2_skin"
import { __nt_api__ } from "./api"
import { __nt_font_v1__ } from "./skin/v1_font"
import { __nt_workspace__ } from "./workspace"
import { __nt_header__ } from "./header"

import browser from "webextension-polyfill"



function _checkLocalValue(key: OptionID, value: any): any {
    var opt = new __nt_storage__.local.options()
    if (typeof opt[key] === typeof value && typeof opt[key] !== "function") {
        if (key === "extOptionsVersion") {
            return
        } else if (["kasasagiGraphType_GeneralDay", "kasasagiGraphType_GeneralTotal", "kasasagiGraphType_ChapterUnique", "kasasagiGraphType_DayPV", "kasasagiGraphType_DayUnique", "kasasagiGraphType_MonthPV", "kasasagiGraphType_MonthUnique"].includes(key)) {
            if (!["bar", "line"].includes(value)) {
                return
            }
        } else if (["novelCustomHeaderMode", "workspaceCustomHeaderMode"].includes(key)) {
            if (!["absolute", "fixed", "scroll"].includes(value)) {
                return
            }
        }
        else if (key === "correctionNumberShort" || key === "correctionNumberLong" || key === "correctionNumberSymbol") {
            if (!["default", "half", "full", "kanji"].includes(value)) {
                return
            }
        } else if (["novelCustomHeaderLeft", "novelCustomHeaderRight"].includes(key)) {
            if (!Array.isArray(value)) { return }

            var list: Array<__nt_header__.iconId> = []
            value.forEach(function (id) {
                if (id in __nt_header__.novelIconList) {
                    list.push(id)
                }
            })
            return list
        } else if ("workspaceCustomHeader" === key) {
            if (!Array.isArray(value)) { return }

            var list: Array<__nt_header__.iconId> = []
            value.forEach(function (id) {
                if (id in __nt_header__.workspaceIconList) {
                    list.push(id)
                }
            })
            return list

        } else if (["workspaceCustomMenu_Left", "workspaceCustomMenu_Middle", "workspaceCustomMenu_Right"].includes(key)) {
            if (!Array.isArray(value)) { return }

            var list: Array<__nt_header__.iconId> = []
            value.forEach(function (id) {
                if (id in __nt_header__.workspaceMenuIconList) {
                    list.push(id)
                }
            })
            return list
        } else if ("extFavoriteOptions" === key) {
            if (Array.isArray(value)) {
                var list: Array<OptionUI_ItemID> = []
                value.forEach(function (option) {
                    var optionData: OptionUI_Item | undefined = getOptionFromID(option)
                    if (optionData?.value?.buttons?.favorite) {
                        list.push(optionData.id)
                    }
                })
                var listNoDuplicate = list.filter((e, i) => {
                    return list.indexOf(e) == i;
                })
                return listNoDuplicate
            }
            return
        } else if ("extPopupDefaultPage" === key) {
            if (value !== "__auto__") {
                var page = getOptionPageFromID(value)
                if ((page?.popup?.defaultPage && page?.title && page?.id)) {
                    return value
                }
            }
            return
        } else if("novelSkinsAvailable" === key){
            if(Array.isArray(value)){
                var p: Array<__nt_skin_v2__.AvailableSkin> = []
                for(let i = 0; i<value.length; i++){
                    const src = value[i]?.src
                    const key = value[i]?.key
                    if((src==="internal" || src==="local") && typeof key === "number" && isFinite(key)){
                        p.push(value[i])
                    }
                }
                return p
            }
        } else if("novelSkinSelected" === key){
            const src = value?.src
            const key = value?.key
            if((src==="internal" || src==="local") && typeof key === "number" && isFinite(key)){
                return {src: src, key: key}
            }
        }
        return value
    }
}

function _checkSyncValue(key: OptionID, value: any): any {
    var opt = new __nt_storage__.local.options()
    if (typeof opt[key] === typeof value && typeof opt[key] !== "function") {
        if (key === "novelHistory") {
            if (Array.isArray(value)) {
                var list: string[] = []
                for (const history of value) {
                    const ncode = new __nt_api__.ncode(history).ncode()
                    if (ncode !== undefined) {
                        list.push(ncode)
                    }
                    return list
                }
            }
        }
        else if (key === "novelHistoryData") {
            if (value instanceof Object) {
                var ret: Record<string, [number, number, string]> = {}
                for (const n of Object.keys(value)) {
                    const ncode = new __nt_api__.ncode(n).ncode()
                    if (ncode !== undefined && Array.isArray(value[ncode])) {
                        if (value[ncode].length == 3) {
                            if (
                                typeof value[ncode][0] === "number" &&
                                typeof value[ncode][1] === "number" &&
                                typeof value[ncode][2] === "string"
                            ) {
                                ret[ncode] = [value[ncode][0], value[ncode][1], value[ncode][2]]
                            }
                        }
                    }
                }
                return ret
            }
            return
        }
        return value
    }
}

function _checkSessionValue(key: OptionID, value: any): any {
    var opt = new __nt_storage__.session.options()
    if (typeof opt[key] === typeof value && typeof opt[key] !== "function") {
        return value
    }
}


export namespace __nt_storage__ {
    export namespace local {
        /**
         * 設定データ（storage.local）
         */
        export class options {
            [key: string]: any

            /* Extension */
            extOptionsVersion: string = __nt_extension__.version
            extAdvancedSettings: boolean = false
            extExperimentalFeatures: boolean = false
            extDebug: boolean = false
            extFavoriteOptions: Array<string> = []
            extPopupDefaultPage: string = "__auto__"
            extOptionPageButtons: boolean = true
            extNotifications: boolean = true

            /* Narou */
            narouSkipAgeauth: boolean = false
            narouSyuppanShowBookImage: boolean = true
            narouSyuppanShowBookViewImage: boolean = true

            /* Novel */
            novelCustomStyle: boolean = true
            novelCustomHeaderType: number | string = "2"
            novelCustomCSS: __nt_text__.CSS_String = ""
            novelLegacyHeaderIcon: boolean = true
            novelVertical: boolean = false
            novelCustomHeaderScrollHidden: boolean = false
            novelCustomHeaderMode: string = "scroll"
            novelCustomHeaderLeft: Array<__nt_header__.iconId> = ["home", "info", "impression", "review", "pdf", "favepisode", "favlist_add", "booklist"]
            novelCustomHeaderRight: Array<__nt_header__.iconId> = ["option"]
            novelCustomHeaderShowEnactiveItems: boolean = false
            novelCustomHeaderSocialShowsBrandName: boolean = false
            novelCustomHeaderQRCodeCurrentLocation: boolean = true
            novelCustomHeaderQRCodeShowURL: boolean = false
            novelPrefaceAutoURL: boolean = true
            novelAfterwordAutoURL: boolean = true
            novelShowAllExtext: boolean = false
            novelShowHistoryOnSublist: boolean = true
            novelForceMypageLink: boolean = false
            novelCursorHide: boolean = false
            novelCursorHideTimeout: number = 5
            novelAttentionBanner: boolean = false

            /* Workspace */
            workspaceCustomHeader: Array<__nt_header__.iconId> = ["user", "message", "home", "menu"]
            workspaceCustomHeaderScrollHidden: boolean = false
            workspaceCustomHeaderMode: string = "absolute"
            workspaceCustomMenu_Left: Array<__nt_header__.iconId> = ["favorite", "edit", "blog"]
            workspaceCustomMenu_Middle: Array<__nt_header__.iconId> = ["reaction", "block-mute", "x-home"]
            workspaceCustomMenu_Right: Array<__nt_header__.iconId> = ["find", "support"]
            workspaceHeaderAdditionalMenu: boolean = false
            workspaceBookmarkLayout: number | string = "0"
            workspaceBookmarkReplaceEpisode: boolean = false
            workspaceBookmarkCategoryLayout: number | string = "2"
            workspaceImpressionMarkedButton: boolean = true
            workspaceImpressionMarkAsReadWhenReply: boolean = true
            workspaceImpressionHideButton: boolean = true
            workspaceImpressionHideWhenMarked: boolean = true
            workspaceNovelmanageDeleteConfirm: boolean = true
            workspaceUserblogmanageDeleteConfirm: boolean = true
            workspaceNovelmanageShowPointAverage: boolean = true
            workspaceCustomEditor: boolean = false
            workspaceEditorSelectedSkin: number = 0
            workspaceEditorSelectedFontFamily: number = 0
            workspaceEditorFontSize: number = 0
            workspaceEditorLineHeight: number = 0
            workspaceEditorTextRendering: string = "optimizeLegibility"
            workspaceEditorWidth: number = 1

            /* Yomou */
            yomouRank_ShowNovelInfoLink: boolean = true
            yomouRank_ShowKasasagi: boolean = false
            yomouRank_ShowRaWi: boolean = false
            yomouRank_ShowDescription: boolean = true
            yomouRank_ShowTags: boolean = true
            yomouRank_DevidePointsUnit: boolean = true
            yomouRank_PointsColor: string = "#ed1a3d"
            yomouRank_CustomCSS: __nt_text__.CSS_String = ""

            yomouRankTop_ShowDescription: boolean = false
            yomouRankTop_ShowPoints: boolean = false
            yomouRankTop_ShowTags: boolean = false
            yomouRankTop_ShowLength: boolean = false
            yomouRankTop_ShowNovelInfoLink: boolean = false
            yomouRankTop_ShowUpdateDate: boolean = false
            yomouRankTop_ShowKasasagi: boolean = false
            yomouRankTop_ShowRaWi: boolean = false
            yomouRankTop_CustomCSS: __nt_text__.CSS_String = ""
            //yomouRankTop_DailyShowList: ["101", "102", "201", "202", "301", "302", "303", "304", "305", "306", "307", "401", "402", "403", "404", "9901", "9902", "9903", "9999"],

            /* Mypage */
            mypageShowUserId: boolean = true
            mypageNovellistShowReaction: boolean = false
            mypageNovellistShowKasasagi: boolean = false
            mypageNovellistShowRaWi: boolean = false
            mypageNovellistShowLength: boolean = false
            mypageShowFavUserId: boolean = true
            mypageProfileStatics: boolean = true
            mypageProfileBooklist: boolean = true
            mypageDisableExternalURLWarning: boolean = false
            mypageProfileAutoURL: boolean = true
            mypageBlogAutoURL: boolean = true
            mypageBlogCommentAutoURL: boolean = false

            /* Kasasagi */
            kasasagiCustomStyle: boolean = true
            kasasagiExportButton: boolean = true

            kasasagiShowGraph_GeneralDay: boolean = true
            kasasagiShowGraph_GeneralTotal: boolean = false
            kasasagiShowGraph_ChapterUnique: boolean = true
            kasasagiShowGraph_DayPV: boolean = true
            kasasagiShowGraph_DayUnique: boolean = true
            kasasagiShowGraph_MonthPV: boolean = true
            kasasagiShowGraph_MonthUnique: boolean = true

            kasasagiGraphType_GeneralDay: GraphType = "bar"
            kasasagiGraphType_GeneralTotal: GraphType = "bar"
            kasasagiGraphType_ChapterUnique: GraphType = "bar"
            kasasagiGraphType_DayPV: GraphType = "bar"
            kasasagiGraphType_DayUnique: GraphType = "bar"
            kasasagiGraphType_MonthPV: GraphType = "bar"
            kasasagiGraphType_MonthUnique: GraphType = "bar"

            kasasagiShowTable_API: boolean = true
            kasasagiShowTable_Rank: boolean = true
            kasasagiShowTable_ExternalLink: boolean = true
            kasasagiShowTable_GeneralDay: boolean = true
            kasasagiShowTable_ChapterUnique: boolean = true
            //kasasagiShowTable_DayPV: boolean = true //Unused
            //kasasagiShowTable_DayUnique: boolean = true //Unused
            //kasasagiShowTable_MonthPV: boolean = true //Unused
            //kasasagiShowTable_MonthUnique: boolean = true //Unused

            /* Mitemin */
            miteminShowIcodeField: boolean = true

            /* Skin */
            skins: __nt_skin_v1__.Skins = []
            selectedSkin: number = 0
            novelAuthorCustomSkin: boolean = true
            novelAuthorCustomSkinWarning: boolean = true

            /* v2 Skin */
            novelSkinsAvailable: Array<__nt_skin_v2__.AvailableSkin> = [
                {src: "internal", key: 0},
                {src: "internal", key: 1},
                {src: "local", key: 0},
            ]
            novelSkinSelected: __nt_skin_v2__.AvailableSkin = {src: "internal", key: 0}
            novelSkins: Array<__nt_skin_v2__.Skin> = [
                new __nt_skin_v2__.Skin({
                    name: "スキン",
                    description: "サンプル",
                    version: 2,
                    preview: {
                        text: "red",
                        background: "yellow"
                    },
                    style: [],
                    css: ""
                })
            ]

            /* Font */
            fontSelectedFontFamily: number = 0
            fontFontFamilyList: __nt_font_v1__.FontFamilies = []
            fontFontSize: number = 0
            fontLineHeight: number = 0
            fontTextRendering: string = "optimizeLegibility"
            fontWidth: number = 1

            /* Correction */
            correctionIndent: boolean = false
            correctionNormalizeEllipses: boolean = false
            correctionNormalizeDash: boolean = false
            correctionNormalizeExclamation: boolean = false
            correctionRepeatedSymbols: boolean = false
            correctionPeriodWithBrackets: boolean = false
            correctionNoSpaceExclamation: boolean = false
            correctionOddEllipses: boolean = false
            correctionOddDash: boolean = false
            correctionWaveDash: boolean = false
            correctionNumber: boolean = false
            correctionNumberShort: CorrectionNumberMode = "full"
            correctionNumberLong: CorrectionNumberMode = "half"
            correctionNumberSymbol: CorrectionNumberMode = "default"
            correctionShowIllustration: boolean = true
            correctionRemoveIllustrationLink: boolean = false
            correctionVerticalLayout_CombineWord: number = 0
            correctionVerticalLayout_CombineNumber: number = 2
            correctionVerticalLayout_CombineExclamation: number = 3
            correctionVerticalLayout_IgnoreCombineNumberInWord: boolean = true
            correctionVerticalLayout_SidewayWord: number = 0
            correctionVerticalLayout_SidewayExclamation: number = 0

            correctionReplacePatterns: ReplacePatterns = [
                {
                    active: false,
                    pattern: "兎に角",
                    regex: false,
                    replacement: "とにかく"
                },
                {
                    active: false,
                    pattern: "兎も角",
                    regex: false,
                    replacement: "ともかく"
                },
                {
                    active: false,
                    pattern: "態々",
                    regex: false,
                    replacement: "わざわざ"
                },
                {
                    active: false,
                    pattern: "殆ど",
                    regex: false,
                    replacement: "ほとんど"
                },
                {
                    active: false,
                    pattern: "偶々",
                    regex: false,
                    replacement: "たまたま"
                },
                {
                    active: false,
                    pattern: "勿論",
                    regex: false,
                    replacement: "もちろん"
                },
                {
                    active: false,
                    pattern: "一際",
                    regex: false,
                    replacement: "ひときわ"
                },
                {
                    active: false,
                    pattern: "流石",
                    regex: false,
                    replacement: "さすが"
                },
                {
                    active: false,
                    pattern: "其れ",
                    regex: false,
                    replacement: "それ"
                },
                {
                    active: false,
                    pattern: "其の",
                    regex: false,
                    replacement: "その"
                },
                {
                    active: false,
                    pattern: "而も",
                    regex: false,
                    replacement: "しかも"
                },
                {
                    active: false,
                    pattern: "而る",
                    regex: false,
                    replacement: "しかる"
                },
                {
                    active: false,
                    pattern: "而れ",
                    regex: false,
                    replacement: "しかれ"
                },
                {
                    active: false,
                    pattern: "凄く",
                    regex: false,
                    replacement: "すごく"
                },
                {
                    active: false,
                    pattern: "凄い",
                    regex: false,
                    replacement: "すごい"
                }
            ]

            /**
             * コンストラクタ
             * @param {undefined|Record<string,any>|Partial<__nt_storage__.local.options>|__nt_storage__.local.options} data - 辞書型のデータで初期値を設定する（無効な値は全て除外される）
             */
            constructor(data?: Record<string, any> | Partial<__nt_storage__.local.options> | __nt_storage__.local.options) {
                this.set(data)
            }

            /**
             * キーに値を設定する
             * @param {OptionID} key - キー
             * @param {any} value - 設定する値
             */
            set(key: OptionID, value: any): void;
            /**
             * キーに値を設定する
             * @param {Record<string, any>|Partial<__nt_storage__.local.options>|__nt_storage__.local.options} value - 設定するキーと値の辞書
             */
            set(value: Record<string, any>|Partial<__nt_storage__.local.options>|__nt_storage__.local.options): void;
            set(key?: OptionID | Record<string, any> | __nt_storage__.local.options | Partial<__nt_storage__.local.options>, value?: any): void;
            set(key?: OptionID | Record<string, any> | __nt_storage__.local.options | Partial<__nt_storage__.local.options>, value?: any): void {
                if (key instanceof __nt_storage__.local.options) {
                    this.novelSkins = []
                    this.set(key.get())
                }
                else if (typeof key === "string") {
                    /** novelSkin_X */
                    const m = key.match(/^novelSkin_(\d)+$/)
                    if(m!==null){
                        const idx = Number(m[1])
                        if(isFinite(idx) && idx < __nt_skin_v2__.maxLocalSkins && idx >= 0 && value instanceof Object){
                            this.novelSkins[idx] = new __nt_skin_v2__.Skin(value)
                        }
                    }
                    
                    /** others */
                    else {
                        var value = _checkLocalValue(key, value)
                        if (value !== undefined) {
                            this[key] = value
                        }
                    }
                } else if (key !== undefined) {
                    this.novelSkins = []
                    for (var k of Object.keys(key)) {
                        this.set(k, key[k])
                    }
                }
            }

            /**
             * キーと値を辞書型で取得する
             * @param {OptionID|Array<OptionID>} parameters - キーの文字列、またはそのリスト
             * @returns 指定したデータを含む辞書型（`parameters`を指定しない場合はすべて）
             */
            get(parameters?: null|undefined): Record<string, any>;
            get(parameters: OptionID | Array<OptionID>): Record<string, any>;
            get(parameters?: null | OptionID | Array<OptionID>): Partial<__nt_storage__.local.options>;
            get(parameters?: null | OptionID | Array<OptionID>): Partial<__nt_storage__.local.options> {
                var ret: Partial<__nt_storage__.local.options> = {}
                if (parameters !== undefined && parameters !== null) { // export each
                    var params: Array<OptionID>
                    if (typeof parameters === "string") {
                        params = [parameters]
                    } else {
                        params = parameters
                    }

                    for (const key of params) {
                        /** novelSkin_X */
                        const m = key.match(/^novelSkin_(\d)+$/)
                        if(m!==null){
                            const skinIdx = Number(m[1])
                            const value = this.novelSkins.at(skinIdx)
                            if( isFinite(skinIdx) && value!==undefined ){
                                ret[`novelSkin_${skinIdx}`] = value
                                continue
                            }
                        }else if(key==="novelSkins"){
                            for(let i = 0; i<this.novelSkins.length; i++){
                                const value = this.novelSkins.at(i)
                                if(value!==undefined ){
                                    ret[`novelSkin_${i}`] = value
                                }
                            }
                        }

                        /** others */
                        else if (key in this) {
                            var value = this[key]
                            if (value !== undefined && typeof value !== "function") {
                                ret[key] = value
                            }
                        }
                    }
                    return ret
                } else { // export all
                    for (const [key, value] of Object.entries(this)) {
                        /** novelSkin_X */
                        if(key === "novelSkins"){
                            for(let idx = 0; idx<this.novelSkins.length; idx++){
                                const value = this.novelSkins.at(idx)
                                if( value instanceof __nt_skin_v2__.Skin ){
                                    ret[`novelSkin_${idx}`] = value
                                    continue
                                }
                            }
                        }

                        /** others */
                        else if (typeof value !== "undefined" && typeof value !== "function") {
                            ret[key] = value
                        }
                    }
                    return ret
                }
            }

            /**
             * 過去のバージョンの設定データを更新する
             * @param {Record<string,any>} data キーと値の辞書
             */
            update(data: Record<string, any>): void {
                var updatedData = this._exceptionProcess(data)
                this.set(updatedData)
            }

            /**
             * 設定データをlocalストレージに保存する（`parameters`を指定しない場合はすべて）
             * @param parameters キーの文字列、またはそのリスト
             */
            setToStorage(parameters?: null|OptionID|Array<OptionID>): Promise<void>{
                return __nt_storage__.local.set(this.get(parameters))
            }

            protected toJSON = () => {
                return this.get()
            }

            // バージョンアップ時の対応
            protected _exceptionProcess = (obj: Record<string, any>): Record<string, any> => {
                if ("novelCustomHeader" in obj && obj.novelCustomHeader === true) {
                    console.log(`Converted value: { novelCustomHeader: true } -> { novelCustomHeaderType: "2" } `)
                    obj.novelCustomHeaderType = "2"
                } else if ("novelCustomHeader" in obj && obj.novelCustomHeader === false) {
                    console.log(`Converted value: { novelCustomHeader: false } -> { novelCustomHeaderType: "1" } `)
                    obj.novelCustomHeaderType = "1"
                }

                return obj
            }

            static check<T>(key: OptionID, value: T): T|void;
            static check<T>(key: Record<string,T>): Record<string,T|undefined>;
            static check<T>(key: OptionID|Record<string,T>, value?: T): T|void|Record<string,T|undefined>{
                if(typeof key === "string"){
                    return _checkLocalValue(key, value)
                }else if(key instanceof Object){
                    var ret: Record<string,any> = {}
                    for (const k of Object.keys(key)) {
                        const c = _checkLocalValue(k, key[k])
                        if(c!==undefined){
                            ret[k] = c
                        }
                    }
                    return ret
                }
            }
        }

        /**
         * 数値の変換モード
         */
        export type CorrectionNumberMode = "full" | "half" | "default" | "kanji"

        /**
         * 置換パターンリスト
         */
        export type ReplacePatterns = Array<ReplacePattern>

        /**
         * 置換パターン
         * @param {string} pattern - 検索パターン
         * @param {string} replacement - 置換文字列
         * @param {boolean} regex - 検索パターンが正規表現かどうか
         * @param {boolean} active - 有効かどうか
         */
        export class ReplacePattern {
            public pattern: string = ""
            public replacement: string = ""
            public regex: boolean = false
            public active: boolean = true
        }
        /**
         * グラフ種類
         */
        export type GraphType = "bar" | "line"

        
        export function get(
            keys?: string | string[] | Partial<__nt_storage__.local.options> | null
        ): Promise<__nt_storage__.local.options> {
            if (keys === undefined) { keys = null }
            return browser.storage.local.get(keys).then((data) => {return new __nt_storage__.local.options(data)})
        }


        export function set(key: string, value: any): Promise<void>
        export function set(data?: __nt_storage__.local.options | Partial<__nt_storage__.local.options> | Record<string,any> | null): Promise<void>
        export function set(
            data: __nt_storage__.local.options | Partial<__nt_storage__.local.options> | Record<string,any> | null | undefined | string,
            value?: any
        ): Promise<void> {
            var v: Record<string,any> = {}
            if(data instanceof __nt_storage__.local.options){
                v = data.get()
                return browser.storage.local.set(v)
            }else if(data instanceof Object){
                v = __nt_storage__.local.options.check(data)
                return browser.storage.local.set(v)
            }else if(typeof data === "string"){
                const c = __nt_storage__.local.options.check(data, value)
                if(c!==undefined){
                    v[data] = c
                }
                return browser.storage.local.set(v)
            }else{
                return browser.storage.local.set(v)
            }
        }

        export function clear(): Promise<void>{
            return browser.storage.local.clear()
        }

        export function remove(keys?: string|string[]|null): Promise<void> {
            if(keys!==null && keys!==undefined){
                return browser.storage.local.remove(keys)
            }
            return new Promise(()=>{})
        }


        export function changed(keys: {(changes: browser.Storage.StorageAreaOnChangedChangesType): void}): void;
        export function changed(keys: string|string[]|null|undefined, callback: {(changes: browser.Storage.StorageAreaOnChangedChangesType): void}): void;
        export function changed(keys?: string|string[]|null|{(changes: browser.Storage.StorageAreaOnChangedChangesType): void}, callback?: {(changes: browser.Storage.StorageAreaOnChangedChangesType): void}): void {
            if((keys===null || keys===undefined) && callback!==undefined){
                return browser.storage.local.onChanged.addListener((changes)=>{
                    if(callback!==undefined){
                        return callback(changes)
                    }
                })
            }else if(typeof keys === "function"){
                callback = keys
                return browser.storage.local.onChanged.addListener((changes)=>{
                    if(callback!==undefined){
                        return callback(changes)
                    }
                })
            }else if(callback!==undefined){
                if(typeof keys === "string"){
                    keys = [keys]
                }
                return browser.storage.local.onChanged.addListener((changes)=>{
                    var ret: browser.Storage.StorageAreaOnChangedChangesType = {}
                    var c = 0
                    if(Array.isArray(keys)){
                        for(const key of keys){
                            ret[key] = changes[key]
                            c ++ 
                        }
                    }
                    if(callback!==undefined && c > 0){
                        return callback(ret)
                    }
                })
            }
        }


    }

    export namespace sync {
        /**
         * 設定データ（storage.sync）
         */
        export class options {
            [key: string]: any

            extLaunchCount: number = 0
            extLastLaunchTime: string = ""
            novelHistory: Array<string> = []
            novelHistoryData: Record<string, [number, number, string]> = {}
            workspaceImpressionMarked: __nt_workspace__.impression.kanrino = {}
            workspaceImpressionHidden: __nt_workspace__.impression.kanrino = {}
            novelSkins: Array<__nt_skin_v2__.Skin> = []
            
            /**
             * コンストラクタ
             * @param {undefined|Record<string,any>|__nt_storage__.sync.options} data - 辞書型のデータで初期値を設定する（無効な値は全て除外される）
             */
            constructor(data?: Record<string, any> | __nt_storage__.sync.options) {
                this.set(data)
            }

            /**
             * キーに値を設定する
             * @param {OptionID} key - キー
             * @param {any} value - 設定する値
             */
            set(key: OptionID, value: any): void
            /**
            * キーに値を設定する
            * @param {Record<string,any>|Partial<__nt_storage__.sync.options>} value - 設定するキーと値の辞書
            */
            set(value: Record<string, any>|Partial<__nt_storage__.sync.options>|__nt_storage__.sync.options): void;
            set(key?: OptionID | Record<string, any> | Partial<__nt_storage__.sync.options> | __nt_storage__.sync.options, value?: any): void;
            set(key?: OptionID | Record<string, any> | Partial<__nt_storage__.sync.options> | __nt_storage__.sync.options, value?: any): void {
                if (key instanceof __nt_storage__.sync.options) {
                    this.novelSkins = []
                    this.set(key.get())
                }
                else if (typeof key === "string") {
                    /** novelSkin_X */
                    const m = key.match(/^novelSkin_(\d)+$/)
                    if(m!==null){
                        const idx = Number(m[1])
                        if(isFinite(idx) && idx < __nt_skin_v2__.maxLocalSkins && idx >= 0 && value instanceof Object){
                            this.novelSkins[idx] = new __nt_skin_v2__.Skin(value)
                        }
                    }
                    
                    /** others */
                    else {
                        var value = _checkSyncValue(key, value)
                        if (value !== undefined) {
                            this[key] = value
                        }
                    }
                } else if (key !== undefined) {
                    this.novelSkins = []
                    for (var k of Object.keys(key)) {
                        this.set(k, key[k])
                    }
                }
            }

            /**
             * キーと値を辞書型で取得する
             * @param {OptionID|Array<OptionID>} parameters - キーの文字列、またはそのリスト
             * @returns 指定したデータを含む辞書型（`parameters`を指定しない場合はすべて）
             */
            get(parameters?: null): Record<string, any>;
            get(parameters: OptionID | Array<OptionID>): Record<string, any>;
            get(parameters?: null | OptionID | Array<OptionID>): Record<string, any>;
            get(parameters?: null | OptionID | Array<OptionID>): Record<string, any> {
                var ret: Record<string, any> = {}
                if (parameters !== undefined && parameters !== null) {
                    var params: Array<OptionID>
                    if (typeof parameters === "string") {
                        params = [parameters]
                    } else {
                        params = parameters
                    }

                    for (const key of params) {
                        /** novelSkin_X */
                        const m = key.match(/^novelSkin_(\d)+$/)
                        if(m!==null){
                            const skinIdx = Number(m[1])
                            const value = this.novelSkins.at(skinIdx)
                            if( isFinite(skinIdx) && value!==undefined ){
                                ret[`novelSkin_${skinIdx}`] = value
                                continue
                            }
                        }else if(key==="novelSkins"){
                            for(let i = 0; i<this.novelSkins.length; i++){
                                const value = this.novelSkins.at(i)
                                if( value!==undefined ){
                                    ret[`novelSkin_${i}`] = value
                                }
                            }
                        }

                        /** others */
                        else if (key in this) {
                            var value = this[key]
                            if (typeof value !== "undefined" && typeof value !== "function") {
                                ret[key] = value
                            }
                        }
                    }
                    return ret
                } else {
                    for (const [key, value] of Object.entries(this)) {
                        /** novelSkin_X */
                        if(key === "novelSkins"){
                            for(let idx = 0; idx<this.novelSkins.length; idx++){
                                const value = this.novelSkins.at(idx)
                                if( value instanceof __nt_skin_v2__.Skin ){
                                    ret[`novelSkin_${idx}`] = value
                                    continue
                                }
                            }
                        }

                        /** others */
                        else if (typeof value !== "undefined" && typeof value !== "function") {
                            ret[key] = value
                        }
                    }
                    return ret
                }
            }

            /**
             * 過去のバージョンの設定データを更新する
             * @param {Record<string,any>} data キーと値の辞書
             */
            update(data: Record<string, any>): void {
                var updatedData = this._exceptionProcess(data)
                this.set(updatedData)
            }

            /**
             * 設定データをsyncストレージに保存する（`parameters`を指定しない場合はすべて）
             * @param parameters キーの文字列、またはそのリスト
             */
            setToStorage(parameters?: null|OptionID|Array<OptionID>): Promise<void>{
                return __nt_storage__.sync.set(this.get(parameters))
            }

            static check<T>(key: OptionID, value: T): T|void;
            static check<T>(key: Record<string,T>): Record<string,T|undefined>;
            static check<T>(key: OptionID|Record<string,T>, value?: T): T|void|Record<string,T|undefined>{
                if(typeof key === "string"){
                    return _checkSyncValue(key, value)
                }else if(key instanceof Object){
                    var ret: Record<string,any> = {}
                    for (const k of Object.keys(key)) {
                        const c = _checkSyncValue(k, key[k])
                        if(c!==undefined){
                            ret[k] = c
                        }
                    }
                    return ret
                }
            }

            protected toJSON = () => {
                return this.get()
            }

            // バージョンアップ時の対応
            protected _exceptionProcess = (obj: Record<string, any>): Record<string, any> => {
                if ("history" in obj) {
                    if (Array.isArray(obj.histroy)) {
                        obj["novelHistory"] = obj.histroy
                        console.log(`Converted value: { history: [...] } -> { novelHistory: [...] } `)
                    }
                }
                if ("history_data" in obj) {
                    if (obj.history_data instanceof Object) {
                        obj["novelHistoryData"] = obj.histroy_data
                        console.log(`Converted value: { history_data: {...} } -> { novelHistoryData: {...} } `)
                    }
                }
                return obj
            }
        }
        
        export function get(keys?: string | string[] | Partial<__nt_storage__.sync.options> | null): Promise<__nt_storage__.sync.options> {
            if (keys === undefined) { keys = null }
            return browser.storage.sync.get(keys).then((data)=>{return new __nt_storage__.sync.options(data)})
        }

        export function set(key: string, value: any): Promise<void>;
        export function set(data?: __nt_storage__.sync.options | Partial<__nt_storage__.sync.options> | Record<string,any> | null): Promise<void>;
        export function set(
            data: __nt_storage__.sync.options | Partial<__nt_storage__.sync.options> | Record<string,any> | null | undefined | string,
            value?: any
        ): Promise<void> {
            var v: Record<string,any> = {}
            if(data instanceof __nt_storage__.sync.options){
                v = data.get()
                return browser.storage.sync.set(v)
            }else if(data instanceof Object){
                v = __nt_storage__.sync.options.check(data)
                return browser.storage.sync.set(v)
            }else if(typeof data === "string"){
                const c = __nt_storage__.sync.options.check(data, value)
                if(c!==undefined){
                    v[data] = c
                }
                return browser.storage.sync.set(v)
            }else{
                return browser.storage.sync.set(v)
            }
        }

        export function clear(): Promise<void>{
            return browser.storage.sync.clear()
        }

        export function remove(keys?: string|string[]|null): Promise<void> {
            if(keys!==null && keys!==undefined){
                return browser.storage.sync.remove(keys)
            }
            return new Promise(()=>{})
        }


        export function changed(keys: {(changes: browser.Storage.StorageAreaSyncOnChangedChangesType): void}): void;
        export function changed(keys: string|string[]|null|undefined, callback: {(changes: browser.Storage.StorageAreaSyncOnChangedChangesType): void}): void;
        export function changed(keys?: string|string[]|null|{(changes: browser.Storage.StorageAreaSyncOnChangedChangesType): void}, callback?: {(changes: browser.Storage.StorageAreaSyncOnChangedChangesType): void}): void {
            if((keys===null || keys===undefined) && callback!==undefined){
                return browser.storage.sync.onChanged.addListener((changes)=>{
                    if(callback!==undefined){
                        return callback(changes)
                    }
                })
            }else if(typeof keys === "function"){
                callback = keys
                return browser.storage.sync.onChanged.addListener((changes)=>{
                    if(callback!==undefined){
                        return callback(changes)
                    }
                })
            }else if(callback!==undefined){
                if(typeof keys === "string"){
                    keys = [keys]
                }
                return browser.storage.sync.onChanged.addListener((changes)=>{
                    var ret: browser.Storage.StorageAreaSyncOnChangedChangesType = {}
                    var c = 0
                    if(Array.isArray(keys)){
                        for(const key of keys){
                            ret[key] = changes[key]
                            c ++ 
                        }
                    }
                    if(callback!==undefined && c > 0){
                        return callback(ret)
                    }
                })
            }
        }
    }

    export namespace session {
        /**
         * 設定データ（storage.session）
         */
        export class options {
            [key: string]: any

            novelSkinCustomCSS: string | undefined
            novelFontCustomCSS: string | undefined
            novelAppliedSkinCSS: string | undefined
            novelAppliedFontCSS: string | undefined
            yomouRankTop_AppliedCSS: string | undefined
            yomouRank_AppliedCSS: string | undefined
            workspaceEditorAppliedSkinCSS: string | undefined
            workspaceEditorAppliedFontCSS: string | undefined
            extOptionSidePanelShow: boolean = true
            novelOfficialTags: Array<string> | undefined

            novelOptionModalSelected: number = 0

            /**
             * コンストラクタ
             * @param {undefined|Record<string,any>|__nt_storage__.session.options} data - 辞書型のデータで初期値を設定する（無効な値は全て除外される）
             */
            constructor(data?: Record<string, any> | __nt_storage__.session.options) {
                this.set(data)
            }

            /**
             * キーに値を設定する
             * @param {OptionID} key - キー
             * @param {any} value - 設定する値
             */
            set(key: OptionID, value: any): void
            /**
            * キーに値を設定する
            * @param {Record<string,any>|Partial<__nt_storage__.session.options>} value - 設定するキーと値の辞書
            */
            set(value: Record<string, any>|Partial<__nt_storage__.session.options>|__nt_storage__.session.options): void;
            set(key?: OptionID | Record<string, any> | Partial<__nt_storage__.session.options> | __nt_storage__.session.options, value?: any): void;
            set(key?: OptionID | Record<string, any> | Partial<__nt_storage__.session.options> | __nt_storage__.session.options, value?: any): void {
                if (key instanceof __nt_storage__.session.options) {
                    this.set(key.get())
                }
                else if (typeof key === "string") {
                    var value = _checkSessionValue(key, value)
                    if (value !== undefined) {
                        this[key] = value
                    }
                } else if (key !== undefined) {
                    for (var k of Object.keys(key)) {
                        this.set(k, key[k])
                    }
                }
            }

            /**
             * キーと値を辞書型で取得する
             * @param {OptionID|Array<OptionID>} parameters - キーの文字列、またはそのリスト
             * @returns 指定したデータを含む辞書型（`parameters`を指定しない場合はすべて）
             */
            get(parameters?: null): Record<string, any>
            get(parameters: OptionID | Array<OptionID>): Record<string, any>
            get(parameters?: null | OptionID | Array<OptionID>): Record<string, any>
            get(parameters?: null | OptionID | Array<OptionID>): Record<string, any> {
                var ret: Record<string, any> = {}
                if (parameters !== undefined && parameters !== null) {
                    var params: Array<OptionID>
                    if (typeof parameters === "string") {
                        params = [parameters]
                    } else {
                        params = parameters
                    }

                    for (const key of params) {
                        var value = this[key]
                        if (typeof value !== "undefined" && typeof value !== "function") {
                            ret[key] = value
                        }
                    }
                    return ret
                } else {
                    for (const [key, value] of Object.entries(this)) {
                        if (typeof value !== "undefined" && typeof value !== "function") {
                            ret[key] = value
                        }
                    }
                    return ret
                }
            }

            static check<T>(key: OptionID, value: any): T|void;
            static check<T>(key: Record<string,T>): Record<string,T|undefined>;
            static check<T>(key: OptionID|Record<string,T>, value?: T): T|void|Record<string,T|undefined>{
                if(typeof key === "string"){
                    return _checkSessionValue(key, value)
                }else if(key instanceof Object){
                    var ret: Record<string,any> = {}
                    for (const k of Object.keys(key)) {
                        const c = _checkSessionValue(k, key[k])
                        if(c!==undefined){
                            ret[k] = c
                        }
                    }
                    return ret
                }
            }

            /**
             * 設定データをsessionストレージに保存する（`parameters`を指定しない場合はすべて）
             * @param parameters キーの文字列、またはそのリスト
             */
            setToStorage(parameters?: null|OptionID|Array<OptionID>): Promise<void>{
                return __nt_storage__.session.set(this.get(parameters))
            }

            protected toJSON = () => {
                return this.get()
            }
        }

        export function get(
            keys?: string | string[] | Partial<__nt_storage__.sync.options> | null,
        ): Promise<__nt_storage__.session.options> {
            if (keys === undefined) { keys = null }
            return browser.storage.local.get(keys).then((data)=>{return new __nt_storage__.session.options(data)})
        }

        export function set(key: string, value: any): Promise<void>;
        export function set(data?: __nt_storage__.session.options | Partial<__nt_storage__.session.options> | Record<string,any> | null): Promise<void>;
        export function set(
            data: __nt_storage__.session.options | Partial<__nt_storage__.session.options> | Record<string,any> | null | undefined | string,
            value?: any,
        ): Promise<void> {
            var v: Record<string,any> = {}
            if(data instanceof __nt_storage__.session.options){
                v = data.get()
                return browser.storage.session.set(v)
            }else if(data instanceof Object){
                v = __nt_storage__.session.options.check(data)
                return browser.storage.session.set(v)
            }else if(typeof data === "string"){
                const c = __nt_storage__.session.options.check(data, value)
                if(c!==undefined){
                    v[data] = c
                }
                return browser.storage.session.set(v)
            }else{
                return browser.storage.session.set(v)
            }
        }

        export function clear(): Promise<void>{
            return browser.storage.session.clear()
        }

        export function remove(keys?: string|string[]|null): Promise<void> {
            if(keys!==null && keys!==undefined){
                return browser.storage.session.remove(keys)
            }
            return new Promise(()=>{})
        }


        export function changed(keys: {(changes: browser.Storage.StorageAreaOnChangedChangesType): void}): void;
        export function changed(keys: string|string[]|null|undefined, callback: {(changes: browser.Storage.StorageAreaOnChangedChangesType): void}): void;
        export function changed(keys?: string|string[]|null|{(changes: browser.Storage.StorageAreaOnChangedChangesType): void}, callback?: {(changes: browser.Storage.StorageAreaOnChangedChangesType): void}): void {
            if((keys===null || keys===undefined) && callback!==undefined){
                return browser.storage.session.onChanged.addListener((changes)=>{
                    if(callback!==undefined){
                        return callback(changes)
                    }
                })
            }else if(typeof keys === "function"){
                callback = keys
                return browser.storage.session.onChanged.addListener((changes)=>{
                    if(callback!==undefined){
                        return callback(changes)
                    }
                })
            }else if(callback!==undefined){
                if(typeof keys === "string"){
                    keys = [keys]
                }
                return browser.storage.session.onChanged.addListener((changes)=>{
                    var ret: browser.Storage.StorageAreaOnChangedChangesType = {}
                    var c = 0
                    if(Array.isArray(keys)){
                        for(const key of keys){
                            ret[key] = changes[key]
                            c ++ 
                        }
                    }
                    if(callback!==undefined && c > 0){
                        return callback(ret)
                    }
                })
            }
        }

        export function setAccessLevel(accessOptions: { accessLevel: chrome.storage.AccessLevel }): Promise<void>{
            return chrome.storage.session.setAccessLevel(accessOptions)
        }
    }
}