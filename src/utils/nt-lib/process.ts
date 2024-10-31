import browser from "webextension-polyfill"


export class __nt_extension__ {
    /**
     * 拡張機能のmanifest.json
     * @returns Manifest
    */
    static get manifest(): browser.Manifest.WebExtensionManifest{
        return browser.runtime.getManifest()
    }
    /**
     * 拡張機能のバージョンを取得
     * @returns バージョン
    */
    static get version(): string{
        return browser.runtime.getManifest().version
    }
    /**
     * 拡張機能の作者名を取得
     * @returns 作者名
    */
    static get author(): string{
        return browser.i18n.getMessage("extAuthor")
    }
}

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
    
    export async function action(data: {
        action: "fetch",
        format: "json"|"text",
        data: {
            url: string|URL|globalThis.Request,
            options?: RequestInit
        },
        id?: string
    }): Promise<ReceiveMessage>;
    export async function action(data: {
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
    export async function action(data: {
        action: "cookies",
        format: "set",
        data: browser.Cookies.SetDetailsType,
        id?: string
    }): Promise<ReceiveMessage>;
    export async function action(data: {
        action: "cookies",
        format: "get",
        data: browser.Cookies.GetDetailsType,
        id?: string
    }): Promise<ReceiveMessage>;
    export async function action(data: SentMessage): Promise<ReceiveMessage|void> {
        try{
            const ret = browser.runtime.sendMessage(data)
            return new ReceiveMessage(ret)
        }catch(e){
            return
        }
    }
}

export namespace __nt_download__ {
    /**
     * オブジェクトをJSONファイルで保存
     * @param data - オブジェクト
     * @param filename - ファイル名
    */
    export async function json(data:any, filename: string): Promise<number|null>{
        var url = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 3))))
        const ret = await __nt_runtime__.action({action: "downloads", data: {url: url, filename: filename}}).catch()
        if(ret?.success){
            return ret?.result
        }
        return null
    }

    /**
     * 文字列をファイルで保存
     * @param data - テキスト
     * @param filename - ファイル名
    */
    export async function text(data: string, filename: string): Promise<number|null>{
        var url = 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(data)))
        const ret = await __nt_runtime__.action({action: "downloads", data: {url: url, filename: filename}}).catch()
        if(ret?.success){
            return ret.result
        }
        return null
    }
}

export namespace __nt_cookie__ {
    export async function set(data: browser.Cookies.SetDetailsType): Promise<browser.Cookies.Cookie|void>{
        const response = await __nt_runtime__.action({action: "cookies", format: "set", data: data}).catch()
        if(response?.success){
            return response?.result
        }
    }

    export async function get(data: browser.Cookies.GetDetailsType): Promise<browser.Cookies.Cookie|void>{
        const response = await __nt_runtime__.action({action: "cookies", format: "get", data: data}).catch()
        if(response?.success){
            return response?.result
        }
    }
}