import $ from "jquery";

export namespace __nt_time__ {
    export const INVALID_DATE = new Date('invalid date');

    /**
     * 日本語の日付の文字列を取得する（yyyy年MM月dd日）
     * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
     * @returns {string} - 日付の文字列
    */
    export function getDateStringJapanese(date:Date=new Date()): string{
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1);
        const day = String(date.getDate());
        return `${year}年${month}月${day}日`;
    }

    /**
     * 日付の文字列を取得する（yyyy-MM-dd）
     * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
     * @param {string} divider - 用いる記号（未指定の場合はハイフン「-」）
     * @returns {string} - 日付の文字列
    */
    export function getDateString(date:Date=new Date(), divider:string = "-"): string{
        if(date===null){return ""}
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${divider}${month}${divider}${day}`;
    }

    /**
     * 日時の文字列からDateオブジェクトを取得
     * @param {string} str - 日時の文字列
     * @returns {Date} - Dateオブジェクト
    */
    export function getDatetimeFromString(str:string): Date{
        return new Date(str)
    }

    /**
     * 日時の文字列を取得する（yyyy/MM/dd HH:mm:ss.SSS）
     * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
     * @returns {string} - 日時の文字列
    */
    export function getDatetimeString(date:Date=new Date()): string{
        if(date===null || date===undefined){return ""}
        return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + ('00' + date.getMilliseconds()).slice(-3);
    }

    /**
     * ファイル名向けの日時の文字列を取得する（yyyy.MM.dd-HH.mm.ss）
     * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
     * @returns {string} - 日時の文字列
    */
    export function getDatetimeStringForFilename(date:Date=new Date()): string{
        if(date===null || date===undefined){return ""}
        return date.getFullYear() + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' +('0' + date.getDate()).slice(-2) + '-' +  ('0' + date.getHours()).slice(-2) + '.' + ('0' + date.getMinutes()).slice(-2) + '.' + ('0' + date.getSeconds()).slice(-2);

    }

    /**
     * ミリ秒表示のない日時の文字列を取得する（yyyy/MM/dd HH:mm:ss）
     * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
     * @returns {string} - 日時の文字列
    */
    export function getDatetimeStringWithoutMilisecond(date:Date=new Date()): string{
        if(date===null || date===undefined){return ""}
        return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
    }

    /**
     * 秒表示のない日時の文字列を取得する（yyyy/MM/dd HH:mm）
     * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
     * @returns {string} - 日時の文字列
    */
    export function getDatetimeStringWithoutSecond(date:Date=new Date()): string{
        if(date===null || date===undefined){return ""}
        return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }

    /**
     * 指定したDateオブジェクトの前日を表すDateオブジェクトを取得
     * @param {Date} today - 当日のDateオブジェクト（未指定の場合は現在時刻）
     * @returns {Date} - 前日のDateオブジェクト
    */
    export function getYesterday(today: Date = new Date()): Date{
        var yesterday = today
        yesterday.setDate(today.getDate() - 1)
        return yesterday
    }

    /**
     * 分を「dd日hh時間mm分」に変換
     * @param {number} minute - 分
     * @returns {string} - 文字列（dd日hh時間mm分）
    */
    export function minuteStringJapanese(minute: number|string): string{
        if(typeof minute === "string"){
            minute = parseFloat(minute)
        }else if(typeof minute === "number"){
            if(isNaN(minute) || minute<0){
                return ``
            }
        }

        var hour = Math.floor(minute / 60)
        minute -= (hour * 60)
        var day = Math.floor(hour / 24)
        hour -= (day * 24)

        if(hour==0){
            return `${minute}分`
        }else if(day==0 && hour > 0){
            return `${hour}時間${minute}分`
        }else{
            return `${day.toLocaleString()}日${hour}時間${minute}分`
        }
    }
}

export namespace __nt_text__ {
    /**
     * String type containing CSS styles.
     */
    export type CSS_String = string


    /**
     * DOM内にあるURLをハイパーリンクに変換する。
     * @param element - HTML文字列
     * @param {boolean} isWarning  - 外部リンクに警告を表示する
     * @returns - HTML文字列
    */
    export function replaceUrl(element: any, isWarning:boolean=false) {
        const narouNetwrokUrlPattern = [
            /^(h?)(ttps?:\/\/(.*)\.syosetu\.com)/,
            /^(h?)(ttps?:\/\/kasasagi\.hinaproject\.com)/
        ]

        function isUrlWhitelisted(url: string){
            const whitelist = narouNetwrokUrlPattern
            var res = false
            $.each(whitelist, function(_, value){
                if(url.match(value)){
                    res = true
                    return false
                }
            })
            return res
        }

        function replaceUrlHtml(str:string){
            let regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
            let regexp_makeLink = function(_all: string, _url: string, _h: string, _href: string) {
                if(isWarning){
                    if(isUrlWhitelisted(_url)){
                        return '<a href="h' + _href + '" target="_blank">' + _url + '</a>';
                    }else{
                        _href = "https://mypage.syosetu.com/?jumplink=h" + encodeURI(_href)
                        return '<a href="'+_href+'" target="_blank">' + _url + '</a>';
                    }
                }else{
                    return '<a href="h' + _href + '" target="_blank">' + _url + '</a>';
                }
            }
            
            return str.replace(regexp_url, regexp_makeLink);
        }

        var nodes = $(element)[0].childNodes;
        $.each(nodes, function(_, w) {
            if(w.innerHTML==undefined){
                $.each($.parseHTML(replaceUrlHtml(w.data)), function(_, x) {
                    w.before(x);
                });
                w.remove();
            }else{
                replaceUrl(w);
            }
        });
    }

    /**
     * DOMをエスケープする。
     * @param {string} string - HTML文字列
     * @returns {string} - エスケープ済の文字列
    */
    export function escapeHtml(string:string): string{
        /*
        var p = $("<p>")
        p.text(string)
        return p.text()
        */

        return string.replace(/[&'`"<>]/g, function(match:string){
            var ret = {
                '&': '&amp;',
                "'": '&#x27;',
                '`': '&#x60;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;',
            }[match]
            
            if(ret===undefined){
                return ""
            }else{
                return ret
            }
        });
    }

    /**
     * 正規表現文字列の記号をエスケープする
     * @param elem - 正規表現を含む文字列
     * @returns - エスケープ済の文字列
    */
    export function escapeRegex(string: string): string{
        var reRegExp = /[\\^$.*+?()[\]{}|]/g
        var reHasRegExp = new RegExp(reRegExp.source);
        return (string && reHasRegExp.test(string))
                ? string.replace(reRegExp, '\\$&')
                : string;
    }

    /**
     * 正規表現をテストする
     * @param regex - 正規表現を含む文字列
     * @returns - 正規表現が正常かどうか
     */
    export function checkRegex(regex: string): boolean {
        try{
            new RegExp(regex)
            return true
        }catch{
            return false
        }
    }

    /**
     * 正規表現をテストする
     * @param regex - 正規表現を含む文字列
     * @returns - 正規表現が正常かどうか
     */
    export function checkRegexWithError(regex: string): string|void {
        try{
            new RegExp(regex)
        }catch(e){
            return String(e)
        }
    }

    /**
     * CSSを縮小
     * @param css - CSS文字列
     * @returns minifyされたCSSを
     */
    export function minifyCss(css: string): string{
        return css.replace(/\n/g, '').replace(/\s\s+/g, ' ');
    }

    /**
     * コンマ付きの数値文字列を数値型に変換
     * @param {string} text - コンマ付きの数値文字列（例：1,000）
     * @returns {number} - 数値
    */
    export function parseIntWithComma(text: string): number{
        return parseInt(text.replace(/,/g, ""))
    }

    /**
     * 小説本文に含まれる挿絵タグをHTML要素に置換
     * @param element - 本文（DOM）
     * @returns - 挿絵タグ変換済みの本文
    */
    export function convertSasieTags(element: any){
        var re = /<(i[0-9]+)\|([0-9]+)>/g
        var to = `<a href="//$2.mitemin.net/$1/" target="_blank"><img src="//$2.mitemin.net/userpageimage/viewimagebig/icode/$1/" alt="挿絵(By みてみん)" border="0"></a>`
        var nodes = $(element)[0].childNodes;
        $.each(nodes, function(_, w) {
            if(w.innerHTML==undefined){ // is text
                if(w.data.match(re)){
                    $.each($.parseHTML(w.data.replace(re, to)), function(_, x) {
                        w.before(x);
                    });
                    w.remove();
                }
            }
        })
    }


    /**
     * 文字数を取得（小説家になろうの内部関数 char_count.js）
     * @param {string} strings - 文字数をカウントする文字列
     * @param {boolean} shouldCountSpecialTag - 特殊タグをカウントするか
     * @param {boolean} shouldCountBlankLF - 空白改行文字をカウントするか
     * @param {boolean} shouldCountHTMLSpecialCharacter - HTML特殊文字をエスケープするか
     * @returns {number} - 文字数
    */
    export function countCharacters(strings:string, shouldCountSpecialTag:boolean, shouldCountBlankLF:boolean, shouldCountHTMLSpecialCharacter:boolean): number{
        //改行コードを統一
        strings = strings.replace(/\r\n|\r/g, '\n');

        if(!shouldCountSpecialTag){
            // みてみんの画像挿入コードを除外
            strings = strings.replace(/<i[0-9]+\|[0-9]+>/g,'');

            // ルビを除外
            strings = convertRubyTags(strings, true);
            strings = strings.replace(/<rt>.*?<\/rt>/g,'');
            strings = strings.replace(/<rp>.*?<\/rp>/g,'');
            strings = strings.replace(/<ruby>/g,'');
            strings = strings.replace(/<\/ruby>/g,'');
        }

        if(!shouldCountBlankLF){
            strings = strings.replace(/\s+/g, '')
        }

        if(shouldCountHTMLSpecialCharacter){
            strings = escapeHtml(strings);
        }

        return strings.length;

    }

    /**
     * 文字列中のルビタグを相互変換（小説家になろうの内部関数 char_count.js）
     * @param {string} text - 元の文字列
     * @param {boolean} toTags - true:ルビタグ→HTML要素　false:HTML要素→ルビタグ
     * @param {boolean} additionalKanji - 漢字の判定範囲を拡大する（「𠮟々ヵヶヽヾゝゞ〃仝」を含むようにする）
     * @returns {string} - 変換後の文字列
    */
    export function convertRubyTags(text:string, toTags:boolean, additionalKanji:boolean = false): string{

        const min = 1;							// ルビ対応可能な最小文字数
        const max = 10;							// ルビ対応可能な最大文字数
        const sticks = '\\|｜';					// 縦棒を指定
        const startBrackets = '《\\(（';			// 開始括弧とみなす記号を指定
        const endBrackets = '》\\)）';			// 終了括弧とみなす記号を指定
        const space = ' 　';						// 空白とみなす記号を指定
        const kana = 'ぁ-んァ-ヶー.・…';			// ひらがな・カタカナを範囲指定
        let alphaKanji = 'A-zＡ-ｚ一-龠';		// アルファベット・漢字を範囲指定
        if(additionalKanji){
            alphaKanji = 'A-zＡ-ｚ一-龠𠮟々ヵヶヽヾゝゞ〃仝'
        }

        var re: RegExp, to: string;

        if(toTags){
            // 青空文庫形式の場合
            // [\|｜]([^\|｜\n]{1,10})《([^\|｜》]{1,10})》
            re = new RegExp('[' + sticks + ']([^' + sticks + '\n]{' + min + ',' + max + '})《([^' + sticks + '》]{' + min + ',' + max + '})》', 'g');
            to = '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>';
            text = text.replace(re, to);
            
            // フリガナの開始記号が[《(（]かつ[》)）]の場合
            // [\|｜]([^《\(（\n]{1,10})([\|｜])([ぁ-んァ-ヶー.・…]{1,10})(》\)）)
            re = new RegExp('[' + sticks + ']([^' + startBrackets + '\n]{' + min + ',' + max + '})([' + sticks + '])([' + kana + ']{' + min + ',' + max + '})(' + endBrackets + ')', 'g');
            to = '<ruby>$1<rp>(</rp><rt>$3</rt><rp>)</rp></ruby>';
            text = text.replace(re, to);

            // ルビを振りたい文字の開始記号の縦棒がなく、フリガナが括弧で囲まれている場合
            // ([A-zＡ-ｚ一-龠]{1,10})[ 　]{1}([A-zＡ-ｚ一-龠]{1,10})([《\(（])([ぁ-んァ-ヶー.・…]{1,10})[ 　]{1}([ぁ-んァ-ヶー.・…]{1,10})([》\)）])
            re = new RegExp('([' + alphaKanji + ']{' + min + ',' + max + '})[' + space + ']{1}([' + alphaKanji + ']{' + min + ',' + max + '})([' + startBrackets + '])([' + kana + ']{' + min + ',' + max + '})[' + space + ']{1}([' + kana + ']{' + min + ',' + max + '})([' + endBrackets + '])', 'g');
            to = '<ruby>$1<rp>$3</rp><rt>$4</rt><rp>$6</rp></ruby>' + '　' + '<ruby>$2<rp>$3</rp><rt>$5</rt><rp>$6</rp></ruby>';
            text = text.replace(re, to);

            // カタカナ・ひらがなと一部記号のみ(縦棒+縦棒以外の任意の文字が1～10文字の場合、または縦棒なし+アルファベットor漢字が1～10文字の場合)
            // (([\|｜]([^\|｜《\(（》\)）\n]{1,10}))|([A-zＡ-ｚ一-龠]{1,10}))([《\(（])([ぁ-んァ-ヶー.・…]{1,10}[ 　]?[ぁ-んァ-ヶー.・…]{0,10})([》\)）])
            re = new RegExp('(([' + sticks + ']([^' + sticks + startBrackets + endBrackets + '\n]{' + min + ',' + max + '}))|([' + alphaKanji + ']{' + min + ',' + max + '}))([' + startBrackets + '])([' + kana + ']{' + min + ',' + max + '}[' + space + ']?[' + kana + ']{0,' + max + '})([' + endBrackets + '])', 'g');
            to = '<ruby>$3$4<rp>$5</rp><rt>$6</rt><rp>$7</rp></ruby>';
            text = text.replace(re, to);

            // ルビの打ち消し
            // ([\|｜])([《\(（])([ぁ-んァ-ヶー.・…]{1,10}[ 　]?[ぁ-んァ-ヶー.・…]{0,10})([》\)）])
            re = new RegExp('([' + sticks + '])([' + startBrackets + '])([' + kana + ']{' + min + ',' + max + '}[' + space + ']?[' + kana + ']{0,' + max + '})([' + endBrackets + '])', 'g');
            to = '$2$3$4';
            text = text.replace(re, to);
        }else{
            re = new RegExp('<ruby>([^<>]+)<rp>[\\(（《]</rp><rt>([^<>]+)</rt><rp>[\\)）》]</rp></ruby>', 'gi');
            text = text.replace(re, '｜$1《$2》');
        }

        return text;
    }

    /**
     * 原稿用紙で何枚か数える（小説家になろうの内部関数 char_count.js）
     * @param {string} string - 文字列
     * @returns {number} - 400字詰め原稿用紙換算の枚数
    */
    export function countManuscriptPaper(string: string): number{
        var len = countCharacters(string, false, true, false);
        var cnt = 1;
        if(len != 0){
            cnt = Math.ceil(len / 400);
        }
        
        return cnt;
    }

    /**
     * 行数を数える（小説家になろうの内部関数 char_count.js）
     * @param {string} string - 文字列
     * @returns {number} - 行数
    */
    export function countLines(string: string): number{
        string = string.replace(/\r\n|\r/g, '\n');
        var cnt = string.match(/\n/g);
        var l: number
        if(cnt != null){
            l = cnt.length + 1;
        }else{
            l = 1;
        }
        return l;
    }

    /**
     * 自動字下げ（小説家になろうの内部関数 char_count.js）
     * @param {string} novel - 変換前の文字列
     * @returns {string} - 変換後の文字列
    */
    export function autoIndent(novel: string): string{
        var text = novel.split(/\n　+「/g);
        novel = text.join('\n「');

        novel = novel.replace(/\n([^　「『\(≪（＜<【\[{\n])/g, '\n　$1');

        novel = novel.replace(/^([^　「『\(≪（＜<【\[{])/, '　$1');

        novel = novel.replace(/\n(　)+/g, '\n　').replace(/^(　)+/g, '　');

        novel = novel.replace(/\n(　)+\n/g,'\n\n');

        return novel;
    }

    /**
     *  読了時間（分）（小説家になろうの内部関数 char_count.js）
     * @param {string} string - 文字列
     * @returns {number} - 読了時間
    */
    export function countTime(string: string): number{
        return Math.ceil(countCharacters(string, false, false, false) / 500)
    }

    /**
     * 文字列にパターンが何回出現するかを数える
     * @param {string} string - 文字列
     * @param {string|RegExp} pattern - パターン
     * @returns {number} - 出現回数
    */
    export function searchCount(string: string, pattern: string | RegExp): number{
        return string.split(pattern).length - 1
    }

    /**
     *  文字列同士の類似度を計算
     * @param {string} strA - 文字列1
     * @param {string} strB - 文字列2
     * @returns {number} - 類似度
    */
    export function stringSimilarity(strA:string, strB:string): number{
        /* https://qiita.com/gomaoaji/items/603904e31f965d759293 */

        function getToNgram(text: string, n: number = 3){
            if(n===undefined){
                n = 3
            }

            let ret: Record<string,any> = {}
            for (var m = 0; m < n; m++) {
                for (var i = 0; i < text.length - m; i++) {
                    const c = text.substring(i, i + m + 1)
                    ret[c] = ret[c] ? ret[c] + 1 : 1
                }
            }
            return ret
        }

        function getValuesSum(object: Record<string,number>){
            return Object.values(object).reduce((prev, current) => prev + current, 0)
        }
        
        function calculate(a: string, b: string){
            const aGram = getToNgram(a)
            const bGram = getToNgram(b)
            const keyOfAGram = Object.keys(aGram)
            const keyOfBGram = Object.keys(bGram)

            // aGramとbGramに共通するN-gramのkeyの配列
            const abKey = keyOfAGram.filter((n) => keyOfBGram.includes(n))
        
            // aGramとbGramの内積(0と1の掛け算のため、小さいほうの値を足し算すれば終わる。)
            let dot = abKey.reduce(
            (prev, key) => prev + Math.min(aGram[key], bGram[key]),
            0
            )
        
            // 長さの積(平方根の積は積の平方根)
            const abLengthMul = Math.sqrt(getValuesSum(aGram) * getValuesSum(bGram));
            return dot / abLengthMul;
        }

        return calculate(strA, strB)
    }
}

export namespace __nt_math__ {
    /**
     * 数値を上限・下限で制限する
     * @param {number} n - 対象の数値
     * @param {number|null|undefined} min - 下限の数値
     * @param {number|null|undefined} max - 上限の数値
     * @returns {number} 制限後の数値
     */
    export function limit(n: number, min?: number|null, max?: number|null): number{
        if(isNaN(n)){return n}

        if(typeof min === "number" && !isNaN(min)){
            if(typeof max === "number" && !isNaN(max)){
                if(min <= max){
                    if(n < min){
                        return min
                    }
                    if(n > max){
                        return max
                    }
                }
            }else{
                if(n < min){
                    return min
                }
            }
        }else{
            if(typeof max === "number"){
                if(n > max){
                    return max
                }
            }
        }
        return n
    }
}

export namespace __nt_array__ {
    /**
     * 配列のなかで一番前にある`undefined`を`item`で置き換えます。  
     * `undefined`が存在しなかった場合は、最後尾に`item`を追加します。  
     * @param array 操作対象の配列
     * @param item 挿入する要素
     * @returns `item`を挿入した位置
     */
    export function putin<T>(array: Array<T>, item: T): number{
        for(let i=0; i<array.length; i++){
            if(array[i]===undefined){
                array[i] = item
                return i
            }
        }
        return array.push(item)
    }

    /**
     * 指定した配列を長さ0の空配列にします。  
     * @param array 操作対象の配列
     */
    export function empty<T>(array: Array<T>): void{
        for(let i=0; i<array.length; i++){
            array.pop()
        }
    }
    
    /**
     * 既存の配列のシャローコピーを返します。  
     * @param array コピー元の配列（この配列は変更されません）
     * @returns コピーされた配列
     */
    export function clone<T>(array: Array<T>): Array<T>{
        return array.concat()
    }
    
    /**
     * `fromIndex`と`toIndex`で指定された位置にある要素を入れ替えます。  
     * @param array 操作対象の配列
     * @param fromIndex 要素のインデックス
     * @param toIndex 要素のインデックス
     */
    export function swap<T>(array: Array<T>, fromIndex: number, toIndex: number){
        var from: T = array[fromIndex]
        var to: T = array[toIndex]
        array[fromIndex] = to
        array[toIndex] = from
    }

    export function move<T>(array: Array<T>, index: number, moveTo: number){
        if((index < array.length && index >= 0) && (moveTo < array.length && moveTo>=0)){
            var data = array[index]
            array.splice(index, 1)
            array.splice(moveTo, 0, data)
        }
    }

    /**
     * 指定したインデックスの要素を削除し、前に詰めます。  
     * @param array 操作対象の配列
     * @param index 削除対象のインデックス
     */
    export function removeAt<T>(array: Array<T>, index: number){
        array.splice(index, 1)
    }

    /**
     * 指定した要素と一致する要素を配列から削除し、前に詰めます。  
     * @param array 操作対象の配列
     * @param item 検索対象の要素
     */
    export function remove<T>(array: Array<T>, item: T){
        for(let i=0; i<array.length; i++){
            if(array[i] === item){
                array.splice(i, 1)
            }
        }
    }
}

export namespace __nt_url__ {
    export class search {
        static set(url: URL|Location|string, params: Record<string, string>): URL|void;
        static set(url: URL|Location|string, value: string, key: string): URL|void;
        static set(_url: URL|Location|string, params: Record<string, string>|string, value?: string): URL|void{
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

            var p: Record<string, string> = {}
            if(typeof params==="string"){
                if(typeof value!=="string"){return}
                p[params] = value
            }else{
                p = params
            }

            var urlParams = new URLSearchParams(url.search)
            for(const [key, value] of Object.entries(p)){
                urlParams.set(key, value)
            }
            url.search = urlParams.toString()
            return url
        }

        static push(url: URL|Location|string, params: Record<string, string>): URL|void;
        static push(url: URL|Location|string, key: string, value: string): URL|void;
        static push(_url: URL|Location|string, params: Record<string, string>|string, value?: string): URL|void{
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

            var p: Record<string, string> = {}
            if(typeof params==="string"){
                if(typeof value!=="string"){return}
                p[params] = value
            }else{
                p = params
            }

            var urlParams = new URLSearchParams(url.search)
            for(const [key, value] of Object.entries(p)){
                urlParams.append(key, value)
            }
            url.search = urlParams.toString()
            return url
        }

        static remove(url: URL|Location|string, key: string, value: string): URL|void;
        static remove(url: URL|Location|string, params: string|Record<string,string|undefined>): URL|void;
        static remove(url: URL|Location|string, params: Array<string|Record<string,string|undefined>>): URL|void;
        static remove(_url: URL|Location|string, params: string|Record<string,string|undefined>|Array<string|Record<string,string|undefined>>, value?: string): URL|void{
            function remove(search: URLSearchParams, param: string|Record<string,string|undefined>){
                if(typeof param==="string"){
                    urlParams.delete(param)
                }else{
                    
                }
            }

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
            
            var urlParams = new URLSearchParams(url.search)
            if(Array.isArray(params)){
                for(let i=0; i<params.length; i++){
                    remove(urlParams, params[i])
                }
            }else{
                if(typeof params==="string"){
                    if(typeof value==="string"){
                        var p: Record<string,string> = {}
                        p[params] = value
                        remove(urlParams, p)
                    }else{
                        remove(urlParams, params)
                    }
                }else{
                    remove(urlParams, params)
                }
            }
            url.search = urlParams.toString()
            return url
        }

        static get(url: URL|Location|string, key: null|undefined): Record<string,Array<string>>|void;
        static get(url: URL|Location|string, key?: string|Array<string>): Record<string,Array<string>>|void;
        static get(_url: URL|Location|string, key?: string|Array<string>|null): Record<string,Array<string>>|void{
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

            var whitelist: Array<string>
            if(key===undefined || key===null){
                whitelist = []
            }else if(typeof key === "string"){
                whitelist = [key]
            }else{
                whitelist = key
            }

            var ret: Record<string,Array<string>> = {}
            var urlParams = new URLSearchParams(url.search)
            for (const key of urlParams.keys()) {
                if(whitelist.includes(key)){
                    ret[key] = urlParams.getAll(key)
                }
            }

            return ret
        }

        static value(url: URL|Location|string, key: string): string[]|void;
        static value(_url: URL|Location|string, key: string): string[]|void {
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

            var urlParams = new URLSearchParams(url.search)
            return urlParams.getAll(key)
        }


        static has(url: URL|Location|string, key: string, value?: string): boolean|void;
        static has(_url: URL|Location|string, key: string, value?: string): boolean|void {
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

            var urlParams = new URLSearchParams(url.search)
            return urlParams.has(key, value)
        }
    }
}