export namespace __nt_header__ {
    /**
     * カスタムアイコンのID
     */
    export type iconId = string



    /**
     * カスタムアイコンのリスト
     * @param {CustomIconID} key - ID
     * @param {CustomIconItem} IconItem - カスタムアイコンのオブジェクト
     */
    export type iconItems = Record<iconId, iconItem>

    /**
     * カスタムアイコン
     * @param {string|undefined} icon - FontAwesomeクラス（例："fa-solid fa-house"）
     * @param {string|undefined} text - 表示名
     * @param {boolean|undefined} isDropdown - ドロップダウンに表示するかどうか
     */
    export class iconItem {
        icon?: string // https://fontawesome.com/search?o=r&m=free
        text?: string
        isDropdown?: boolean

        constructor(icon?:iconItem)
        constructor(icon?:Object|iconItem){
            if(icon instanceof Object){
                if("icon" in icon && typeof icon?.icon=="string"){
                    this.icon = icon.icon
                }
                if("text" in icon && typeof icon?.text=="string"){
                    this.text = icon.text
                }
                if("isDropdown" in icon && typeof icon?.isDropdown=="boolean"){
                    this.isDropdown = icon.isDropdown
                }
            }
        }
    }

    /**
     * 小説ページのカスタムヘッダ用アイコンリスト
     */
    export const novelIconList: iconItems = {
        home: {
            icon: "fa-solid fa-house",
            text: "ホーム"
        },
        narou: {
            icon: "fa-solid fa-pen-nib",
            text: "トップページ"
        },
        login: {
            icon: "fa-solid fa-right-to-bracket",
            text: "ログイン"
        },
        author: {
            icon: "fa-solid fa-user",
            text: "作者"
        },
        kasasagi: {
            icon: "fa-solid fa-chart-line",
            text: "アクセス解析"
        },
        "narou-api": {
            icon: "fa-solid fa-file-code",
            text: "なろうAPI"
        },
        rss: {
            icon: "fa-solid fa-rss",
            text: "RSS"
        },
        info: {
            icon: "fa-solid fa-info",
            text: "作品情報"
        },
        impression: {
            icon: "fa-solid fa-comments",
            text: "感想"
        },
        review: {
            icon: "fa-solid fa-flag",
            text: "レビュー"
        },
        pdf: {
            icon: "fa-solid fa-file-pdf",
            text: "縦書きPDF"
        },
        booklist: {
            icon: "fa-solid fa-book-bookmark",
            text: "ブックマーク"
        },
        favlist_add: {
            icon: "fa-regular fa-star",
            text: "お気に入りep"
        },
        favepisode: {
            icon: "fa-solid fa-table-list",
            text: "お気に入りep一覧"
        },
        edit: {
            icon: "fa-solid fa-pen-to-square",
            text: "編集"
        },
        /*
        siori: {
            icon: "fa-solid fa-bookmark",
            text: "しおり"
        },
        */
        text: {
            icon: "fa-solid fa-file-lines",
            text: "TXT"
        },
        history: {
            icon: "fa-solid fa-clock-rotate-left",
            text: "直近の閲覧履歴"
        },
        search: {
            icon: "fa-solid fa-magnifying-glass",
            text: "検索"
        },
        typo: {
            icon: "fa-solid fa-keyboard",
            text: "誤字報告"
        },
        report: {
            icon: "fa-solid fa-bullhorn",
            text: "情報提供"
        },
        scroll: {
            icon: "fa-solid fa-angles-up",
            text: "スクロール"
        },
        "copy-url": {
            icon: "fa-solid fa-link",
            text: "URLをコピー"
        },
        twitter: {
            icon: "fa-brands fa-x-twitter",
            text: "X"
        },
        facebook: {
            icon: "fa-brands fa-facebook",
            text: "Facebook"
        },
        line: {
            icon: "fa-brands fa-line",
            text: "LINE"
        },
        "hatena-bookmark": {
            icon: "icon-hatena-bookmark",
            text: "はてなブックマーク"
        },
        feedly: {
            icon: "icon-feedly",
            text: "Feedly"
        },
        rawi: {
            icon: "fa-solid fa-robot",
            text: "RaWi"
        },
        qrcode: {
            icon: "fa-solid fa-qrcode",
            text: "QRコード"
        },
        option: {
            icon: "fa-solid fa-gear",
            text: "設定"
        }
    }

