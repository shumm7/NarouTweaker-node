/**
 * Nコード
 * @param ncode - Nコードを取得・設定
 * @param index - Nコードインデックスを取得
 */
export class Ncode{

    private value: string|undefined;
    [Symbol.toStringTag] = "Ncode"

    /**
     * @param ncode - Nコード文字列、または、インデックス
    */
    constructor(ncode?: string|number|Ncode){
        if(typeof ncode === "string"){
            if(ncode.trim().match(/^[n|N]\d+[a-zA-Z]+$/)){
                this.value = ncode.toLowerCase()
            }
        }else if(typeof ncode === "number"){
            const lo = (ncode - 1) % 9999 + 1;
            const hi = ((ncode - 1) / 9999) | 0;
            let lostr = lo.toString();
            while (lostr.length < 4) lostr = `0${lostr}`;
            this.value = `n${lostr}${this.stringifyBase26(hi)}`;

        }else if(ncode instanceof Ncode){
            this.value = ncode.ncode()
        }
    }

    /**
     * NコードからNコードインデックスを取得
     * @param ncode - Nコード
     * @returns Nコードインデックス
    */
    index = (): number|undefined => {
        var str: string|undefined = this.value

        if(str !== undefined){
            const match = this.ncode_re.exec(str)
            if (!match){
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
    ncode = (ncode?: string|number|Ncode): string|undefined => {
        if(ncode===undefined){
            return this.value
        }else{
            this.value = new Ncode(ncode).ncode()
        }
    }

    /**
     * Returns a string of a N-code.
    */
    toString = (): string => {
        if(this.value===undefined){
            return ""
        }else{
            return this.value
        }
    }

    /* Ncode Parse */
    /* https://zenn.dev/qnighy/articles/5faa90ddfef843 */
    /* By Masaki Hara (2021/07/17)*/
    private readonly ncode_re = /^[n|N](\d+)([a-zA-Z]+)$/i
    private parseBase26(s:string) {
        const sl = s.toLowerCase();
        let ret = 0;
        for (let i = 0; i < sl.length; i++) {
            ret = ret * 26 + (sl.charCodeAt(i) - 0x61);
        }
        return ret;
    }
    
    private stringifyBase26(n:number) {
        if (n === 0) return "a";
        const digits:Array<number> = [];
        let m = n;
        while (m > 0) {
            digits.push(m % 26 + 0x61);
            m = (m / 26) | 0;
        }
        digits.reverse();
        return String.fromCharCode(...digits);
    }
} 

/**
 * Sコード
 * @param scode - Sコードを取得・設定
 */
export class Scode{
    private value: string|undefined;
    [Symbol.toStringTag] = "Scode"

    constructor(scode?: string|Scode){
        if(typeof scode === "string"){
            if(scode.trim().match(/^[s|S]\d+[a-zA-Z]+$/)){
                this.value = scode.toLowerCase()
            }
        }else if(scode instanceof Scode){
            this.value = scode.scode()
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
    scode = (scode?: string|Scode): string|undefined => {
        if(scode===undefined){
            return this.value
        }else{
            this.value = new Scode(scode).scode()
        }
    }

    /**
     * Returns a string of a S-code.
    */
    toString = (): string => {
        if(this.value===undefined){
            return ""
        }else{
            return this.value
        }
    }
}

/**
 * 小説家になろうグループサイトのURLからNコードを取得
 * @param {string|URL|Location} _url ページのURL
 * @returns {Scode} Nコード
 */
export function getNcodeFromURL(_url?:string|URL|Location): Ncode|undefined{
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
        url = new URL(window.location.toString())
    }

    if(url.hostname=="ncode.syosetu.com" || url.hostname=="novel18.syosetu.com"){
        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/\d+\/*$/)){ /* Story */
            m = url.pathname.match(/^\/([n|N]\d+[a-zA-Z]+)\/\d+\/*$/)
        }
        else if (url.pathname.match(/^\/[n|N]\d+[a-zA-Z]+\/*$/)){ /* Top */
            m = url.pathname.match(/^\/([n|N]\d+[a-zA-Z]+)\/*$/)
        }
        else if (url.pathname.match(/\/novelview\/infotop\/ncode\/[n|N]\d+[a-zA-Z]+\/*/)){ /* Novel Info */
            m = url.pathname.match(/\/novelview\/infotop\/ncode\/([n|N]\d+[a-zA-Z]+)\/*/)
        }
        else if(url.pathname.match(/^\/novelpdf\/creatingpdf\/ncode\/[n|N]\d+[a-zA-Z]+\/*$/)){ /* PDF */
            m = url.pathname.match(/^\/novelpdf\/creatingpdf\/ncode\/([n|N]\d+[a-zA-Z]+)\/*$/)
        }
        else if(url.pathname.match(/^\/txtdownload\/top\/ncode\/[n|N]\d+[a-zA-Z]+\/*$/)){ /* TXT */
            m = url.pathname.match(/^\/txtdownload\/top\/ncode\/([n|N]\d+[a-zA-Z]+)\/*$/)
        }
        
        if(m!==null){
            return new Ncode(m[1])
        }
    }else if(url.hostname=="novelcom.syosetu.com" || url.hostname == "novelcom18.syosetu.com"){
        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/impression\/list\/ncode\/\d+\/*.*$/)){ /* Impression */
            m = url.pathname.match(/^\/impression\/list\/ncode\/(\d+)\/*.*$/)
        }
        else if (url.pathname.match(/^\/impressionres\/.*\/ncode\/(\d+)\/*.*$/)){ /* Impression Res */
            m = url.pathname.match(/^\/impressionres\/.*\/ncode\/(\d+)\/*.*$/)
        }
        else if (url.pathname.match(/^\/novelreview\/list\/ncode\/(\d+)\/*.*$/)){ /* Review */
            m = url.pathname.match(/^\/novelreview\/list\/ncode\/(\d+)\/*.*$/)
        }
        else if (url.pathname.match(/^\/novelreport\/input\/ncode\/(\d+)\/*.*$/)){ /* Review */
            m = url.pathname.match(/^\/novelreport\/input\/ncode\/(\d+)\/*.*$/)
        }
        
        if(m!==null){
            return new Ncode(Number(m[1]))
        }
    }else if(url.hostname=="syosetu.com"){
        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/draftepisode\/input\/ncode\/\d+\/*/)){
            m = url.pathname.match(/^\/draftepisode\/input\/ncode\/(\d+)\/*/)
        }
        else if (url.pathname.match(/^\/usernoveldatamanage\/.*\/ncode\/\d+\/*.*$/)){
            m = url.pathname?.match(/^\/usernoveldatamanage\/updateinput\/ncode\/(\d+)\/*.*$/)
        }

        if(m!==null){
            return new Ncode(Number(m[1]))
        }
    }else if(url.hostname=="kasasagi.hinaproject.com"){
        var m: RegExpMatchArray|null = null
        if (url.pathname.match(/^\/access\/.*\/ncode\/[n|N]\d+[a-zA-Z]+\/*/)){
            m = url.pathname.match(/^\/access\/.*\/ncode\/([n|N]\d+[a-zA-Z]+)\/*/)
        }

        if(m!==null){
            return new Ncode(m[1])
        }
    }
    return new Ncode()
}

/**
 * 小説家になろうグループサイトのURLからSコードを取得
 * @param {string|URL|Location} _url ページのURL
 * @returns {Scode} Sコード
 */
export function getScodeFromURL(_url?:string|URL|Location): Scode|undefined{
    let url:URL
    if(typeof _url === "string"){
        try{
            url = new URL(_url)
        }catch(e){
            return
        }
    }else if(_url instanceof URL){
        url = _url
    }else if(_url instanceof Location){
        url = new URL(_url.toString())
    }else{
        url = new URL(location.toString())
    }

    if(url.hostname=="ncode.syosetu.com" || url.hostname=="novel18.syosetu.com"){
        if (url.pathname.match(/^\/[s|S]\d{4}[a-zA-Z]{1,}\/\d+\/*$/)){
            return new Scode((url.pathname.match(/^\/([s|S]\d{4}[a-zA-Z]{1,})\/\d+\/*$/) ?? "")[1].toLowerCase())
        }
    }
    return new Scode
}



/**
 * Iコード
 */
export class Icode{
    private value: string|undefined;
    private key: string|undefined;
    [Symbol.toStringTag] = "Icode"

    constructor(icode?: string|Icode|number, userid?: string|number){
        if(typeof icode === "string" || typeof icode === "number" || icode === undefined){
            if(typeof icode === "number"){
                if(!isNaN(icode) && icode >= 0){
                    this.value = "i" + icode.toString()
                }
            }else if(typeof icode === "string"){
                if(icode.trim().match(/^[i|I]\d+$/)){
                    this.value = icode.toLowerCase()
                }else if(icode.trim().match(/^<(i\d+)\|(\d+)>$/)){
                    var m = icode.trim().match(/^<(i\d+)\|(\d+)>$/)
                    if(m!==null){
                        this.value = m[1].toLowerCase()
                        this.key = m[2].toLowerCase()
                        return
                    }
                }
            }

            if(typeof userid === "number"){
                if(!isNaN(userid) && userid >= 0){
                    this.key = userid.toString()
                }
            }else if(typeof userid === "string"){
                if(userid.trim().match(/^\d+$/)){
                    this.key = userid
                }
            }
        }else if(icode instanceof Icode){
            var dict: Record<string,string|undefined> = icode.get()
            this.value = dict.icode
            this.key = dict.userid
        }
    }

    get = (): Record<string,string|undefined> => {
        return {icode: this.value, userid: this.key}
    }

    icode = (icode?: string|Icode|number):string|undefined => {
        if(icode===undefined){
            return this.value
        }else{
            this.value = new Icode(icode).icode()
        }
    }

    userid = (userid?: string|number):string|undefined => {
        if(userid===undefined){
            return this.value
        }else{
            this.key = new Icode(undefined, userid).userid()
        }
    }

    sasieTag = (): string|undefined => {
        if(this.value!==undefined && this.userid!==undefined){
            return `<i${this.value}|${this.key}>`
        }
    }

    url = (): string|undefined => {
        if(this.value!==undefined && this.userid!==undefined){
            return `https://${this.key}.mitemin.net/${this.value}/`
        }
    }
}


export function getIcodeFromURL(_url?:string|URL|Location): Icode|undefined{
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
        url = new URL(window.location.toString())
    }

    var icode: string|undefined
    var userid: string|undefined
    if(url.protocol=="https:" || url.protocol=="http:"){
        if(url.host.match(/^[0-9]+\.mitemin\.net$/)){
            var m = url.host.match(/^([0-9]+)\.mitemin\.net$/)
            if(m!==null){
                userid = m[1]
                if(url.pathname.match(/^\/i[0-9]+\/*$/)){
                    var n = url.pathname.match(/^\/(i[0-9]+)\/*$/)
                    if(n!==null){
                        icode = n[1]
                    }
                }
            }
            
        }else if(url.host.match(/^trackback\.mitemin\.net$/) && url.pathname.match(/^\/send\/image\/icode\/[0-9]+\/*$/)){
            var m = url.pathname.match(/^\/send\/image\/icode\/([0-9]+)\/*$/)
            if(m!==null){
                icode = "i" + m[1]
            }
        }
    }

    if(icode!==undefined || userid!==undefined){
        return new Icode(icode, userid)
    }
}