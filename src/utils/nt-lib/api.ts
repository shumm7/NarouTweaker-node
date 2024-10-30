import { __nt_runtime__ } from "./process"
import { __nt_text__ } from "./text"


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


        export function fetch(_ncode: ncode|string|undefined, isR18: boolean = false, callback: (data: __nt_api__.novel.data|undefined) => void): void{
            const n = new ncode(_ncode).ncode()
            
            let url
            if(n){
                if(isR18){
                    url = `https://api.syosetu.com/novel18api/api/?out=json&libtype=2&opt=weekly&ncode=${n}`
                }else{
                    url = `https://api.syosetu.com/novelapi/api/?out=json&libtype=2&opt=weekly&ncode=${n}`
                }
            }else{
                callback(undefined)
                return
            }
            
            __nt_runtime__.action({action: "fetch", format: "json", data: {url: url, options: {'method': 'GET'}}}).then(function(response){
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
                    callback(api)
                    return
                }
                callback(undefined)
                return
            })
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

        export function fetch(_ncode: ncode|string, callback: (data: Array<__nt_api__.rankin.data>)=>void):void {
            const n = new ncode(_ncode).ncode()
            if(n!==undefined){
                const url = "https://api.syosetu.com/rank/rankin/?out=json&libtype=2&ncode=" + n
                __nt_runtime__.action({action: "fetch", format: "json", data: {url: url, options: {'method': 'GET'}}}).then(function(response){
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
                        callback(ret)
                        return 
                    }
                    callback([])
                    return 
                })
            }else{
                callback([])
            }
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

        export function fetch(userid: number|string, callback: (data: __nt_api__.user.data|undefined) => void): void{
            const url = `https://api.syosetu.com/userapi/api/?out=json&libtype=2&userid=${userid}`
            
            __nt_runtime__.action({action: "fetch", format: "json", data: {url: url, options: {'method': 'GET'}}}).then(function(response){
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
                    callback(api)
                    return
                }
                callback(undefined)
                return
            })
        }
        
    }

    /**
     * Nコード
     * @param ncode - Nコードを取得・設定
     * @param index - Nコードインデックスを取得
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
     * @param scode - Sコードを取得・設定
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