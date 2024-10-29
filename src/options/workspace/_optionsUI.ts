export const OptionUI_CustomElement_workspace: Record<string,string> = {
    ui_workspaceCustomHeaderDraggable: `
        <div class="draggable_area_container" id="workspace_header_icon">
            <div class="draggable_area_outer draggable_area_header">
                <div class="title">表示</div>
                <div class="draggable_area" id="active" name="workspace-header"></div>
            </div>
            <div class="draggable_area_outer draggable_area_header">
                <div class="title">非表示</div>
                <div class="draggable_area" id="disabled" name="workspace-header"></div>
            </div>
        </div>
    `,

    ui_workspaceCustomHeaderMenuDraggable: `
        <div class="draggable_area_container" id="workspace_menu_icon">
            <div class="draggable_area_outer draggable_area_menu">
                <div class="title">左</div>
                <div class="draggable_area" id="left" name="workspace-header-menu"></div>
            </div>
            <div class="draggable_area_outer draggable_area_menu">
                <div class="title">中</div>
                <div class="draggable_area" id="middle" name="workspace-header-menu"></div>
            </div>
            <div class="draggable_area_outer draggable_area_menu">
                <div class="title">右</div>
                <div class="draggable_area" id="right" name="workspace-header-menu"></div>
            </div>
            <div class="draggable_area_outer draggable_area_menu">
                <div class="title">非表示</div>
                <div class="draggable_area" id="disabled" name="workspace-header-menu"></div>
            </div>
        </div>
    `,

}