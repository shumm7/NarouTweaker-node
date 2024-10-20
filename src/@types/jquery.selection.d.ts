type JQuerySelection_OperationMode = "replace"|"insert"|"get"|"getPos"|"setPos"|JQuerySelection_SelectionMode
type JQuerySelection_Caret = "keep"|"start"|"end"
type JQuerySelection_InsertMode = "before"|"after"
type JQuerySelection_SelectionMode = "text"|"html"

interface JQuerySelection_Opts {
    text?: string
    caret?: JQuerySelection_Caret
    mode?: JQuerySelection_InsertMode
    start?: number
    end?: number
}

interface JQuerySelection_ReplaceOpts extends JQuerySelection_Opts {
    text: string
    caret?: JQuerySelection_Caret
}

interface JQuerySelection_InsertOpts extends JQuerySelection_Opts {
    text: string
    mode: JQuerySelection_InsertMode
    caret?: JQuerySelection_Caret
}

interface JQuerySelection_Range extends JQuerySelection_Opts {
    start: number
    end: number
}

interface JQuery {
    /**
     * 選択文字列を置き換えます
     * @param {string} opts.text - 置き換え後の文字列
     * 
     * @param {JQuerySelection_Caret} opts.caret - "keep", "start", "end" のいずれか。 指定がない場合、"keep" として処理されます。
     * * "keep" - 選択状態を保持させる（置き換え後の文字列が選択される）
     * * "start" - 選択開始位置にキャレットを移動させる
     * * "end" - 選択終了位置にキャレットを移動させる
     */
    selection(mode: "replace", opts: JQuerySelection_ReplaceOpts): JQuery<TElement>;

    /**
     * 選択文字列の前、もしくは後に文字列を挿入します
     * @param {string} opts.text - 挿入する文字列
     * 
     * @param {JQuerySelection_InsertMode} opts.mode - 挿入モード "before", "after" のいずれか。
     * * "before" - 選択開始位置（選択文字列の前）に文字列を挿入する
     * * "after" - 選択終了位置（選択文字列の後）に文字列を挿入する
     * 
     * @param {JQuerySelection_Caret} opts.caret - キャレットモード "keep", "start", "end" のいずれか。 指定がない場合、"keep" として処理されます。
     * * "keep" - 選択状態を保持させる
     * * "start" - 選択開始位置にキャレットを移動させる
     * * "end" - 選択終了位置にキャレットを移動させる
     */
    selection(mode: "insert", opts: JQuerySelection_InsertOpts): JQuery<TElement>;

    /**
     * 選択されている文字列を取得します
     * @returns {string} - 選択されている文字列を返します
     */
    selection(mode: "get"): string;

    /**
     * キャレット位置を取得します
     * @returns {JQuerySelection_Range} - キャレット位置を返します
     * * return.start {Integer} - 選択開始位置
     * * return.end {Integer} - 選択終了位置
     */
    selection(mode: "getPos"): JQuerySelection_Range;

    /**
     * キャレット位置を設定します
     * @param {number} opts.start - 選択開始位置（位置は0から数えます）
     * @param {number} opts.end - 選択終了位置（位置は0から数えます）
     */
    selection(mode: "setPos", opts: JQuerySelection_Range): JQuery<TElement>;

    /**
     * ウィンドウ内の選択されている文字列を取得します
     * @param {JQuerySelection_SelectionMode} mode - 取得モード "text", "html" のいずれか。 指定がない場合、"text" として処理されます。
     * * "text" - テキストを取得します
     * * "html" - HTMLを取得します
     * 
     * @returns {string} - 選択されている文字列を返します。
     */
    selection(mode?: JQuerySelection_SelectionMode): string;

    selection(mode?: JQuerySelection_OperationMode, opts?: JQuerySelection_Opts): JQuery<TElement>|string|JQuerySelection_Range;
}