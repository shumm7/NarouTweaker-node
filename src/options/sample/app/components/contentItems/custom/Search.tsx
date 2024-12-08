import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { FontAwseomeIcon } from '../../common/Icon';
import ContentItem, { CheckShowElement } from '../../ContentItem';
import ErrorMessage from '../module/ErrorMessage';
import Link from '../../common/Link';
import SearchBox from '../../Search';

import $ from 'jquery';
import { nt } from '../../../../../../utils/narou-tweaker';
import { OptionUI_Items } from '../../../lib/items';
import { OptionUI_Pages } from '../../../lib/pages';
import { OptionUI_Category, OptionUI_Item, OptionUI_ItemProps } from '../../../lib/type';

const rows = [
    { value: [`"◯◯"`], description: "完全一致する語句を検索" },
    { value: [`-◯◯`], description: "特定の語句を除外（NOT検索）" },
    { value: [`-"◯◯"`], description: "完全一致する語句を除外（NOT検索）" },
    { value: [`page:◯◯`, `page:◯◯&◯◯`], description: "特定のページの項目のみを表示\n（&区切りで複数指定可）" },
    { value: [`filter:advanced`, `filter:experimental`, `filter:a&e`], description: "高度な設定/実験中の機能のみを表示\n（&区切りで複数指定可）" },
    { value: [`-page:◯◯`, `-filter:◯◯`], description: "特定のフィルターに該当する項目を非表示" },

]

export function Search(props: OptionUI_ItemProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [open, setOpen] = useState(false)

    const handleClose = () => { setOpen(false) };

    const words = splitWords(searchParams.get("q") ?? "")
    var result = searchCategory(words).splice(0, 1)

    return (
        <Stack
            spacing={1}
            sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
            }}
            direction="column"
        >
            <Stack
                direction="column"
                sx={{
                    justifyContent: "flex-start",
                    width: { xs: '100%', md: 'auto' },
                }}
                spacing={1}
            >
                <Stack direction="row" sx={{ gap: 2 }}>
                    <SearchBox width={{ xs: '100%', md: '40ch' }} />
                    <IconButton
                        size="small"
                        aria-label="実験的な要素"
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onClick={() => { setOpen(true) }}
                        sx={{ color: 'text.secondary' }}
                    >
                        <FontAwseomeIcon icon={{ icon: "circle-question", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                    </IconButton>
                </Stack>
                {
                    (result.length > 0) &&
                    <Stack direction="row" spacing={0}>
                        <Typography variant="body2" color="text.secondary">関連するカテゴリ：</Typography>
                        <Typography variant="body2">
                            <Link page={result[0].id} category="" id="">{result[0].title}</Link>
                        </Typography>
                    </Stack>
                }
            </Stack>


            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    キーワード検索
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: "text.secondary",
                    })}
                >
                    <FontAwseomeIcon icon={{ icon: "xmark", prefix: "solid" }} style={{ color: "inherit" }} />
                </IconButton>
                <DialogContent
                    dividers
                    sx={{
                        ".MuiTypography-root": {
                            whiteSpace: "pre-wrap"
                        }
                    }}
                >
                    <Typography variant="body2" color='text.primary'>
                        {"検索フィールドにキーワードを入力することで、関連する設定項目を検索することができます。\nキーワードはスペースで区切ることで、AND検索を行うことができます。"}
                    </Typography>
                    <Typography variant="h6" color='text.primary' mt={1}>検索オプション</Typography>
                    <Typography variant="body2" color='text.primary'>以下の記号を使用することで、より条件を指定した検索を行うことができます。</Typography>
                    <TableContainer component={Paper} sx={{ mt: 1 }} elevation={0}>
                        <Table sx={{ minWidth: "100%", textOverflow: "wrap" }} aria-label="simple table">
                            <TableHead>
                                <TableRow sx={{ color: "text.secondary" }}>
                                    <TableCell>記法</TableCell>
                                    <TableCell>概要</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, i) => (
                                    <TableRow
                                        key={i}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Stack direction="column">
                                                {
                                                    row.value.map((v) => {
                                                        return <Typography variant='body2'>{v}</Typography>
                                                    })
                                                }
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: "pre" }}>{row.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog >

        </Stack>
    )
}

