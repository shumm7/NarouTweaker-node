import browser, { cookies } from "webextension-polyfill"

export namespace __nt_runtime__ {
    export class SentMessage {
        action?: "fetch"|"downloads"|"cookies"
        id?: string
        data?: any
        format?: string

        constructor(data: any) {
            if(data instanceof Object){
                const action = data?.action
                if(action==="fetch" || action==="downloads" || action==="cookies"){
                    this.action = action
                }
                if(typeof data?.id === "string"){
                    this.id = data.id
                }
                this.data = data?.data
                if(typeof data?.format === "string"){
                    this.format = data.format
                }
            }
        }
    }

    export class ReceiveMessage extends SentMessage {
        success?: boolean
        result?: any

        constructor(data: any) {
            super(data)
            if(typeof data?.success === "boolean"){
                this.success = data.success
            }
            this.result = data?.result
        }
    }
    
    export function action(data: {
        action: "fetch",
        format: "json"|"text",
        data: {
            url: string|URL|globalThis.Request,
            options?: RequestInit
        },
        id?: string
    }): Promise<ReceiveMessage>;
    export function action(data: {
        action: "downloads",
        data: {
            body?: string;
            saveAs?: boolean;
            url: string;
            filename?: string;
            headers?: browser.Downloads.DownloadOptionsTypeHeadersItemType[];
            method?: "GET" | "POST";
            conflictAction?: browser.Downloads.FilenameConflictAction;
        },
        id?: string
    }): Promise<ReceiveMessage>;
    export function action(data: {
        action: "cookies",
        format: "set",
        data: browser.Cookies.SetDetailsType,
        id?: string
    }): Promise<ReceiveMessage>;
    export function action(data: {
        action: "cookies",
        format: "get",
        data: browser.Cookies.GetDetailsType,
        id?: string
    }): Promise<ReceiveMessage>;
    export function action(data: SentMessage): Promise<ReceiveMessage> {
        return browser.runtime.sendMessage(data).then((ret)=>{
            return new ReceiveMessage(ret)
        })
    }
}

export namespace __nt_download__ {
    /**
     * オブジェクトをJSONファイルで保存
     * @param data - オブジェクト
     * @param filename - ファイル名
    */
    export function json(data:any, filename: string): Promise<number|null>{
        var url = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 3))))
        return __nt_runtime__.action({action: "downloads", data: {url: url, filename: filename}}).then((data)=>{
            if(data?.success){
                return data.result
            }else{
                return null
            }
        }).catch((e) => {
            return null
        })
    }

    /**
     * 文字列をファイルで保存
     * @param data - テキスト
     * @param filename - ファイル名
    */
    export function text(data: string, filename: string): Promise<number|null>{
        var url = 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(data)))
        return __nt_runtime__.action({action: "downloads", data: {url: url, filename: filename}}).then((data)=>{
            if(data?.success){
                return data.result
            }else{
                return null
            }
        }).catch((e) => {
            return null
        })
    }
}

export namespace __nt_cookie__ {
    export function set(data: browser.Cookies.SetDetailsType): Promise<browser.Cookies.Cookie|undefined>{
        return __nt_runtime__.action({action: "cookies", format: "set", data: data}).then(function(response){
            if(response?.success){
                return response?.result
            }else{
                return undefined
            }
        }).catch((e)=>{
            return undefined
        })
    }

    export function get(data: browser.Cookies.GetDetailsType): Promise<browser.Cookies.Cookie|undefined>{
        return __nt_runtime__.action({action: "cookies", format: "get", data: data}).then(function(response){
            if(response?.success){
                return response?.result
            }else{
                return undefined
            }
        }).catch((e)=>{
            return undefined
        })
    }
}