import { general_optionsList } from "../general/_options";
import { narou_optionsList } from "../narou/_options";
import { novel_optionsList } from "../novel/_options";
import { yomou_optionsList } from "../yomou/_options";
import { workspace_optionsList } from "../workspace/_options";
import { mypage_optionsList } from "../mypage/_options";
import { mitemin_optionsList } from "../mitemin/_options";
import { kasasagi_optionsList } from "../kasasagi/_options";

import { OptionUI_Item, OptionUI_Page } from "./optionUI_type";

export const OptionUI_Pages: Array<OptionUI_Page> = [
    {
        title: "検索",
        description: "設定項目を絞り込み検索することができます。",
        id: "search",
        defaultCategory: "general",
        categories: [
            {
                title: "検索",
                id: "general",
            },
        ],
        tabs: false,
        sidebar: false,
        popup: {
            defaultPage: true
        },
        noindex: true,
    },
    {
        title: "全般",
        description: "Narou Tweaker全体の設定を変更することが出来ます。",
        id: "general",
        icon: "fa-solid fa-gear",
        defaultCategory: "introduction",
        popup: {
            hide: true,
            defaultPage: true
        },
        categories: [
            {
                title: "デバッグ",
                id: "debug",
                description: {
                    attention: "【デバッグモード】開発者向けの機能です。不具合が発生する可能性がありますのでご注意ください。"
                }
            },
            {
                title: "Narou Tweaker",
                id: "introduction",
            },
            {
                title: "基本設定",
                id: "config",
                description: {
                    text: "Narou Tweaker全体に影響する設定を変更します。"
                }
            },
            {
                title: "設定データ",
                id: "data",
                description: {
                    text: "Narou Tweakerの設定データを変更します。",
                    attention: "すべての設定がリセットされる場合があります。操作にはご注意ください。"
                }
            },
            {
                title: "パッチノート",
                id: "version",
            }
        ]
    },
    {
        title: "お気に入り",
        description: "お気に入りのオプションを登録できます。",
        id: "favorite",
        icon: "fa-solid fa-heart",
        defaultCategory: "general",
        categories: [
            {
                title: "全般",
                id: "general",
            },
        ],
        tabs: false,
        popup: {
            hide: true,
            defaultPage: true
        },
    },
    {
        id: "favorite-separator",
        categories: [],
        noindex: true,
        separator: true,
        popup: {
            hide: true,
        },
    },
    {
        title: "小説家になろう",
        description: "小説家になろうの表示を設定することが出来ます。",
        id: "narou",
        icon: "fa-solid fa-house",
        targetUrl: ["*.syosetu.com", "eparet.net"],
        defaultCategory: "general",
        popup: {
            defaultPage: true
        },
        categories: [
            {
                title: "全般",
                id: "general",
                description: {
                    text: "小説家になろうの全般に影響する設定を変更します。"
                }
            },
        ]
    },
    {
        title: "小説ページ",
        description: "小説本文やその関連ページの設定を変更することが出来ます。",
        id: "novel",
        icon: "fa-solid fa-book",
        targetUrl: ["ncode.syosetu.com", "novelcom.syosetu.com", "novel18.syosetu.com", "novelcom18.syosetu.com"],
        defaultCategory: "general",
        popup: {
            defaultPage: true
        },
        categories: [
            {
                title: "全般",
                id: "general",
                description: {
                    text: "小説ページ全体に影響する設定を変更します。"
                }
            },
            {
                title: "本文",
                id: "novel",
                description: {
                    text: "本文ページに影響する設定を変更します。"
                }
            },
            {
                title: "スキン",
                id: "style",
                description: {
                    text: "ページの外観を変更します。",
                    small: "これらの設定は、小説ページ内から直接変更できます。",
                }
            },
            {
                title: "書体",
                id: "font",
                description: {
                    text: "フォントや行間などの文章レイアウトを変更します。",
                    small: "これらの設定は、小説ページ内から直接変更できます。",
                }
            },
            {
                title: "文章校正",
                id: "correction",
                description: {
                    text: "小説本文を指定した方法で校正します。",
                    small: "これらの設定は、小説ページ内から直接変更できます。",
                }
            },
        ]
    },
    {
        title: "小説を読もう！",
        description: "ランキングや検索ページの表示を設定することが出来ます。",
        id: "yomou",
        icon: "fa-solid fa-crown",
        targetUrl: ["yomou.syosetu.com", "noc.syosetu.com", "mnlt.syosetu.com", "mid.syosetu.com"],
        defaultCategory: "rank",
        popup: {
            defaultPage: true
        },
        categories: [
            {
                title: "ランキング",
                id: "rank",
                description: {
                    text: "ランキング全般の設定を変更します。"
                }
            },
            {
                title: "ランキング（トップ）",
                id: "ranktop",
                description: {
                    text: "ランキングのトップページの設定を変更します。"
                }
            },
        ]
    },
    {
        title: "ユーザページ",
        description: "ユーザページの表示を設定することが出来ます。",
        id: "workspace",
        icon: "fa-solid fa-pen-nib",
        targetUrl: ["syosetu.com"],
        defaultCategory: "general",
        popup: {
            defaultPage: true
        },
        categories: [
            {
                title: "全般",
                id: "general",
                description: {
                    text: "ユーザページの全体に影響する設定を変更します。"
                }
            },
            {
                title: "小説管理",
                id: "manage",
                description: {
                    text: "小説の管理画面を変更します。"
                }
            },
            {
                title: "エディタ",
                id: "editor",
                description: {
                    text: "小説の編集画面を変更します。"
                }
            },
            {
                title: "お気に入り",
                id: "favorite",
                description: {
                    text: "ブックマークやお気に入りユーザの設定を変更します。"
                }
            },
            {
                title: "リアクション",
                id: "reaction",
                description: {
                    text: "感想やレビューなどの設定を変更します。"
                }
            },
        ]
    },
    {
        title: "マイページ",
        description: "マイページの表示を設定することが出来ます。",
        id: "mypage",
        icon: "fa-solid fa-user",
        targetUrl: ["mypage.syosetu.com", "xmypage.syosetu.com"],
        defaultCategory: "general",
        popup: {
            defaultPage: true
        },
        categories: [
            {
                title: "全般",
                id: "general",
                description: {
                    text: "マイページの全体に影響する設定を変更します。"
                }
            },
            {
                title: "活動報告",
                id: "blog",
                description: {
                    text: "活動報告の設定を変更します。"
                }
            },
            {
                title: "プロフィール",
                id: "profile",
                description: {
                    text: "プロフィールの設定を変更します。"
                }
            },
        ]
    },
    {
        title: "みてみん",
        description: "みてみん・えぱれっとの表示を設定することが出来ます。",
        id: "mitemin",
        icon: "fa-solid fa-palette",
        targetUrl: ["mitemin.net", "eparet.net"],
        defaultCategory: "general",
        popup: {
            defaultPage: true
        },
        categories: [
            {
                title: "全般",
                id: "general",
                description: {
                    text: "みてみん全体に影響する設定を変更します。"
                }
            },
        ]
    },
    {
        title: "アクセス解析",
        description: "KASASAGI（アクセス解析ページ）の表示を設定することが出来ます。",
        id: "kasasagi",
        icon: "fa-solid fa-chart-line",
        targetUrl: ["kasasagi.hinaproject.com"],
        defaultCategory: "general",
        popup: {
            defaultPage: true
        },
        categories: [
            {
                title: "全般",
                id: "general",
                description: {
                    text: "KASASAGIの全体に影響する設定を変更します。"
                }
            },
            {
                title: "総合PV",
                id: "pageview",
                description: {
                    text: "総合PVの設定を変更します。"
                }
            },
            {
                title: "エピソード別",
                id: "episode",
                description: {
                    text: "エピソード別ユニークの設定を変更します。"
                }
            },
            {
                title: "日別",
                id: "day",
                description: {
                    text: "日別PV・ユニークの設定を変更します。"
                }
            },
            {
                title: "月別",
                id: "month",
                description: {
                    text: "月別PV・ユニークの設定を変更します。"
                }
            },
        ]
    },
]

export const OptionUI_Items: Array<OptionUI_Item> = [
    /* 検索 */
    {
        id: "extSearch",
        title: "検索",
        description: {
            text: "キーワードを入力してください",
            small: "・スペース区切りでAND検索ができます。<br>・「\"◯◯\"」と括ると完全一致する語句を検索します。<br>・「-◯◯」で特定の語句を除外します。"
        },
        ui: {
            type: "custom",
            name: "default",
            data: "ui_extSearchBox",
        },
        location: {
            page: "search",
            category: "general",
            noindex: true,
        },
        value: {
            buttons: {
                reset: false,
                favorite: false,
            },
        }
    },

    /* 全般 */
    ...general_optionsList,

    /* 小説家になろう */
    ...narou_optionsList,

    /* 小説ページ */
    ...novel_optionsList,
    
    /* 小説を読もう！ */
    ...yomou_optionsList,

    /* ユーザページ */
    ...workspace_optionsList,

    /* マイページ */
    ...mypage_optionsList,

    /* みてみん */
    ...mitemin_optionsList,

    /* アクセス解析 */
    ...kasasagi_optionsList,
]