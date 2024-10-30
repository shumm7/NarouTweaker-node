
import { nt } from "./narou-tweaker"
/************************************************************************************* */
/*                                 感想の既読情報                                       */
/************************************************************************************* */
export type ImpressionKanrino = Record<string,Array<string>>

export function pushImpressionReadList(ncode: nt.api.ncode | Array<nt.api.ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<nt.api.ncode> = []
    if(typeof ncode === "string"){
        list = [new nt.api.ncode(ncode)]
    }else if (ncode instanceof nt.api.ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new nt.api.ncode(n))
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

    nt.storage.sync.get(["workspaceImpressionMarked"]).then(function (l) {
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
        nt.storage.sync.set({ workspaceImpressionMarked: l.workspaceImpressionMarked })
    })
}

export function popImpressionReadList(ncode: nt.api.ncode | Array<nt.api.ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<nt.api.ncode> = []
    if(typeof ncode === "string"){
        list = [new nt.api.ncode(ncode)]
    }else if (ncode instanceof nt.api.ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new nt.api.ncode(n))
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

    nt.storage.sync.get(["workspaceImpressionMarked"]).then(function (l) {
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
        nt.storage.sync.set({ workspaceImpressionMarked: l.workspaceImpressionMarked })
    })
}

export function pushImpressionHiddenList(ncode: nt.api.ncode | Array<nt.api.ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<nt.api.ncode> = []
    if(typeof ncode === "string"){
        list = [new nt.api.ncode(ncode)]
    }else if (ncode instanceof nt.api.ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new nt.api.ncode(n))
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

    nt.storage.sync.get(["workspaceImpressionHidden"]).then(function (l) {
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
        nt.storage.sync.set({ workspaceImpressionHidden: l.workspaceImpressionHidden })
    })
}

export function popImpressionHiddenList(ncode: nt.api.ncode | Array<nt.api.ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<nt.api.ncode> = []
    if(typeof ncode === "string"){
        list = [new nt.api.ncode(ncode)]
    }else if (ncode instanceof nt.api.ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new nt.api.ncode(n))
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

    nt.storage.sync.get(["workspaceImpressionHidden"]).then(function (l) {
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
        nt.storage.sync.set("workspaceImpressionHidden", l.workspaceImpressionHidden)
    })
}