type RankPageDetail = {
    site?: string
    r18?: boolean
    detail?: string
    type?: string
    category?: string
}

export function checkRankPageDetail(_url?: string | URL | Location){
    let url: URL
    if (typeof _url === "string") {
        try {
            url = new URL(_url)
        } catch (e) {
            return undefined
        }
    } else if (_url instanceof URL) {
        url = _url
    } else if (_url instanceof Location) {
        url = new URL(_url.toString())
    } else {
        url = new URL(window.location.toString())
    }

    var ret: RankPageDetail = {}
    if(url.hostname=="yomou.syosetu.com"){
        ret.site = "yomou"
        ret.r18 = false

        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/rank\/top\/*$/)){ /* Ranking Top */
            ret.detail = "rank"
            ret.type = "top"
        }else if(url.pathname.match(/^\/rireki\/list\/*$/)){ /* History */
            ret.detail = "history"
        }else if(url.pathname.match(/^\/search.php/)){ /* Search */
            ret.detail = "search"
        }else if(url.pathname.match(/^\/rank\/list\/type\/.*\/*$/)){ /* General Ranking */
            ret.detail = "rank"
            ret.type = "general"
            m = url.pathname.match(/^\/rank\/list\/type\/(.*)\/*$/)
        }else if(url.pathname.match(/^\/rank\/attnlist\/type\/.*\/*$/)){ /* Attn Ranking */
            ret.detail = "rank"
            ret.type = "attn"
            m = url.pathname.match(/^\/rank\/attnlist\/type\/(.*)\/*$/)
        }else if(url.pathname.match(/^\/rank\/genrelist\/type\/.*\/*$/)){ /* Genre Ranking */
            ret.detail = "rank"
            ret.type = "genre"
            m = url.pathname.match(/^\/rank\/genrelist\/type\/(.*)\/*$/)
        }else if(url.pathname.match(/^\/rank\/isekailist\/type\/.*\/*$/)){ /* Isekai Ranking */
            ret.detail = "rank"
            ret.type = "isekai"
            m = url.pathname.match(/^\/rank\/isekailist\/type\/(.*)\/*$/)
        }

        if(m!==null){
            ret.category = m[1]
        }

    }else if(url.hostname=="noc.syosetu.com"){
        ret.site = "noc"
        ret.r18 = true

        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/rank\/top\/*$/)){ /* Ranking Top */
            ret.detail = "rank"
            ret.type = "top"
        }else if(url.pathname.match(/^\/rireki\/list\/*$/)){ /* History */
            ret.detail = "history"
        }else if(url.pathname.match(/^\/search\/search\/*$/)){ /* Search */
            ret.detail = "search"
        }else if(url.pathname.match(/^\/rank\/list\/type\/.*\/*$/)){ /* General Ranking */
            ret.detail = "rank"
            ret.type = "general"
            m = url.pathname.match(/^\/rank\/list\/type\/(.*)\/*$/)
        }

        if(m!==null){
            ret.category = m[1]
        }

    }else if(url.hostname=="mid.syosetu.com"){
        ret.site = "mid"
        ret.r18 = true

        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/rank\/top\/*$/)){ /* Ranking Top */
            ret.detail = "rank"
            ret.type = "top"
        }else if(url.pathname.match(/^\/rireki\/list\/*$/)){ /* History */
            ret.detail = "history"
        }else if(url.pathname.match(/^\/search\/search\/*$/)){ /* Search */
            ret.detail = "search"
        }else if(url.pathname.match(/^\/rank\/list\/type\/.*\/*$/)){ /* General Ranking */
            ret.detail = "rank"
            ret.type = "general"
            m = url.pathname.match(/^\/rank\/list\/type\/(.*)\/*$/)
        }

        if(m!==null){
            ret.category = m[1]
        }

    }else if(url.hostname=="mnlt.syosetu.com"){
        ret.site = "mnlt"
        ret.r18 = true

        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/rank\/top\/*$/)){ /* Ranking Top */
            ret.detail = "rank"
            ret.type = "top"
            ret.category = "female"
        }else if(url.pathname.match(/^\/rank\/bltop\/*$/)){ /* BL Ranking Top */
            ret.detail = "rank"
            ret.type = "top"
            ret.category = "bl"
        }else if(url.pathname.match(/^\/rireki\/list\/*$/)){ /* History */
            ret.detail = "history"
        }else if(url.pathname.match(/^\/search\/search\/*$/)){ /* Search */
            ret.detail = "search"
        }else if(url.pathname.match(/^\/rank\/list\/type\/.*\/*$/)){ /* General Ranking */
            ret.detail = "rank"
            ret.type = "general_female"
            m = url.pathname.match(/^\/rank\/list\/type\/(.*)\/*$/)
        }else if(url.pathname.match(/^\/rank\/bllist\/type\/.*\/*$/)){ /* BL General Ranking */
            ret.detail = "rank"
            ret.type = "general_bl"
            m = url.pathname.match(/^\/rank\/bllist\/type\/(.*)\/*$/)
        }

        if(m!==null){
            ret.category = m[1]
        }

    }

    return ret
}