export function SearchResult(props: OptionUI_ItemProps) {
    const [searchParams, setSearchParams] = useSearchParams()

    const storage = props.storage

    if (storage !== undefined) {
        const words = splitWords(searchParams.get("q") ?? "")
        var result = searchOption(
            words,
            storage,
            {
                target: {
                    id: false,
                },
            }
        )

        if (result.length > 0) {
            return (
                <Stack
                    direction="column"
                    spacing={1}
                    sx={{ gap: 0.5, width: "100%" }}
                >
                    <Stack
                        id={"nt-option-search-suggestion"}
                        direction={"column"}
                        className="nt-option-item"
                        sx={{
                            "&:last-child > .nt-option-item--divider": {
                                display: "none"
                            }
                        }}
                    >
                        <Stack spacing={1} sx={{ py: 1 }}>
                            <Typography variant='body2' color="text.primary">{`${result.length}件の項目が見つかりました。`}</Typography>
                            {result.length > 10 && <Typography variant='body2' color="text.secondary" sx={{ fontSize: "90%" }}>このページには関連性の高い10件のみが表示されています。</Typography>}
                        </Stack>
                        <Divider sx={{ pt: 1 }} className="nt-option-item--divider" />
                    </Stack>
                    {
                        result.slice(0, 10).map((option: OptionUI_Item) => {
                            return <ContentItem option={option} storage={storage} type="search" />
                        })
                    }
                </Stack>
            )
        } else {
            return (
                <Stack
                    direction="column"
                    spacing={1}
                    sx={{ gap: 0.5, width: "100%" }}
                >
                    {
                        (result.length === 0) && (
                            words.length > 0 ?
                                <ErrorMessage title="一致する項目が見つかりませんでした" />
                                :
                                <ErrorMessage title="キーワードをもとに設定項目を検索します" />
                        )
                    }
                </Stack>
            )
        }
    }
}


interface OptionUI_SearchResult extends OptionUI_Item {
    score?: number
}
interface OptionUI_CategorySearchResult extends OptionUI_Category {
    score?: number
}

