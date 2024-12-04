import { nt } from "../../../../utils/narou-tweaker"

export type OptionID = string
export type OptionUI_PageID = string
export type OptionUI_CategoryID = string
export type OptionUI_ItemID = string

export type OptionUI_Anchors = Array<OptionUI_Anchor>
export interface OptionUI_Anchor {
    id: string
    level: number
    label: string
}

/**
 * オプションページ上の説明文クラス
 * @param {string} text - メイン文章
 * @param {string} small - サブ文章
 * @param {string} attention - 警告文（赤字）
 * @param {string} hidden - 非表示
 * @param {Array<string>} keywords - 絵kん咲くようキーワード
 */
export class OptionUI_Descriptions {
    attention?: string
    text?: string
    small?: string
    hidden?: string
    keywords?: Array<string>
}


/************************************************************************************* */
/**
 * オプションページ
 * @param {OptionUI_PageID} id - ページID
 * @param {string} title - 表示名
 * @param {string} description - 説明文
 * @param {string} icon - FontAwesomeのクラス
 * @param {Array<string>} targetUrl - 設定対象となるページのURL
 * @param {OptionUI_CategoryID} defaultCategory - ページ内既定のカテゴリID
 * @param {Array<OptionUI_Category>} categories - カテゴリ
 * @param {boolean} tabs - タブを表示するかどうか
 * @param {boolean} sidebar - サイドバーを表示するかどうか
 * @param {boolean} separator - サイドバーのセパレーターかどうか
 * @param {boolean} noindex - 検索ページで結果に表示しない
 * @param {OptionUI_Page_Popup} popup - ポップアップ上での設定
 * @param {OptionUI_PageID} parent - 親ページ
 */
export interface OptionUI_Page {
    id: OptionUI_PageID
    type?: "page" | "divider" | "header"
    title?: string
    description?: string
    icon?: OptionUI_FontAwesomeIcon
    targetUrl?: Array<string>
    defaultCategory?: OptionUI_CategoryID
    categories?: Array<OptionUI_Category> 
    parent?: OptionUI_PageID
    position?: OptionUI_Page_Position
    noindex?: boolean
    hideToc?: boolean
    popup?: boolean
}

export type OptionUI_Page_Position = "top" | "bottom" | "hide"

export interface OptionUI_FontAwesomeIcon {
    icon: string
    prefix?: string
    variant?: string
}

/************************************************************************************* */
/**
 * オプションページのカテゴリ
 * @param {OptionUI_CategoryID} id - カテゴリID
 * @param {string} title - 表示名
 * @param {OptionUI_Descriptions} description - 説明文
 */
export interface OptionUI_Category {
    id: OptionUI_CategoryID
    title: string
    description?: OptionUI_Descriptions
    hideTitle?: boolean
    hideDescription?: boolean
}



/************************************************************************************* */
/**
 * オプションページのアイテム
 */
export interface OptionUI_Item {
    id: OptionUI_ItemID
    title: string
    description?: OptionUI_Descriptions
    location: {
        page: OptionUI_PageID
        category: OptionUI_CategoryID
        hide?: boolean
        noindex?: boolean
        parent?: string
    }
    ui?: OptionUI_Item_UI
    value?: {
        related?: Array<OptionID> | "childs"
        isAdvanced?: boolean
        isDebug?: boolean
        isExperimental?: boolean
        requirement?: {
            condition?: "and"|"or"|"nor"|"nand"
            requirementParams?: Array<{
                id: OptionID,
                value: any,
                /**
                 * `=`: `storage` === `v` (default)  
                 * `!=`: `storage` !== `v`  
                 * `>`: `storage` > `v`  
                 * `<`: `storage` < `v`  
                 * `>=`: `storage` >= `v`  
                 * `<=`: `storage` <= `v`  
                 * `<=`: `storage` <= `v`  
                 * `in`: `v` in `storage`  
                 * `of`: `v`.includes(`storage`)  
                 * `include`: `storage`.includes(`v`)  
                 */
                compare?: "="|"!="|">"|"<"|">="|"<="|"in"|"of"|"include"
            }>
        }
    }
}

interface OptionUI_Item_UI<T = "switch" | "checkbox" | "select" | "radio" | "slider" | "textarea" | "code"
| "parent" | "custom" | "color" | "textfield" | "number"> {
    type: T
    variant?: "filled" | "standard" | "outlined"
    data?: T extends "switch" | "checkbox"
        ? OptionUI_Item_Switch
        : T extends "select"
        ? OptionUI_Item_Select
        : T extends "radio"
        ? OptionUI_Item_Select
        : T extends "slider"
        ? OptionUI_Item_Slider
        : T extends "textarea"
        ? OptionUI_Item_TextArea
        : T extends "code"
        ? OptionUI_Item_Code
        : T extends "color"
        ? OptionUI_Item_Color
        : T extends "textfield"
        ? OptionUI_Item_TextField
        : T extends "number"
        ? OptionUI_Item_Number
        : T extends "parent"
        ? OptionUI_Item_Parent
        : T extends "custom"
        ? OptionUI_Item_Custom
        : {}
    label?: string
    description?: string
    placeholder?: string
    labelPlacement?: 'bottom'|'end'|'start'|'top'
    showForce?: boolean
    hideButtons?: Array<"all"|"favorite"|"reset"|"info">
}


/************************************************************************************* */
/* オプションページ データ */
export interface OptionUI_ItemProps {
    option: OptionUI_Item
    storage?: nt.storage.local.options
    type?: "search" | "favorite" | "default"
    child?: number
}

export interface OptionUI_Item_UI_Text {
    label?: string
    description?: string
    type?: "text" | "number"
    variant?: "outlined" | "filled" | "standard"
}

export class OptionUI_Item_Switch {
}

export class OptionUI_Item_TextArea {
    rows?: number
    maxRows?: number
    minRows?: number
    width?: number
    layout?: "default"|"wide"
}

export class OptionUI_Item_TextField {
    layout?: "default"|"wide"
}

export class OptionUI_Item_Code {
    language?: string
    width?: number
    height?: number
    maxWidth?: number
    maxHeight?: number
    layout?: "default"|"wide"|"popup"
}

export class OptionUI_Item_Select<U = "string"|"number"> {
    dataType?: U
    values?: U extends "string"
        ? Array<{ value: string, label: string }>
        : U extends "number"
        ? Array<{ value: number, label: string }>
        : Array<{ value: string|number, label: string }>
}

export class OptionUI_Item_Radio<U = "string"|"number"> {
    dataType?: U
    values?: U extends "string"
        ? Array<{ value: string, label: string }>
        : U extends "number"
        ? Array<{ value: number, label: string }>
        : Array<{ value: string|number, label: string }>
    layout?: "default"|"wide"
}

export class OptionUI_Item_Number {
    max?: number
    min?: number
    step?: number|null
    forceStep?: boolean
    prefix?: string|OptionUI_FontAwesomeIcon
    suffix?: string|OptionUI_FontAwesomeIcon
}

export class OptionUI_Item_Slider extends OptionUI_Item_Number {
    marks?: boolean | Array<{ value: number, label: string }>
    showLabel?: "auto" | "on" | "off"
    showField?: boolean
    size?: "small"|"medium"
    width?: number
}


export class OptionUI_Item_Color {
    hidePreview?: boolean
}

export class OptionUI_Item_Parent {
}

export class OptionUI_Item_Custom {
    id?: string
    layout?: "default"|"wide"|"dropdown"|"popup"
    hideDivider?: boolean
}