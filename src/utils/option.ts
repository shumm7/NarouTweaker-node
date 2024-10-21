import { getOptionFromID, getOptionPageFromID } from "../options/_utils/optionUI_utils"
import { ReplacePatterns, ImpressionKanrino, CorrectionNumberMode, GraphType } from "./data"
import { CustomIconIDs, novelIconList, workspaceIconList, workspaceMenuIconList } from "./header"
import { getExtensionVersion } from "./misc"
import { CSS_String } from "./type"
import { FontFamiliesV1 } from "./v1_font"
import { SkinsV1 } from "./v1_skin"
import { OptionID, OptionUI_Item, OptionUI_ItemID } from "../options/_utils/optionUI_type"
import { Ncode } from "./ncode"
/**
 * 設定データ（storage.local）
 */
export class LocalOptions {
    [key: string]: any

    /* Extension */
    extOptionsVersion: string = getExtensionVersion()
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
    novelCustomCSS: CSS_String = ""
    novelLegacyHeaderIcon: boolean = true
    novelVertical: boolean = false
    novelCustomHeaderScrollHidden: boolean = false
    novelCustomHeaderMode: string = "scroll"
    novelCustomHeaderLeft: CustomIconIDs = ["home", "info", "impression", "review", "pdf", "favepisode", "favlist_add", "booklist"]
    novelCustomHeaderRight: CustomIconIDs = ["option"]
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
    workspaceCustomHeader: CustomIconIDs = ["user", "message", "home", "menu"]
    workspaceCustomHeaderScrollHidden: boolean = false
    workspaceCustomHeaderMode: string = "absolute"
    workspaceCustomMenu_Left: CustomIconIDs = ["favorite", "edit", "blog"]
    workspaceCustomMenu_Middle: CustomIconIDs = ["reaction", "block-mute", "x-home"]
    workspaceCustomMenu_Right: CustomIconIDs = ["find", "support"]
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
    yomouRank_CustomCSS: CSS_String = ""

    yomouRankTop_ShowDescription: boolean = false
    yomouRankTop_ShowPoints: boolean = false
    yomouRankTop_ShowTags: boolean = false
    yomouRankTop_ShowLength: boolean = false
    yomouRankTop_ShowNovelInfoLink: boolean = false
    yomouRankTop_ShowUpdateDate: boolean = false
    yomouRankTop_ShowKasasagi: boolean = false
    yomouRankTop_ShowRaWi: boolean = false
    yomouRankTop_CustomCSS: CSS_String = ""
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
    skins: SkinsV1 = []
    selectedSkin: number = 0
    novelAuthorCustomSkin: boolean = true
    novelAuthorCustomSkinWarning: boolean = true

