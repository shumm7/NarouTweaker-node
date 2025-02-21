import * as React from 'react';
import { SxProps, Theme } from '@mui/material';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Active, Announcements, closestCorners, CollisionDetection, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, MouseSensor, Over, PointerSensor, UniqueIdentifier, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from "@dnd-kit/utilities";
import { SortableData, sortableKeyboardCoordinates, useSortable, arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import ContentItem_Head from '../module/Head';
import { FontAwseomeIcon } from '../../common/Icon';
import { nt } from '../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type';

const maxAmount = 6
const boxHeight = 350
const listContainerId = "nt-workspace-custom-header-sortable"

function IconOverlay(props: { icon: string, style?: SxProps<Theme> }) {
    const icon = getIconData(props.icon)

    if (icon) {
        return (
            <ListItem
                sx={{
                    cursor: "grabbing",
                    backgroundColor: "action.hover",
                }}
            >
                {
                    icon.icon &&
                    <ListItemIcon sx={{ alignItems: "center" }}>
                        <FontAwseomeIcon icon={icon.icon} style={{ fontSize: "14px" }} />
                    </ListItemIcon>
                }

                <ListItemText
                    primary={
                        icon.isDropdown ?
                            <Stack direction="row" spacing={1} gap={1}>
                                {icon.text}
                                <Typography sx={{ color: "inherit" }}>
                                    <FontAwseomeIcon icon={{ icon: "caret-down", prefix: "solid" }} />
                                </Typography>
                            </Stack>
                            :
                            icon.text
                    }

                />
            </ListItem>
        )
    }
}

export default function Workspace_CustomHeader(props: OptionUI_ItemProps) {
    const storage = props.storage
    const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }));

    const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>();
    const [list, setList] = useState<Array<nt.header.iconId>>()
    const [dialogEdit, setDialogEdit] = useState<boolean>(false)
    const [dialogEditChecked, setdialogEditChecked] = useState<Array<nt.header.iconId>>([])
    const addedAmount = list ? dialogEditChecked.filter(v => !list.includes(v)).length : 0
    const removedAmount = list ? list.filter(v => !dialogEditChecked.includes(v)).length : 0

    if (storage !== undefined && list === undefined) {
        const v = storage.workspaceCustomHeader
        if (Array.isArray(v)) {
            setList(v.filter(v => typeof v === "string"))
        } else {
            setList([])
        }

        nt.storage.local.changed(["workspaceCustomHeader"], (changes) => {
            if (changes.workspaceCustomHeader) {
                const s = changes.workspaceCustomHeader.newValue
                if (Array.isArray(s)) {
                    setList(s.filter(v => typeof v === "string"))
                }
            }
        })
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const data = getData(event);
        if (data && list) {
            const { from, to } = data;

            var newList: Array<nt.header.iconId> = arrayMove(list, from.index, to.index)
            setList(newList)
            nt.storage.local.set({
                workspaceCustomHeader: newList
            })
        }
    }

    const handleEditClose = () => {
        if (list) {
            let add = dialogEditChecked.filter(v => !list.includes(v))
            if (dialogEdit) {
                nt.storage.local.set({
                    workspaceCustomHeader: [...list.filter(v => dialogEditChecked.includes(v)), ...add]
                })
            }
        }
        setDialogEdit(false)
        setdialogEditChecked([])
    }

    function IconElement(props: { icon: nt.header.iconId, index: number }) {
        const iconId = props.icon
        const icon = getIconData(iconId)
        const { index } = props
        const { active, attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: iconId, data: { index, icon: iconId, type: "sortable" } });

        if (icon) {
            return (
                <div
                    ref={setNodeRef}
                    style={{
                        opacity: iconId === active?.id ? 0 : 1,
                        transform: CSS.Transform.toString(transform),
                        //transition: transition,
                        cursor: isDragging ? "grabbing" : "grab",

                    }}
                    {...attributes}
                    {...listeners}
                >
                    <ListItem
                        sx={{
                            "&:hover": {
                                backgroundColor: "action.hover"
                            }
                        }}
                        secondaryAction={
                            <Stack direction="row">
                                <IconButton
                                    edge="end"
                                    aria-label="削除"
                                    onClick={() => {
                                        if (list) {
                                            nt.storage.local.set({
                                                workspaceCustomHeader: list.toSpliced(index, 1)
                                            })
                                        }
                                    }}
                                    sx={{ color: "text.secondary" }}
                                >
                                    <FontAwseomeIcon icon={{ icon: "xmark", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                </IconButton>
                            </Stack>
                        }
                    >
                        {
                            icon.icon &&
                            <ListItemIcon sx={{ alignItems: "center" }}>
                                <FontAwseomeIcon icon={icon.icon} style={{ fontSize: "14px" }} />
                            </ListItemIcon>
                        }

                        <ListItemText
                            primary={
                                icon.isDropdown ?
                                    <Stack direction="row" spacing={1} gap={1}>
                                        {icon.text}
                                        <Typography sx={{ color: "inherit", ml: 1 }}>
                                            <FontAwseomeIcon icon={{ icon: "caret-down", prefix: "solid" }} />
                                        </Typography>
                                    </Stack>
                                    :
                                    icon.text
                            }
                        />
                    </ListItem>
                </div>
            )
        }
    }

    function Container(props: { list: Array<nt.header.iconId>, id: string }) {
        const { setNodeRef } = useDroppable({ id: props.id, data: { type: "droppable", id: props.id } });

        return (
            <SortableContext
                id={props.id}
                items={props.list}
                strategy={verticalListSortingStrategy}
            >
                <List
                    ref={setNodeRef}
                    sx={{
                        width: 1,
                        maxHeight: boxHeight,
                        height: boxHeight,
                        overflowY: "auto",
                        overflowX: "hidden",
                        borderRadius: 1,
                        paddingTop: 0,
                        paddingBottom: 0,
                        backgroundColor: "background.paper",
                        scrollBehavior: "smooth",
                    }}
                >

                    <ListSubheader
                        sx={{
                            borderBottom: "1px solid",
                            borderBottomColor: "divider",
                            color: "text.secondary",
                            textAlign: "right"
                        }}
                    >
                        <Stack direction="row" sx={{ justifyContent: "space-between", py: 1 }}>
                            <Typography variant='body2' sx={{ color: "text.secondary" }}>
                                {`${list?.length ?? 0}/${maxAmount}`}
                            </Typography>
                            <IconButton
                                aria-label="追加"
                                onClick={() => {
                                    if (list) {
                                        setdialogEditChecked(list)
                                        setDialogEdit(true)
                                    }
                                }}
                            >
                                <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                            </IconButton>
                        </Stack>
                    </ListSubheader>
                    {
                        props.list.map((v, i) => <IconElement icon={v} index={i} />)
                    }
                </List>
            </SortableContext>
        )
    }

    function DialogEditIcon(props: { checked?: boolean, added?: boolean }) {
        const { checked, added } = props
        if (checked && !added) {
            return (
                <Typography sx={{ color: "text.secondary" }}>
                    <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                </Typography>
            )
        } else if (!checked && added) {
            return (
                <Typography sx={{ color: "text.secondary" }}>
                    <FontAwseomeIcon icon={{ icon: "minus", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                </Typography>
            )
        }
        return null
    }

    return (
        <>
            <Stack
                direction="column"
                sx={{
                    width: "100%",
                    justifyContent: "space-between"
                }}
            >
                <ContentItem_Head {...props} />
                <DndContext
                    accessibility={{
                        //announcements: defaultAnnouncements
                    }}
                    collisionDetection={closestCorners}
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <Stack
                        sx={{
                            height: "inherit",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: "auto",
                            my: 2
                        }}
                        direction="row"
                        gap={1}
                    >
                        {
                            (storage !== undefined && list !== undefined) ?
                                <Container list={list} id={listContainerId} />
                                :
                                <Skeleton variant="rounded" width="100%">
                                    <Box sx={{ width: 1, borderRadius: 1, height: boxHeight }} />
                                </Skeleton>
                        }
                    </Stack>
                    <DragOverlay>
                        {typeof activeId === "string" ? <IconOverlay icon={activeId} /> : null}
                    </DragOverlay>
                </DndContext>
            </Stack>

            <Dialog
                fullWidth
                open={dialogEdit}
                onClose={handleEditClose}
                PaperProps={{
                    elevation: 1,
                }}
            >
                <DialogTitle>アイテムを追加</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleEditClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: "text.secondary",
                    })}
                >
                    <FontAwseomeIcon icon={{ icon: "xmark", prefix: "solid" }} style={{ color: "inherit" }} />
                </IconButton>
                <DialogContent
                    dividers
                    sx={{
                        borderBottom: "none"
                    }}
                >
                    <DialogContentText>
                        <Stack spacing={1} direction="column">
                            <List
                                sx={{
                                    width: 1,
                                    height: boxHeight,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    borderRadius: 1,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    backgroundColor: "background.paper",
                                    scrollBehavior: "smooth",
                                }}
                            >
                                <ListSubheader
                                    sx={{
                                        borderBottom: "1px solid",
                                        borderBottomColor: "divider",
                                        color: "text.secondary",
                                        textAlign: "right"
                                    }}
                                >
                                    <Stack direction="row" sx={{ justifyContent: "flex-start", py: 1 }}>
                                        <Typography variant='body2' sx={{ color: "text.secondary" }}>
                                            {`${(list?.length ?? 0) + addedAmount - removedAmount}/${maxAmount}`}
                                        </Typography>
                                    </Stack>
                                </ListSubheader>
                                {
                                    Array.from(Object.entries(nt.header.workspaceIconList)).map((entry, i) => {
                                        const id = entry[0]
                                        const icon = entry[1]
                                        const labelId = `nt-workspace-custom-header-sortable--add-checkbox-${i}`
                                        const checked = dialogEditChecked.includes(id)
                                        const added = dialogEdit && list?.includes(id)

                                        const amount = (list?.length ?? 0) + addedAmount - removedAmount

                                        let disabled = false
                                        if (!checked && amount >= maxAmount) {
                                            disabled = true
                                        }

                                        return (
                                            <ListItem
                                                sx={{
                                                    "&:hover": {
                                                        backgroundColor: "action.hover"
                                                    }
                                                }}
                                                secondaryAction={<DialogEditIcon checked={checked} added={added} />}
                                                disablePadding
                                            >
                                                <ListItemButton
                                                    role={undefined}
                                                    disabled={disabled}
                                                    onClick={() => {
                                                        if (dialogEditChecked.includes(id)) {
                                                            setdialogEditChecked(dialogEditChecked.filter(v => v !== id))
                                                        } else {
                                                            setdialogEditChecked([...dialogEditChecked, id])
                                                        }
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ alignItems: "center" }}>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={checked}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            disabled={disabled}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                        {icon.icon && <FontAwseomeIcon icon={icon.icon} style={{ fontSize: "14px" }} />}
                                                    </ListItemIcon>

                                                    <ListItemText
                                                        id={labelId}
                                                        primary={
                                                            icon.isDropdown ?
                                                                <Stack direction="row" spacing={1} gap={1}>
                                                                    {icon.text}
                                                                    <Typography sx={{ color: "inherit", ml: 1 }}>
                                                                        <FontAwseomeIcon icon={{ icon: "caret-down", prefix: "solid" }} />
                                                                    </Typography>
                                                                </Stack>
                                                                :
                                                                icon.text
                                                        }
                                                        slotProps={{
                                                            primary: {
                                                                sx: {
                                                                    color: (checked && !added) || (!checked && added) ? "text.primary" : "text.secondary",
                                                                    textDecoration: (!checked && added) ? "line-through" : "inherit",
                                                                    fontWeight: (checked && !added) || (!checked && added) ? "bold" : "inherit",
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                            <Typography sx={{ color: "text.primary", fontSize: "90%" }}>
                                {`追加するアイテム：${addedAmount}`}
                            </Typography>
                            <Typography sx={{ color: "text.primary", fontSize: "90%" }}>
                                {`削除するアイテム：${removedAmount}`}
                            </Typography>
                        </Stack>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}


function getIconData(iconId: nt.header.iconId): nt.header.iconItem | void {
    if (iconId in nt.header.workspaceIconList) {
        return nt.header.workspaceIconList[iconId]
    }
}

function getFromData(active: Active): { id: UniqueIdentifier, index: number, icon: string } | void {
    const id = active.id
    if (typeof id === "string") {
        const index = active.data.current?.index
        const icon = active.data.current?.icon

        if (!isFinite(index) || typeof icon !== "string") {
            return
        }

        return {
            id: id,
            index: index,
            icon: icon
        }
    }
};

function getToData(over: Over): { id: UniqueIdentifier, index: number, icon: string } | void {
    const id = over.id
    if (typeof id === "string") {
        const index = over.data.current?.index
        const icon = over.data.current?.icon
        const type = over.data.current?.type

        if (type === "sortable") {
            if (!isFinite(index) || typeof icon !== "string") {
                return
            }

            return {
                id: id,
                index: index,
                icon: icon
            }
        } else if (type === "droppable") {
            return {
                id: id,
                index: -1,
                icon: ""
            }
        }
    }
};

function getData(event: { active: Active; over: Over | null }) {
    const { active, over } = event
    if (over === null) {
        return
    }

    if (active.id === over.id) {
        return
    }

    const from = getFromData(active)
    const to = getToData(over)

    if (from && to) {
        return { from: from, to: to };
    }
};

const defaultAnnouncements: Announcements = {
    onDragStart({ active }) {
        console.log(`Picked up draggable item [${active.id}].`);
        return undefined
    },
    onDragOver({ active, over }) {
        if (over) {
            console.log(
                `Draggable item [${active.id}] was moved over droppable area [${over.id}].`
            );
            return undefined
        }

        console.log(`Draggable item [${active.id}] is no longer over a droppable area.`);
        return undefined
    },
    onDragEnd({ active, over }) {
        if (over) {
            console.log(
                `Draggable item [${active.id}] was dropped over droppable area [${over.id}]`
            );
            return undefined
        }

        console.log(`Draggable item [${active.id}] was dropped.`);
        return undefined
    },
    onDragCancel({ active }) {
        console.log(`Dragging was cancelled. Draggable item [${active.id}] was dropped.`);
        return undefined
    }
};