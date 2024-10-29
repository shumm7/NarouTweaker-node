export namespace __nt_array__ {
    /**
     * 配列のなかで一番前にある`undefined`を`item`で置き換えます。  
     * `undefined`が存在しなかった場合は、最後尾に`item`を追加します。  
     * @param array 操作対象の配列
     * @param item 挿入する要素
     * @returns `item`を挿入した位置
     */
    export function putIn<T>(array: Array<T>, item: T): number{
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