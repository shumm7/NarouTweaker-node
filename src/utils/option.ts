import { getOptionFromID, getOptionPageFromID } from "../options/_utils/optionUI_utils"
import { CustomIconIDs, novelIconList, workspaceIconList, workspaceMenuIconList } from "./header"
import { getExtensionVersion } from "./misc"
import { CSS_String, ReplacePatterns } from "./type"
import { FontFamiliesV1 } from "./v1_font"
import { SkinsV1 } from "./v1_skin"
import { OptionID, OptionUI_Item, OptionUI_ItemID } from "options/_utils/optionUI_type"

/**
 * 設定データ（storage.local）
 */
export class LocalOptions{
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
    narouSyuppanShowBookImage: boolean = true
    narouSyuppanShowBookViewImage: boolean = true

    /* Novel */
    novelCustomStyle: boolean = true
    novelCustomHeaderType: number|string = "2"
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
    workspaceBookmarkLayout: number|string = "0"
    workspaceBookmarkReplaceEpisode: boolean = false
    workspaceBookmarkCategoryLayout: number|string = "2"
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
    
    kasasagiGraphType_GeneralDay: string = "bar"
    kasasagiGraphType_GeneralTotal: string = "bar"
    kasasagiGraphType_ChapterUnique: string = "bar"
    kasasagiGraphType_DayPV: string = "bar"
    kasasagiGraphType_DayUnique: string = "bar"
    kasasagiGraphType_MonthPV: string = "bar"
    kasasagiGraphType_MonthUnique: string = "bar"

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
    correctionNumberShort: string = "full"
    correctionNumberLong: string = "half"
    correctionNumberSymbol: string = "default"
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

    constructor(data?: Record<string,any>){
        var p:any = this
        if(data instanceof Object){
            Object.keys(data).forEach(function(key){
                p.set(key, data[key])
            })
        }
    }

    public set = (key?: OptionID|Object, value?: any):void => {
        if(key!==undefined){
            if(typeof key==="string"){
                var value = this._checkValue(key, value)
                if(value!==undefined){
                    this[key] = value
                }
            }else if(value instanceof Object){
                value = this._exceptionProcess(value)
                Object.keys(key).forEach(function(k){
                    this.set(k, key[k])
                })
            }
        }
    }

    public get = (includeParameters?: null|OptionID|Array<OptionID>): Record<string,any> => {
        var ret = {}
        if(includeParameters!==undefined && includeParameters!==null){
            var params: Array<OptionID>
            if(typeof includeParameters==="string"){
                params = [includeParameters]
            }else{
                params = includeParameters
            }

            const obj = Object.entries(this)
            for (const key of includeParameters){
                var value: any = obj[key]
                if(typeof value!=="undefined" && typeof value!=="function"){
                    ret[key] = value
                }
            }
            return ret
        }else{
            for (const [key, value] of Object.entries(this)){
                if(typeof value !== "undefined" && typeof value!=="function"){
                    ret[key] = value
                }
            }
            return ret
        }
    }

    public param = (key?: string): any => {
        if(key){
            var value = this[key]
            if(typeof value !== "undefined" && typeof value!=="function"){
                return value
            }
        }
    }

    public check = (key?: string, value?: any): any => {
        if(key){
            if(value===undefined){
                if(this)
                value = this[key]
            }
            return this._checkValue(key, value)
        }
    }

    // バージョンアップ時の対応
    protected _exceptionProcess = (obj: Record<string,any>): Record<string,any> => {
        if("novelCustomHeader" in obj && obj.novelCustomHeader === true){
            console.log(`Converted value: { novelCustomHeader: true } -> { novelCustomHeaderType: "2" } `)
            obj.novelCustomHeaderType = "2"
        }else if("novelCustomHeader" in obj && obj.novelCustomHeader === false){
            console.log(`Converted value: { novelCustomHeader: false } -> { novelCustomHeaderType: "1" } `)
            obj.novelCustomHeaderType = "1"
        }

        return obj
    }