    /**
     * ユーザページのカスタムヘッダ用アイコンリスト
     */
    export const workspaceIconList: iconItems = {
        user: {
            icon: "fa-solid fa-user",
            text: "ユーザ",
            isDropdown: true
        },
        message: {
            icon: "fa-regular fa-envelope",
            text: "メッセージ"
        },
        home: {
            icon: "fa-solid fa-house",
            text: "ユーザホーム"
        },
        menu: {
            icon: "fa-solid fa-bars",
            text: "メニュー",
            isDropdown: true
        },
        favorite: {
            icon: "fa-regular fa-star",
            text: "お気に入り",
            isDropdown: true
        },
        favuser: {
            icon: "fa-solid fa-heart",
            text: "お気に入りユーザ"
        },
        favnovel: {
            icon: "fa-solid fa-book-bookmark",
            text: "ブックマーク"
        },
        noticelist: {
            icon: "fa-solid fa-bell",
            text: "更新通知"
        },
        edit: {
            icon: "fa-solid fa-pen",
            text: "投稿",
            isDropdown: true
        },
        usernovel: {
            icon: "fa-solid fa-plus",
            text: "作品の作成・編集"
        },
        novelseries: {
            icon: "fa-solid fa-list",
            text: "シリーズ設定"
        },
        blog: {
            icon: "fa-regular fa-newspaper",
            text: "活動報告"
        },
        reaction: {
            icon: "fa-regular fa-comment-dots",
            text: "リアクション",
            isDropdown: true
        },
        impression: {
            icon: "fa-regular fa-comment",
            text: "感想"
        },
        review: {
            icon: "fa-solid fa-flag",
            text: "イチオシレビュー"
        },
        blogcomment: {
            icon: "fa-regular fa-newspaper",
            text: "活動報告コメント"
        },
        novelreport: {
            icon: "fa-solid fa-keyboard",
            text: "誤字報告"
        },
        "block-mute": {
            icon: "fa-solid fa-ban",
            text: "ブロック・ミュート",
            isDropdown: true
        },
        "x-home": {
            icon: "fa-solid fa-house",
            text: "ホーム↔Xホーム"
        },
        find: {
            icon: "fa-solid fa-magnifying-glass",
            text: "作品を探す",
            isDropdown: true
        },
        support: {
            icon: "fa-regular fa-circle-question",
            text: "お困りの方は",
            isDropdown: true
        }
    }

    /**
     * ユーザページのメニュー用アイコンリスト
     */
    export const workspaceMenuIconList: iconItems = {
        user: {
            icon: "fa-solid fa-user",
            text: "ユーザ"
        },
        message: {
            icon: "fa-regular fa-envelope",
            text: "メッセージ"
        },
        home: {
            icon: "fa-solid fa-house",
            text: "ユーザホーム"
        },
        favorite: {
            icon: "fa-regular fa-star",
            text: "お気に入り"
        },
        edit: {
            icon: "fa-solid fa-pen",
            text: "投稿"
        },
        blog: {
            icon: "fa-regular fa-newspaper",
            text: "活動報告"
        },
        reaction: {
            icon: "fa-regular fa-comment-dots",
            text: "リアクション"
        },
        "block-mute": {
            icon: "fa-solid fa-ban",
            text: "ブロック・ミュート"
        },
        "x-home": {
            icon: "fa-solid fa-house",
            text: "ホーム↔Xホーム"
        },
        find: {
            icon: "fa-solid fa-magnifying-glass",
            text: "作品を探す"
        },
        support: {
            icon: "fa-regular fa-circle-question",
            text: "お困りの方は"
        }
    }

    /**
     * リストに含まれていないアイコンを取得する
     * @param {Array<CustomIconIDs>|CustomIconIDs} lists - カスタムアイコンIDのリスト（一階層までネスト可）
     * @param {CustomIconItems} parent - 全体集合となるカスタムアイコンのリスト
     * @returns {CustomIconIDs} - 引数に指定したリストに含まれないアイコンIDのリスト
     */
    export function getExcludeIcons(lists: Array<Array<iconId>>|Array<iconId>, parent: iconItems = novelIconList): Array<iconId>{
        const v: Array<iconId> = lists.flat()
        var ret: Array<iconId> = []
        Object.keys(parent).forEach(function(key: iconId){
            if(!v.includes(key)){
                ret.push(key)
            }
        })
        return ret;
    }
}