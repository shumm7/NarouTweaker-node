import $ from 'jquery';

export namespace __nt_text__ {
    /**
     * String type containing CSS styles.
     */
    export type CSS_String = string
}


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