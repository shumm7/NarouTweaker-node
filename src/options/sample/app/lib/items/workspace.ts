import { OptionUI_Item } from "../type";
//import { workspace_customHeaderMenuSortable, workspace_customHeaderSortable } from "./_optionsAction";

export const workspace_optionsList: Array<OptionUI_Item> = [
    /* 全般 (general) */
    {
        id: "workspaceCustomHeader",
        title: "ヘッダのアイテム配置",
        description: {
            text: "ヘッダに表示するアイテムを指定します。",
            small: "（最大6つまで）",
            keywords: ["へっだのあいてむはいち", "ヘッダ", "レイアウト", "外観"],
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_workspaceCustomHeaderDraggable"
            },
        },
        location: {
            page: "workspace",
            category: "general",
        },
    },

    {
        id: "workspaceCustomMenu",
        title: "メニューのアイテム配置",
        description: {
            text: "ヘッダのメニューに表示するアイテムを指定します。",
            keywords: ["めにゅーのあいてむはいち", "ヘッダ", "レイアウト", "外観"],
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_workspaceCustomHeaderMenuDraggable"
            },
        },
        location: {
            page: "workspace",
            category: "general",
        },
        value: {
            related: ["workspaceCustomMenu_Left", "workspaceCustomMenu_Middle", "workspaceCustomMenu_Right"],
        },
    },

    {
        id: "workspaceCustomHeaderMode",
        title: "ヘッダの追従モード",
        description: {
            text: "ヘッダの配置場所を設定します。",
            small: "・上部：ページ上部に固定\n・追従：スクロールしても常に表示\n・スクロール：基本は非表示、上にスクロールした時だけ表示",
            keywords: ["へっだのついじゅうもーど", "ヘッダ", "追従モード"],
        },
        ui: {
            type: "select",
            data: {
                dataType: "string",
                values: [
                    { value: "absolute", label: "上部" },
                    { value: "fixed", label: "追従" },
                    { value: "scroll", label: "スクロール" },
                ]
            },
        },
        location: {
            page: "workspace",
            category: "general",
        },
        value: {
            isExperimental: true,
        },
    },

    {
        id: "workspaceCustomHeaderScrollHidden",
        title: "ページ読み込み時にヘッダを隠す",
        description: {
            text: "オンの場合、ページ読み込み時にヘッダを隠します。",
            small: "（ヘッダの追従モードが「スクロール」でのみ有効）",
            keywords: ["ぺーじよみこみじにへっだをかくす", "ヘッダ", "追従モード"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "general",
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "workspaceCustomHeaderMode", value: "scroll" }
                ],
            },
            isAdvanced: true,
        },
    },


    /* 小説管理 (manage) */
    {
        id: "workspaceNovelmanageDeleteConfirm",
        title: "小説削除の誤操作防止機能",
        description: {
            text: "うっかり小説を削除してしまうことを防ぐため、削除操作時の確認画面を変更します。",
            keywords: ["しょうせつさくじょのごそうさぼうしきのう", "削除", "安全"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "manage",
        },
    },

    {
        id: "workspaceUserblogmanageDeleteConfirm",
        title: "活動報告削除の誤操作防止機能",
        description: {
            text: "うっかり活動報告を削除してしまうことを防ぐため、削除操作時の確認画面を変更します。",
            keywords: ["かつどうほうこくさくじょのごそうさぼうしきのう", "削除", "安全"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "manage",
        },
    },

    {
        id: "workspaceNovelmanageShowPointAverage",
        title: "作品詳細ページで評価ポイント平均を表示",
        description: {
            text: "作品詳細ページ上で、評価ポイント平均の星マークの横に数値を表示します。",
            keywords: ["さくひんしょうさいぺーじでひょうかぽいんとへいきんをひょうじ", "評価ポイント"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "manage",
        },
        value: {
            isAdvanced: true
        },
    },

    /* エディタ (editor) */
    {
        id: "workspaceCustomEditor",
        title: "エディタ",
        description: {
            text: "小説の編集画面をオリジナルのエディタに変更します。",
            keywords: ["えでぃた", "エディタ", "編集", "レイアウト", "外観", "デザイン"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "editor",
        },
    },

    /* お気に入り (favorite) */
    {
        id: "parent_workspaceFavorite_Bookmark",
        title: "ブックマーク",
        ui: {
            type: "parent",
        },
        location: {
            page: "workspace",
            category: "favorite",
            noindex: true,
        },
    },

    {
        id: "workspaceBookmarkLayout",
        title: "ブックマークのレイアウト",
        description: {
            text: "ブックマーク画面のレイアウトを変更します。",
            keywords: ["ぶっくまーくのれいあうと", "レイアウト", "外観", "デザイン", "ブックマーク", "お気に入り"],
        },
        ui: {
            type: "select",
            data: {
                values: [
                    { value: 0, label: "デフォルト" },
                    { value: 1, label: "旧デザイン風" },
                    { value: 2, label: "リスト表示" }
                ],
                dataType: "number"
            },
        },
        location: {
            page: "workspace",
            category: "favorite",
            parent: "parent_workspaceFavorite_Bookmark",
        },
    },

    {
        id: "workspaceBookmarkCategoryLayout",
        title: "カテゴリ表示",
        description: {
            text: "ブックマークカテゴリのレイアウトを変更します。",
            keywords: ["ぶっくまーくかてごりひょうじ", "レイアウト", "外観", "デザイン", "ブックマーク", "お気に入り"],
        },
        ui: {
            type: "select",
            data: {
                values: [
                    { value: 0, label: "ドロップダウン" },
                    { value: 1, label: "サイドバー" },
                    { value: 2, label: "ドロップダウン・サイドバー両方" }
                ],
                dataType: "number"
            },
        },
        location: {
            page: "workspace",
            category: "favorite",
            parent: "parent_workspaceFavorite_Bookmark",
        },
    },

    {
        id: "workspaceBookmarkReplaceEpisode",
        title: "「部分」表記へ変更",
        description: {
            text: "「エピソード(ep.)」の表記を「部分」に変更します。",
            keywords: ["「えぴそーど」 → 「ぶぶん」ひょうき", "ブックマーク", "お気に入り"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "favorite",
            parent: "parent_workspaceFavorite_Bookmark",
        },
        value: {
            isExperimental: true,
        },
    },

    /* リアクション */
    {
        id: "parent_workspaceReaction_Impression",
        title: "感想",
        ui: {
            type: "parent",
        },
        location: {
            page: "workspace",
            category: "reaction",
            noindex: true,
        },
    },

    {
        id: "workspaceImpressionMarkedButton",
        title: "既読/未読ボタンを表示",
        description: {
            text: "書かれた感想を既読/未読にするボタンを追加します。",
            keywords: ["きどく/みどくぼたんをひょうじ", "感想", "リアクション"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "reaction",
            parent: "parent_workspaceReaction_Impression",
        },
    },

    {
        id: "workspaceImpressionHideButton",
        title: "表示/非表示ボタンを表示",
        description: {
            text: "書かれた感想を表示/非表示にするボタンを追加します。",
            keywords: ["ひょうじ/ひひょうじぼたんをひょうじ", "感想", "リアクション"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "reaction",
            parent: "parent_workspaceReaction_Impression",
        },
    },

    {
        id: "workspaceImpressionMarkAsReadWhenReply",
        title: "返信時に既読にする",
        description: {
            text: "感想に返信したとき、自動的にその感想を既読にします。",
            keywords: ["へんしんじにきどくにする", "感想", "リアクション"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "reaction",
            parent: "parent_workspaceReaction_Impression",
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "workspaceImpressionMarkedButton", value: true }
                ],
            },
            isAdvanced: true,
        },
    },

    {
        id: "workspaceImpressionHideWhenMarked",
        title: "既読にしたとき非表示にする",
        description: {
            text: "感想を既読にしたとき、自動的にその感想を非表示にします。",
            keywords: ["きどくにしたときひひょうじにする", "感想", "リアクション"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "workspace",
            category: "reaction",
            parent: "parent_workspaceReaction_Impression",
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "workspaceImpressionMarkedButton", value: true },
                    { id: "workspaceImpressionHideButton", value: true },
                ],
                condition: "and"
            },
            isAdvanced: true,
        },
    },
]