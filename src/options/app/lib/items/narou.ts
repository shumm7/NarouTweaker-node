import { OptionUI_Item } from "../type";

export const narou_optionsList: Array<OptionUI_Item> = [
    /* 全般 (general) */
    {
        id: "narouSyuppanShowBookImage",
        title: "書報（作品一覧）ページの書影を取得",
        description: {
            text: "書報（作品一覧）ページ上にある作品の書影をAmazonから取得します。",
            small: "（負荷軽減のため、アイコンをクリックした時に書影を取得します）",
            keywords: ["しょほう（さくひんいちらん）ぺーじのしょえいをしゅとく", "書報", "書影"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "narou",
            category: "general",
        },
    },

    {
        id: "narouSyuppanShowBookViewImage",
        title: "書報（作品詳細）ページの書影を取得",
        description: {
            text: "書報（作品詳細）ページ上にある作品の書影をAmazonから取得します。",
            keywords: ["しょほう（さくひんしょうさい）ぺーじのしょえいをしゅとく", "書報", "書影"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "narou",
            category: "general",
        },
    },
]