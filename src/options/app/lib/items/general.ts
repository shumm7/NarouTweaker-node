import { OptionUI_Pages } from "../pages"
import { OptionUI_Item } from "../type"
//import { general_exportOptionData, general_exportOptionText, general_fixOptionData, general_importOptionData, general_insertOptionData, general_monitorOptionChanged, general_popupDefaultPage_Dropdown, general_removeOptionData } from "./_optionsAction"

export const general_optionsList: Array<OptionUI_Item> = [
    /* 基本設定 (config) */
    {
        id: "extPopupDefaultPage",
        title: "デフォルトページ（ポップアップ時）",
        description: {
            text: "拡張機能のアイコンをクリックしたときに、一番最初に表示するページを設定します。",
            keywords: ["でふぉるとぺーじ（ぽっぷあっぷじ）", "環境設定", "基本設定", "ページ", "拡張機能", "ポップアップ"],
        },
        ui: {
            type: "select",
            data: {
                values: [
                    { value: "__auto__", label: "自動（デフォルト）" },
                    ...OptionUI_Pages.map((page) => {
                        if (page.popup && (page.type==="page" || page.type===undefined) && page.title) {
                            return { value: page.id, label: page.title }
                        } else {
                            return undefined
                        }
                    }).filter((v)=>v!==undefined)
                ]
            },
        },
        location: {
            page: "general",
            category: "config"
        },
    },

    {
        id: "extNotifications",
        title: "通知",
        description: {
            text: "拡張機能からの通知を許可します。",
            small: "例えば、拡張機能がアップデートされたときに通知が来るようになります。",
            keywords: ["つうち", "環境設定", "通知", "基本設定", "拡張機能"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "general",
            category: "config"
        },
    },

    {
        id: "extAdvancedSettings",
        title: "高度な設定",
        description: {
            text: "上級者向けの設定項目を表示します。通常では不要です。",
            keywords: ["高度", "こうどなせってい", "環境設定", "上級者", "基本設定"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "general",
            category: "config"
        },
    },

    {
        id: "extExperimentalFeatures",
        title: "実験中の機能",
        description: {
            text: "テスト中の機能を有効化します。",
            attention: "不具合が発生する可能性があります。ご注意ください。",
            keywords: ["高度", "じっけんちゅうのきのう", "環境設定", "上級者", "実験", "テスト", "基本設定"],
        },
        location: {
            page: "general",
            category: "config",
        },
        ui: {
            type: "switch",
        }
    },

    /* データ (data) */
    {
        id: "extDebugPage",
        title: "デバッグページ",
        description: {
            text: "開発者向けのデバッグ機能",
        },
        ui: {
            type: "custom",
            data: {
                layout: "wide",
                id: "extDebugPage",
            },
            hideDivider: true,
            hideButtons: "all",
        },
        location: {
            hide: true,
            page: "general",
            category: "data",
            noindex: true,
        }
    },

    {
        id: "extExportOption",
        title: "設定をエクスポート",
        description: {
            text: "保存されている設定データをJSON形式で出力します。",
            keywords: ["エクスポート", "せっていをえくすぽーと", "設定データ", "JSON"],
        },
        ui: {
            type: "custom",
            data: {
                id: "extExportOption",
            },
            hideButtons: ["reset"]
        },
        location: {
            page: "general",
            category: "data",
        }
    },

    {
        id: "extImportOption",
        title: "設定をインポート",
        description: {
            text: "外部からJSON形式の設定データを読み込みます。",
            attention: "スキンを含む、既存のデータが全て上書きされます。この操作は元に戻せません。",
            keywords: ["インポート", "せっていをいんぽーと", "設定データ", "JSON"],
        },
        ui: {
            type: "custom",
            data: {
                id: "extImportOption",
            },
            hideButtons: ["reset"],
        },
        location: {
            page: "general",
            category: "data",
        }
    },

    {
        id: "extFixOption",
        title: "設定を修復",
        description: {
            text: "バージョンアップなどにより残された不要な設定データを削除し、修復します。通常、データは削除されません。",
            keywords: ["せっていをしゅうふく", "設定データ", "リセット"],
        },
        ui: {
            type: "custom",
            data: {
                id: "extFixOption",
            },
            hideButtons: ["reset"],
        },
        location: {
            page: "general",
            category: "data",
        },
    },

    {
        id: "extResetOption",
        title: "設定をリセット",
        description: {
            text: "保存されている設定データをすべて初期値に戻します。",
            attention: "スキンを含む、保存されているデータが全てリセットされます。この操作は元に戻せません。",
            keywords: ["リセット", "せっていをりせっと", "設定データ"],
        },
        ui: {
            type: "custom",
            data: {
                id: "extResetOption",
            },
            hideButtons: ["reset"],
        },
        location: {
            page: "general",
            category: "data",
        },
    },
]