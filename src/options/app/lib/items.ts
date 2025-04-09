import { general_optionsList } from "./items/general"
import { narou_optionsList } from "./items/narou"
import { novel_optionsList } from "./items/novel"
import { yomou_optionsList } from "./items/yomou"
import { workspace_optionsList } from "./items/workspace"
import { mypage_optionsList } from "./items/mypage"
import { mitemin_optionsList } from "./items/mitemin"

import { OptionUI_Item } from "./type"

import { test_optionsList } from "./items/test"
import { misc_optionsList } from "./items/misc"
import { debug_optionsList } from "./items/debug"

export const OptionUI_Items: Array<OptionUI_Item> = [
    /* 検索 */
    {
        id: "extSearch",
        title: "検索",
        description: {
            text: "キーワードを入力してください",
            small: '・スペース区切りでAND検索ができます。<br>・「"◯◯"」と括ると完全一致する語句を検索します。<br>・「-◯◯」で特定の語句を除外します。',
        },
        ui: {
            type: "custom",
            data: {
                id: "ui_extSearchBox",
            },
            hideButtons: "all",
        },
        location: {
            page: "search",
            category: "general",
            noindex: true,
        },
    },

    /* テスト */
    ...test_optionsList,

    /* 全般 */
    ...general_optionsList,

    /* 小説家になろう */
    ...narou_optionsList,

    /* 小説ページ */
    ...novel_optionsList,

    /* 小説を読もう！ */
    ...yomou_optionsList,

    /* ユーザページ */
    ...workspace_optionsList,

    /* マイページ */
    ...mypage_optionsList,

    /* みてみん */
    ...mitemin_optionsList,

    /* デバッグ */
    ...debug_optionsList,

    /* その他 */
    ...misc_optionsList,
]