    /* Font */
    fontSelectedFontFamily: number = 0
    fontFontFamilyList: FontFamiliesV1 = []
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
     * @param {undefined|Record<string,any>|LocalOptions} data - 辞書型のデータで初期値を設定する（無効な値は全て除外される）
     */
    constructor(data?: Record<string, any> | LocalOptions) {
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
     * @param {Record<string,any>} value - 設定するキーと値の辞書
     */
    set(value: Record<string, any>): void
    /**
     * キーに値を設定する
     * @param {LocalOptions} value
     */
    set(value: Record<string, any>): void
    set(key?: OptionID | Record<string, any> | LocalOptions, value?: any): void;
    set(key?: OptionID | Record<string, any> | LocalOptions, value?: any): void {
        if (key instanceof LocalOptions) {
            this.set(key.get())
        }
        else if (typeof key === "string") {
            var value = LocalOptions._checkValue(key, value)
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
     * @returns すべてのデータを含む辞書型
     */
    get(): Record<string, any>
    /**
     * キーと値を辞書型で取得する
     * @param {OptionID|Array<OptionID>} parameters - キーの文字列、またはそのリスト
     * @returns 指定したデータを含む辞書型
     */
    get(parameters: OptionID | Array<OptionID>): Record<string, any>

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
                if (key in this) {
                    var value = this[key]
                    if (value !== undefined && typeof value !== "function") {
                        ret[key] = value
                    }
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

    /**
     * 過去のバージョンの設定データを更新する
     * @param {Record<string,any>} data キーと値の辞書
     */
    update(data: Record<string, any>): void {
        var updatedData = this._exceptionProcess(data)
        this.set(updatedData)
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

    static check(key: OptionID, value: any): any;
    static check(key: Record<string,any>): any;
    static check(key: OptionID|Record<string,any>, value?: any): any{
        if(typeof key === "string"){
            return LocalOptions._checkValue(key, value)
        }else if(key instanceof Object){
            var ret: Record<string,any> = {}
            for (const k of Object.keys(key)) {
                const c = LocalOptions._checkValue(k, key[k])
                if(c!==undefined){
                    ret[k] = c
                }
            }
            return ret
        }
    }

    protected static _checkValue = (key: OptionID, value: any): any => {
        var opt = new LocalOptions()
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

                var list: CustomIconIDs = []
                value.forEach(function (id) {
                    if (id in novelIconList) {
                        list.push(id)
                    }
                })
                return list
            } else if ("workspaceCustomHeader" === key) {
                if (!Array.isArray(value)) { return }

                var list: CustomIconIDs = []
                value.forEach(function (id) {
                    if (id in workspaceIconList) {
                        list.push(id)
                    }
                })
                return list

            } else if (["workspaceCustomMenu_Left", "workspaceCustomMenu_Middle", "workspaceCustomMenu_Right"].includes(key)) {
                if (!Array.isArray(value)) { return }

                var list: CustomIconIDs = []
                value.forEach(function (id) {
                    if (id in workspaceMenuIconList) {
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
            }
            return value
        }
    }
}

/**
 * 設定データ（storage.sync）
 */
export class SyncOptions {
    [key: string]: any

    extLaunchCount: number = 0
    extLastLaunchTime: string = ""
    novelHistory: Array<string> = []
    novelHistoryData: Record<string, [number, number, string]> = {}
    workspaceImpressionMarked: ImpressionKanrino = {}
    workspaceImpressionHidden: ImpressionKanrino = {}

    /**
     * コンストラクタ
     * @param {undefined|Record<string,any>|SyncOptions} data - 辞書型のデータで初期値を設定する（無効な値は全て除外される）
     */
    constructor(data?: Record<string, any> | SyncOptions) {
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
    * @param {Record<string,any>} value - 設定するキーと値の辞書
    */
    set(value: Record<string, any>): void
    /**
    * キーに値を設定する
    * @param {SyncOptions} value
    */
    set(value: SyncOptions): void
    set(key?: OptionID | Record<string, any> | SyncOptions, value?: any): void;
    set(key?: OptionID | Record<string, any> | SyncOptions, value?: any): void {
        if (key instanceof SyncOptions) {
            this.set(key.get())
        }
        else if (typeof key === "string") {
            var value = SyncOptions._checkValue(key, value)
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
     * @returns すべてのデータを含む辞書型
     */
    get(): Record<string, any>
    /**
     * キーと値を辞書型で取得する
     * @param {OptionID|Array<OptionID>} parameters - キーの文字列、またはそのリスト
     * @returns 指定したデータを含む辞書型
     */
    get(parameters: OptionID | Array<OptionID>): Record<string, any>
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

    /**
     * 過去のバージョンの設定データを更新する
     * @param {Record<string,any>} data キーと値の辞書
     */
    update(data: Record<string, any>): void {
        var updatedData = this._exceptionProcess(data)
        this.set(updatedData)
    }

    static check(key: OptionID, value: any): any;
    static check(key: Record<string,any>): any;
    static check(key: OptionID|Record<string,any>, value?: any): any{
        if(typeof key === "string"){
            return SyncOptions._checkValue(key, value)
        }else if(key instanceof Object){
            var ret: Record<string,any> = {}
            for (const k of Object.keys(key)) {
                const c = SyncOptions._checkValue(k, key[k])
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

    protected static _checkValue = (key: OptionID, value: any): any => {
        var opt = new LocalOptions()
        if (typeof opt[key] === typeof value && typeof opt[key] !== "function") {
            if (key === "novelHistory") {
                if (Array.isArray(value)) {
                    var list: string[] = []
                    for (const history of value) {
                        const ncode = new Ncode(history).ncode()
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
                        const ncode = new Ncode(n).ncode()
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
}



/**
 * 設定データ（storage.session）
 */
export class SessionOptions {
    [key: string]: any

    novelSkinCustomCSS: string | undefined
    novelFontCustomCSS: string | undefined
    novelAppliedSkinCSS: string | undefined
    novelAppliedFontCSS: string | undefined
    yomouRankTop_AppliedCSS: string | undefined
    yomouRank_AppliedCSS: string | undefined
    workspaceEditorAppliedSkinCSS: string | undefined
    workspaceEditorAppliedFontCSS: string | undefined

    novelOptionModalSelected: number = 0

    /**
     * コンストラクタ
     * @param {undefined|Record<string,any>|SessionOptions} data - 辞書型のデータで初期値を設定する（無効な値は全て除外される）
     */
    constructor(data?: Record<string, any> | SessionOptions) {
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
    * @param {Record<string,any>} value - 設定するキーと値の辞書
    */
    set(value: Record<string, any>): void
    /**
    * キーに値を設定する
    * @param {SessionOptions} value
    */
    set(value: SessionOptions): void
    set(key?: OptionID | Record<string, any> | SessionOptions, value?: any): void;
    set(key?: OptionID | Record<string, any> | SessionOptions, value?: any): void {
        if (key instanceof SessionOptions) {
            this.set(key.get())
        }
        else if (typeof key === "string") {
            var value = SessionOptions._checkValue(key, value)
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
     * @returns すべてのデータを含む辞書型
     */
    get(): Record<string, any>
    /**
     * キーと値を辞書型で取得する
     * @param {OptionID|Array<OptionID>} parameters - キーの文字列、またはそのリスト
     * @returns 指定したデータを含む辞書型
     */
    get(parameters: OptionID | Array<OptionID>): Record<string, any>
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

    static check(key: OptionID, value: any): any;
    static check(key: Record<string,any>): any;
    static check(key: OptionID|Record<string,any>, value?: any): any{
        if(typeof key === "string"){
            return SessionOptions._checkValue(key, value)
        }else if(key instanceof Object){
            var ret: Record<string,any> = {}
            for (const k of Object.keys(key)) {
                const c = SessionOptions._checkValue(k, key[k])
                if(c!==undefined){
                    ret[k] = c
                }
            }
            return ret
        }
    }

    protected static _checkValue = (key: OptionID, value: any): any => {
        var opt = new SessionOptions()
        if (typeof opt[key] === typeof value && typeof opt[key] !== "function") {
            return value
        }
    }

    protected toJSON = () => {
        return this.get()
    }
}


export function getLocalOptions(
    keys: string | string[] | Partial<LocalOptions> | null | undefined,
    callback: (items: LocalOptions) => void
): void;
export function getLocalOptions(
    keys: string | string[] | Partial<LocalOptions> | null | undefined
): Promise<{[key: string]: any}>; 
export function getLocalOptions(
    keys: string | string[] | Partial<LocalOptions> | null | undefined,
    callback?: (items: LocalOptions) => void
): void | Promise<{[key: string]: any}> {
    if (keys === undefined) { keys = null }
    if(callback!==undefined){
        chrome.storage.local.get(keys, function (data) {
            try {
                callback(new LocalOptions(data))
            } catch (e) {
                console.warn(e)
            }
        })
    }else{
        return chrome.storage.local.get(keys)
    }
}

export function getSyncOptions(
    keys: string | string[] | Partial<SyncOptions> | null | undefined,
    callback: (items: SyncOptions) => void
): void;
export function getSyncOptions(
    keys: string | string[] | Partial<SyncOptions> | null | undefined
): Promise<{[key: string]: any}>;
export function getSyncOptions(
    keys: string | string[] | Partial<SyncOptions> | null | undefined,
    callback?: (items: SyncOptions) => void
): void | Promise<{[key: string]: any}> {
    if (keys === undefined) { keys = null }
    if(callback!==undefined){
        chrome.storage.local.get(keys, function (data) {
            try {
                callback(new SyncOptions(data))
            } catch (e) {
                console.warn(e)
            }
        })
    }else{
        return chrome.storage.local.get(keys)
    }
}

export function getSessionOptions(
    keys: string | string[] | Partial<SyncOptions> | null | undefined,
    callback: (items: SessionOptions) => void
): void;
export function getSessionOptions(
    keys: string | string[] | Partial<SyncOptions> | null | undefined
): Promise<{[key: string]: any}>;
export function getSessionOptions(
    keys: string | string[] | Partial<SyncOptions> | null | undefined,
    callback?: (items: SessionOptions) => void
): void|Promise<{[key: string]: any}> {
    if (keys === undefined) { keys = null }
    if(callback!==undefined){
        chrome.storage.local.get(keys, function (data) {
            try {
                callback(new SessionOptions(data))
            } catch (e) {
                console.warn(e)
            }
        })
    }else{
        return chrome.storage.local.get(keys)
    }
}


export function setLocalOptions(key: string, value: any): Promise<{[key: string]: any}>
export function setLocalOptions(key: string, value: any, callback: (data?: {[key: string]: any}) => void): void
export function setLocalOptions(data?: LocalOptions | Partial<LocalOptions> | Record<string,any> | null): Promise<{[key: string]: any}>
export function setLocalOptions(data?: LocalOptions | Partial<LocalOptions> | Record<string,any> | null, callback?: (data?: {[key: string]: any}) => void): void
export function setLocalOptions(
    data: LocalOptions | Partial<LocalOptions> | Record<string,any> | null | undefined | string,
    value?: any,
    callback?: (data?: {[key: string]: any}) => void
): void | Promise<{[key: string]: any}> {
    var v: Record<string,any> = {}
    if(data instanceof LocalOptions){
        v = data.get()
        return f(v, value)
    }else if(data instanceof Object){
        v = LocalOptions.check(data)
        return f(v, value)
    }else if(typeof data === "string"){
        const c = LocalOptions.check(data, value)
        if(c!==undefined){
            v[data] = c
        }
        return f(v, callback)
    }else{
        return f(v, value)
    }

    function f(v: Record<string,any>, c?: (data?: {[key: string]: any})=>void): void | Promise<{[key: string]: any}>{
        if(c===undefined){
            return chrome.storage.local.set(v).then(()=>{return v})
        }else{
            chrome.storage.local.set(v, ()=>{c(v)})
        }
        return
    }
}


export function setSyncOptions(key: string, value: any): Promise<{[key: string]: any}>
export function setSyncOptions(key: string, value: any, callback: (data?: {[key: string]: any}) => void): void
export function setSyncOptions(data?: SyncOptions | Partial<SyncOptions> | Record<string,any> | null): Promise<{[key: string]: any}>
export function setSyncOptions(data?: SyncOptions | Partial<SyncOptions> | Record<string,any> | null, callback?: (data?: {[key: string]: any}) => void): void
export function setSyncOptions(
    data: SyncOptions | Partial<SyncOptions> | Record<string,any> | null | undefined | string,
    value?: any,
    callback?: (data?: {[key: string]: any}) => void
): void | Promise<{[key: string]: any}> {
    var v: Record<string,any> = {}
    if(data instanceof SyncOptions){
        v = data.get()
        return f(v, value)
    }else if(data instanceof Object){
        v = SyncOptions.check(data)
        return f(v, value)
    }else if(typeof data === "string"){
        const c = SyncOptions.check(data, value)
        if(c!==undefined){
            v[data] = c
        }
        return f(v, callback)
    }else{
        return f(v, value)
    }

    function f(v: Record<string,any>, c?: (data?: {[key: string]: any})=>void): void | Promise<{[key: string]: any}> {
        if(c===undefined){
            return chrome.storage.sync.set(v).then(()=>{return v})
        }else{
            chrome.storage.sync.set(v, ()=>{c(v)})
        }
        return
    }
}

export function setSessionOptions(key: string, value: any): Promise<{[key: string]: any}>
export function setSessionOptions(key: string, value: any, callback: (data?: {[key: string]: any}) => void): void
export function setSessionOptions(data?: SessionOptions | Partial<SessionOptions> | Record<string,any> | null): Promise<{[key: string]: any}>
export function setSessionOptions(data?: SessionOptions | Partial<SessionOptions> | Record<string,any> | null, callback?: (data?: {[key: string]: any}) => void): void
export function setSessionOptions(
    data: SessionOptions | Partial<SessionOptions> | Record<string,any> | null | undefined | string,
    value?: any,
    callback?: (data?: {[key: string]: any}) => void
): void | Promise<{[key: string]: any}> {
    var v: Record<string,any> = {}
    if(data instanceof SessionOptions){
        v = data.get()
        return f(v, value)
    }else if(data instanceof Object){
        v = SessionOptions.check(data)
        return f(v, value)
    }else if(typeof data === "string"){
        const c = SessionOptions.check(data, value)
        if(c!==undefined){
            v[data] = c
        }
        return f(v, callback)
    }else{
        return f(v, value)
    }

    function f(v: Record<string,any>, c?: (data?: {[key: string]: any})=>void): void | Promise<{[key: string]: any}> {
        if(c===undefined){
            return chrome.storage.session.set(v).then(() => {return v})
        }else{
            chrome.storage.session.set(v, ()=>{c(v)})
        }
        return
    }
}