
import { Ncode } from "./ncode"
import { SyncOptions } from "./option"
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

export function pushImpressionReadList(ncode: Ncode|string, kanrino: string){
    const _ncode = new Ncode(ncode).ncode()
    if(_ncode!==undefined){
        chrome.storage.sync.get(["workspaceImpressionMarked"], function(_d){
            const l = new SyncOptions(_d)
            if(l.workspaceImpressionMarked==undefined){l.workspaceImpressionMarked = {}}
            if(!(_ncode in l.workspaceImpressionMarked)){
                l.workspaceImpressionMarked[_ncode] = []
            }
            l.workspaceImpressionMarked[_ncode].push(kanrino)
            chrome.storage.sync.set(l.get("workspaceImpressionMarked"))
        })
    }
}

export function popImpressionReadList(ncode: Ncode|string, kanrino: string){
    const _ncode = new Ncode(ncode).ncode()
    if(_ncode!==undefined){
        chrome.storage.sync.get(["workspaceImpressionMarked"], function(_d){
            const l = new SyncOptions(_d)
            if(l.workspaceImpressionMarked==undefined){l.workspaceImpressionMarked = {}}
            if(_ncode in l.workspaceImpressionMarked){
                l.workspaceImpressionMarked[_ncode] = l.workspaceImpressionMarked[_ncode].filter(d => d!=kanrino)
                if(l.workspaceImpressionMarked[_ncode].length === 0)[
                    delete l.workspaceImpressionMarked[_ncode]
                ]
                chrome.storage.sync.set(l.get("workspaceImpressionMarked"))
            }
        })
    }
}

export function pushImpressionHiddenList(ncode: Ncode|string, kanrino: string){
    const _ncode = new Ncode(ncode).ncode()
    if(_ncode!==undefined){
        chrome.storage.sync.get(["workspaceImpressionHidden"], function(_d){
            const l = new SyncOptions(_d)
            if(l.workspaceImpressionHidden==undefined){l.workspaceImpressionHidden = {}}
            if(!(_ncode in l.workspaceImpressionHidden)){
                l.workspaceImpressionHidden[_ncode] = []
            }
            l.workspaceImpressionHidden[_ncode].push(kanrino)
            chrome.storage.sync.set(l.get("workspaceImpressionHidden"))
        })
    }
}

export function popImpressionHiddenList(ncode: Ncode|string, kanrino: string){
    const _ncode = new Ncode(ncode).ncode()
    if(_ncode!==undefined){
        chrome.storage.sync.get(["workspaceImpressionHidden"], function(_d){
            const l = new SyncOptions(_d)
            if(l.workspaceImpressionHidden==undefined){l.workspaceImpressionHidden = {}}
            if(_ncode in l.workspaceImpressionHidden){
                l.workspaceImpressionHidden[_ncode] = l.workspaceImpressionHidden[_ncode].filter(d => d!=kanrino)
                if(l.workspaceImpressionHidden[_ncode].length === 0)[
                    delete l.workspaceImpressionHidden[_ncode]
                ]
                chrome.storage.sync.set(l.get("workspaceImpressionHidden"))
            }
        })
    }
}