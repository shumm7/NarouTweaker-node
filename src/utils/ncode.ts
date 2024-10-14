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
            if(ncode.match(/^[n|N]\d{4}[a-zA-Z]+$/)){
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
    public index(ncode: string|number|Ncode|undefined): number|undefined {
        var str: string|undefined
        if(ncode === undefined){
            str = this.value
        }else{
            str = new Ncode(ncode).ncode()
        }

        if(str === undefined){
            return
        }

        const match = this.ncode_re.exec(str)
        if (!match){
            return
        }
        const lo = parseInt(match[1], 10)
        const hi = this.parseBase26(match[2])
        return hi * 9999 + lo
    }

    /**
     * Nコードを取得
     * @returns {string} - 取得したNコード
    */
    public ncode(): string|undefined;

    /**
     * Nコードを設定
     * @param {string|number|Ncode} ncode - 設定するNコード（またはNコードインデックス）
    */
    public ncode(ncode: string|number|Ncode): void;
    public ncode(ncode?: string|number|Ncode): string|void {
        if(ncode===undefined){
            return this.value
        }else{
            this.value = new Ncode(ncode).ncode()
        }
    }

    /**
     * Returns a string of a N-code.
    */
    public toString(): string{
        if(this.value===undefined){
            return ""
        }else{
            return this.value
        }
    }

    /* Ncode Parse */
    /* https://zenn.dev/qnighy/articles/5faa90ddfef843 */
    /* By Masaki Hara (2021/07/17)*/
    private readonly ncode_re = /^[n|N](\d{4})([a-z]+)$/i
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
            if(scode.match(/^[s|S]\d{4}[a-zA-Z]+$/)){
                this.value = scode.toLowerCase()
            }
        }else if(scode instanceof Scode){
            this.value = scode.scode()
        }
    }

    /**
     * Sコードを取得
     * @returns {string} - 取得したSコード
    */
    public scode(): string|undefined;

    /**
     * Sコードを設定
     * @param {string|Scode} scode - 設定するSコード
    */
    public scode(scode: string|Scode): undefined;
    public scode(scode?: string|Scode): string|undefined {
        if(scode===undefined){
            return this.value
        }else{
            this.value = new Scode(scode).scode()
        }
    }

    /**
     * Returns a string of a S-code.
    */
    public toString(): string{
        if(this.value===undefined){
            return ""
        }else{
            return this.value
        }
    }
}


export function getNcodeFromURL(_url:string|URL|Location): Ncode{
    let url:URL
    if(typeof _url === "string"){
        try{
            url = new URL(_url)
        }catch(e){
            return new Ncode()
        }
    }else if(_url instanceof URL){
        url = _url
    }else if(_url instanceof Location){
        url = new URL(_url.toString())
    }else{
        url = new URL(location.toString())
    }

    if(url.hostname=="ncode.syosetu.com" || url.hostname=="novel18.syosetu.com"){
        if (url.pathname.match(/^\/[n|N]\d{4}[a-zA-Z]{2}\/\d+\/*$/)){ /* Story */
            return new Ncode((url.pathname.match(/^\/([n|N]\d{4}[a-zA-Z]{2})\/\d+\/*$/) ?? "")[1].toLowerCase())
        }
        else if (url.pathname.match(/^\/[n|N]\d{4}[a-zA-Z]{2}\/*$/)){ /* Top */
            return new Ncode((url.pathname.match(/^\/([n|N]\d{4}[a-zA-Z]{2})\/*$/) ?? "")[1].toLowerCase())
        }
        else if (url.pathname.match(/\/novelview\/infotop\/ncode\/[n|N]\d{4}[a-zA-Z]{2}\/*/)){ /* Novel Info */
            return new Ncode((url.pathname.match(/\/novelview\/infotop\/ncode\/([n|N]\d{4}[a-zA-Z]{2})\/*/) ?? "")[1].toLowerCase())
        }
        else if(url.pathname.match(/^\/novelpdf\/creatingpdf\/ncode\/[n|N]\d{4}[a-zA-Z]{2}\/*$/)){ /* PDF */
            return new Ncode((url.pathname.match(/^\/novelpdf\/creatingpdf\/ncode\/([n|N]\d{4}[a-zA-Z]{2})\/*$/) ?? "")[1].toLowerCase())
        }
        else if(url.pathname.match(/^\/txtdownload\/top\/ncode\/[n|N]\d{4}[a-zA-Z]{2}\/*$/)){ /* TXT */
            return new Ncode((url.pathname.match(/^\/txtdownload\/top\/ncode\/([n|N]\d{4}[a-zA-Z]{2})\/*$/) ?? "")[1].toLowerCase())
        }
    }else if(url.hostname=="novelcom.syosetu.com" || url.hostname == "novelcom18.syosetu.com"){
        if (url.pathname.match(/^\/impression\/list\/ncode\/\d+\/*.*$/)){ /* Impression */
            return new Ncode(Number((url.pathname.match(/^\/impression\/list\/ncode\/(\d+)\/*.*$/) ?? "")[1]))
        }
        else if (url.pathname.match(/^\/novelreview\/list\/ncode\/(\d+)\/*.*$/)){ /* Review */
            return new Ncode(Number((url.pathname.match(/^\/novelreview\/list\/ncode\/(\d+)\/*.*$/) ?? "")[1]))
        }
        else if (url.pathname.match(/^\/novelreport\/input\/ncode\/(\d+)\/*.*$/)){ /* Review */
            return new Ncode(Number((url.pathname.match(/^\/novelreport\/input\/ncode\/(\d+)\/*.*$/) ?? "")[1]))
        }
    }else if(url.hostname=="syosetu.com"){
        if (url.pathname.match(/^\/draftepisode\/input\/ncode\/\d+\/*/)){
            return new Ncode(Number((url.pathname.match(/^\/draftepisode\/input\/ncode\/(\d+)\/*/) ?? "")[1]))
        }
        else if (url.pathname.match(/^\/usernoveldatamanage\/.*\/ncode\/\d+\/*.*$/)){
            return new Ncode(Number((url.pathname?.match(/^\/usernoveldatamanage\/updateinput\/ncode\/(\d+)\/*.*$/) ?? "")[1]))
        }
    }
    return new Ncode()
}

export function getScodeFromURL(_url:string|URL|Location): Scode{
    let url:URL
    if(typeof _url === "string"){
        try{
            url = new URL(_url)
        }catch(e){
            return new Scode()
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