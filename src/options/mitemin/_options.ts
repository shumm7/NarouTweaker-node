import { OptionUI_Item } from "options/_lib/optionUI_type";

export const mitemin_optionsList: Array<OptionUI_Item> = [
    /* 全般 (general) */
    {
        id: "miteminShowIcodeField",
        title: "iコードを表示",
        description: {
            text: "iコードのコピー用フィールドを表示します。",
            keywords: ["iこーどをひょうじ", "iコード", "みてみん", "挿絵", "えぱれっと"],
        },
        ui: {
            type: "toggle",
            name: "default"
        },
        location: {
            page: "mitemin",
            category: "general",
        },
        value: {
            related: ["miteminShowIcodeField"],
            buttons: {
                reset: true,
                favorite: true,
            },
        },
    },
]