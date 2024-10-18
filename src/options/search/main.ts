import { OptionUI_Category, OptionUI_Item } from "../_utils/optionUI_type";
import { searchCount, stringSimilarity } from "../../utils/text";
import { getOptionElement, optionHide, syntaxHighlight } from "../_utils/utils";
import { restoreOptions, setup } from "../general";
import { OptionUI_Items, OptionUI_Pages } from "../_utils/optionUI_items";

setup()
$("#search-box").focus()

if(`${$("#search-box").val() ?? ""}`.length>0){
    search(`${$("#search-box").val() ?? ""}`)
}

$("#search-box").on("input", function(){
    var searchWords = `${$("#search-box").val() ?? ""}`
    $("#sidebar-search-box").val(searchWords)
    search(searchWords)
})

class OptionUI_SearchResult extends OptionUI_Item {
    score?: number
}
class OptionUI_CategorySearchResult extends OptionUI_Category {
    score?: number
}

function search(searchWords: string){
    const words = splitWords(searchWords)
    
    const params = new URLSearchParams(location.search)
    params.set("s", words.join(" "))
    window.history.replaceState(null, "", `${location.pathname}?${params.toString()}`)

    var result = searchOption(words)
    var c_result = searchCategory(words)

    $(".search-result-box").remove()
    $(".search-box--suggestion-item").empty()

    /* カテゴリ */
    if(c_result.length > 0){
        var r = c_result[0]
        $(`.search-box--suggestion-item`).append(`関連カテゴリ: <span style="font-weight: bold; margin-left: 5px;"><a href="/options/${r.id}/index.html" target="_self">${r.title}</a></span>`)
    }

    /* オプション */
    if(result.length>0){
        var elm = $(`
            <div class="contents-wide search-result-box search-result--option">
                <div id="search-result--information">${result.length}件の項目が見つかりました。</div>
            </div>
        `)

        $(`.contents-container[name="general"]`).append(elm)

        $.each(result.slice(0, 10), function(_, option){
            var elm = getOptionElement(option, "search")
            
            $(`.contents-container[name="general"]`).append(elm)

            if(option.ui){
                if(typeof option.ui.action==="function"){
                    option.ui.action()
                }else if(Array.isArray(option.ui.action)){
                    option.ui.action.forEach(function(func){
                        if(typeof func==="function"){
                            func()
                        }
                    })
                }
            }
        })

        optionHide()
        syntaxHighlight()
        restoreOptions()

        /* 結果が10件以上の場合 */
        if(result.length>10){
            elm = $(`
                <div class="contents-wide search-result-box search-result--option">
                    <div id="search-result--information">このページには関連性の高い10件のみが表示されています。</div>
                </div>
            `)
            $(`.contents-container[name="general"]`).append(elm)
        }
    }else{
        /* 結果が0件の場合 */
        if(words.length>0){
            var elm = $(`
                <div class="contents-wide search-result-box search-result--option">
                    <div id="search-result--information search-result--notfound">一致する項目が見つかりませんでした。</div>
                </div>
            `)

            $(`.contents-container[name="general"]`).append(elm)
        }
    }
}


