import { __nt_api__ } from "./api"
import { __nt_storage__ } from "./storage"


export namespace __nt_workspace__ {
    export namespace impression {
        export type kanrino = Record<string,Array<string>>

        export async function pushReadList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
            var list: Array<__nt_api__.ncode> = []
            if(typeof ncode === "string"){
                list = [new __nt_api__.ncode(ncode)]
            }else if (ncode instanceof __nt_api__.ncode) {
                list = [ncode]
            }else if (Array.isArray(ncode)){
                for(const n of ncode){
                    if(typeof n === "string"){
                        list.push(new __nt_api__.ncode(n))
                    }else{
                        list.push(n)
                    }
                }
            }
            if (!Array.isArray(kanrino)) {
                kanrino = [kanrino]
            }
            if (list.length !== kanrino.length ||  list.length === 0) {
                return
            }

            let local = await __nt_storage__.sync.get(["workspaceImpressionMarked"])
            list.forEach((n, i)=>{
                const _ncode = n?.ncode()
                if (_ncode !== undefined && kanrino !== undefined) {
                    if (local.workspaceImpressionMarked == undefined) { local.workspaceImpressionMarked = {} }
                    if (!(_ncode in local.workspaceImpressionMarked)) {
                        local.workspaceImpressionMarked[_ncode] = []
                    }
                    local.workspaceImpressionMarked[_ncode].push(kanrino[i])
                }
            })
            await __nt_storage__.sync.set({ workspaceImpressionMarked: local.workspaceImpressionMarked })
        }

        export async function popReadList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
            var list: Array<__nt_api__.ncode> = []
            if(typeof ncode === "string"){
                list = [new __nt_api__.ncode(ncode)]
            }else if (ncode instanceof __nt_api__.ncode) {
                list = [ncode]
            }else if (Array.isArray(ncode)){
                for(const n of ncode){
                    if(typeof n === "string"){
                        list.push(new __nt_api__.ncode(n))
                    }else{
                        list.push(n)
                    }
                }
            }
            if (!Array.isArray(kanrino)) {
                kanrino = [kanrino]
            }
            if (list.length !== kanrino.length ||  list.length === 0) {
                return
            }

            let local = await __nt_storage__.sync.get(["workspaceImpressionMarked"])
            list.forEach((n, i)=>{
                const _ncode = n?.ncode()
                if (_ncode !== undefined && kanrino !== undefined) {
                    if (local.workspaceImpressionMarked == undefined) { local.workspaceImpressionMarked = {} }
                    if (_ncode in local.workspaceImpressionMarked) {
                        local.workspaceImpressionMarked[_ncode] = local.workspaceImpressionMarked[_ncode].filter(d => d != kanrino[i])
                        if (local.workspaceImpressionMarked[_ncode].length === 0) [
                            delete local.workspaceImpressionMarked[_ncode]
                        ]
                    }
                }
            })
            await __nt_storage__.sync.set({ workspaceImpressionMarked: local.workspaceImpressionMarked })
        }

        export async function pushHiddenList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
            var list: Array<__nt_api__.ncode> = []
            if(typeof ncode === "string"){
                list = [new __nt_api__.ncode(ncode)]
            }else if (ncode instanceof __nt_api__.ncode) {
                list = [ncode]
            }else if (Array.isArray(ncode)){
                for(const n of ncode){
                    if(typeof n === "string"){
                        list.push(new __nt_api__.ncode(n))
                    }else{
                        list.push(n)
                    }
                }
            }
            if (!Array.isArray(kanrino)) {
                kanrino = [kanrino]
            }
            if (list.length !== kanrino.length ||  list.length === 0) {
                return
            }

            let local = await __nt_storage__.sync.get(["workspaceImpressionHidden"])
            list.forEach((n, i)=>{
                const _ncode = n?.ncode()
                if (_ncode !== undefined && kanrino !== undefined) {
                    if (local.workspaceImpressionHidden == undefined) { local.workspaceImpressionHidden = {} }
                    if (!(_ncode in local.workspaceImpressionHidden)) {
                        local.workspaceImpressionHidden[_ncode] = []
                    }
                    local.workspaceImpressionHidden[_ncode].push(kanrino[i])
                }
            })
            await __nt_storage__.sync.set({ workspaceImpressionHidden: local.workspaceImpressionHidden })
        }

        export async function popHiddenList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
            var list: Array<__nt_api__.ncode> = []
            if(typeof ncode === "string"){
                list = [new __nt_api__.ncode(ncode)]
            }else if (ncode instanceof __nt_api__.ncode) {
                list = [ncode]
            }else if (Array.isArray(ncode)){
                for(const n of ncode){
                    if(typeof n === "string"){
                        list.push(new __nt_api__.ncode(n))
                    }else{
                        list.push(n)
                    }
                }
            }
            if (!Array.isArray(kanrino)) {
                kanrino = [kanrino]
            }
            if (list.length !== kanrino.length ||  list.length === 0) {
                return
            }

            let local = await __nt_storage__.sync.get(["workspaceImpressionHidden"])
            list.forEach((n, i)=>{
                const _ncode = n?.ncode()
                if (_ncode !== undefined && kanrino !== undefined) {
                    if (local.workspaceImpressionHidden == undefined) { local.workspaceImpressionHidden = {} }
                    if (_ncode in local.workspaceImpressionHidden) {
                        local.workspaceImpressionHidden[_ncode] = local.workspaceImpressionHidden[_ncode].filter(d => d != kanrino[i])
                        if (local.workspaceImpressionHidden[_ncode].length === 0) [
                            delete local.workspaceImpressionHidden[_ncode]
                        ]
                    }
                }
            })
            await __nt_storage__.sync.set("workspaceImpressionHidden", local.workspaceImpressionHidden)
        }
    }
}