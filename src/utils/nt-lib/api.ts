import { __nt_runtime__ } from "./process"
import { __nt_text__ } from "./text"
import { Ncode } from "../ncode"


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


        export function fetch(ncode: Ncode|string|undefined, isR18: boolean = false, callback: (data: __nt_api__.novel.data|undefined) => void): void{
            const _ncode = new Ncode(ncode).ncode()
            
            let url
            if(_ncode){
                if(isR18){
                    url = `https://api.syosetu.com/novel18api/api/?out=json&libtype=2&opt=weekly&ncode=${_ncode}`
                }else{
                    url = `https://api.syosetu.com/novelapi/api/?out=json&libtype=2&opt=weekly&ncode=${_ncode}`
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

        export function fetch(ncode: Ncode|string, callback: (data: Array<__nt_api__.rankin.data>)=>void):void {
            const _ncode = new Ncode(ncode).ncode()
            if(_ncode!==undefined){
                const url = "https://api.syosetu.com/rank/rankin/?out=json&libtype=2&ncode=" + _ncode
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
}