/* オプションを検索して、結果を取得 */
function searchOption(
    searchWords: string[],
    storage: nt.storage.local.options,
    searchOption?: {
        target?: {
            id?: boolean,
            title?: boolean,
            description?: boolean,
            keyword?: boolean
        }
    }
): Array<OptionUI_SearchResult> {
    const modeId = searchOption?.target?.id ?? true
    const modeTitle = searchOption?.target?.title ?? true
    const modeDescription = searchOption?.target?.description ?? true
    const modeKeywords = searchOption?.target?.keyword ?? true

    /* 特殊キーワード（検索フィルター） */
    let isWhitelistActive = false
    let magic_word = false
    let pageFilter: { blacklist: Array<string>, whitelist: Array<string> } = { blacklist: [], whitelist: [] }

    let modeFilter = {
        whitelist: {
            experimental: false,
            advanced: false
        },
        blacklist: {
            experimental: false,
            advanced: false
        }
    }

    function getPageFromKeyword(w: string) {
        let ret: Array<string> = []

        let m = w.match(/^\"(.+)\"$/s)
        if (m !== null) {
            w = m[1]
            for (let i = 0; i < OptionUI_Pages.length; i++) {
                const page = OptionUI_Pages[i]
                if (!page.noindex) {
                    if (page.title === w || page.id === w) {
                        ret.push(page.id)
                    }
                }
            }
        }
        else {
            w = w.toLowerCase()
            for (let i = 0; i < OptionUI_Pages.length; i++) {
                const page = OptionUI_Pages[i]
                if (!page.noindex) {
                    if (page.title?.toLowerCase().includes(w) || page.id.toLowerCase().includes(w)) {
                        ret.push(page.id)
                    }
                }
            }
        }
        return ret
    }

    /* キーワードを分解 */
    for (let k = 0; k < searchWords.length; k++) {
        let w = searchWords[k]

        if (w.match(/^\-+page\:(.*)$/s)) { // 特定のページを除外
            var m = w.match(/^\-+page\:(.*)$/s)
            if (m) {
                w = m[1]
                $.each(w.split("&"), function (_, v) {
                    $.each(getPageFromKeyword(v), function (_, u) {
                        if (!pageFilter.blacklist.includes(u)) {
                            pageFilter.blacklist.push(u)
                        }
                    })
                })
                searchWords[k] = ""
            }
        }
        else if (w.match(/^page\:.*$/s)) { // 特定のページのみで検索
            isWhitelistActive = true
            var m = w.match(/^page\:(.*)$/s)
            if (m) {
                w = m[1]
                $.each(w.split("&"), function (_, v) {
                    $.each(getPageFromKeyword(v), function (_, u) {
                        if (!pageFilter.whitelist.includes(u)) {
                            pageFilter.whitelist.push(u)
                        }
                    })
                })
                searchWords[k] = ""
            }
        }
        else if (w.match(/^\-+filter\:.*$/s)) {
            var m = w.match(/^\-+filter\:(.*)$/s)
            if (m) {
                w = m[1]
                $.each(w.split("&"), function (_, v) {
                    v = v.toLowerCase()
                    if (v === "experiment" || v === "experimental" || v === "e") {
                        modeFilter.blacklist.experimental = true
                    } else if (v === "advance" || v === "advanced" || v === "a") {
                        modeFilter.blacklist.advanced = true
                    }
                })
                searchWords[k] = ""
            }
        }
        else if (w.match(/^filter\:.*$/s)) {
            var m = w.match(/^filter\:(.*)$/s)
            if (m) {
                w = m[1]
                $.each(w.split("&"), function (_, v) {
                    v = v.toLowerCase()
                    if (v === "experiment" || v === "experimental" || v === "e") {
                        modeFilter.whitelist.experimental = true
                    } else if (v === "advance" || v === "advanced" || v === "a") {
                        modeFilter.whitelist.advanced = true
                    }
                })
                searchWords[k] = ""
            }
        } else if (w.match(/^\*$/s)) {
            magic_word = true
            searchWords[k] = ""
        }
    }
    searchWords = searchWords.filter((v)=>v.length>0)

    if (!isWhitelistActive) {
        for (let i = 0; i < OptionUI_Pages.length; i++) {
            const page = OptionUI_Pages[i]
            if (!page.noindex) {
                pageFilter.whitelist.push(page.id)
            }
        }
    }

    /* 検索実行 */
    var searchResult: Array<OptionUI_SearchResult> = []
    for (let i = 0; i < OptionUI_Items.length; i++) {
        const v: OptionUI_SearchResult = OptionUI_Items[i]

        if (!v.location.noindex && CheckShowElement(storage, v)) {
            let exception = false

            /* 検索対象（全文） */
            var fullWords = ""
            if (modeId && v.id) {
                fullWords += v.id
            }
            if (modeTitle && v.title) {
                fullWords += v.title
            }
            if (modeDescription && v.description) {
                if (v.description.text) {
                    fullWords += v.description.text
                }
                if (v.description.small) {
                    fullWords += v.description.small
                }
                if (v.description.attention) {
                    fullWords += v.description.attention
                }
            }
            var p_fullWords = fullWords
            if (modeKeywords && v.description) {
                if (v.description.keywords) {
                    fullWords += v.description.keywords.join("")
                }
            }

            /* キーワード検索 */
            let scoreSum = 0
            for (let k = 0; k < searchWords.length; k++) {
                let w = searchWords[k]
                let score = 0

                if (w.match(/^\-+.+$/s)) {
                    var m = w.match(/^\-+(.+)$/s)
                    if (m) {
                        w = m[1]
                        if (p_fullWords.includes(w)) {
                            exception = true
                            continue
                        }
                    }
                } else if (w.match(/^\".+\"$/s)) {
                    var m = w.match(/^\"(.+)\"$/s)
                    if (m) {
                        w = m[1]
                        if (!p_fullWords.includes(w)) {
                            exception = true
                            continue

                        } else {
                            if (modeId) {
                                score += (100 * countMult_include(v.id, w, 0)) * (1 + w.length / v.id.length)
                            }
                            if (modeTitle) {
                                score += getSearchScore(v.title, w, 15) * countMult_include(v.title, w, 0.2)
                            }
                            if (modeDescription && v.description) {
                                score += getSearchScore(v.description.text, w, 10) * countMult_include(v.description.text, w, 0.1)
                                score += getSearchScore(v.description.small, w, 8) * countMult_include(v.description.small, w, 0.08)
                                score += getSearchScore(v.description.attention, w, 8) * countMult_include(v.description.attention, w, 0.08)
                                score += getSearchScore(v.description.hidden, w, 10) * countMult_include(v.description.hidden, w, 0.1)
                            }
                            if (modeKeywords && v.description) {
                                if (Array.isArray(v.description.keywords)) {
                                    $.each(v.description.keywords, function (_, k) {
                                        score += getSearchScore(k, w, 10) * countMult_include(k, w, 0)
                                    })
                                }
                            }
                            score *= 1.5
                        }
                    }
                } else {
                    if (modeId) {
                        score += (100 * countMult_include(v.id, w, 0)) * (1 + w.length / v.id.length)
                    }
                    if (modeTitle) {
                        score += getSearchScore(v.title, w, 10) * countMult(v.title, w, 0.2)
                    }
                    if (modeDescription && v.description) {
                        score += getSearchScore(v.description.text, w, 10) * countMult(v.description.text, w, 0.1)
                        score += getSearchScore(v.description.small, w, 8) * countMult(v.description.small, w, 0.08)
                        score += getSearchScore(v.description.attention, w, 8) * countMult(v.description.attention, w, 0.08)
                        score += getSearchScore(v.description.hidden, w, 10) * countMult(v.description.hidden, w, 0.1)
                    }
                    if (modeKeywords && v.description) {
                        if (Array.isArray(v.description.keywords)) {
                            $.each(v.description.keywords, function (_, k) {
                                score += getSearchScore(k, w, 10) * countMult_include(k, w, 0)
                            })
                        }
                    }
                }
                scoreSum += score
            }
            let score = scoreSum / searchWords.length

            /* 検索フィルター */
            if (modeFilter.blacklist.experimental) {
                if (v.value?.isExperimental) {
                    exception = true
                }
            }
            if (modeFilter.blacklist.advanced) {
                if (v.value?.isAdvanced) {
                    exception = true
                }
            }
            if (modeFilter.whitelist.experimental) {
                if (!v.value?.isExperimental) {
                    exception = true
                }
            }
            if (modeFilter.whitelist.advanced) {
                if (!v.value?.isAdvanced) {
                    exception = true
                }
            }

            if (pageFilter.blacklist.includes(v.location.page)) {
                exception = true
            }
            if (!pageFilter.whitelist.includes(v.location.page)) {
                exception = true
            }
            
            if ((score >= 20 && !exception && !magic_word) || (magic_word && !exception)) {
                v.score = score
                searchResult.push(v)
            }
        }
    }

    return searchResult.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
}

/* カテゴリを検索して、結果を取得 */
function searchCategory(searchWords: string[]): Array<OptionUI_CategorySearchResult> {
    var searchResult: Array<OptionUI_CategorySearchResult> = []
    $.each(OptionUI_Pages, function (_, v) {
        if (!v.noindex) {
            var exception = false

            /* 検索対象（全文） */
            var fullWords = ""
            if (v.title) {
                fullWords += v.title
            }
            if (v.description) {
                fullWords += v.description
            }

            /* NOT検索 / 完全一致 */
            var scoreSum = 0
            $.each(searchWords.filter(w => w.trim().length > 0), function (_, w) {
                var score = 0
                if (w.match(/^\-+.+$/s)) {
                    var m = w.match(/^\-+(.+)$/s)
                    if (m) {
                        w = m[1]
                        if (fullWords.includes(w)) {
                            exception = true
                            return true
                        }
                    }
                } else if (w.match(/^\".+\"$/s)) {
                    var m = w.match(/^\"(.+)\"$/s)
                    if (m) {
                        w = m[1]
                        if (!fullWords.includes(w)) {
                            exception = true
                            return true
                        } else {
                            score += getSearchScore(v.title, w, 10) * countMult_include(v.title, w, 0.2)
                            score += getSearchScore(v.description, w, 10) * countMult_include(v.description, w, 0.1)
                            score *= 1.5
                        }
                    }
                } else {
                    score += getSearchScore(v.title, w, 10) * countMult(v.title, w, 0.2)
                    score += getSearchScore(v.description, w, 10) * countMult(v.description, w, 0.1)
                }
                scoreSum += score
            })

            const score = scoreSum / searchWords.length
            if (score >= 30 && !exception) {
                searchResult.push({ id: v.id, title: v.title ?? "", score: score })
            }
        }
    })
    searchResult = searchResult.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

    return searchResult
}



/* キーワードを分割 */
function splitWords(splitWords: string) {
    var list: Array<string> = []
    var word = ""
    var startBracket = false
    var startBracketPos = -1

    var chars = [...splitWords.trim()]
    $.each(chars, function (idx, c) {
        if (c.match(/\"/)) {
            if (!startBracket && word.length == 0) {
                startBracket = true //ブラケット開始
                startBracketPos = idx
                word += c
            } else {
                if (idx < chars.length - 1) {
                    if (chars[idx + 1].match(/\s/) && idx - startBracketPos > 1) {
                        list.push(word + c)
                        word = ""
                        startBracket = false
                        startBracketPos = -1
                    } else {
                        word += c
                    }
                }
                else {
                    list.push(word + c)
                    word = ""
                }
            }
        } else if (c.match(/\s/) && !startBracket) {
            if (word.length > 0) {
                list.push(word)
                word = ""
            }
        } else {
            word += c
        }
    })
    if (word.length > 0) {
        list.push(word)
    }
    return list
}

/* 得点付け関数 */
function getSearchScore(target: string | undefined, word: string, mult: number) {
    if (!target) {
        return 0
    }
    if (mult === undefined) {
        mult = 1
    }
    return 10 * nt.text.stringSimilarity(target.toLowerCase(), word.toLowerCase()) * mult
}

function countMult_include(target: string | undefined, searchWord: string, mult: number) {
    if (!target) {
        return 0
    }
    if (mult === undefined) {
        mult = 0.1
    }
    var s = nt.text.searchCount(target.toLowerCase(), searchWord.toLowerCase())
    if (s <= 0) {
        return 0
    } else {
        return 1 + mult * (s - 1)
    }
}

function countMult(target: string | undefined, searchWord: string, mult: number) {
    if (!target) {
        return 0
    }
    if (mult === undefined) {
        mult = 0.1
    }
    var s = nt.text.searchCount(target.toLowerCase(), searchWord.toLowerCase())
    return 1 + mult * s
}