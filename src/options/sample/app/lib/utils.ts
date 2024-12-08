import { OptionUI_Items } from "./items";
import { OptionUI_Pages } from "./pages";
import { nt } from "../../../../utils/narou-tweaker";
import { OptionUI_Category, OptionUI_CategoryID, OptionUI_Item, OptionUI_ItemID, OptionUI_Page, OptionUI_PageID } from "./type";

import $ from 'jquery';

/* Option Category */
export function getOptionPageFromID(id: OptionUI_PageID): OptionUI_Page|undefined{
    var ret: OptionUI_Page|undefined
    OptionUI_Pages.forEach(function(v){
        if(v.id === id){
            ret = v
            return true
        }
    })
    return ret
}

export function getOptionCategoryFromID(id: OptionUI_PageID, categoryId: OptionUI_CategoryID): OptionUI_Category|undefined{
    var ret: OptionUI_Category|undefined
    var page = getOptionPageFromID(id)

    if(page?.categories){
        $.each(page.categories, function(_, v){
            if(v.id===categoryId){
                ret = v
                return true
            }
        })
    }
    return ret
}

export function getOptionCategory(page?: OptionUI_Page, categoryId?: OptionUI_CategoryID): OptionUI_Category|undefined{
    var ret: OptionUI_Category|undefined

    if(page?.categories){
        $.each(page.categories, function(_, v){
            if(v.id===categoryId){
                ret = v
                return true
            }
        })
    }
    return ret
}


/* Option Data */
export function getOptionFromID(id: OptionUI_ItemID): OptionUI_Item|undefined{
    var ret: OptionUI_Item|undefined
    OptionUI_Items.forEach(function(v){
        if(v.id === id){
            ret = v
            return true
        }
    })
    return ret
}

export function getOptionParentID(option?: OptionUI_Item): OptionUI_ItemID|undefined{
    if(option !== undefined){
        return option.location.parent
    }
    return
}

export function getOptionParentIDFromID(id: OptionUI_ItemID): OptionUI_ItemID|undefined{
    return getOptionParentID(getOptionFromID(id))
}

export function getOptionParent(option?: OptionUI_Item): OptionUI_Item|undefined{
    var parentId = getOptionParentID(option)
    if(parentId){
        return getOptionFromID(parentId)
    }else{
        return
    }
}

export function getOptionParentFromID(id: OptionUI_ItemID): OptionUI_Item|undefined{
    return getOptionParent(getOptionFromID(id))
}

export function getOptionChildrenFromID(id: OptionUI_ItemID): Array<OptionUI_Item>{
    var ret: Array<OptionUI_Item> = []

    if(parent){
        $.each(OptionUI_Items, function(_, v){
            if(v.location){
                if(v.location.parent === id){
                    ret.push(v)
                }
            }
        })
    }
    return ret
}

export function getOptionParentTree(option?: OptionUI_Item): Array<OptionUI_Item>{
    let ret: Array<OptionUI_Item> = []

    function parent(o?: OptionUI_Item){
        if(o !== undefined){
            ret.push(o)
            parent(getOptionParent(o))
        }
    }

    parent(option)
    return ret.reverse()
}


/* favorite */
export function appendFavoriteOption(id: OptionUI_ItemID){
    nt.storage.local.get("extFavoriteOptions").then(function(data){
        var list: Array<OptionUI_ItemID> = data.extFavoriteOptions

        var opt: OptionUI_Item|undefined = getOptionFromID(id)
        var targetIdx: number = 0
        var objectIds: Array<OptionUI_ItemID> = []

        if(opt){
            objectIds.push(opt.id)

            // idが子で親が存在しないときは一番若い子の直前に親を配置する
            var parent: OptionUI_Item|undefined =  getOptionParent(opt)
            if(parent){
                if(!list.includes(parent.id)){
                    var children = getOptionChildrenFromID(parent.id)
                    if(children.length>0){
                        $.each(children, function(_, child){
                            var idx = list.indexOf(child.id)
                            if(idx>=0){
                                targetIdx = Math.min(targetIdx, idx)
                            }
                        })
                        objectIds.splice(0, 0, parent.id)
                    }
                }
            }

            // idが親だった場合、一番若い子の直前に親を配置する
            var children: Array<OptionUI_Item> = getOptionChildrenFromID(opt.id)
            if(children.length>0){
                $.each(children, function(_, child){
                    var idx = list.indexOf(child.id)
                    if(idx>=0){
                        targetIdx = Math.min(targetIdx, idx)
                    }
                })
                $.each(children, function(_, child){
                    list = list.filter((v)=>v !== child.id)
                    if(!objectIds.includes(child.id)){
                        objectIds.push(child.id)
                    }
                })
            }


            $.each(objectIds, function(_, p){
                if(list.includes(p)){
                    list = list.filter((v)=>v !==p)
                }
            })
            list.splice(targetIdx, 0, ...objectIds)
            data.set("extFavoriteOptions", list)
            nt.storage.local.set(data.get("extFavoriteOptions"))
        }
    })
}

