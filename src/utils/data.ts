
import { Ncode } from "./ncode"
import { getSyncOptions, SyncOptions } from "./option"
/************************************************************************************* */
/*                                 設定データ                                           */
/************************************************************************************* */
export type GraphType = "bar" | "line"

/************************************************************************************* */
/*                                 校正                                                */
/************************************************************************************* */
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


/**
 * 数値の変換モード
 */
export type CorrectionNumberMode = "full" | "half" | "default" | "kanji"


/************************************************************************************* */
/*                                 感想の既読情報                                       */
/************************************************************************************* */
export type ImpressionKanrino = Record<string,Array<string>>

export function pushImpressionReadList(ncode: Ncode | Array<Ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<Ncode> = []
    if(typeof ncode === "string"){
        list = [new Ncode(ncode)]
    }else if (ncode instanceof Ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new Ncode(n))
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

    getSyncOptions(["workspaceImpressionMarked"], function (l) {
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
        chrome.storage.sync.set({ workspaceImpressionMarked: l.workspaceImpressionMarked })
    })
}

export function popImpressionReadList(ncode: Ncode | Array<Ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<Ncode> = []
    if(typeof ncode === "string"){
        list = [new Ncode(ncode)]
    }else if (ncode instanceof Ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new Ncode(n))
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

    getSyncOptions(["workspaceImpressionMarked"], function (l) {
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
        chrome.storage.sync.set({ workspaceImpressionMarked: l.workspaceImpressionMarked })
    })
}

export function pushImpressionHiddenList(ncode: Ncode | Array<Ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<Ncode> = []
    if(typeof ncode === "string"){
        list = [new Ncode(ncode)]
    }else if (ncode instanceof Ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new Ncode(n))
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

    getSyncOptions(["workspaceImpressionHidden"], function (l) {
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
        chrome.storage.sync.set({ workspaceImpressionHidden: l.workspaceImpressionHidden })
    })
}

export function popImpressionHiddenList(ncode: Ncode | Array<Ncode|string> | string, kanrino: string | Array<string>) {
    var list: Array<Ncode> = []
    if(typeof ncode === "string"){
        list = [new Ncode(ncode)]
    }else if (ncode instanceof Ncode) {
        list = [ncode]
    }else if (Array.isArray(ncode)){
        for(const n of ncode){
            if(typeof n === "string"){
                list.push(new Ncode(n))
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

    getSyncOptions(["workspaceImpressionHidden"], function (l) {
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
        chrome.storage.sync.set({ workspaceImpressionHidden: l.workspaceImpressionHidden })
    })
}