    protected _checkValue = (key: OptionID, value: any): any => {
        if(typeof this[key] === typeof value && typeof this[key]!=="function"){
            if(key === "extOptionsVersion"){
                return
            }else if(["kasasagiGraphType_GeneralDay", "kasasagiGraphType_GeneralTotal", "kasasagiGraphType_ChapterUnique", "kasasagiGraphType_DayPV", "kasasagiGraphType_DayUnique", "kasasagiGraphType_MonthPV", "kasasagiGraphType_MonthUnique"].includes(key)){
                if(!["bar", "line"].includes(value)){
                    return
                }
            }else if(["novelCustomHeaderMode", "workspaceCustomHeaderMode"].includes(key)){
                if(!["absolute", "fixed", "scroll"].includes(value)){
                    return
                }
            }
            else if(key==="correctionNumberShort" || key==="correctionNumberLong" || key==="correctionNumberSymbol"){
                if(!["default", "half", "full", "kanji"].includes(value)){
                    return
                }
            }else if(["novelCustomHeaderLeft", "novelCustomHeaderRight"].includes(key)){
                if(!Array.isArray(value)){return}

                var list: CustomIconIDs = []
                value.forEach(function(id){
                    if(id in novelIconList){
                        list.push(id)
                    }
                })
                return list
            }else if("workspaceCustomHeader" === key){
                if(!Array.isArray(value)){return}

                var list: CustomIconIDs = []
                value.forEach(function(id){
                    if(id in workspaceIconList){
                        list.push(id)
                    }
                })
                return list

            }else if(["workspaceCustomMenu_Left", "workspaceCustomMenu_Middle", "workspaceCustomMenu_Right"].includes(key)){
                if(!Array.isArray(value)){return}

                var list: CustomIconIDs = []
                value.forEach(function(id){
                    if(id in workspaceMenuIconList){
                        list.push(id)
                    }
                })
                return list
            }else if("extFavoriteOptions" === key){
                if(Array.isArray(value)){
                    var list: Array<OptionUI_ItemID> = []
                    value.forEach(function(option){
                        var optionData: OptionUI_Item|undefined = getOptionFromID(option)
                        if(optionData?.value?.buttons?.favorite){
                            list.push(optionData.id)
                        }
                    })
                    var listNoDuplicate = list.filter((e, i) => {
                        return list.indexOf(e) == i;
                    }) 
                    return listNoDuplicate
                }
                return
            }else if("extPopupDefaultPage" === key){
                if(value!=="__auto__"){
                    var page = getOptionPageFromID(value)
                    if((page?.popup?.defaultPage && page?.title && page?.id)){
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
export class SyncOptions{
    extLaunchCount: number = 0
    extLastLaunchTime: string = ""
    history: Array<any> = []
    history_data: Object = {}
    workspaceImpressionMarked: Object = {}

    constructor(data?: Record<string,any>){
        var p:any = this
        if(data instanceof Object){
            Object.keys(data).forEach(function(key){
                p.set(key, data[key])
            })
        }
    }
    public set = (key?: OptionID|Object, value?: any):void => {
        if(key!==undefined){
            if(typeof key==="string"){
                var value = this._checkValue(key, value)
                if(value!==undefined){
                    this[key] = value
                }
            }else if(value instanceof Object){
                value = this._exceptionProcess(value)
                Object.keys(key).forEach(function(k){
                    this.set(k, key[k])
                })
            }
        }
    }

    public get = (includeParameters?: null|OptionID|Array<OptionID>): Record<string,any> => {
        var ret = {}
        if(includeParameters!==undefined && includeParameters!==null){
            var params: Array<OptionID>
            if(typeof includeParameters==="string"){
                params = [includeParameters]
            }else{
                params = includeParameters
            }

            const obj = Object.entries(this)
            for (const key of includeParameters){
                var value: any = obj[key]
                if(typeof value!=="undefined" && typeof value!=="function"){
                    ret[key] = value
                }
            }
            return ret
        }else{
            for (const [key, value] of Object.entries(this)){
                if(typeof value !== "undefined" && typeof value!=="function"){
                    ret[key] = value
                }
            }
            return ret
        }
    }

    public param = (key?: string): any => {
        if(key){
            var value = this[key]
            if(typeof value !== "undefined" && typeof value!=="function"){
                return value
            }
        }
    }

    public check = (key?: string, value?: any): any => {
        if(key){
            if(value===undefined){
                if(this)
                value = this[key]
            }
            return this._checkValue(key, value)
        }
    }

    // バージョンアップ時の対応
    protected _exceptionProcess = (obj: Record<string,any>): Record<string,any> =>{
        return obj
    }

    protected _checkValue = (key: OptionID, value: any): any => {
        if(typeof this[key] === typeof value && typeof this[key]!=="function"){
            
            return value
        }
    }
}