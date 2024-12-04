import { OptionUI_Item } from "../type";

export const kasasagi_optionsList: Array<OptionUI_Item> = [
    /* 全般 (general) */
    {
        id: "kasasagiCustomStyle",
        title: "デザインを調整（推奨）",
        description: {
            text: "全体的なページのデザインを調整します。",
            keywords: ["でざいんをちょうせい", "KASASAGI", "アクセス解析", "レイアウト", "デザイン", "外観"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "general",
        },
    },

    {
        id: "kasasagiExportButton",
        title: "エクスポートボタン",
        description: {
            text: "表示されているデータをファイルで出力できるボタンを追加します。",
            keywords: ["えくすぽーとぼたん", "KASASAGI", "アクセス解析", "エクスポート", "JSON"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "general",
        },
    },

    /* 総合PV (pageview) */
    {
        id: "parent_kasasagiGeneralDay",
        title: "当日・前日PV",
        ui: {
            type: "parent",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            noindex: true,
        },
    },

    {
        id: "kasasagiShowGraph_GeneralDay",
        title: "グラフ表示",
        description: {
            hidden: "当日・前日PVのグラフを表示します。",
            keywords: ["ぐらふひょうじ（とうじつ・ぜんじつPV）", "KASASAGI", "アクセス解析", "グラフ", "当日・前日PV"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            parent: "parent_kasasagiGeneralDay",
        },
    },

    {
        id: "kasasagiGraphType_GeneralDay",
        title: "グラフ種類",
        description: {
            text: "グラフの外観を設定します。",
            keywords: ["ぐらふしゅるい（とうじつ・ぜんじつPV）", "KASASAGI", "アクセス解析", "グラフ", "当日・前日PV"],
        },
        ui: {
            type: "radio",
            data: {
                dataType: "string",
                values: [
                    { value: "bar", label: "棒グラフ" },
                    { value: "line", label: "折れ線グラフ" }
                ]
            },
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            parent: "parent_kasasagiGeneralDay",
        },
        value: {
            requirement: {
                requirementParams: [
                    {id: "kasasagiShowGraph_GeneralDay", value: true}
                ]
            },
            isAdvanced: true,
        },
    },

    {
        id: "parent_kasasagiGeneralTotal",
        title: "累計PV",
        ui: {
            type: "parent",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            noindex: true,
        },
    },

    {
        id: "kasasagiShowGraph_GeneralTotal",
        title: "グラフ表示",
        description: {
            hidden: "累計PVのグラフを表示します。",
            keywords: ["ぐらふひょうじ（るいけいPV）", "KASASAGI", "アクセス解析", "グラフ", "累計PV"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            parent: "parent_kasasagiGeneralTotal",
        },
    },

    {
        id: "kasasagiGraphType_GeneralTotal",
        title: "グラフ種類",
        description: {
            text: "グラフの外観を設定します。",
            keywords: ["ぐらふしゅるい（るいけいPV）", "KASASAGI", "アクセス解析", "グラフ", "累計PV"],
        },
        ui: {
            type: "radio",
            data: {
                dataType: "string",
                values: [
                    { value: "bar", label: "棒グラフ" },
                    { value: "line", label: "折れ線グラフ" }
                ],
            },
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            parent: "parent_kasasagiGeneralTotal",
        },
        value: {
            requirement: {
                requirementParams: [
                    {id: "kasasagiShowGraph_GeneralTotal", value: true}
                ]
            },
            isAdvanced: true,
        },
    },

    {
        id: "parent_kasasagiGeneralAPI",
        title: "情報表示",
        ui: {
            type: "parent",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            noindex: true,
        },
    },

    {
        id: "kasasagiShowTable_API",
        title: "作品データ",
        description: {
            text: "詳細な作品の統計情報を表示します。",
            keywords: ["さくひんでーたひょうじ", "KASASAGI", "アクセス解析", "テーブル（表）", "なろうAPI"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            parent: "parent_kasasagiGeneralAPI",
        },
    },

    {
        id: "kasasagiShowTable_Rank",
        title: "殿堂入り",
        description: {
            text: "作品の殿堂入り情報を表示します。",
            keywords: ["さくひんでーたひょうじ", "KASASAGI", "アクセス解析", "テーブル（表）", "なろうAPI", "殿堂入り", "ランキング"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            parent: "parent_kasasagiGeneralAPI",
        },
    },

    {
        id: "kasasagiShowTable_ExternalLink",
        title: "リンク集",
        description: {
            text: "作品に関連する外部サイトのリンクを表示します。",
            keywords: ["りんくしゅうひょうじ", "KASASAGI", "アクセス解析"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "pageview",
            parent: "parent_kasasagiGeneralAPI",
        },
    },

    /* エピソード別 (episode) */
    {
        id: "kasasagiShowGraph_ChapterUnique",
        title: "グラフ表示",
        description: {
            hidden: "エピソード別ユニークのグラフを表示します。",
            keywords: ["ぐらふひょうじ（えぴそーどべつゆにーく）", "KASASAGI", "アクセス解析", "グラフ", "エピソード別ユニーク"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "episode",
        },
    },

    {
        id: "kasasagiGraphType_ChapterUnique",
        title: "グラフ種類",
        description: {
            text: "グラフの外観を設定します。",
            keywords: ["ぐらふしゅるい（えぴそーどべつゆにーく）", "KASASAGI", "アクセス解析", "グラフ", "エピソード別ユニーク"],
        },
        ui: {
            type: "radio",
            data: {
                dataType: "string",
                values: [
                    { value: "bar", label: "棒グラフ" },
                    { value: "line", label: "折れ線グラフ" }
                ],
            },
        },
        location: {
            page: "kasasagi",
            category: "episode",
        },
        value: {
            requirement: {
                requirementParams: [
                    {id: "kasasagiShowGraph_ChapterUnique", value: true}
                ]
            },
            isAdvanced: true,
        },
    },

    {
        id: "kasasagiShowTable_ChapterUnique",
        title: "テーブル表示",
        description: {
            text: "既存のテーブル（表）のレイアウトを変更します。",
            keywords: ["てーぶるひょうじ（えぴそーどべつゆにーく）", "KASASAGI", "アクセス解析", "テーブル（表）", "エピソード別ユニーク"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "episode",
        },
    },

    /* 日別 (day) */
    {
        id: "parent_kasasagiDayPV",
        title: "日別PV",
        ui: {
            type: "parent",
        },
        location: {
            page: "kasasagi",
            category: "day",
            noindex: true,
        },
    },

    {
        id: "kasasagiShowGraph_DayPV",
        title: "グラフ表示",
        description: {
            hidden: "日別PVのグラフを表示します。",
            keywords: ["ぐらふひょうじ（ひべつPV）", "KASASAGI", "アクセス解析", "グラフ", "日別PV"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "day",
            parent: "parent_kasasagiDayPV"
        },
    },

    {
        id: "kasasagiGraphType_DayPV",
        title: "グラフ種類",
        description: {
            text: "グラフの外観を設定します。",
            keywords: ["ぐらふしゅるい（ひべつPV）", "KASASAGI", "アクセス解析", "グラフ", "日別PV"],
        },
        ui: {
            type: "radio",
            data: {
                dataType: "string",
                values: [
                    { value: "bar", label: "棒グラフ" },
                    { value: "line", label: "折れ線グラフ" }
                ],
            },
        },
        location: {
            page: "kasasagi",
            category: "day",
            parent: "parent_kasasagiDayPV"
        },
        value: {
            requirement: {
                requirementParams: [
                    {id: "kasasagiShowGraph_DayPV", value: true}
                ]
            },
            isAdvanced: true,
        },
    },

    {
        id: "parent_kasasagiDayUnique",
        title: "日別ユニーク",
        ui: {
            type: "parent",
        },
        location: {
            page: "kasasagi",
            category: "day",
            noindex: true,
        },
    },

    {
        id: "kasasagiShowGraph_DayUnique",
        title: "グラフ表示",
        description: {
            hidden: "日別ユニークのグラフを表示します。",
            keywords: ["ぐらふひょうじ（ひべつゆにーく）", "KASASAGI", "アクセス解析", "グラフ", "日別ユニーク"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "day",
            parent: "parent_kasasagiDayUnique"
        },
    },

    {
        id: "kasasagiGraphType_DayUnique",
        title: "グラフ種類",
        description: {
            text: "グラフの外観を設定します。",
            keywords: ["ぐらふしゅるい（ひべつゆにーく）", "KASASAGI", "アクセス解析", "グラフ", "日別ユニーク"],
        },
        ui: {
            type: "radio",
            data: {
                dataType: "string",
                values: [
                    { value: "bar", label: "棒グラフ" },
                    { value: "line", label: "折れ線グラフ" }
                ],
            },
        },
        location: {
            page: "kasasagi",
            category: "day",
            parent: "parent_kasasagiDayUnique"
        },
        value: {
            requirement: {
                requirementParams: [
                    {id: "kasasagiShowGraph_DayUnique", value: true}
                ]
            },
            isAdvanced: true,
        },
    },

    /* 月別 (month) */
    {
        id: "parent_kasasagiMonthPV",
        title: "月別PV",
        ui: {
            type: "parent",
        },
        location: {
            page: "kasasagi",
            category: "month",
            noindex: true,
        },
    },

    {
        id: "kasasagiShowGraph_MonthPV",
        title: "グラフ表示",
        description: {
            hidden: "月別PVのグラフを表示します。",
            keywords: ["ぐらふひょうじ（つきべつPV）", "KASASAGI", "アクセス解析", "グラフ", "月別PV"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "month",
            parent: "parent_kasasagiMonthPV"
        },
    },

    {
        id: "kasasagiGraphType_MonthPV",
        title: "グラフ種類",
        description: {
            text: "グラフの外観を設定します。",
            keywords: ["ぐらふしゅるい（つきべつPV）", "KASASAGI", "アクセス解析", "グラフ", "月別PV"],
        },
        ui: {
            type: "radio",
            data: {
                dataType: "string",
                values: [
                    { value: "bar", label: "棒グラフ" },
                    { value: "line", label: "折れ線グラフ" }
                ]
            },
        },
        location: {
            page: "kasasagi",
            category: "month",
            parent: "parent_kasasagiMonthPV"
        },
        value: {
            requirement: {
                requirementParams: [
                    {id: "kasasagiShowGraph_MonthPV", value: true}
                ]
            },
            isAdvanced: true,
        },
    },

    {
        id: "parent_kasasagiMonthUnique",
        title: "月別ユニーク",
        ui: {
            type: "parent",
        },
        location: {
            page: "kasasagi",
            category: "month",
            noindex: true,
        },
    },

    {
        id: "kasasagiShowGraph_MonthUnique",
        title: "グラフ表示",
        description: {
            hidden: "月別ユニークのグラフを表示します。",
            keywords: ["ぐらふひょうじ（つきべつゆにーく）", "KASASAGI", "アクセス解析", "グラフ", "月別ユニーク"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "kasasagi",
            category: "month",
            parent: "parent_kasasagiMonthUnique"
        },
    },

    {
        id: "kasasagiGraphType_MonthUnique",
        title: "グラフ種類",
        description: {
            text: "グラフの外観を設定します。",
            keywords: ["ぐらふしゅるい（つきべつゆにーく）", "KASASAGI", "アクセス解析", "グラフ", "月別ユニーク"],
        },
        ui: {
            type: "radio",
            data: {
                dataType: "string",
                values: [
                    { value: "bar", label: "棒グラフ" },
                    { value: "line", label: "折れ線グラフ" }
                ]
            },
        },
        location: {
            page: "kasasagi",
            category: "month",
            parent: "parent_kasasagiMonthUnique"
        },
        value: {
            requirement: {
                requirementParams: [
                    {id: "kasasagiShowGraph_MonthUnique", value: true}
                ]
            },
            isAdvanced: true,
        },
    },
]