export function removeFavoriteOption(id: OptionUI_ItemID){
    nt.storage.local.get("extFavoriteOptions").then(function(data){
        var list: Array<OptionUI_ItemID> = data.extFavoriteOptions

        var opt = getOptionFromID(id)
        if(opt){
            //リストからidを削除
            var option: OptionUI_Item = opt
            list = list.filter((v)=>v !== option.id)

            // idが親だった場合、子のidをすべて削除
            const children: Array<OptionUI_Item> = getOptionChildrenFromID(option.id)
            $.each(children, function(_, child){
                if(list.includes(child.id)){
                    list = list.filter((v)=>v !== child.id)
                }
            })

            // idが子で、その兄弟がゼロであったときに親を削除する
            const parent: OptionUI_Item|undefined = getOptionParent(option)
            if(parent){
                const parentId = parent.id
                var p_children = getOptionChildrenFromID(parentId)
                var flag = false
                $.each(p_children, function(_, child){
                    if(list.includes(child.id)){
                        flag = true
                        return false
                    }
                })
                if(!flag){
                    list = list.filter((v)=>v !== parentId)
                }
            }

            nt.storage.local.set({extFavoriteOptions: list})
        }
    })
}

export function moveFavoriteOption(id: OptionUI_ItemID, pos: number){
    nt.storage.local.get("extFavoriteOptions").then(function(data){
        var list: Array<OptionUI_ItemID> = data.extFavoriteOptions

        if(!list.includes(id)){
            return false
        }

        /* リストにある要素が親 -> 子を別のリストに分離 */
        var childrenList: Record<string,any> = {}
        $.each(list, function(_, parentId){
            const children: Array<OptionUI_Item> = getOptionChildrenFromID(parentId)
            $.each(children, function(_, child){
                if(list.includes(child.id)){
                    if(Array.isArray(childrenList[parentId])){
                        childrenList[parentId].push(child.id)
                    }else{
                        childrenList[parentId] = [child.id]
                    }
                    list = list.filter((v)=>v!==child.id)
                }
            })
        })

        /* リストにある要素が子 */
        $.each(list, function(_, childId){
            const parentId: OptionUI_ItemID|undefined = getOptionParentIDFromID(childId)
            if(parentId && list.includes(parentId)){
                if(Array.isArray(childrenList[parentId])){
                    childrenList[parentId].push(childId)
                }else{
                    childrenList[parentId] = [childId]
                }
                if(childId===id){
                    id = parentId
                }
                list = list.filter((v)=>v!==childId)
            }
        })

        /* リストの要素を移動 */
        var current: number = list.indexOf(id)
        if(current >= 0){
            var target = nt.math.limit(current + pos, 0, list.length)
            if(target === current){
                return false
            }

            var tail = list.slice(current + 1)
            list.splice(current)
            Array.prototype.push.apply(list, tail);
            list.splice(target, 0, id);

            $.each(list, function(_, id){
                if(id in childrenList){
                    list.splice(list.indexOf(id) + 1, 0, ...childrenList[id])
                }
            })
            data.set("extFavoriteOptions", list)

            nt.storage.local.set(data.get("extFavoriteOptions"))
        }
    })
}

export function insertFavoriteOption(from: OptionUI_ItemID, to: OptionUI_ItemID){
    nt.storage.local.get("extFavoriteOptions").then(function(data){
        var list: Array<OptionUI_ItemID> = data.extFavoriteOptions

        if(!list.includes(from) || !list.includes(to)){
            return false
        }
        
        var childrenList: Record<string,any> = {}
        $.each(list, function(_, parentId){
            const children: Array<OptionUI_Item> = getOptionChildrenFromID(parentId)
            $.each(children, function(_, child){
                if(list.includes(child.id)){
                    if(Array.isArray(childrenList[parentId])){
                        childrenList[parentId].push(child.id)
                    }else{
                        childrenList[parentId] = [child.id]
                    }
                    list = list.filter((v)=>v!==child.id)
                }
            })
        })

        /* リストにある要素が子 */
        $.each(list, function(_, childId){
            const parentId: OptionUI_ItemID|undefined = getOptionParentIDFromID(childId)
            if(parentId && list.includes(parentId)){
                if(Array.isArray(childrenList[parentId])){
                    childrenList[parentId].push(childId)
                }else{
                    childrenList[parentId] = [childId]
                }
                if(childId===from){
                    from = parentId
                }else if(childId===to){
                    to = parentId
                }
                list = list.filter((v)=>v!==childId)
            }
        })

        var current: number = list.indexOf(from)
        var target: number = list.indexOf(to)

        if(current >= 0){
            var tail = list.slice(current + 1)
            list.splice(current)
            Array.prototype.push.apply(list, tail);
            list.splice(target, 0, from);

            $.each(list, function(_, id){
                if(id in childrenList){
                    list.splice(list.indexOf(id) + 1, 0, ...childrenList[id])
                }
            })
            data.set("extFavoriteOptions", list)

            nt.storage.local.set(data.get("extFavoriteOptions"))
        }
    })
}



/**
 * storageの不要なパラメータをフォーマットする
 * @param {bool} _fixLocal - nt.storage.localをフォーマットする
 * @param {bool} _fixSync - nt.storage.syncをフォーマットする
 */
export function fixOption(_fixLocal: boolean = false, _fixSync: boolean = false){
    if(_fixLocal){
        nt.storage.local.get(null).then((data)=>{
            var option = new nt.storage.local.options(data).get()
            nt.storage.local.clear().then(()=>{
                nt.storage.local.set(option).then(function(){
                    console.log("Fixed option data (local).", option)
                })
            })
        })
    }
    
    if(_fixSync){
        nt.storage.sync.get(null).then((data)=>{
            var option = new nt.storage.sync.options(data).get()
            nt.storage.sync.clear().then(()=>{
                nt.storage.sync.set(option).then(function(){
                    console.log("Fixed option data (sync).", option)
                })
            })
        })
    }
}