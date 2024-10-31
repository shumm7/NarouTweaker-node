import $ from 'jquery';

import { __nt_runtime__ } from "./process"
import { __nt_text__ } from "./utils"


function strOrUndefined(v: any): string|undefined{
    if(typeof v === "string"){
        return __nt_text__.escapeHtml(v)
    }
}
function numOrUndefined(v: any): number|undefined{
    if(typeof v === "number"){
        return v
    }
}

function strOrNullOrUndefined(v: any): string|null|undefined{
    if(typeof v === "string"){
        return __nt_text__.escapeHtml(v)
    }else if(v === null){
        return v
    }
}

export namespace __nt_api__ {
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
        else if(url.hostname == "syosetu.com"){
            if(url.pathname.match(/^\/user\/top\/*/)){
                return false
            }else if(url.pathname.match(/^\/xuser\/top\/*/)){
                return true
            }

        }
    }

    /**
     * 小説のエピソード番号を取得
     * @param {string|URL|Location} _url ページのURL
     * @returns {number} エピソード番号（判定できない場合は0を出力）
     */
    export function episode(_url?:string|URL|Location): number{
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
     * 小説家になろうグループサイトのページ種別を判定します
     * @param {string|URL|Location} _url  ページのURL
     * @returns {string|undefined} 種類
     */
    export function pageType(_url?:string|URL|Location): string|undefined{
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
                return "impression"
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



    export namespace novel {
        /************************************************************************************* */
        /*                                 なろう小説API                                        */
        /************************************************************************************* */
        export interface data {
            [key: string]: any

            title: string|undefined
            ncode: string|undefined
            userid: number|undefined
            writer: string|undefined
            story: string|undefined
            nocgenre: number|undefined
            biggenre: number|undefined
            genre: number|undefined
            gensaku: string|undefined
            keyword: string|undefined
            general_firstup: string|undefined
            general_lastup: string|undefined
            novel_type: number|undefined
            end: number|undefined
            general_all_no: number|undefined
            length: number|undefined
            time: number|undefined
            isstop: number|undefined
            isr15: number|undefined
            isbl: number|undefined
            isgl: number|undefined
            iszankoku: number|undefined
            istensei: number|undefined
            istenni: number|undefined
            global_point: number|undefined
            daily_point: number|undefined
            weekly_point: number|undefined
            monthly_point: number|undefined
            quarter_point: number|undefined
            yearly_point: number|undefined
            fav_novel_cnt: number|undefined
            impression_cnt: number|undefined
            review_cnt: number|undefined
            all_point: number|undefined
            all_hyoka_cnt: number|undefined
            sasie_cnt: number|undefined
            kaiwaritu: number|undefined
            novelupdated_at: string|undefined
            updated_at: string|undefined
            weekly_unique: number|undefined
        }

        /**
         * なろう小説APIからデータを取得する
         * @param _ncode Nコード
         * @param isR18 R18かどうか 
         * @param callback 
         * @returns 
         */
        export async function fetch(_ncode?: ncode|string, isR18: boolean = false): Promise<__nt_api__.novel.data|void>{
            const n = new ncode(_ncode).ncode()
            
            if(n){
                let url
                if(isR18){
                    url = `https://api.syosetu.com/novel18api/api/?out=json&libtype=2&opt=weekly&ncode=${n}`
                }else{
                    url = `https://api.syosetu.com/novelapi/api/?out=json&libtype=2&opt=weekly&ncode=${n}`
                }
            
                const response = await __nt_runtime__.action({action: "fetch", format: "json", data: {url: url, options: {'method': 'GET'}}}).catch()
                if(response?.success && response?.action=="fetch" && response?.result[0]?.allcount === 1){
                    const n = response.result[1]

                    var api: __nt_api__.novel.data = {
                        title: strOrUndefined(n?.title),
                        ncode: strOrUndefined(n?.ncode),
                        userid: numOrUndefined(n?.userid),
                        writer: strOrUndefined(n?.writer),
                        story: strOrUndefined(n?.story),
                        nocgenre: numOrUndefined(n?.nocgenre),
                        biggenre: numOrUndefined(n?.biggenre),
                        genre: numOrUndefined(n?.genre),
                        gensaku: strOrUndefined(n?.gensaku),
                        keyword: strOrUndefined(n?.keyword),
                        general_firstup: strOrUndefined(n?.general_firstup),
                        general_lastup: strOrUndefined(n?.general_lastup),
                        novel_type: numOrUndefined(n?.novel_type),
                        end: numOrUndefined(n?.end),
                        general_all_no: numOrUndefined(n?.general_all_no),
                        length: numOrUndefined(n?.length),
                        time: numOrUndefined(n?.time),
                        isstop: numOrUndefined(n?.isstop),
                        isr15: numOrUndefined(n?.isr15),
                        isbl: numOrUndefined(n?.isbl),
                        isgl: numOrUndefined(n?.isgl), 
                        iszankoku: numOrUndefined(n?.iszankoku), 
                        istensei: numOrUndefined(n?.istensei), 
                        istenni: numOrUndefined(n?.istenni), 
                        global_point: numOrUndefined(n?.global_point),
                        daily_point: numOrUndefined(n?.daily_point),
                        weekly_point: numOrUndefined(n?.weekly_point),
                        monthly_point: numOrUndefined(n?.monthly_point),
                        quarter_point: numOrUndefined(n?.quarter_point),
                        yearly_point: numOrUndefined(n?.yearly_point),
                        fav_novel_cnt: numOrUndefined(n?.fav_novel_cnt),
                        impression_cnt: numOrUndefined(n?.impression_cnt),
                        review_cnt: numOrUndefined(n?.review_cnt),
                        all_point: numOrUndefined(n?.all_point),
                        all_hyoka_cnt: numOrUndefined(n?.all_hyoka_cnt),
                        sasie_cnt: numOrUndefined(n?.sasie_cnt),
                        kaiwaritu: numOrUndefined(n?.kaiwaritu),
                        novelupdated_at: strOrUndefined(n?.novelupdated_at),
                        updated_at: strOrUndefined(n?.updated_at),
                        weekly_unique: numOrUndefined(n?.weekly_unique)
                    }
                    return api
                }
            }
        }

        /**
         * 小説大ジャンル
         * @param genre - 大ジャンル番号
         * @returns 大ジャンル名
        */
        export function bigGenre(genre?:number): string{
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
        export function bigGenreNumber(genre?:string): number|null{
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
        export function genre(genre?:number): string{
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
        export function genreNumber(genre?:string):number|null{
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
        export function novelType(type?:Number): string{
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
        export function novelEnd(state?:Number|boolean): string{
            if(state==0 || state==false){
                return "完結"
            }
            else if(state==1 || state==true){
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
        export function nocgenre(genre?:Number): string{
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
    }
    
    export namespace rankin {
        /************************************************************************************* */
        /*                                 なろう殿堂入りAPI                                    */
        /************************************************************************************* */

        export interface data{
            [key: string]: any

            pt: number|undefined,
            rank: number|undefined,
            rtype: string|undefined
        }
        /**
         * なろう殿堂入りAPIからデータを取得する
         * @param _ncode Nコード
         * @returns 
         */
        export async function fetch(_ncode?: ncode|string): Promise<Array<__nt_api__.rankin.data>> {
            const n = new ncode(_ncode).ncode()
            if(n!==undefined){
                const url = "https://api.syosetu.com/rank/rankin/?out=json&libtype=2&ncode=" + n

                const response = await __nt_runtime__.action({action: "fetch", format: "json", data: {url: url, options: {'method': 'GET'}}}).catch()
                var ret: Array<__nt_api__.rankin.data> = []
                if(response?.success && response?.action=="fetch"){
                    if(Array.isArray(response.result)){
                        for(const n of response.result){
                            var rankin: __nt_api__.rankin.data = {
                                pt: numOrUndefined(n?.pt),
                                rank: numOrUndefined(n?.rank),
                                rtype: strOrUndefined(n?.rtype)
                            }
                            ret.push(rankin)
                        }
                    }
                }
            }
            return []
        }
    }

    export namespace user {
        /************************************************************************************* */
        /*                                 なろうユーザ検索API                                  */
        /************************************************************************************* */
        export interface data {
            [key: string]: any
            
            userid: number|undefined
            name: string|undefined
            yomikata: string|undefined
            name1st: string|null|undefined
            novel_cnt: number|undefined
            review_cnt: number|undefined
            novel_length: number|undefined
            sum_global_point: number|undefined
        }

        /**
         * なろうユーザ検索APIからデータを取得する
         * @param userid ユーザID
         * @returns 
         */
        export async function fetch(userid: number|string): Promise<__nt_api__.user.data|void>{
            const url = `https://api.syosetu.com/userapi/api/?out=json&libtype=2&userid=${userid}`
            
            const response = await __nt_runtime__.action({action: "fetch", format: "json", data: {url: url, options: {'method': 'GET'}}})
            if(response?.success && response?.action=="fetch" && response?.result[0]?.allcount === 1){
                const n = response.result[1]

                var api: __nt_api__.user.data = {
                    userid: numOrUndefined(n?.userid),
                    name: strOrUndefined(n?.name),
                    yomikata: strOrUndefined(n?.yomikata),
                    name1st: strOrNullOrUndefined(n?.name1st),
                    novel_cnt: numOrUndefined(n?.novel_cnt),
                    review_cnt: numOrUndefined(n?.review_cnt),
                    novel_length: numOrUndefined(n?.novel_length),
                    sum_global_point: numOrUndefined(n?.sum_global_point),
                }
                return api
            }
        }

        /**
         * 作者のユーザIDを取得
         * @param {string|URL|Location} _url ページのURL
         * @returns {string} - ユーザID
         */
        export function getFromURL(_url?:string|URL|Location): string|undefined{
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
        
    }

    export namespace search {
        /**
         * 小説タグから検索URLを取得する
         * @param {string|Array<string>} tag 
         * @param {string|number} site - 数値または文字列で対象のサイトを指定。未指定や不正な値の場合は、小説家になろう（全年齢）になる（1:ノクターン 2:ムーンライト 3:ムーンライト（BL） 4:ミッドナイト）
         * @param param 
         * @returns 
         */
        export function novelTagURL(tag: string|Array<string>, site?: string|number, param?: {[key: string]: any}){
            if(param===undefined){
                param = {}
            }
            if(Array.isArray(tag) && tag.length>0){
                param.word = tag.map((v)=>escape(v)).join("+")
            }else if(typeof tag === "string"){
                param.word = tag.split(" ").map((v)=>escape(v)).join("+")
            }
            param.keyword = 1

            return novelSearchURL(site, param)
        }

        /**
         * 小説家になろうの検索結果URLを取得する
         * @param {string|number} site - 数値または文字列で対象のサイトを指定。未指定や不正な値の場合は、小説家になろう（全年齢）になる（1:ノクターン 2:ムーンライト 3:ムーンライト（BL） 4:ミッドナイト）
         * @param param - 検索パラメータ（辞書型オブジェクト）
         * @returns URL
         */
        export function novelSearchURL(site?: string|number, param?: {[key: string]: any}){
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
    }

    export namespace episodes {
        export interface data {
            novel: __nt_api__.novel.data
            episodes: Array<episode>
            chapters: Array<chapter>
        }

        export interface episode {
            episode: number
            subtitle: string
            date: string
            updateDate?: string
            chapterTitle?: string
            chapter: number
        }

        export interface chapter {
            title: string
            chapter: number
            firstEpisode: number
        }

        export async function fetch(_ncode?: ncode|string, isR18: boolean = false): Promise<data|void>{
            const parentClass = "p-eplist"
            const episodeClass = "p-eplist__sublist"
            const chapterClass = "p-eplist__chapter-title"
            const episodeSubtitleClass = "p-eplist__subtitle"
            const episodeUpdateClass = "p-eplist__update"
            const episodeFavepClass = "p-eplist__favep"

            const novelData = await __nt_api__.novel.fetch(_ncode, isR18)
            const general_all_no = novelData?.general_all_no
            const novel_type = novelData?.novel_type
            const ncode = new __nt_api__.ncode(novelData?.ncode).ncode()

            if(novelData!==undefined && general_all_no!==undefined && novel_type===1 && ncode!==undefined){

                var fetches: Array<Promise<Array<episode>>> = []
                for(var i=1; i<=Math.ceil(general_all_no/100); i++){
                    let url
                    if(isR18){
                        url = `https://ncode.syosetu.com/${ncode}/?p=${i}`
                    }else{
                        url = `https://novel18.syosetu.com/${ncode}/?p=${i}`
                    }
                    fetches.push(fetchEach(url))
                }
                if(fetches.length > 0){
                    let chapters: Array<chapter> = []
                    let chapter: number = 0
                    let response = (await Promise.all(fetches)).flat(1)
                    for(let i=0; i<response.length; i++){
                        response[i].episode = i + 1
                        const chapterTitle = response[i].chapterTitle
                        if(chapterTitle!==undefined){
                            chapter++
                            chapters.push({
                                title: chapterTitle,
                                chapter: chapter,
                                firstEpisode: i + 1
                            })
                        }
                        response[i].chapter = chapter
                    }
                    return {
                        novel: novelData,
                        episodes: response,
                        chapters: chapters
                    }
                }

            }

            if(novelData!==undefined){
                return {
                    novel: novelData,
                    episodes: [],
                    chapters: []
                }
            }

            async function fetchEach(url: string): Promise<Array<episode>>{
                try{
                    let ret: Array<episode> = []
                    const response = await __nt_runtime__.action({action: "fetch", format: "text", data: {url: url, options: {'method': 'GET'}}})
                    if(response?.success){
                        const html = response.result
                        if(typeof html !== "string"){return []}

                        var elm = $($.parseHTML(html)).find(`.${parentClass}`)
                        if(!elm.length){return []}

                        var episodeData: episode = {
                            episode: 0,
                            subtitle: "",
                            date: "",
                            chapter: 0
                        }
                        elm.find(`.${chapterClass}, .${episodeClass}`).each(function(){
                            var ep = $(this)
                            if(ep.hasClass(chapterClass)){
                                // chapter title
                                episodeData.chapterTitle = ep.text()
                            }else if(ep.hasClass(episodeClass)){
                                // subtitle
                                episodeData.subtitle = ep.find(`.${episodeSubtitleClass}`).text()

                                // date / updateDate
                                var dateElm = ep.find(`.${episodeUpdateClass}`)
                                dateElm.find(`.${episodeFavepClass}`).remove()
                                var update = dateElm.find(`*[title$="改稿"]`)
                                if(update.length){
                                    var updateDate = update.attr("title") ?? ""
                                    var m = updateDate.match(/^(.*) 改稿$/)
                                    if(m!==null){
                                        episodeData.updateDate = m[1]
                                    }
                                    update.remove()
                                }
                                episodeData.date = dateElm.text()

                                // push
                                ret.push(episodeData)
                                episodeData = {
                                    episode: 0,
                                    subtitle: "",
                                    date: "",
                                    chapter: 0
                                }
                            }
                        })
                    }
                    return ret
                }catch(e){}
                return []
            }
        }
    }

    /**
     * Nコード
     */
    
    export class ncode {

        private value: string | undefined;
        [Symbol.toStringTag] = "ncode"

        /**
         * @param ncode - Nコード文字列、または、インデックス
        */
        constructor(_ncode?: string | number | ncode) {
            if (typeof _ncode === "string") {
                if (_ncode.trim().match(/^[n|N]\d+[a-zA-Z]+$/)) {
                    this.value = _ncode.toLowerCase()
                }
            } else if (typeof _ncode === "number") {
                const lo = (_ncode - 1) % 9999 + 1;
                const hi = ((_ncode - 1) / 9999) | 0;
                let lostr = lo.toString();
                while (lostr.length < 4) lostr = `0${lostr}`;
                this.value = `n${lostr}${this.stringifyBase26(hi)}`;

            } else if (_ncode instanceof ncode) {
                this.value = _ncode.ncode()
            }
        }

        /**
         * NコードからNコードインデックスを取得
         * @param ncode - Nコード
         * @returns Nコードインデックス
        */
        index = (): number | undefined => {
            var str: string | undefined = this.value

            if (str !== undefined) {
                const match = this.ncode_re.exec(str)
                if (!match) {
                    return
                }
                const lo = parseInt(match[1], 10)
                const hi = this.parseBase26(match[2])
                return hi * 9999 + lo
            }
        }

        /**
         * Nコードを取得
         * @returns {string|undefined} - Nコード
         * 
         * Nコードを設定
         * @param {string|number|Ncode} ncode - 設定するNコード（またはNコードインデックス）
         * 
        */
        ncode = (_ncode?: string | number | ncode): string | undefined => {
            if (_ncode === undefined) {
                return this.value
            } else {
                this.value = new ncode(_ncode).ncode()
            }
        }

        /**
         * Returns a string of a N-code.
        */
        toString = (): string => {
            if (this.value === undefined) {
                return ""
            } else {
                return this.value
            }
        }

        toJSON = () => {
            return this.ncode()
        }

        /* Ncode Parse */
        /* https://zenn.dev/qnighy/articles/5faa90ddfef843 */
        /* By Masaki Hara (2021/07/17)*/
        private readonly ncode_re = /^[n|N](\d+)([a-zA-Z]+)$/i
        private parseBase26(s: string) {
            const sl = s.toLowerCase();
            let ret = 0;
            for (let i = 0; i < sl.length; i++) {
                ret = ret * 26 + (sl.charCodeAt(i) - 0x61);
            }
            return ret;
        }

        private stringifyBase26(n: number) {
            if (n === 0) return "a";
            const digits: Array<number> = [];
            let m = n;
            while (m > 0) {
                digits.push(m % 26 + 0x61);
                m = (m / 26) | 0;
            }
            digits.reverse();
            return String.fromCharCode(...digits);
        }

        /**
         * 小説家になろうグループサイトのURLからNコードを取得
         * @param {string|URL|Location} _url ページのURL
         * @returns {ncode} Nコード
         */
        static getFromURL(_url?: string | URL | Location): ncode | undefined {
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

            if (url.hostname == "ncode.syosetu.com" || url.hostname == "novel18.syosetu.com") {
                var m: RegExpMatchArray | null = null
                if (url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/\d+\/*$/)) { /* Story */
                    m = url.pathname.match(/^\/([n|N]\d+[a-zA-Z]+)\/\d+\/*$/)
                }
                else if (url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/*$/)) { /* Top */
                    m = url.pathname.match(/^\/([n|N]\d+[a-zA-Z]+)\/*$/)
                }
                else if (url.pathname.match(/\/novelview\/infotop\/ncode\/[n|N]\d+[a-zA-Z]+\/*/)) { /* Novel Info */
                    m = url.pathname.match(/\/novelview\/infotop\/ncode\/([n|N]\d+[a-zA-Z]+)\/*/)
                }
                else if (url.pathname.match(/^\/novelpdf\/creatingpdf\/ncode\/[n|N]\d+[a-zA-Z]+\/*$/)) { /* PDF */
                    m = url.pathname.match(/^\/novelpdf\/creatingpdf\/ncode\/([n|N]\d+[a-zA-Z]+)\/*$/)
                }
                else if (url.pathname.match(/^\/txtdownload\/top\/ncode\/[n|N]\d+[a-zA-Z]+\/*$/)) { /* TXT */
                    m = url.pathname.match(/^\/txtdownload\/top\/ncode\/([n|N]\d+[a-zA-Z]+)\/*$/)
                }

                if (m !== null) {
                    return new ncode(m[1])
                }
            } else if (url.hostname == "novelcom.syosetu.com" || url.hostname == "novelcom18.syosetu.com") {
                var m: RegExpMatchArray | null = null
                if (url.pathname.match(/^\/impression\/list\/ncode\/\d+\/*.*$/)) { /* Impression */
                    m = url.pathname.match(/^\/impression\/list\/ncode\/(\d+)\/*.*$/)
                }
                else if (url.pathname.match(/^\/impressionres\/.*\/ncode\/(\d+)\/*.*$/)) { /* Impression Res */
                    m = url.pathname.match(/^\/impressionres\/.*\/ncode\/(\d+)\/*.*$/)
                }
                else if (url.pathname.match(/^\/novelreview\/list\/ncode\/(\d+)\/*.*$/)) { /* Review */
                    m = url.pathname.match(/^\/novelreview\/list\/ncode\/(\d+)\/*.*$/)
                }
                else if (url.pathname.match(/^\/novelreport\/input\/ncode\/(\d+)\/*.*$/)) { /* Review */
                    m = url.pathname.match(/^\/novelreport\/input\/ncode\/(\d+)\/*.*$/)
                }

                if (m !== null) {
                    return new ncode(Number(m[1]))
                }
            } else if (url.hostname == "syosetu.com") {
                var m: RegExpMatchArray | null = null
                if (url.pathname.match(/^\/draftepisode\/input\/ncode\/\d+\/*/)) {
                    m = url.pathname.match(/^\/draftepisode\/input\/ncode\/(\d+)\/*/)
                }
                else if (url.pathname.match(/^\/usernoveldatamanage\/.*\/ncode\/\d+\/*.*$/)) {
                    m = url.pathname?.match(/^\/usernoveldatamanage\/updateinput\/ncode\/(\d+)\/*.*$/)
                }

                if (m !== null) {
                    return new ncode(Number(m[1]))
                }
            } else if (url.hostname == "kasasagi.hinaproject.com") {
                var m: RegExpMatchArray | null = null
                if (url.pathname.match(/^\/access\/.*\/ncode\/[n|N]\d+[a-zA-Z]+\/*/)) {
                    m = url.pathname.match(/^\/access\/.*\/ncode\/([n|N]\d+[a-zA-Z]+)\/*/)
                }

                if (m !== null) {
                    return new ncode(m[1])
                }
            }
            return new ncode()
        }
    }

    /**
     * Sコード
     */
    export class scode {
        private value: string | undefined;
        [Symbol.toStringTag] = "scode"

        constructor(_scode?: string | scode) {
            if (typeof _scode === "string") {
                if (_scode.trim().match(/^[s|S]\d+[a-zA-Z]+$/)) {
                    this.value = _scode.toLowerCase()
                }
            } else if (_scode instanceof scode) {
                this.value = _scode.scode()
            }
        }

        /**
         * Sコードを取得
         * @returns {string|undefined} - Sコード
         * 
         * Sコードを設定
         * @param {string|Scode} scode - 設定するSコード
         * 
        */
        scode = (_scode?: string | scode): string | undefined => {
            if (_scode === undefined) {
                return this.value
            } else {
                this.value = new scode(_scode).scode()
            }
        }

        protected toJSON = () => {
            return this.scode()
        }

        /**
         * Returns a string of a S-code.
        */
        toString = (): string => {
            if (this.value === undefined) {
                return ""
            } else {
                return this.value
            }
        }

        /**
         * 小説家になろうグループサイトのURLからSコードを取得
         * @param {string|URL|Location} _url ページのURL
         * @returns {scode} Sコード
         */
        static getFromURL(_url?: string | URL | Location): scode | undefined {
            let url: URL
            if (typeof _url === "string") {
                try {
                    url = new URL(_url)
                } catch (e) {
                    return
                }
            } else if (_url instanceof URL) {
                url = _url
            } else if (_url instanceof Location) {
                url = new URL(_url.toString())
            } else {
                url = new URL(location.toString())
            }
        
            if (url.hostname == "ncode.syosetu.com" || url.hostname == "novel18.syosetu.com") {
                if (url.pathname.match(/^\/[s|S]\d{4}[a-zA-Z]{1,}\/\d+\/*$/)) {
                    return new scode((url.pathname.match(/^\/([s|S]\d{4}[a-zA-Z]{1,})\/\d+\/*$/) ?? "")[1].toLowerCase())
                }
            }
            return new scode
        }
    }

    /**
     * Iコード
     */
    export class icode {
        private value: string | undefined;
        private key: string | undefined;
        [Symbol.toStringTag] = "icode"

        constructor(_icode?: string | icode | number, userid?: string | number) {
            if (typeof _icode === "string" || typeof _icode === "number" || _icode === undefined) {
                if (typeof _icode === "number") {
                    if (!isNaN(_icode) && _icode >= 0) {
                        this.value = "i" + _icode.toString()
                    }
                } else if (typeof _icode === "string") {
                    if (_icode.trim().match(/^[i|I]\d+$/)) {
                        this.value = _icode.toLowerCase()
                    } else if (_icode.trim().match(/^<(i\d+)\|(\d+)>$/)) {
                        var m = _icode.trim().match(/^<(i\d+)\|(\d+)>$/)
                        if (m !== null) {
                            this.value = m[1].toLowerCase()
                            this.key = m[2].toLowerCase()
                            return
                        }
                    }
                }

                if (typeof userid === "number") {
                    if (!isNaN(userid) && userid >= 0) {
                        this.key = userid.toString()
                    }
                } else if (typeof userid === "string") {
                    if (userid.trim().match(/^\d+$/)) {
                        this.key = userid
                    }
                }
            } else if (_icode instanceof icode) {
                var dict: Record<string, string | undefined> = _icode.get()
                this.value = dict.icode
                this.key = dict.userid
            }
        }

        get = (): Record<string, string | undefined> => {
            return { icode: this.value, userid: this.key }
        }

        icode = (_icode?: string | icode | number): string | undefined => {
            if (_icode === undefined) {
                return this.value
            } else {
                this.value = new icode(_icode).icode()
            }
        }

        userid = (userid?: string | number): string | undefined => {
            if (userid === undefined) {
                return this.value
            } else {
                this.key = new icode(undefined, userid).userid()
            }
        }

        sasieTag = (): string | undefined => {
            if (this.value !== undefined && this.userid !== undefined) {
                return `<i${this.value}|${this.key}>`
            }
        }

        url = (): string | undefined => {
            if (this.value !== undefined && this.userid !== undefined) {
                return `https://${this.key}.mitemin.net/${this.value}/`
            }
        }

        protected toJSON = () => {
            return this.get()
        }


        static getFromURL(_url?: string | URL | Location): icode | undefined {
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

            var _icode: string | undefined
            var _userid: string | undefined
            if (url.protocol == "https:" || url.protocol == "http:") {
                if (url.host.match(/^[0-9]+\.mitemin\.net$/)) {
                    var m = url.host.match(/^([0-9]+)\.mitemin\.net$/)
                    if (m !== null) {
                        _userid = m[1]
                        if (url.pathname.match(/^\/i[0-9]+\/*$/)) {
                            var n = url.pathname.match(/^\/(i[0-9]+)\/*$/)
                            if (n !== null) {
                                _icode = n[1]
                            }
                        }
                    }

                } else if (url.host.match(/^trackback\.mitemin\.net$/) && url.pathname.match(/^\/send\/image\/icode\/[0-9]+\/*$/)) {
                    var m = url.pathname.match(/^\/send\/image\/icode\/([0-9]+)\/*$/)
                    if (m !== null) {
                        _icode = "i" + m[1]
                    }
                }
            }

            if (_icode !== undefined || _userid !== undefined) {
                return new icode(_icode, _userid)
            }
        }
    }
}