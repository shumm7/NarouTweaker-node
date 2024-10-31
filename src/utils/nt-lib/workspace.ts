import { __nt_api__ } from "./api"
import { __nt_storage__ } from "./storage"


export namespace __nt_workspace__ {
    export namespace impression {
        export type kanrino = Record<string,Array<string>>

        export function pushReadList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
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

            __nt_storage__.sync.get(["workspaceImpressionMarked"]).then(function (l) {
                list.forEach((n, i)=>{
                    const _ncode = n?.ncode()
                    if (_ncode !== undefined && kanrino !== undefined) {
                        if (l.workspaceImpressionMarked == undefined) { l.workspaceImpressionMarked = {} }
                        if (!(_ncode in l.workspaceImpressionMarked)) {
                            l.workspaceImpressionMarked[_ncode] = []
                        }
                        l.workspaceImpressionMarked[_ncode].push(kanrino[i])
                    }
                })
                __nt_storage__.sync.set({ workspaceImpressionMarked: l.workspaceImpressionMarked })
            })
        }

        export function popReadList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
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

            __nt_storage__.sync.get(["workspaceImpressionMarked"]).then(function (l) {
                list.forEach((n, i)=>{
                    const _ncode = n?.ncode()
                    if (_ncode !== undefined && kanrino !== undefined) {
                        if (l.workspaceImpressionMarked == undefined) { l.workspaceImpressionMarked = {} }
                        if (_ncode in l.workspaceImpressionMarked) {
                            l.workspaceImpressionMarked[_ncode] = l.workspaceImpressionMarked[_ncode].filter(d => d != kanrino[i])
                            if (l.workspaceImpressionMarked[_ncode].length === 0) [
                                delete l.workspaceImpressionMarked[_ncode]
                            ]
                        }
                    }
                })
                __nt_storage__.sync.set({ workspaceImpressionMarked: l.workspaceImpressionMarked })
            })
        }

        export function pushHiddenList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
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

            __nt_storage__.sync.get(["workspaceImpressionHidden"]).then(function (l) {
                list.forEach((n, i)=>{
                    const _ncode = n?.ncode()
                    if (_ncode !== undefined && kanrino !== undefined) {
                        if (l.workspaceImpressionHidden == undefined) { l.workspaceImpressionHidden = {} }
                        if (!(_ncode in l.workspaceImpressionHidden)) {
                            l.workspaceImpressionHidden[_ncode] = []
                        }
                        l.workspaceImpressionHidden[_ncode].push(kanrino[i])
                    }
                })
                __nt_storage__.sync.set({ workspaceImpressionHidden: l.workspaceImpressionHidden })
            })
        }

        export function popHiddenList(ncode: __nt_api__.ncode | Array<__nt_api__.ncode|string> | string, kanrino: string | Array<string>) {
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

            __nt_storage__.sync.get(["workspaceImpressionHidden"]).then(function (l) {
                list.forEach((n, i)=>{
                    const _ncode = n?.ncode()
                    if (_ncode !== undefined && kanrino !== undefined) {
                        if (l.workspaceImpressionHidden == undefined) { l.workspaceImpressionHidden = {} }
                        if (_ncode in l.workspaceImpressionHidden) {
                            l.workspaceImpressionHidden[_ncode] = l.workspaceImpressionHidden[_ncode].filter(d => d != kanrino[i])
                            if (l.workspaceImpressionHidden[_ncode].length === 0) [
                                delete l.workspaceImpressionHidden[_ncode]
                            ]
                        }
                    }
                })
                __nt_storage__.sync.set("workspaceImpressionHidden", l.workspaceImpressionHidden)
            })
        }
    }
}