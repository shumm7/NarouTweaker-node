import { OptionUI_Items, OptionUI_Pages } from "./optionUI_items";
import { LocalOptions, SyncOptions } from "../../utils/option";
import { OptionUI_Category, OptionUI_CategoryID, OptionUI_Item, OptionUI_ItemID, OptionUI_Page, OptionUI_PageID } from "./optionUI_type.js";

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

    if(page){
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

    if(page){
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
    if(option instanceof OptionUI_Item){
        if(option.location){
            if(option.location.hasParent){
                return option.location.parent
            }
        }
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

export function getOptionChildsFromID(id: OptionUI_ItemID): Array<OptionUI_Item>{
    var ret: Array<OptionUI_Item> = []

    if(parent){
        $.each(OptionUI_Items, function(_, v){
            if(v.location){
                if(v.location.hasParent && v.location.parent === id){
                    ret.push(v)
                }
            }
        })
    }
    return ret
}


/* favorite */
export function appendFavoriteOption(id: OptionUI_ItemID){
    chrome.storage.local.get("extFavoriteOptions", function(data){
        var list: Array<OptionUI_ItemID> = []
        if(Array.isArray(data.extFavoriteOptions)){
            list = data.extFavoriteOptions
        }

        var opt = getOptionFromID(id)
        var targetIdx = 0
        var objectIds: Array<OptionUI_ItemID> = []
        if(opt){
            objectIds.push(opt.id)

            // idが子で親が存在しないときは一番若い子の直前に親を配置する
            var parent =  getOptionParent(opt)
            if(parent){
                if(!list.includes(parent.id)){
                    var childs = getOptionChildsFromID(parent.id)
                    if(childs.length>0){
                        $.each(childs, function(_, child){
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
            var childs = getOptionChildsFromID(opt.id)
            if(childs.length>0){
                $.each(childs, function(_, child){
                    var idx = list.indexOf(child.id)
                    if(idx>=0){
                        targetIdx = Math.min(targetIdx, idx)
                    }
                })
                $.each(childs, function(_, child){
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
            chrome.storage.local.set({extFavoriteOptions: list})
        }
    })
}

export function removeFavoriteOption(id: OptionUI_ItemID){
    chrome.storage.local.get("extFavoriteOptions", function(data){
        var list = data.extFavoriteOptions
        if(!Array.isArray(list)){
            list = []
        }

        var opt = getOptionFromID(id)
        if(opt){
            //リストからidを削除
            var option: OptionUI_Item  = opt
            list = list.filter((v)=>v !== option.id)

            // idが親だった場合、子のidをすべて削除
            var childs = getOptionChildsFromID(option.id)
            $.each(childs, function(_, child){
                if(list.includes(child.id)){
                    list = list.filter((v)=>v !== child.id)
                }
            })

            // idが子で、その兄弟がゼロであったときに親を削除する
            var parent = getOptionParent(option)
            if(parent){
                const parentId = parent.id
                var childs = getOptionChildsFromID(parentId)
                var flag = false
                $.each(childs, function(_, child){
                    if(list.includes(child.id)){
                        flag = true
                        return false
                    }
                })
                if(!flag){
                    list = list.filter((v)=>v !== parentId)
                }
            }

            chrome.storage.local.set({extFavoriteOptions: list})
        }
    })
}

export function moveFavoriteOption(id, pos){
    chrome.storage.local.get("extFavoriteOptions", function(data){
        var list = data.extFavoriteOptions
        if(!Array.isArray(list)){
            list = []
        }
        if(!list.includes(id)){
            return false
        }

        /* リストにある要素が親 -> 子を別のリストに分離 */
        var childsList = {}
        $.each(list, function(_, parentId){
            var childs = getOptionChildsFromID(parentId)
            $.each(childs, function(_, child){
                if(list.includes(child.id)){
                    if(Array.isArray(childsList[parentId])){
                        childsList[parentId].push(child.id)
                    }else{
                        childsList[parentId] = [child.id]
                    }
                    list = list.filter((v)=>v!==child.id)
                }
            })
        })

        /* リストにある要素が子 */
        $.each(list, function(_, childId){
            var parentId = getOptionParentIDFromID(childId)
            if(parentId && list.includes(parentId)){
                if(Array.isArray(childsList[parentId])){
                    childsList[parentId].push(childId)
                }else{
                    childsList[parentId] = [childId]
                }
                if(childId===id){
                    id = parentId
                }
                list = list.filter((v)=>v!==childId)
            }
        })

        /* リストの要素を移動 */
        var current = list.indexOf(id)
        if(current >= 0){
            var target = current + pos
            if(target < 0){
                target = 0
            }
            if(target > list.length){
                target = list.length
            }
            if(target === current){
                return false
            }

            var tail = list.slice(current + 1)
            list.splice(current)
            Array.prototype.push.apply(list, tail);
            list.splice(target, 0, id);

            $.each(list, function(_, id){
                if(id in childsList){
                    list.splice(list.indexOf(id) + 1, 0, ...childsList[id])
                }
            })

            chrome.storage.local.set({extFavoriteOptions: list})
        }


    })
}


/* format */
export function fixOption(local, sync){
    if(local){
        chrome.storage.local.get(null, (data)=>{
            chrome.storage.local.clear(()=>{
                var option = new LocalOptions(data)

                chrome.storage.local.set(option.get(), function(){
                    console.log("Fixed option data (local).")
                })
            })
        })
    }
    
    if(sync){
        chrome.storage.sync.get(null, (data)=>{
            chrome.storage.sync.clear(()=>{
                var option = new SyncOptions(data)

                chrome.storage.sync.set(option.get(), function(){
                    console.log("Fixed option data (sync).")
                })
            })
        })
    }
}