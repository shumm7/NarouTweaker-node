import { OptionUI_Item } from "../type";

export const yomou_optionsList: Array<OptionUI_Item> = [
    /* ランキング (rank) */
    {
        id: "parent_yomouRank_data",
        title: "表示内容",
        description: {
            text: "各作品に表示する情報を設定します。"
        },
        ui: {
            type: "parent",
        },
        location: {
            page: "yomou",
            category: "rank",
            noindex: true,
        }
    },

    {
        id: "parent_yomouRank_point",
        title: "ポイント表示",
        ui: {
            type: "parent",
        },
        location: {
            page: "yomou",
            category: "rank",
            noindex: true,
        },
        value: {
            isAdvanced: true,
        }
    },

    {
        id: "yomouRank_ShowDescription",
        title: "あらすじ",
        description: {
            hidden: "ランキング上の作品にあらすじを表示します。",
            keywords: ["あらすじ", "ランキング"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "rank",
            parent: "parent_yomouRank_data",
        },
    },

    {
        id: "yomouRank_ShowTags",
        title: "キーワード",
        description: {
            hidden: "ランキング上の作品にキーワードを表示します。",
            keywords: ["きーわーど", "ランキング", "キーワード", "タグ"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "rank",
            parent: "parent_yomouRank_data",
        }
    },

    {
        id: "yomouRank_ShowNovelInfoLink",
        title: "作品情報へのリンク",
        description: {
            hidden: "ランキング上の作品に作品情報ページへのリンクを表示します。",
            keywords: ["さくひんじょうほうへのりんく", "ランキング", "作品情報"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "rank",
            parent: "parent_yomouRank_data",
        }
    },

    {
        id: "yomouRank_ShowKasasagi",
        title: "アクセス解析へのリンク",
        description: {
            hidden: "ランキング上の作品にアクセス解析ページへのリンクを表示します。",
            keywords: ["あくせすかいせきへのりんく", "ランキング", "アクセス解析", "KASASAGI"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "rank",
            parent: "parent_yomouRank_data",
        }
    },

    {
        id: "yomouRank_ShowRaWi",
        title: "RaWiへのリンク",
        description: {
            hidden: "ランキング上の作品にRaWiへのリンクを表示します。",
            keywords: ["RaWiへのりんく", "ランキング", "RaWi"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "rank",
            parent: "parent_yomouRank_data",
        }
    },

    {
        id: "yomouRank_DevidePointsUnit",
        title: "ポイント表示の数値と単位の色を分ける",
        description: {
            text: "評価ポイントの数値と単位の文字色を分けます。",
            keywords: ["ぽいんとひょうじのすうちとたんいのいろをわける", "ランキング", "評価ポイント", "CSS"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "rank",
            parent: "parent_yomouRank_point",
        },
    },

    {
        id: "yomouRank_PointsColor",
        title: "ポイント表示色",
        description: {
            hidden: "評価ポイントの文字色を指定します。",
            keywords: ["ぽいんとひょうじしょく", "ランキング", "評価ポイント", "CSS"],
        },
        ui: {
            type: "color",
        },
        location: {
            page: "yomou",
            category: "rank",
            parent: "parent_yomouRank_point",
        },
    },

    {
        id: "yomouRank_CustomCSS",
        title: "追加CSS",
        description: {
            text: "任意のCSSをランキングページに追加することができます。",
            keywords: ["ついかCSS", "追加CSS"],
        },
        ui: {
            type: "code",
            data: {
                language: "css",
                layout: "wide",
                maxHeight: 300
            },
        },
        location: {
            page: "yomou",
            category: "rank",
        },
        value: {
            isAdvanced: true,
        },
    },

    /* ランキング（トップ） (ranktop) */
    {
        id: "parent_yomouRankTop_data",
        title: "表示内容",
        description: {
            text: "各作品に表示する情報を設定します。",
        },
        ui: {
            type: "parent",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            noindex: true,
        }
    },

    {
        id: "yomouRankTop_ShowPoints",
        title: "ポイント",
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },

    {
        id: "yomouRankTop_ShowDescription",
        title: "あらすじ",
        description: {
            hidden: "ランキングのトップページ上の作品にあらすじを表示します。",
            keywords: ["あらすじ", "ランキング（トップ）"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },

    {
        id: "yomouRankTop_ShowTags",
        title: "キーワード",
        description: {
            hidden: "ランキングのトップページ上の作品にキーワードを表示します。",
            keywords: ["きーわーど", "ランキング（トップ）", "キーワード", "タグ"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },

    {
        id: "yomouRankTop_ShowLength",
        title: "読了時間・文字数",
        description: {
            hidden: "ランキングのトップページ上の作品に読了時間・文字数を表示します。",
            keywords: ["どくりょうじかん・もじすう", "ランキング（トップ）"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },

    {
        id: "yomouRankTop_ShowNovelInfoLink",
        title: "作品情報へのリンク",
        description: {
            hidden: "ランキングのトップページ上の作品に作品情報ページへのリンクを表示します。",
            keywords: ["さくひんじょうほうへのりんく", "ランキング（トップ）", "作品情報"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },

    {
        id: "yomouRankTop_ShowUpdateDate",
        title: "最終更新日時",
        description: {
            hidden: "ランキングのトップページ上の作品に最終更新日時を表示します。",
            keywords: ["さいしゅうこうしんにちじ", "ランキング（トップ）"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },

    {
        id: "yomouRankTop_ShowKasasagi",
        title: "アクセス解析へのリンク",
        description: {
            hidden: "ランキングのトップページ上の作品にアクセス解析ページへのリンクを表示します。",
            keywords: ["あくせすかいせきへのりんく", "ランキング（トップ）", "アクセス解析", "KASASAGI"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },

    {
        id: "yomouRankTop_ShowRaWi",
        title: "RaWiへのリンク",
        description: {
            hidden: "ランキングのトップページ上の作品にRaWiへのリンクを表示します。",
            keywords: ["RaWiへのりんく", "ランキング（トップ）", "RaWi"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "yomou",
            category: "ranktop",
            parent: "parent_yomouRankTop_data"
        }
    },
    
    {
        id: "yomouRankTop_CustomCSS",
        title: "追加CSS",
        description: {
            text: "任意のCSSをランキングのトップページに追加することができます。",
            keywords: ["ついかCSS", "追加CSS"],
        },
        ui: {
            type: "code",
            data: {
                language: "css",
                layout: "wide",
                maxHeight: 300
            },
        },
        location: {
            page: "yomou",
            category: "ranktop",
        },
        value: {
            isAdvanced: true,
        },
    },
]