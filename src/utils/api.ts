/**
 * 小説タグから検索URLを取得する
 * @param {string|Array<string>} tag 
 * @param {string|number} site - 数値または文字列で対象のサイトを指定。未指定や不正な値の場合は、小説家になろう（全年齢）になる（1:ノクターン 2:ムーンライト 3:ムーンライト（BL） 4:ミッドナイト）
 * @param param 
 * @returns 
 */
export function getNovelTagURL(tag: string|Array<string>, site?: string|number, param?: {[key: string]: any}){
    if(param===undefined){
        param = {}
    }
    if(Array.isArray(tag) && tag.length>0){
        param.word = tag.map((v)=>escape(v)).join("+")
    }else if(typeof tag === "string"){
        param.word = tag.split(" ").map((v)=>escape(v)).join("+")
    }
    param.keyword = 1

    return getNovelSearchURL(site, param)
}

/**
 * 小説家になろうの検索結果URLを取得する
 * @param {string|number} site - 数値または文字列で対象のサイトを指定。未指定や不正な値の場合は、小説家になろう（全年齢）になる（1:ノクターン 2:ムーンライト 3:ムーンライト（BL） 4:ミッドナイト）
 * @param param - 検索パラメータ（辞書型オブジェクト）
 * @returns URL
 */
export function getNovelSearchURL(site?: string|number, param?: {[key: string]: any}){
    if(param===undefined){
        param = {}
    }

    var url = `https://yomou.syosetu.com/search.php`
    if(site=="noc" || Number(site)==1 ){
        url = `https://noc.syosetu.com/search/search/search.php`
    }else if(site=="mnlt"){
        return `https://mnlt.syosetu.com/search/search/`
    }else if(Number(site)==2){
        param.nocgenre = 2
        url = `https://mnlt.syosetu.com/search/search/`
    }else if(Number(site)==3){
        param.nocgenre = 3
        url = `https://mnlt.syosetu.com/search/search/`
    }else if(site=="mid" || Number(site)==4){
        url = `https://mid.syosetu.com/search/search/`
    }

    let i = 0
    Object.keys(param).forEach(function(key){
        if(i==0){
            url += "?"
        }else{
            url += "&"
        }
        url += `${key}=${param[key]}`
        i += 1
    })

    return url
}

/**
 * 小説家になろうグループサイトのURLがR18かどうかを判定
 * @param {string|URL|Location} _url ページのURL
 * @returns {boolean} - true:R18 / false:全年齢 / undefined: 判定不能・エラー
 */
export function isR18(_url?:string|URL|Location): boolean|undefined{
    let url:URL
    if(typeof _url === "string"){
        try{
            url = new URL(_url)
        }catch(e){
            return undefined
        }
    }else if(_url instanceof URL){
        url = _url
    }else if(_url instanceof Location){
        url = new URL(_url.toString())
    }else{
        url = new URL(location.toString())
    }

    if(url.hostname=="ncode.syosetu.com" || url.hostname=="novelcom.syosetu.com"){
        return false
    }
    else if(url.hostname=="novelcom18.syosetu.com" || url.hostname=="novel18.syosetu.com"){
        return true
    }
    else if(url.hostname == "mypage.syosetu.com"){
        return false
    }
    else if(url.hostname == "xmypage.syosetu.com"){
        return true
    }
}

/**
 * 小説のエピソード番号を取得
 * @param {string|URL|Location} _url ページのURL
 * @returns {number} エピソード番号（判定できない場合は0を出力）
 */
