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