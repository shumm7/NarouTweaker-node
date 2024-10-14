import { OptionID } from "utils/option"

export type OptionUI_PageID = string
export type OptionUI_CategoryID = string
export type OptionUI_ItemID = string

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
export class OptionUI_Page{
    id: OptionUI_PageID = ""
    title?: string
    description?: string
    icon?: string
    targetUrl?: Array<string>
    defaultCategory?: OptionUI_CategoryID
    parent?: OptionUI_PageID
    categories: Array<OptionUI_Category> = []
    tabs?: boolean = true
    sidebar?: boolean = true
    separator?: boolean = false
    noindex?: boolean = false
    popup?: OptionUI_Page_Popup = new OptionUI_Page_Popup
}

/**
 * ポップアップページ上での設定項目
 * @param {boolean} hide - ポップアップ上でアイコンを隠す
 * @param {boolean} defaultPage - ポップアップのデフォルトページに設定可能かどうか
 */
class OptionUI_Page_Popup {
    hide?: boolean = false
    defaultPage?: boolean = true
}

/************************************************************************************* */
/**
 * オプションページのカテゴリ
 * @param {OptionUI_CategoryID} id - カテゴリID
 * @param {string} title - 表示名
 * @param {OptionUI_Descriptions} description - 説明文
 */
export class OptionUI_Category {
    id: OptionUI_CategoryID = ""
    title?: string
    description?: OptionUI_Descriptions
}



/************************************************************************************* */
/**
 * オプションページのアイテム
 */
export class OptionUI_Item {
    id: OptionUI_ItemID = ""
    title?: string
    description?: OptionUI_Descriptions
    ui?: OptionUI_Item_UI
    location?: OptionUI_Item_Location
    value?: OptionUI_Item_Value
    class?: any
    style?: any
}

class OptionUI_Item_UI {
    type: string = ""
    name: string = "default"
    suffix?: string
    prefix?: string
    data?: any
    action?: Function|Array<Function>
    noindex?: boolean
    style?: any
    class?: any
}
class OptionUI_Item_Location {
    page: OptionUI_PageID = ""
    category: OptionUI_CategoryID = ""
    hasParent?: boolean
    hide?: boolean
    parent?: OptionUI_ItemID
    noindex?: boolean
}
class OptionUI_Item_Value {
    related?: Array<OptionID>|OptionID
    buttons?: OptionUI_Item_Value_Buttons
    isAdvanced?: boolean
    isDebug?: boolean
    isExperimental?: boolean
    requirement?: OptionUI_Item_Value_Requirement
}
class OptionUI_Item_Value_Buttons {
    reset?: boolean
    favorite?: boolean
}
class OptionUI_Item_Value_Requirement {
    dataFor: Array<OptionUI_ItemID>|OptionUI_ItemID = ""
    data: Array<any>|any
    mode?: string = "show"
    rule?: string
}