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
    export type iconItems = Record<string, iconItem>

    /**
     * カスタムアイコン
     * @param {string|undefined} id - キー名
     * @param {string|undefined} icon - FontAwesomeクラス（例："fa-solid fa-house"）
     * @param {string|undefined} text - 表示名
     * @param {boolean|undefined} isDropdown - ドロップダウンに表示するかどうか
     */
    export interface iconItem {
        id: string
        icon: string // https://fontawesome.com/search?o=r&m=free
        text: string
        isDropdown?: boolean
    }

    /**
     * 小説ページのカスタムヘッダ用アイコンリスト
     */
    export const novelIconList: iconItems = {
        home: {
            id: "home",
            icon: "fa-solid fa-house",
            text: "ホーム"
        },
        narou: {
            id: "narou",
            icon: "fa-solid fa-pen-nib",
            text: "トップページ"
        },
        login: {
            id: "login",
            icon: "fa-solid fa-right-to-bracket",
            text: "ログイン"
        },
        author: {
            id: "author",
            icon: "fa-solid fa-user",
            text: "作者"
        },
        kasasagi: {
            id: "kasasagi",
            icon: "fa-solid fa-chart-line",
            text: "アクセス解析"
        },
        "narou-api": {
            id: "narou-api",
            icon: "fa-solid fa-file-code",
            text: "なろうAPI"
        },
        rss: {
            id: "rss",
            icon: "fa-solid fa-rss",
            text: "RSS"
        },
        info: {
            id: "info",
            icon: "fa-solid fa-info",
            text: "作品情報"
        },
        impression: {
            id: "impression",
            icon: "fa-solid fa-comments",
            text: "感想"
        },
        review: {
            id: "review",
            icon: "fa-solid fa-flag",
            text: "レビュー"
        },
        pdf: {
            id: "pdf",
            icon: "fa-solid fa-file-pdf",
            text: "縦書きPDF"
        },
        booklist: {
            id: "booklist",
            icon: "fa-solid fa-book-bookmark",
            text: "ブックマーク"
        },
        favlist_add: {
            id: "favlist_add",
            icon: "fa-regular fa-star",
            text: "お気に入りep"
        },
        favepisode: {
            id: "favepisode",
            icon: "fa-solid fa-table-list",
            text: "お気に入りep一覧"
        },
        edit: {
            id: "edit",
            icon: "fa-solid fa-pen-to-square",
            text: "編集"
        },
        /*
        siori: {
            id: "siori",
            icon: "fa-solid fa-bookmark",
            text: "しおり"
        },
        */
        text: {
            id: "text",
            icon: "fa-solid fa-file-lines",
            text: "TXT"
        },
        history: {
            id: "history",
            icon: "fa-solid fa-clock-rotate-left",
            text: "直近の閲覧履歴"
        },
        search: {
            id: "search",
            icon: "fa-solid fa-magnifying-glass",
            text: "検索"
        },
        typo: {
            id: "typo",
            icon: "fa-solid fa-keyboard",
            text: "誤字報告"
        },
        report: {
            id: "report",
            icon: "fa-solid fa-bullhorn",
            text: "情報提供"
        },
        scroll: {
            id: "scroll",
            icon: "fa-solid fa-angles-up",
            text: "スクロール"
        },
        "copy-url": {
            id: "copy-url",
            icon: "fa-solid fa-link",
            text: "URLをコピー"
        },
        twitter: {
            id: "twitter",
            icon: "fa-brands fa-x-twitter",
            text: "X"
        },
        facebook: {
            id: "facebook",
            icon: "fa-brands fa-facebook",
            text: "Facebook"
        },
        line: {
            id: "line",
            icon: "fa-brands fa-line",
            text: "LINE"
        },
        "hatena-bookmark": {
            id: "hatena-bookmark",
            icon: "icon-hatena-bookmark",
            text: "はてなブックマーク"
        },
        feedly: {
            id: "feedly",
            icon: "icon-feedly",
            text: "Feedly"
        },
        rawi: {
            id: "rawi",
            icon: "fa-solid fa-robot",
            text: "RaWi"
        },
        qrcode: {
            id: "qrcode",
            icon: "fa-solid fa-qrcode",
            text: "QRコード"
        },
        option: {
            id: "option",
            icon: "fa-solid fa-gear",
            text: "設定"
        }
    }

    /**
     * ユーザページのカスタムヘッダ用アイコンリスト
     */
    export const workspaceIconList: iconItems = {
        user: {
            id: "user",
            icon: "fa-solid fa-user",
            text: "ユーザ",
            isDropdown: true
        },
        message: {
            id: "message",
            icon: "fa-regular fa-envelope",
            text: "メッセージ"
        },
        home: {
            id: "home",
            icon: "fa-solid fa-house",
            text: "ユーザホーム"
        },
        menu: {
            id: "menu",
            icon: "fa-solid fa-bars",
            text: "メニュー",
            isDropdown: true
        },
        favorite: {
            id: "favorite",
            icon: "fa-regular fa-star",
            text: "お気に入り",
            isDropdown: true
        },
        favuser: {
            id: "favuser",
            icon: "fa-solid fa-heart",
            text: "お気に入りユーザ"
        },
        favnovel: {
            id: "favnovel",
            icon: "fa-solid fa-book-bookmark",
            text: "ブックマーク"
        },
        noticelist: {
            id: "noticelist",
            icon: "fa-solid fa-bell",
            text: "更新通知"
        },
        edit: {
            id: "edit",
            icon: "fa-solid fa-pen",
            text: "投稿",
            isDropdown: true
        },
        usernovel: {
            id: "usernovel",
            icon: "fa-solid fa-plus",
            text: "作品の作成・編集"
        },
        novelseries: {
            id: "novelseries",
            icon: "fa-solid fa-list",
            text: "シリーズ設定"
        },
        blog: {
            id: "blog",
            icon: "fa-regular fa-newspaper",
            text: "活動報告"
        },
        reaction: {
            id: "reaction",
            icon: "fa-regular fa-comment-dots",
            text: "リアクション",
            isDropdown: true
        },
        impression: {
            id: "impression",
            icon: "fa-regular fa-comment",
            text: "感想"
        },
        review: {
            id: "review",
            icon: "fa-solid fa-flag",
            text: "イチオシレビュー"
        },
        blogcomment: {
            id: "blogcomment",
            icon: "fa-regular fa-newspaper",
            text: "活動報告コメント"
        },
        novelreport: {
            id: "novelreport",
            icon: "fa-solid fa-keyboard",
            text: "誤字報告"
        },
        "block-mute": {
            id: "block-mute",
            icon: "fa-solid fa-ban",
            text: "ブロック・ミュート",
            isDropdown: true
        },
        "x-home": {
            id: "x-home",
            icon: "fa-solid fa-house",
            text: "ホーム↔Xホーム"
        },
        find: {
            id: "find",
            icon: "fa-solid fa-magnifying-glass",
            text: "作品を探す",
            isDropdown: true
        },
        support: {
            id: "support",
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
            id: "user",
            icon: "fa-solid fa-user",
            text: "ユーザ"
        },
        message: {
            id: "message",
            icon: "fa-regular fa-envelope",
            text: "メッセージ"
        },
        home: {
            id: "home",
            icon: "fa-solid fa-house",
            text: "ユーザホーム"
        },
        favorite: {
            id: "favorite",
            icon: "fa-regular fa-star",
            text: "お気に入り"
        },
        edit: {
            id: "edit",
            icon: "fa-solid fa-pen",
            text: "投稿"
        },
        blog: {
            id: "blog",
            icon: "fa-regular fa-newspaper",
            text: "活動報告"
        },
        reaction: {
            id: "reaction",
            icon: "fa-regular fa-comment-dots",
            text: "リアクション"
        },
        "block-mute": {
            id: "block-mute",
            icon: "fa-solid fa-ban",
            text: "ブロック・ミュート"
        },
        "x-home": {
            id: "x-home",
            icon: "fa-solid fa-house",
            text: "ホーム↔Xホーム"
        },
        find: {
            id: "find",
            icon: "fa-solid fa-magnifying-glass",
            text: "作品を探す"
        },
        support: {
            id: "support",
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