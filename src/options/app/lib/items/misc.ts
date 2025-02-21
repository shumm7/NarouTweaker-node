import { OptionUI_Item } from "../type";

export const misc_optionsList: Array<OptionUI_Item> = [
    /* About */
    {
        id: "extIntroduction",
        title: "Narou Tweaker",
        description: {
            text: "「小説家になろう」を最高に使いやすく。"
        },
        ui: {
            type: "custom",
            data: {
                id: "extIntroduction",
                layout: "wide"
            },
            hideButtons: "all",
        },
        location: {
            page: "about",
            category: "introduction",
            noindex: true,
        },
    },

    /* Patchnotes */
    {
        id: "extPatchnotes",
        title: "Narou Tweaker",
        ui: {
            type: "custom",
            data: {
                id: "extPatchnotes",
                layout: "wide"
            },
            hideButtons: "all",
        },
        location: {
            page: "patchnotes",
            category: "general",
            noindex: true,
        },
    },

    /* Favorite */
    {
        id: "extFavoriteOptions",
        title: "Narou Tweaker",
        ui: {
            type: "custom",
            data: {
                id: "extFavoriteOptions",
                layout: "wide"
            },
            hideButtons: "all"
        },
        location: {
            page: "favorite",
            category: "general",
            noindex: true,
        },
    },

    
    /* Search */
    {
        id: "extSearch",
        title: "検索",
        ui: {
            type: "custom",
            data: {
                id: "extSearch",
                layout: "wide"
            },
            hideButtons: "all",
        },
        location: {
            page: "search",
            category: "main",
            noindex: true,
        },
    },
    {
        id: "extSearchResult",
        title: "検索結果",
        ui: {
            type: "custom",
            data: {
                id: "extSearchResult",
                layout: "wide"
            },
            hideButtons: "all",
        },
        location: {
            page: "search",
            category: "result",
            noindex: true,
        },
    },
]