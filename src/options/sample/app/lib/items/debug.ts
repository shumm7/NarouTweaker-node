import { OptionUI_Item } from "../type"

export const debug_optionsList: Array<OptionUI_Item> =  [
    /* 基本 */
    {
        id: "extDebug",
        title: "デバッグ機能",
        description: {
            text: "デバッグ機能を有効化します。",
            attention: "開発者向けの機能です。不具合が発生する可能性がありますのでご注意ください。",
            keywords: ["高度", "でばっぐきのう", "環境設定", "上級者", "でばっぐ", "実験", "テスト", "基本設定", "開発", "開発者向け", "デバッグ"],
        },
        location: {
            page: "debug",
            category: "general",
            noindex: true,
        },
        ui: {
            type: "switch",
        }
    },

    /* モニタリング */
    {
        id: "extDebug_ShowOption",
        title: "設定データを閲覧",
        description: {
            text: "保存されている設定データを文字列で表示します。",
            small: "（local/sync/sessionのデータを表示しています）",
            keywords: ["せっていでーたをえつらん", "設定データ", "local", "sync", "session", "JSON"],
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_extDebug_OptionList"
            },
            hideButtons: ["reset"],
        },
        location: {
            page: "debug",
            category: "general",
            noindex: true,
        },
        value: {
            isDebug: true,
        },
    },

    {
        id: "extDebug_InsertOption",
        title: "設定データを変更",
        description: {
            text: "設定データを書き換えます。",
            keywords: ["せっていでーたをへんこう", "設定データ", "local", "sync", "session"],
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_extDebug_InsertOptionForm"
            },
            hideButtons: ["reset"],
        },
        location: {
            page: "debug",
            category: "general",
            noindex: true,
        },
        value: {
            isDebug: true,
        },
    },

    {
        id: "extDebug_MonitorOption",
        title: "設定データの変更を監視",
        description: {
            text: "設定データの変更を監視します。",
            keywords: ["せっていでーたのへんこうをかんし", "設定データ", "local", "sync", "session"],
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_extDebug_OptionMonitor"
            },
            hideButtons: ["reset"],
        },
        location: {
            page: "debug",
            category: "general",
            noindex: true,
        },
        value: {
            isDebug: true,
        },
    },
]