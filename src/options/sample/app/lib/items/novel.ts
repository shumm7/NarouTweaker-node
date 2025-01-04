import { OptionUI_Item } from "../type";
//import { novel_customHeaderSortable, novel_fontEditor, novel_replacePattern, novel_skinEditor } from "./_optionsAction";

export const novel_optionsList: Array<OptionUI_Item> = [
    /* 全般 (general) */
    {
        id: "novelCustomStyle",
        title: "デザインを調整（推奨）",
        description: {
            text: "全体的なページのデザインを調整します。",
            keywords: ["でざいんをちょうせい", "レイアウト", "デザイン", "外観"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "general",
        }
    },

    {
        id: "novelCustomHeaderType",
        title: "ヘッダのデザイン",
        description: {
            text: "小説ページに表示されるヘッダのデザインを変更します。",
            keywords: ["へっだのでざいん", "レイアウト", "デザイン", "外観", "ヘッダ", "シンプルなヘッダ"],
        },
        ui: {
            type: "select",
            data: {
                values: [
                    { value: 0, label: "オフ（小説家になろう標準）" },
                    { value: 1, label: "ベーシック" },
                    { value: 2, label: "ミニマル（推奨）" },
                ],
                dataType: "number"
            },
            label: "スタイル"
        },
        location: {
            page: "novel",
            category: "general",
        }
    },

    {
        id: "novelCustomHeaderMode",
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
            }
        },
        location: {
            page: "novel",
            category: "general",
        },
        value: {
            requirement: {
                condition: "or",
                requirementParams: [
                    { id: "novelCustomHeaderType", value: [1, 2], compare: "of" },
                    { id: "novelCustomHeaderType", value: ["1", "2"], compare: "of" }
                ]
            },
        }
    },

    {
        id: "novelCustomHeaderScrollHidden",
        title: "ページ読み込み時にヘッダを隠す",
        description: {
            text: "オンの場合、ページ読み込み時にヘッダを隠します。",
            small: "（ヘッダの追従モードが「スクロール」でのみ有効）",
            keywords: ["ぺーじよみこみじにへっだをかくす", "追従モード"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "general",
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "novelCustomHeaderMode", value: "scroll" }
                ]
            },
            isAdvanced: true,
        },
    },

    {
        id: "novelCustomHeaderData",
        title: "ヘッダのアイテム配置",
        description: {
            text: "ヘッダに表示するアイテムを指定します。",
            small: "（ドラッグ＆ドロップで入れ替え）",
            keywords: ["へっだのあいてむはいち", "ヘッダ", "レイアウト", "外観"],
        },
        ui: {
            type: "custom",
            data: {
                id: "novelCustomHeaderData",
                layout: "wide",
            }
        },
        location: {
            page: "novel",
            category: "general",
        },
        value: {
            related: ["novelCustomHeaderLeft", "novelCustomHeaderRight"],
            requirement: {
                condition: "or",
                requirementParams: [
                    { id: "novelCustomHeaderType", value: [1, 2], compare: "of" },
                    { id: "novelCustomHeaderType", value: ["1", "2"], compare: "of" }
                ]
            },
        }
    },

    {
        id: "parent_novelCustomHeaderOption",
        title: "ヘッダの詳細設定",
        ui: {
            type: "parent"
        },
        location: {
            page: "novel",
            category: "general",
            noindex: true,
        },
        value: {
            isAdvanced: true,
            requirement: {
                condition: "or",
                requirementParams: [
                    { id: "novelCustomHeaderType", value: [1, 2], compare: "of" },
                    { id: "novelCustomHeaderType", value: ["1", "2"], compare: "of" }
                ]
            },
        }
    },

    {
        id: "novelCustomHeaderShowEnactiveItems",
        title: "使用できないアイコンを表示",
        description: {
            text: "オンの場合、使用できないアイコンを暗転して表示します。",
            keywords: ["しようできないあいこんをひょうじ", "ヘッダの詳細設定"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "general",
            parent: "parent_novelCustomHeaderOption"
        },
        value: {
            isAdvanced: true,
            requirement: {
                condition: "or",
                requirementParams: [
                    { id: "novelCustomHeaderType", value: [1, 2], compare: "of" },
                    { id: "novelCustomHeaderType", value: ["1", "2"], compare: "of" }
                ]
            },
        },
    },

    {
        id: "novelCustomHeaderSocialShowsBrandName",
        title: "SNSアイコンをブランド名で表記する",
        description: {
            text: "SNSアイコンの表示テキストの設定を変更します。",
            small: "オン：「Facebook」などのブランド名を表示します。\nオフ：「シェア」などのアクション名を表示します。",
            keywords: ["SNSあいこんをぶらんどめいでひょうきする", "ヘッダの詳細設定"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "general",
            parent: "parent_novelCustomHeaderOption"
        },
        value: {
            isAdvanced: true,
            requirement: {
                condition: "or",
                requirementParams: [
                    { id: "novelCustomHeaderType", value: [1, 2], compare: "of" },
                    { id: "novelCustomHeaderType", value: ["1", "2"], compare: "of" }
                ]
            },
        },
    },

    {
        id: "novelCustomHeaderQRCodeCurrentLocation",
        title: "QRコードのURLを現在のページに設定",
        description: {
            text: "QRコードアイコンのURL設定を変更します。",
            small: "オン：現在表示しているページのURL\nオフ：作品の目次/本文のURL",
            keywords: ["QRこーどのURLをげんざいのぺーじにせってい", "ヘッダの詳細設定", "QRコード"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "general",
            parent: "parent_novelCustomHeaderOption"
        },
        value: {
            isAdvanced: true,
            requirement: {
                condition: "or",
                requirementParams: [
                    { id: "novelCustomHeaderType", value: [1, 2], compare: "of" },
                    { id: "novelCustomHeaderType", value: ["1", "2"], compare: "of" }
                ]
            },
        },
    },

    {
        id: "novelCustomHeaderQRCodeShowURL",
        title: "QRコードのリンクをテキストで表示",
        description: {
            text: "QRコードアイコンでURLを別途テキストで表示します。",
            keywords: ["QRこーどのりんくをてきすとでひょうじ", "ヘッダの詳細設定", "QRコード"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "general",
            parent: "parent_novelCustomHeaderOption"
        },
        value: {
            isAdvanced: true,
            requirement: {
                condition: "or",
                requirementParams: [
                    { id: "novelCustomHeaderType", value: [1, 2], compare: "of" },
                    { id: "novelCustomHeaderType", value: ["1", "2"], compare: "of" }
                ]
            },
        },
    },

    /* 本文 (novel) */
    {
        id: "novelShowAllExtext",
        title: "あらすじを全て表示",
        description: {
            text: "作品のあらすじの隠れている部分を自動的に表示する。",
            keywords: ["あらすじをすべてひょうじ", "あらすじ"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "novel",
        },
        value: {
            isExperimental: true,
        }
    },

    {
        id: "novelPrefaceAutoURL",
        title: "自動URL化（前書き）",
        description: {
            text: "前書きに含まれるURL文字列を、自動的にリンクに変換します。",
            keywords: ["じどうURLか", "前書き", "まえがき", "自動URL化"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "novel",
        },
    },

    {
        id: "novelAfterwordAutoURL",
        title: "自動URL化（後書き）",
        description: {
            text: "後書きに含まれるURL文字列を、自動的にリンクに変換します。",
            keywords: ["じどうURLか", "後書き", "あとがき", "自動URL化"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "novel",
        },
    },

    {
        id: "novelForceMypageLink",
        title: "作者のマイページへのリンクを強制",
        description: {
            text: "作者が別で作者名を設定していた場合でも、常にマイページへのリンクを表示します。",
            keywords: ["さくしゃのまいぺーじへのりんくをきょうせい", "マイページ", "作者名"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "novel",
        },
    },

    {
        id: "novelShowHistoryOnSublist",
        title: "目次ページに直近の閲覧履歴を表示",
        description: {
            text: "目次ページ上に、直近の閲覧したエピソードを表示します。",
            keywords: ["もくじぺーじにちょっきんのえつらんりれきをひょうじ", "履歴", "目次"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "novel",
        },
    },

    {
        id: "novelCursorHide",
        title: "一定時間経過後にマウスカーソルを非表示にする",
        description: {
            text: "マウスを動かさずに一定時間経過すると、マウスカーソルを非表示にします。",
            keywords: ["いっていじかんけいかごにまうすかーそるをひひょうじにする", "マウスカーソル"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "novel",
        },
        value: {
            isExperimental: true,
        }
    },

    {
        id: "novelCursorHideTimeout",
        title: "カーソル非表示までの時間",
        description: {
            text: "マウスカーソルを非表示にするまでの時間を秒で指定します。",
            keywords: ["かーそるひひょうじまでのじかん", "マウスカーソル"],
        },
        ui: {
            type: "slider",
            data: {
                min: 0,
                max: 60,
                step: 1,
                showLabel: "auto",
                showField: true,
            }
        },
        location: {
            page: "novel",
            category: "novel",
        },
        value: {
            isExperimental: true,
            requirement: {
                requirementParams: [
                    { id: "novelCursorHide", value: true }
                ]
            },
        },
    },

    {
        id: "novelAttentionBanner",
        title: "「作品に含まれる要素」をバナーで表示する",
        description: {
            text: "「作品に含まれる要素」をバナーで表示します。",
            keywords: ["「さくひんにふくまれるようそ」をばなーでひょうじする"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "novel",
        },
        value: {
            isExperimental: true,
        },
    },

    /* スキン (style) */
    {
        id: "novelSkinV2",
        title: "スキン",
        description: {
            text: "小説ページの外観を変更します。",
            keywords: ["すきん", "レイアウト", "デザイン", "外観", "スキン", "スキン設定", "CSS"],
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_novelSkinSelect",
            }
        },
        location: {
            page: "novel",
            category: "style",
        },
        value: {
            related: ["novelSkinSelected"],
        },
    },
    /*
    {
        id: "novelSkinExport",
        title: "スキンのエクスポート",
        description: {
            text: "現在、選択中のスキンをデータとして出力します。",
            keywords: ["すきんのえくすぽーと", "エクスポート", "スキン"],
        },
        ui: {
            type: "custom",
            data: "ui_novelSkinExportButtons",
            action: novel_skinExport,
            hideButtons: ["reset"],
        },
        location: {
            page: "novel",
            category: "style",
        },
        value: {
            isAdvanced: true,
        },
    },

    {
        id: "novelSkinImport",
        title: "スキンのインポート",
        description: {
            text: "外部からスキンを取り込むことができます。",
            keywords: ["すきんのいんぽーと", "インポート", "スキン"],
        },
        ui: {
            type: "custom",
            data: "ui_novelSkinImportButtons",
            action: novel_skinImport,
            hideButtons: ["reset"],
        },
        location: {
            page: "novel",
            category: "style",
        },
        value: {
            isAdvanced: true,
        },
    },
    */

    {
        id: "novelCustomCSS",
        title: "追加CSS",
        description: {
            text: "任意のCSSをページに追加することができます。\nこのスタイルは、スキンよりも後に読み込まれます。",
            keywords: ["ついかCSS", "追加CSS", "スキン"],
        },
        ui: {
            type: "code",
            data: {
                language: "css",
                layout: "wide",
                maxHeight: 300
            }
        },
        location: {
            page: "novel",
            category: "style",
        },
        value: {
            isAdvanced: true,
        },
    },

    {
        id: "novelAuthorCustomSkin",
        title: "作者スキン",
        description: {
            text: "専用バナーが小説の「ランキングタグ」に配置されている場合、作者が設定したスキンが反映されます。",
            keywords: ["さくしゃすきん", "作者スキン", "作者", "CSS"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "style",
        },
    },

    {
        id: "novelAuthorCustomSkinWarning",
        title: "作者スキンの警告文を表示",
        description: {
            text: "作者スキンが適用されていることを示す警告文を、ページ上部に表示します。",
            keywords: ["さくしゃすきんのけいこくぶんをひょうじ", "作者スキン", "作者"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "style",
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "novelAuthorCustomSkin", value: true }
                ]
            },
            isAdvanced: true,
        },
    },

    /*
    {
        id: "novelGenerateAuthorCustomSkin",
        title: "作者スキンバナーを作成",
        description: {
            text: "現在選択中のスキンから、作者設定スキンバナーを生成します。",
            keywords: ["さくしゃすきんばなーをさくせい", "作者スキン", "作者"],
        },
        ui: {
            type: "custom",
            data: "ui_novelAuthorCustomSkinGenerator",
            action: novel_authorSkin,
            hideButtons: ["reset"],
        },
        location: {
            page: "novel",
            category: "style",
        },
        value: {
            requirement: {
                dataFor: ["novelAuthorCustomSkin"],
                data: true,
                mode: "show"
            },
            isAdvanced: true,
        },
    },
    */


    /* 書体 (font) */
    {
        id: "novelFont",
        title: "フォント",
        description: {
            text: "小説ページの書体やレイアウトを変更します。",
            keywords: ["ふぉんと", "レイアウト", "デザイン", "外観", "フォント", "フォント設定", "CSS", "書体"],
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_novelFontSelect",
                layout: "wide"
            }
        },
        location: {
            page: "novel",
            category: "font",
        },
        value: {
            related: ["fontFontFamilyList", "fontSelectedFontFamily"],
        },
    },

    {
        id: "novelVertical",
        title: "縦書き",
        description: {
            text: "本文を縦書きで表示します。",
            attention: "設定の反映には、ページの再読み込みが必要です。",
            keywords: ["たてがき", "レイアウト", "外観", "フォント", "縦書き", "書体"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "font",
        },
    },

    {
        id: "fontFontSize",
        title: "文字サイズ",
        description: {
            hidden: "小説ページの文字サイズを変更します。",
            keywords: ["もじさいず", "レイアウト", "外観", "フォント", "大きさ"],
        },
        ui: {
            type: "number",
            data: {
                step: 10,
                max: 300,
                min: 50,
                suffix: "%",
                button: true,
            },
        },
        location: {
            page: "novel",
            category: "font",
        },
    },

    {
        id: "fontLineHeight",
        title: "行間",
        description: {
            hidden: "小説ページの行間幅を変更します。",
            keywords: ["ぎょうかん", "レイアウト", "外観", "フォント", "行間", "幅"],
        },
        ui: {
            type: "number",
            data: {
                step: 10,
                max: 300,
                min: 50,
                suffix: "%",
                button: true,
            },
        },
        location: {
            page: "novel",
            category: "font",
        },
    },

    {
        id: "fontWidth",
        title: "横幅",
        description: {
            hidden: "小説ページの横幅を変更します。",
            keywords: ["よこはば", "レイアウト", "外観", "フォント", "横幅", "幅"],
        },
        ui: {
            type: "number",
            data: {
                step: 10,
                max: 1000,
                min: 0,
                suffix: "px",
                button: true,
            },
        },
        location: {
            page: "novel",
            category: "font",
        },
    },

    /* 文章校正 (correction) */
    {
        id: "parent_correctionGrammer",
        title: "文法",
        ui: {
            type: "parent",
        },
        location: {
            page: "novel",
            category: "correction",
            noindex: true,
        },
    },

    {
        id: "parent_correctionSymbol",
        title: "記号",
        ui: {
            type: "parent"
        },
        location: {
            page: "novel",
            category: "correction",
            noindex: true,
        },
    },

    {
        id: "parent_correctionLocalize",
        title: "ローカライズ",
        ui: {
            type: "parent"
        },
        location: {
            page: "novel",
            category: "correction",
            noindex: true,
        },
        value: {
            isAdvanced: true,
        }
    },

    {
        id: "parent_correctionVertical",
        title: "文字の向き（縦書きのみ）",
        description: {
            text: "縦書き時に一部の文字列を回転して表示します。"
        },
        ui: {
            type: "parent"
        },
        location: {
            page: "novel",
            category: "correction",
            noindex: true,
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "novelVertical", value: true }
                ]
            },
            isAdvanced: true,
        },
    },

    {
        id: "parent_correctionMisc",
        title: "その他",
        ui: {
            type: "parent"
        },
        location: {
            page: "novel",
            category: "correction",
            noindex: true,
        },
    },

    {
        id: "correctionIndent",
        title: "段落下げ",
        description: {
            text: "地の文の行頭に全角スペースを1つ追加します。",
            keywords: ["だんらくさげ", "文法", "文章校正", "段落"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionGrammer"
        },
    },

    {
        id: "correctionNormalizeEllipses",
        title: "三点リーダー",
        description: {
            text: "中点やピリオドなどでできた三点リーダーを修正します。",
            small: "「・・・」「...」→「…………」",
            keywords: ["さんてんりーだー", "記号", "文章校正", "三点リーダー"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionNormalizeDash",
        title: "ダッシュ",
        description: {
            text: "罫線・ハイフンなどでできたダッシュを全角ダッシュへ変換します。",
            small: "「──」→「――」",
            keywords: ["だっしゅ", "記号", "文章校正", "ダッシュ"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionNormalizeExclamation",
        title: "感嘆符",
        description: {
            text: "感嘆符を個数に応じて適切なものに変換します。",
            small: "「！？」→「⁉️」 「！！！」→「!!!」",
            keywords: ["かんたんふ", "記号", "文章校正", "感嘆符", "クエスチョン", "エクスクラメーション"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionRepeatedSymbols",
        title: "連続する句読点",
        description: {
            text: "連続で現れる句読点を1つに修正します。",
            small: "「、、、」→「、」",
            keywords: ["れんぞくするくとうてん", "記号", "文章校正", "句読点"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionPeriodWithBrackets",
        title: "括弧の後の句点",
        description: {
            text: "括弧の後に現れる句点を削除します。",
            small: "「。』」→「』」",
            keywords: ["かっこのあとのくてん", "記号", "文章校正", "句読点", "カッコ", "括弧"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionNoSpaceExclamation",
        title: "後ろに空白の無い感嘆符",
        description: {
            text: "感嘆符の後ろに全角スペースを追加します。",
            small: "「！あ」→「！　あ」",
            keywords: ["うしろにくうはくのないかんたんふ", "記号", "文章校正", "感嘆符"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionOddEllipses",
        title: "奇数の三点リーダー",
        description: {
            text: "奇数個連続する三点リーダーを偶数個に修正します。",
            small: "「…」→「……」",
            keywords: ["きすうのさんてんりーだー", "記号", "文章校正", "三点リーダー"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionOddDash",
        title: "奇数のダッシュ",
        description: {
            text: "奇数個連続するダッシュを偶数個に修正します。",
            small: "「―」→「――」",
            keywords: ["きすうのだっしゅ", "記号", "文章校正", "ダッシュ"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionWaveDash",
        title: "波ダッシュを繋げる",
        description: {
            text: "連続する波ダッシュを繋げます。",
            small: "「～～」→「〰〰」",
            keywords: ["なみだっしゅをつなげる", "記号", "文章校正", "波ダッシュ"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionSymbol"
        },
    },

    {
        id: "correctionNumber",
        title: "数値",
        description: {
            text: "数値の表記方法を変更します。",
            small: "※数値とは、「+-」の記号を含む半角/全角数字で構成された実数のことです。",
            keywords: ["すうち", "ローカライズ", "文章校正", "数値"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionLocalize"
        },
    },

    {
        id: "correctionNumberShort",
        title: "1文字の数値",
        description: {
            text: "1文字の数値の表示方法を設定します。",
            keywords: ["1もじのすうち", "ローカライズ", "文章校正", "数値"],
        },
        ui: {
            type: "select",
            data: {
                dataType: "string",
                values: [
                    { value: "default", label: "そのまま" },
                    { value: "half", label: "半角へ置換" },
                    { value: "full", label: "全角へ置換" },
                    { value: "kanji", label: "漢数字へ置換" },
                ],
            }
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionLocalize"
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "correctionNumber", value: true }
                ]
            }
        },
    },

    {
        id: "correctionNumberLong",
        title: "2文字以上の数値",
        description: {
            text: "2文字以上の数値の表示方法を設定します。",
            keywords: ["2もじのすうち", "ローカライズ", "文章校正", "数値"],
        },
        ui: {
            type: "select",
            data: {
                dataType: "string",
                values: [
                    { value: "default", label: "そのまま" },
                    { value: "half", label: "半角へ置換" },
                    { value: "full", label: "全角へ置換" },
                    { value: "kanji", label: "漢数字へ置換" },
                ],
            }
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionLocalize"
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "correctionNumber", value: true }
                ]
            }
        },
    },

    {
        id: "correctionNumberSymbol",
        title: "数値内の記号",
        description: {
            text: "数値内の記号の表示方法を設定します。",
            keywords: ["すうちないのきごう", "ローカライズ", "文章校正", "数値"],
        },
        ui: {
            type: "select",
            data: {
                values: [
                    { value: "default", label: "そのまま" },
                    { value: "half", label: "半角へ置換" },
                    { value: "full", label: "全角へ置換" },
                    { value: "kanji", label: "カタカナへ置換" },
                ]
            }
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionLocalize"
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "correctionNumber", value: true }
                ]
            }
        },
    },

    {
        id: "correctionVerticalLayout_CombineWord",
        title: "半角単語（縦中横）",
        description: {
            text: "設定した桁数までの半角英数字を横方向に表示します。",
            small: "（0で無効）",
            keywords: ["はんかくたんご", "縦中横", "文字の向き", "文章校正", "縦書き"],
        },
        ui: {
            type: "number",
            data: {
                min: 0,
                max: 10,
                step: 1,
                forceStep: true,
                suffix: "文字以下",
            },
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionVertical",
        },
    },

    {
        id: "correctionVerticalLayout_CombineNumber",
        title: "半角数字（縦中横）",
        description: {
            text: "設定した桁数までの半角数字を横方向に表示します。",
            small: "（0で無効）",
            keywords: ["はんかくすうじ", "縦中横", "文字の向き", "文章校正", "縦書き"],
        },
        ui: {
            type: "number",
            data: {
                min: 0,
                max: 10,
                step: 1,
                forceStep: true,
                suffix: "文字以下"
            },
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionVertical",
        },
    },

    {
        id: "correctionVerticalLayout_IgnoreCombineNumberInWord",
        title: "単語中の数字を無視する",
        description: {
            text: "数値の表記方法を変更します。",
            small: "前後に半角英字のある数字を、縦中横処理から無視します。",
            keywords: ["たんごちゅうのすうじをむしする", "縦中横", "文字の向き", "文章校正", "縦書き"],
        },
        ui: {
            type: "switch",
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionVertical",
        },
    },

    {
        id: "correctionVerticalLayout_CombineExclamation",
        title: "半角感嘆符（縦中横）",
        description: {
            text: "設定した桁数までの半角感嘆符を横方向に表示します。",
            small: "（0で無効）",
            keywords: ["はんかくかんたんふ", "縦中横", "文字の向き", "文章校正", "縦書き"],
        },
        ui: {
            type: "number",
            data: {
                min: 0,
                max: 10,
                step: 1,
                forceStep: true,
            suffix: "文字以下"
            },
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionVertical",
        },
    },

    {
        id: "correctionVerticalLayout_SidewayWord",
        title: "全角単語（横向き）",
        description: {
            text: "設定した桁数以上の全角英数字を縦方向に表示します。",
            small: "（0で無効）",
            keywords: ["ぜんかくたんご", "横向き", "文字の向き", "文章校正", "縦書き"],
        },
        ui: {
            type: "number",
            data: {
                min: 0,
                max: 20,
                step: 1,
                forceStep: true,
            suffix: "文字以上"
            },
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionVertical",
        },
    },

    {
        id: "correctionVerticalLayout_SidewayExclamation",
        title: "感嘆符（横向き）",
        description: {
            text: "設定した桁数以上の全角感嘆符を縦方向に表示します。",
            small: "（0で無効）",
            keywords: ["ぜんかくたんご", "横向き", "文字の向き", "文章校正", "縦書き"],
        },
        ui: {
            type: "number",
            data: {
                min: 0,
                max: 20,
                step: 1,
                forceStep: true,
            suffix: "文字以上"
            },
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionVertical",
        },
    },

    {
        id: "correctionShowIllustration",
        title: "挿絵を表示",
        description: {
            text: "挿絵を表示するかどうか選択します。",
            keywords: ["さしえをひょうじ", "挿絵", "文章校正"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionMisc"
        },
    },

    {
        id: "correctionRemoveIllustrationLink",
        title: "挿絵のリンクを無効化",
        description: {
            text: "挿絵に設定される「みてみん」へのリンクを無効化します。",
            keywords: ["さしえのりんくをむこうか", "挿絵", "文章校正"],
        },
        ui: {
            type: "switch"
        },
        location: {
            page: "novel",
            category: "correction",
            parent: "parent_correctionMisc"
        },
        value: {
            requirement: {
                requirementParams: [
                    { id: "correctionShowIllustration", value: true }
                ],
            }
        },
    },

    {
        id: "correctionReplacePatterns",
        title: "置換",
        description: {
            text: "任意の文字列を置換します。 ",
            keywords: ["ちかん", "置換", "置き換え", "文章校正", "正規表現"],
        },
        ui: {
            type: "custom",
            data: {
                id: "correctionReplacePatterns",
                layout: "wide",
            }
        },
        location: {
            page: "novel",
            category: "correction",
        },
    },
]