export function getEpisode(_url?:string|URL|Location): number{
    let url:URL
    if(typeof _url === "string"){
        try{
            url = new URL(_url)
        }catch(e){
            return 0
        }
    }else if(_url instanceof URL){
        url = _url
    }else if(_url instanceof Location){
        url = new URL(_url.toString())
    }else{
        url = new URL(location.toString())
    }

    if(url.hostname=="ncode.syosetu.com" || url.hostname=="novel18.syosetu.com"){
        if (url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/\d+\/*$/)){ /* Story */
            var m = url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/(\d+)\/*$/)
            if(m!==null){
                const e = Number(m[1])
                if(!isNaN(e)){
                    return e
                }
            }
            
        }
    }
    return 0
}


/**
 * 作者のユーザIDを取得
 * @param {string|URL|Location} _url ページのURL
 * @returns {string} - ユーザID
 */
export function getUserIdFromURL(_url?:string|URL|Location): string|undefined{
    let url:URL
    if(typeof _url === "string"){
        try{
            url = new URL(_url)
        }catch(e){
            return undefined
        }
    }else if(_url instanceof URL){
        url = _url
    }else if(_url instanceof Location){
        url = new URL(_url.toString())
    }else{
        url = new URL(location.toString())
    }

    if(location.hostname == "mypage.syosetu.com"){
        var m = location.pathname.match(/\/userid\/(\d+)\//)
        if(m){
            return m[1]
        }
    }else if(location.hostname == "xmypage.syosetu.com"){
        var m = location.pathname.match(/\/xid\/(x\d+[a-zA-Z]*)\//)
        if(m){
            return m[1].toLowerCase()
        }
    }else if(location.hostname == "ncode.syosetu.com" || location.hostname == "novelcom.syosetu.com"){
        const atom: string = $("link[href^='https://api.syosetu.com/writernovel/'][title='Atom']").prop("href")
        var m = atom.match(/https:\/\/api\.syosetu\.com\/writernovel\/(\d+)\.Atom/)
        if(m!==null){
            return m[1]
        }
    }else if(location.hostname == "novel18.syosetu.com" || location.hostname == "novelcom18.syosetu.com"){
        const atom: string = $("link[href^='https://api.syosetu.com/writernovel/'][title='Atom']").prop("href")
        var m = atom.match(/https:\/\/api\.syosetu\.com\/writernovel\/(x\d+[a-zA-Z]+)\.Atom/)
        if(m!==null){
            return m[1].toLowerCase()
        }
    }
}


/**
 * 小説家になろうグループサイトのページ種別を判定します
 * @param {string|URL|Location} _url  ページのURL
 * @returns {string|undefined} 種類
 */
export function getPageType(_url?:string|URL|Location): string|undefined{
    let url:URL
    if(typeof _url === "string"){
        try{
            url = new URL(_url)
        }catch(e){
            return undefined
        }
    }else if(_url instanceof URL){
        url = _url
    }else if(_url instanceof Location){
        url = new URL(_url.toString())
    }else{
        url = new URL(location.toString())
    }

    if(url.hostname=="ncode.syosetu.com" || url.hostname=="novel18.syosetu.com"){
        if (url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/\d+\/*$/)){ /* Story */
            return "novel"
        }
        else if (url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/*$/)){ /* Top */
            if((typeof $)!=="undefined"){
                if($(".p-novel__body").length){
                    return "novel"
                }else{
                    return "top"
                }
            }else{
                return "novel"
            }
        }
        else if (url.pathname.match(/\/novelview\/infotop\/ncode\/[n|N]\d+[a-zA-Z]+\/*/)){ /* Novel Info */
            return "info"
        }
        else if(url.pathname.match(/^\/novelpdf\/creatingpdf\/ncode\/[n|N]\d+[a-zA-Z]+\/*$/)){ /* PDF */
            return "pdf"
        }
        else if(url.pathname.match(/^\/txtdownload\/top\/ncode\/[n|N]\d+[a-zA-Z]+\/*$/)){ /* TXT */
            return "txt"
        }
        else if(url.pathname.match(/^\/[s|S]\d{4}[a-zA-Z]{1,}\/*$/)){ /* シリーズ */
            return "series"
        }
    }else if(url.hostname=="novelcom.syosetu.com" || url.hostname=="novelcom18.syosetu.com"){
        if (url.pathname.match(/^\/impression\/list\/ncode\/\d+\/*.*$/)){ /* Impression */
            return "impression"
        }
        else if (url.pathname.match(/^\/impressionres\/.*\/ncode\/\d+\/*.*$/)){ /* Impression Reply */
            return "impressionres"
        }
        else if (url.pathname.match(/^\/novelreview\/list\/ncode\/\d+\/*.*$/)){ /* Review */
            return "review"
        }
        else if (url.pathname.match(/^\/novelreport\/.*\/ncode\/\d+\/*.*$/)){ /* 誤字報告 */
            return "report"
        }
        else if(url.pathname.match(/^\/[s|S]\d{4}[a-zA-Z]{1,}\/*$/)){ /* シリーズ */
            return "series"
        }
    }
}

/**
 * 小説大ジャンル
 * @param genre - 大ジャンル番号
 * @returns 大ジャンル名
*/
export function getBigGenre(genre:number): string;
export function getBigGenre(genre:number|any): string{
    if(genre==1){
        return "恋愛"
    }
    else if(genre==2){
        return "ファンタジー"
    }
    else if(genre==3){
        return "文芸"
    }
    else if(genre==4){
        return "SF"
    }
    else if(genre==99){
        return "その他"
    }
    else if(genre==98){
        return "ノンジャンル"
    }
    else{
        return ""
    }
}

/**
 * 小説大ジャンル番号
 * @param genre - 大ジャンル名
 * @returns 大ジャンル番号
*/
export function getBigGenreNumber(genre:string): number|null
export function getBigGenreNumber(genre:string|any): number|null{
    if(genre=="恋愛"){
        return 1
    }
    else if(genre=="ファンタジー"){
        return 2
    }
    else if(genre=="文芸"){
        return 3
    }
    else if(genre=="SF"){
        return 4
    }
    else if(genre=="その他"){
        return 99
    }
    else if(genre=="ノンジャンル"){
        return 98
    }
    else{
        return null
    }
}

/**
 * 小説ジャンル
 * @param genre - ジャンル番号
 * @returns ジャンル名
*/
export function getGenre(genre:number): string
export function getGenre(genre:number|any): string{
    if(genre==101){
        return "異世界〔恋愛〕"
    }
    else if(genre==102){
        return "現実世界〔恋愛〕"
    }
    else if(genre==201){
        return "ハイファンタジー〔ファンタジー〕"
    }
    else if(genre==202){
        return "ローファンタジー〔ファンタジー〕"
    }
    else if(genre==301){
        return "純文学〔文芸〕"
    }
    else if(genre==302){
        return "ヒューマンドラマ〔文芸〕"
    }
    else if(genre==303){
        return "歴史〔文芸〕"
    }
    else if(genre==304){
        return "推理〔文芸〕"
    }
    else if(genre==305){
        return "ホラー〔文芸〕"
    }
    else if(genre==306){
        return "アクション〔文芸〕"
    }
    else if(genre==307){
        return "コメディー〔文芸〕"
    }
    else if(genre==401){
        return "VRゲーム〔SF〕"
    }
    else if(genre==402){
        return "宇宙〔SF〕"
    }
    else if(genre==403){
        return "空想科学〔SF〕"
    }
    else if(genre==404){
        return "パニック〔SF〕"
    }
    else if(genre==9901){
        return "童話〔その他〕"
    }
    else if(genre==9902){
        return "詩〔その他〕"
    }
    else if(genre==9903){
        return "エッセイ〔その他〕"
    }
    else if(genre==9904){
        return "リプレイ〔その他〕"
    }
    else if(genre==9999){
        return "その他〔その他〕"
    }
    else if(genre==9801){
        return "ノンジャンル〔ノンジャンル〕"
    }
    else{
        return ""
    }
}

/**
 * 小説ジャンル番号
 * @param genre - ジャンル名
 * @returns ジャンル番号
*/
export function getGenreNumber(genre:string):number|null
export function getGenreNumber(genre:string|any):number|null{
    if(genre=="異世界〔恋愛〕"){
        return 101
    }
    else if(genre=="現実世界〔恋愛〕"){
        return 102
    }
    else if(genre=="ハイファンタジー〔ファンタジー〕"){
        return 201
    }
    else if(genre=="ローファンタジー〔ファンタジー〕"){
        return 202
    }
    else if(genre=="純文学〔文芸〕"){
        return 301
    }
    else if(genre=="ヒューマンドラマ〔文芸〕"){
        return 302
    }
    else if(genre=="歴史〔文芸〕"){
        return 303
    }
    else if(genre=="推理〔文芸〕"){
        return 304
    }
    else if(genre=="ホラー〔文芸〕"){
        return 305
    }
    else if(genre=="アクション〔文芸〕"){
        return 306
    }
    else if(genre=="コメディー〔文芸〕"){
        return 307
    }
    else if(genre=="VRゲーム〔SF〕"){
        return 401
    }
    else if(genre=="宇宙〔SF〕"){
        return 402
    }
    else if(genre=="空想科学〔SF〕"){
        return 403
    }
    else if(genre=="パニック〔SF〕"){
        return 404
    }
    else if(genre=="童話〔その他〕"){
        return 9901
    }
    else if(genre=="詩〔その他〕"){
        return 9902
    }
    else if(genre=="エッセイ〔その他〕"){
        return 9903
    }
    else if(genre=="リプレイ〔その他〕"){
        return 9904
    }
    else if(genre=="その他〔その他〕"){
        return 9999
    }
    else if(genre=="ノンジャンル〔ノンジャンル〕"){
        return 9801
    }
    else{
        return null
    }
}

/**
 * 小説タイプ（連載/短編）
 * @param type - 1:連載 / 2:短編
 * @returns 小説タイプ
*/
export function getNovelType(type:Number): string
export function getNovelType(type:Number|any): string{
    if(type==1){
        return "連載"
    }
    else if(type==2){
        return "短編"
    }else{
        return ""
    }
}

/**
 * 小説の完結情報
 * @param state - 0:完結 / 1:連載中
 * @returns 小説タイプ
*/
export function getNovelEnd(state:Number): string
export function getNovelEnd(state:Number|any): string{
    if(state==0){
        return "完結"
    }
    else if(state==1){
        return "連載中"
    }else{
        return ""
    }
}

/**
 * R18小説の掲載サイト名
 * @param genre - 1:ノクターン / 2:ムーンライト / 3:ムーンライト（BL） / 4:ミッドナイト
 * @returns サイト名
*/
export function getNocgenre(genre:Number): string
export function getNocgenre(genre:Number|any): string{
    if(genre==1){
        return "ノクターンノベルズ(男性向け)"
    }
    else if(genre==2){
        return "ムーンライトノベルズ(女性向け)"
    }
    else if(genre==3){
        return "ムーンライトノベルズ(BL)"
    }
    else if(genre==4){
        return "ミッドナイトノベルズ(大人向け)"
    }
    else{
        return ""
    }
}