import { OptionUI_Page } from "./type";

const top: Array<OptionUI_Page> = [
    {
        id: "top-header-favorite",
        title: "基本",
        position: "top",
        type: "header",
        noindex: true,
    },

    {
        title: "テスト",
        id: "test",
        position: "top",
        defaultCategory: "switch",
        categories: [
            {
                title: "Switch",
                id: "switch"
            },
            {
                title: "Checkbox",
                id: "checkbox"
            },
            {
                title: "Select",
                id: "select"
            },
            {
                title: "Radio",
                id: "radio"
            },
            {
                title: "Slider",
                id: "slider"
            },
            {
                title: "TextArea",
                id: "textarea"
            },
            {
                title: "Code",
                id: "code"
            },
            {
                title: "Text Field",
                id: "textfield"
            },
        ],
    },

    {
        title: "一般設定",
        description: "Narou Tweaker全体の設定を変更することが出来ます。",
        id: "general",
        icon: {
            prefix: "solid",
            icon: "gear"
        },
        position: "top",
        popup: true,
        defaultCategory: "introduction",
        categories: [
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
            }
        ]
    },
    
    {
        title: "お気に入り",
        description: "お気に入りのオプションを登録できます。",
        id: "favorite",
        icon: {
            prefix: "solid",
            icon: "heart"
        },
        position: "top",
        popup: true,
        hideToc: true,
        defaultCategory: "general",
        categories: [
            {
                title: "全般",
                id: "general",
                hideTitle: true,
            },
        ],
    },

    {
        id: "top-header-favorite",
        title: "個別",
        position: "top",
        type: "header",
        noindex: true,
    },
    {
        title: "小説家になろう",
        description: "小説家になろうの表示を設定することが出来ます。",
        id: "narou",
        icon: {
            prefix: "solid",
            icon: "house"
        },
        popup: true,
        targetUrl: ["*.syosetu.com", "eparet.net"],
        defaultCategory: "general",
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
        icon: {
            prefix: "solid",
            icon: "book"
        },
        popup: true,
        targetUrl: ["ncode.syosetu.com", "novelcom.syosetu.com", "novel18.syosetu.com", "novelcom18.syosetu.com"],
        defaultCategory: "general",
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
        icon: {
            prefix: "solid",
            icon: "crown"
        },
        popup: true,
        targetUrl: ["yomou.syosetu.com", "noc.syosetu.com", "mnlt.syosetu.com", "mid.syosetu.com"],
        defaultCategory: "rank",
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
        icon: {
            prefix: "solid",
            icon: "fa-pen-nib"
        },
        popup: true,
        targetUrl: ["syosetu.com"],
        defaultCategory: "general",
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
        icon: {
            prefix: "solid",
            icon: "user"
        },
        popup: true,
        targetUrl: ["mypage.syosetu.com", "xmypage.syosetu.com"],
        defaultCategory: "general",
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
        icon: {
            prefix: "solid",
            icon: "palette"
        },
        popup: true,
        targetUrl: ["mitemin.net", "eparet.net"],
        defaultCategory: "general",
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
        icon: {
            prefix: "solid",
            icon: "chart-line"
        },
        popup: true,
        targetUrl: ["kasasagi.hinaproject.com"],
        defaultCategory: "general",
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

const bottom: Array<OptionUI_Page> = [
    {
        id: "bottom-divider",
        position: "bottom",
        type: "divider",
        noindex: true,
    },

    {
        title: "パッチノート",
        id: "patchnotes",
        icon: {
            prefix: "solid",
            icon: "file-lines"
        },
        position: "bottom",
        defaultCategory: "introduction",
        noindex: true,
        hideToc: true,
        categories: [
            {
                title: "パッチノート",
                id: "general",
            },
        ]
    },

    {
        title: "情報",
        id: "about",
        icon: {
            prefix: "solid",
            icon: "circle-info"
        },
        noindex: true,
        position: "bottom",
        defaultCategory: "introduction",
        categories: [
            {
                title: "Narou Tweaker",
                id: "introduction",
                hideTitle: true,
            },
        ],
        hideToc: true
    },

    {
        title: "ヘルプ",
        id: "help",
        icon: {
            prefix: "solid",
            icon: "circle-question"
        },
        position: "bottom",
        defaultCategory: "introduction",
        noindex: true,
        categories: [
            {
                title: "サポート",
                id: "support",
            },
            {
                title: "よくある質問",
                id: "faq",
            },
        ]
    },
]

const hide: Array<OptionUI_Page> = [
    {
        title: "検索",
        description: "設定項目を絞り込み検索することができます。",
        id: "search",
        defaultCategory: "general",
        position: "hide",
        popup: true,
        categories: [
            {
                title: "検索",
                id: "general",
            },
        ],
        hideToc: true,
        noindex: true,
    },
    
    {
        title: "デバッグ",
        description: "開発者向けのデバッグ機能",
        id: "debug",
        icon: {
            prefix: "solid",
            icon: "bug"
        },
        position: "hide",
        popup: false,
        defaultCategory: "general",
        categories: [
            {
                title: "デバッグ機能",
                id: "general",
                description: {
                    attention: "【デバッグ機能】開発者向けの機能です。不具合が発生する可能性がありますのでご注意ください。"
                }
            },
        ],
        noindex: true
    },
]

export const OptionUI_Pages: Array<OptionUI_Page> = [
    ...top,
    ...bottom,
    ...hide
]