/* オプションを検索して、結果を取得 */
function searchOption(searchWords: string[]): Array<OptionUI_SearchResult>{
    /*
    const modeTitle = $(`#search-target--title`).prop('checked')
    const modeDescription = $(`#search-target--description`).prop('checked')
    const modeKeywords = $(`#search-target--keyword`).prop('checked')
    */
    const modeId = true
    const modeTitle = true
    const modeDescription = true
    const modeKeywords = true

    /* 特殊キーワード（検索フィルター） */
    var isWhitelistActive = false
    var magic_word = false
    var pageFilter = {
        blacklist: <Array<string>>[],
        whitelist: <Array<string>>[]
    }

    var modeFilter = {
        whitelist: {
            experimental: false,
            advanced: false
        },
        blacklist: {
            experimental: false,
            advanced: false
        }
    }

    function getPageFromKeyword(w: string){
        var ret: Array<string> = []
        
        var m = w.match(/^\"(.+)\"$/s)
        if(m!==null){
            w = m[1]
            $.each(OptionUI_Pages, function(_, c){
                if(!c.noindex){
                    if(c.title === w || c.id === w){
                        ret.push(c.id)
                    }
                }
            })
            
        }
        else{
            w = w.toLowerCase()
            $.each(OptionUI_Pages, function(_, c){
                if(!c.noindex){
                    if(c.title?.toLowerCase().includes(w) || c.id.toLowerCase().includes(w)){
                        ret.push(c.id)
                    }
                }
            })
            
        }
        return ret
    }

    $.each(searchWords, function(k, w){
        var m = w.match(/^\-+page\:(.+)$/s)
        if(m){ /* 特定のページを除外 */
            w = m[1]
            $.each(w.split("&"), function(_, v){
                $.each(getPageFromKeyword(v), function(_, u){
                    if(!pageFilter.blacklist.includes(u)){
                        pageFilter.blacklist.push(u)
                    }
                })
            })
            searchWords[k] = ""
        }
        else if(w.match(/^page\:.+$/s)){ /* 特定のページのみで検索 */
            isWhitelistActive = true
            var m = w.match(/^page\:(.+)$/s)
            if(m){
                w = m[1]
                $.each(w.split("&"), function(_, v){
                    $.each(getPageFromKeyword(v), function(_, u){
                        if(!pageFilter.whitelist.includes(u)){
                            pageFilter.whitelist.push(u)
                        }
                    })
                })
                searchWords[k] = ""
            }
        }
        else if(w.match(/^\-+filter\:.+$/s)){
            var m = w.match(/^\-+filter\:(.+)$/s)
            if(m){
                w = m[1]
                $.each(w.split("&"), function(_, v){
                    v = v.toLowerCase()
                    if(v==="experiment" || v==="experimental" || v==="e"){
                        modeFilter.blacklist.experimental = true
                    }else if(v==="advance" || v==="advanced" || v==="a"){
                        modeFilter.blacklist.advanced = true
                    }
                })
                searchWords[k] = ""
            }
        }
        else if(w.match(/^filter\:.+$/s)){
            var m = w.match(/^filter\:(.+)$/s)
            if(m){
                w = m[1]
                $.each(w.split("&"), function(_, v){
                    v = v.toLowerCase()
                    if(v==="experiment" || v==="experimental" || v==="e"){
                        modeFilter.whitelist.experimental = true
                    }else if(v==="advance" || v==="advanced" || v==="a"){
                        modeFilter.whitelist.advanced = true
                    }
                })
                searchWords[k] = ""
            }
        }else if(w.match(/^\*$/s)){
            magic_word = true
            searchWords[k] = ""
        }
    })

    if(!isWhitelistActive){
        $.each(OptionUI_Pages, function(_,c){
            if(!c.noindex){
                pageFilter.whitelist.push(c.id)
            }
        })
    }
    

    /* 検索実行 */
    var searchResult: Array<OptionUI_SearchResult> = []
    if(modeTitle || modeDescription || modeKeywords){
        $.each(OptionUI_Items, function(_, v: OptionUI_SearchResult){
            if(v.location){
                if(!v.location.noindex){
                    var exception = false

                    /* 検索対象（全文） */
                    var fullWords = ""
                    if(modeId && v.id){
                        fullWords += v.id
                    }
                    if(modeTitle && v.title){
                        fullWords += v.title
                    }
                    if(modeDescription && v.description){
                        if(v.description.text){
                            fullWords += v.description.text
                        }
                        if(v.description.small){
                            fullWords += v.description.small
                        }
                        if(v.description.attention){
                            fullWords += v.description.attention
                        }
                    }
                    var p_fullWords = fullWords
                    if(modeKeywords && v.description){
                        if(v.description.keywords){
                            fullWords += v.description.keywords.join("")
                        }
                    }

                    /* キーワード検索 */
                    var scoreSum = 0
                    $.each(searchWords, function(_, w){
                        if(!w){
                            return true
                        }

                        var score = 0
                        if(w.match(/^\-+.+$/s)){
                            var m = w.match(/^\-+(.+)$/s)
                            if(m){
                                w = m[1]
                                if(p_fullWords.includes(w)){
                                    exception = true
                                    return true
                                }
                            }
                        }else if(w.match(/^\".+\"$/s)){
                            var m = w.match(/^\"(.+)\"$/s)
                            if(m){
                                w = m[1]
                                if(!p_fullWords.includes(w)){
                                    exception = true
                                    return true
                                }else{
                                    if(modeId){
                                        score += (100 * countMult_include(v.id, w, 0)) * (1 + w.length / v.id.length)
                                    }
                                    if(modeTitle){
                                        score += getSearchScore(v.title, w, 10) * countMult_include(v.title, w, 0.2)
                                    }
                                    if(modeDescription && v.description){
                                        score += getSearchScore(v.description.text, w, 10) * countMult_include(v.description.text, w, 0.1)
                                        score += getSearchScore(v.description.small, w, 8) * countMult_include(v.description.small, w, 0.08)
                                        score += getSearchScore(v.description.attention, w, 8) * countMult_include(v.description.attention, w, 0.08)
                                        score += getSearchScore(v.description.hidden, w, 10) * countMult_include(v.description.hidden, w, 0.1)
                                    }
                                    if(modeKeywords && v.description){
                                        if(Array.isArray(v.description.keywords)){
                                            $.each(v.description.keywords, function(_, k){
                                                score += getSearchScore(k, w, 10) * countMult_include(k, w, 0)
                                            })
                                        }
                                    }
                                    score *= 1.5
                                }
                            }
                        }else{
                            if(modeId){
                                score += (100 * countMult_include(v.id, w, 0)) * (1 + w.length / v.id.length)
                            }
                            if(modeTitle){
                                score += getSearchScore(v.title, w, 10) * countMult(v.title, w, 0.2)
                            }
                            if(modeDescription && v.description){
                                score += getSearchScore(v.description.text, w, 10) * countMult(v.description.text, w, 0.1)
                                score += getSearchScore(v.description.small, w, 8) * countMult(v.description.small, w, 0.08)
                                score += getSearchScore(v.description.attention, w, 8) * countMult(v.description.attention, w, 0.08)
                                score += getSearchScore(v.description.hidden, w, 10) * countMult(v.description.hidden, w, 0.1)
                            }
                            if(modeKeywords && v.description){
                                if(Array.isArray(v.description.keywords)){
                                    $.each(v.description.keywords, function(_, k){
                                        score += getSearchScore(k, w, 10) * countMult_include(k, w, 0)
                                    })
                                }
                            }
                        }
                        scoreSum += score
                    })

                    const score = scoreSum / searchWords.length

                    
                    /* 検索フィルター */
                    if(modeFilter.blacklist.experimental){
                        if(v.value?.isExperimental){
                            exception = true
                        }
                    }
                    if(modeFilter.blacklist.advanced){
                        if(v.value?.isAdvanced){
                            exception = true
                        }
                    }
                    if(modeFilter.whitelist.experimental){
                        if(!v.value?.isExperimental){
                            exception = true
                        }
                    }
                    if(modeFilter.whitelist.advanced){
                        if(!v.value?.isAdvanced){
                            exception = true
                        }
                    }

                    if(pageFilter.blacklist.includes(v.location.page)){
                        exception = true
                    }
                    if(!pageFilter.whitelist.includes(v.location.page)){
                        exception = true
                    }

                    if((score>=20 && !exception && !magic_word) || (magic_word && !exception)){
                        v.score = score
                        
                        searchResult.push(v)
                    }
                }
            }
        })
        searchResult = searchResult.sort((a,b) => (b.score ?? 0) - (a.score ?? 0))
    }

    return searchResult
}

/* カテゴリを検索して、結果を取得 */
function searchCategory(searchWords: string[]): Array<OptionUI_CategorySearchResult>{
    var searchResult: Array<OptionUI_CategorySearchResult> = []
    $.each(OptionUI_Pages, function(_, v){
        if(!v.noindex){
            var exception = false

            /* 検索対象（全文） */
            var fullWords = ""
            if(v.title){
                fullWords += v.title
            }
            if(v.description){
                fullWords += v.description
            }

            /* NOT検索 / 完全一致 */
            var scoreSum = 0
            $.each(searchWords.filter(w => w.trim().length > 0), function(_, w){
                var score = 0
                if(w.match(/^\-+.+$/s)){
                    var m = w.match(/^\-+(.+)$/s)
                    if(m){
                        w = m[1]
                        if(fullWords.includes(w)){
                            exception = true
                            return true
                        }
                    }
                }else if(w.match(/^\".+\"$/s)){
                    var m = w.match(/^\"(.+)\"$/s)
                    if(m){
                        w = m[1]
                        if(!fullWords.includes(w)){
                            exception = true
                            return true
                        }else{
                            score += getSearchScore(v.title, w, 10) * countMult_include(v.title, w, 0.2)
                            score += getSearchScore(v.description, w, 10) * countMult_include(v.description, w, 0.1)
                            score *= 1.5
                        }
                    }
                }else{
                    score += getSearchScore(v.title, w, 10) * countMult(v.title, w, 0.2)
                    score += getSearchScore(v.description, w, 10) * countMult(v.description, w, 0.1)
                }
                scoreSum += score
            })

            const score = scoreSum / searchWords.length
            if(score>=30 && !exception){
                searchResult.push({id: v.id, title: v.title, score: score})
            }
        }
    })
    searchResult = searchResult.sort((a,b) => (b.score ?? 0) - (a.score ?? 0))

    return searchResult
}


/* キーワードを分割 */
function splitWords(splitWords: string){
    var list: Array<string> = []
    var word = ""
    var startBracket = false
    var startBracketPos = -1

    var chars = [...splitWords.trim()]
    $.each(chars, function(idx, c){
        if(c.match(/\"/)){
            if(!startBracket && word.length==0){
                startBracket = true //ブラケット開始
                startBracketPos = idx
                word += c
            }else{
                if(idx < chars.length-1){
                    if(chars[idx+1].match(/\s/) && idx - startBracketPos>1){
                        list.push(word + c)
                        word = ""
                        startBracket = false
                        startBracketPos = -1
                    }else{
                        word += c
                    }
                }
                else{
                    list.push(word + c)
                    word = ""
                } 
            }
        }else if(c.match(/\s/) && !startBracket){
            if(word.length>0){
                list.push(word)
                word = ""
            }
        }else{
            word += c
        }
    })
    if(word.length>0){
        list.push(word)
    }
    return list
}


/* 得点付け関数 */
function getSearchScore(target: string|undefined, word: string, mult: number){
    if(!target){
        return 0
    }
    if(mult===undefined){
        mult = 1  
    }
    return 10 * stringSimilarity(target.toLowerCase(), word.toLowerCase()) * mult
}

function countMult_include(target: string|undefined, searchWord: string, mult: number){
    if(!target){
        return 0
    }
    if(mult===undefined){
        mult = 0.1    
    }
    var s = searchCount(target.toLowerCase(), searchWord.toLowerCase())
    if(s <= 0){
        return 0
    }else{
        return 1 + mult * (s - 1)
    }
}

function countMult(target: string|undefined, searchWord: string, mult: number){
    if(!target){
        return 0
    }
    if(mult===undefined){
        mult = 0.1    
    }
    var s = searchCount(target.toLowerCase(), searchWord.toLowerCase())
    return 1 + mult * s
}