import { nt } from "../../utils/narou-tweaker";

import Sortable from 'sortablejs'
import $ from 'jquery';

export function workspace_customHeaderSortable(){
    /* Workspace Header */
    function storeWorkspaceHeader(){
        nt.storage.local.set("workspaceCustomHeader", getHeaderIconList("active"))
    
        function getHeaderIconList(position: string){
            if(position!="active" && position!="disabled") { return }
        
            var list: Array<nt.header.iconId> = []
            $(".draggable_area[name='workspace-header']#"+position+" .icon-element").each((_, icon)=>{
                const id = $(icon).attr("id")
                if(id!==undefined){
                    list.push(id)
                }
            })
            return list;
        }
    }

    if($(".draggable_area[name='workspace-header']").length){
        Sortable.create($(".draggable_area[name='workspace-header']#active")[0], {
            handle: '.icon-element',
            sort: true,
            group: {
                name: 'header-icon',
                pull: true,
                put: function(to, from){
                    return to.el.children.length < 6;
                }
            },
            animation: 150,
            onSort: function () {
                storeWorkspaceHeader();
            },
        });
        Sortable.create($(".draggable_area[name='workspace-header']#disabled")[0], {
            handle: '.icon-element',
            animation: 150,
            sort: true,
            group: {
                name: 'header-icon',
                pull: true,
                put: true,
            },
            onSort: function () {
                storeWorkspaceHeader();
            },
            
        });
    }



    /* Workspace Header */
    function getWorkspaceHeaderIconElement(id: nt.header.iconId){
        let icon = nt.header.workspaceIconList[id]
        var c = ""
        if("isDropdown" in icon){
            if(icon.isDropdown){
                c = `<i class="fa-solid fa-caret-down" style="margin-left: .2em;"></i>`
            }
        }

        return `
        <div id="${id}" class="icon-element" draggable="true">
            <i class="${icon.icon}"></i>
            <span class="title">${icon.text}</span>
            ${c}
        </div>`
    }

    function restoreSortable(){
        function restore(data: Array<nt.header.iconId>, position: string){
            $(".draggable_area[name='workspace-header']#"+position).empty()
            $.each(data, (_, icon)=>{
                $(".draggable_area[name='workspace-header']#"+position).append(getWorkspaceHeaderIconElement(icon))
            })
        }
        nt.storage.local.get(["workspaceCustomHeader"]).then(function(data){
            restore(data.workspaceCustomHeader, "active")
            restore(nt.header.getExcludeIcons([data.workspaceCustomHeader], nt.header.workspaceIconList), "disabled")
        })
    }

    restoreSortable()
    nt.storage.local.changed("workspaceCustomHeader", function(changes){
        restoreSortable()
    })
}

export function workspace_customHeaderMenuSortable(){
    /* Workspace Header Menu */
    function storeWorkspaceHeaderMenu(){
        nt.storage.local.set({
            workspaceCustomMenu_Left: getMenuIconList("left"),
            workspaceCustomMenu_Middle: getMenuIconList("middle"),
            workspaceCustomMenu_Right: getMenuIconList("right"),
        })
    
        function getMenuIconList(position: "left" | "middle" | "right" | "disabled"){
            if(position!="left" && position!="middle" && position!="right" && position!="disabled") { return }
        
            var list: Array<nt.header.iconId> = []
            $(".draggable_area[name='workspace-header-menu']#"+position+" .icon-element").each((_, icon)=>{
                const id: nt.header.iconId|undefined = $(icon).attr("id")
                if(id!==undefined){
                    list.push(id)
                }
            })
            return list;
        }
    }
    
    if($(".draggable_area[name='workspace-header-menu']").length){
        Sortable.create($(".draggable_area[name='workspace-header-menu']#left")[0], {
            handle: '.icon-element',
            sort: true,
            group: {
                name: 'menu-icon',
                pull: true,
                put: true
            },
            animation: 150,
            onSort: function () {
                storeWorkspaceHeaderMenu();
            },
        });
        Sortable.create($(".draggable_area[name='workspace-header-menu']#middle")[0], {
            handle: '.icon-element',
            sort: true,
            group: {
                name: 'menu-icon',
                pull: true,
                put: true
            },
            animation: 150,
            onSort: function () {
                storeWorkspaceHeaderMenu();
            },
        });
        Sortable.create($(".draggable_area[name='workspace-header-menu']#right")[0], {
            handle: '.icon-element',
            sort: true,
            group: {
                name: 'menu-icon',
                pull: true,
                put: true
            },
            animation: 150,
            onSort: function () {
                storeWorkspaceHeaderMenu();
            },
        });
        Sortable.create($(".draggable_area[name='workspace-header-menu']#disabled")[0], {
            handle: '.icon-element',
            sort: true,
            group: {
                name: 'menu-icon',
                pull: true,
                put: true
            },
            animation: 150,
            onSort: function () {
                storeWorkspaceHeaderMenu();
            },
        });
    }

    /* Workspace Header Menu */
    function getWorkspaceHeaderMenuIconElement(id: nt.header.iconId){
        let icon = nt.header.workspaceMenuIconList[id]

        return `
        <div id="${id}" class="icon-element" draggable="true">
            <i class="${icon.icon}"></i>
            <span class="title">${icon.text}</span>
        </div>`
    }

    function restoreSortable(){
        function restore(data: Array<nt.header.iconId>, position: string){
            $(".draggable_area[name='workspace-header-menu']#"+position).empty()
            $.each(data, (_, icon)=>{
                $(".draggable_area[name='workspace-header-menu']#"+position).append(getWorkspaceHeaderMenuIconElement(icon))
            })
        }
        nt.storage.local.get(["workspaceCustomMenu_Left", "workspaceCustomMenu_Middle", "workspaceCustomMenu_Right"]).then(function(data){
            restore(data.workspaceCustomMenu_Left, "left")
            restore(data.workspaceCustomMenu_Middle, "middle")
            restore(data.workspaceCustomMenu_Right, "right")
            restore(nt.header.getExcludeIcons([data.workspaceCustomMenu_Left, data.workspaceCustomMenu_Middle, data.workspaceCustomMenu_Right], nt.header.workspaceMenuIconList), "disabled")
        })
    }

    restoreSortable()
    nt.storage.local.changed(["workspaceCustomMenu_Left", "workspaceCustomMenu_Middle", "workspaceCustomMenu_Right"], function(changes){
        restoreSortable()
    })
}