/**
 * String type containing CSS styles.
 */
export type CSS_String = string

/**
 * 置換パターンリスト
 */
export type ReplacePatterns = Array<ReplacePattern>

/**
 * 置換パターン
 * @param {string} pattern - 検索パターン
 * @param {string} replacement - 置換文字列
 * @param {boolean} regex - 検索パターンが正規表現かどうか
 * @param {boolean} active - 有効かどうか
 */
export class ReplacePattern {
    public pattern: string = ""
    public replacement: string = ""
    public regex: boolean = false
    public active: boolean = true
}