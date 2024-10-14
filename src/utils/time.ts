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
    if(date===null){return ""}
    return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + date.getMilliseconds();
}

/**
 * ファイル名向けの日時の文字列を取得する（yyyy.MM.dd-HH.mm.ss）
 * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
 * @returns {string} - 日時の文字列
*/
export function getDatetimeStringForFilename(date:Date=new Date()): string{
    if(date===null){return ""}
    return date.getFullYear() + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' +('0' + date.getDate()).slice(-2) + '-' +  ('0' + date.getHours()).slice(-2) + '.' + ('0' + date.getMinutes()).slice(-2) + '.' + ('0' + date.getSeconds()).slice(-2);

}

/**
 * 秒表示のない日時の文字列を取得する（yyyy/MM/dd HH:mm）
 * @param {Date} date - Dateオブジェクト（未指定の場合は現在時刻）
 * @returns {string} - 日時の文字列
*/
export function getDatetimeStringWithoutSecond(date:Date=new Date()): string{
    if(date===null){return ""}
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
