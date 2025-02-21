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

const boxHeight = 500
const listLeftContainerId = "nt-novel-custom-header-sortable-left"
const listRightContainerId = "nt-novel-custom-header-sortable-right"

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
                                <Typography sx={{ color: "inherit", ml: 1 }}>
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

export default function Novel_CustomHeader(props: OptionUI_ItemProps) {
    const storage = props.storage
    const sensors = useSensors(
        /*
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),
        */
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
    );

    const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>();
    const [listLeft, setListLeft] = useState<Array<nt.header.iconId>>()
    const [listRight, setListRight] = useState<Array<nt.header.iconId>>()
    const [dialogEdit, setDialogEdit] = useState<"left" | "right" | undefined>()
    const [dialogEditChecked, setdialogEditChecked] = useState<Array<nt.header.iconId>>([])
    const [dialogEditHideAdded, setDialogEditHideAdded] = useState<boolean>(true)

    if (storage !== undefined && (listLeft === undefined || listRight === undefined)) {
        const vl = storage.novelCustomHeaderLeft
        const vr = storage.novelCustomHeaderRight
        if (Array.isArray(vl)) {
            setListLeft(vl.filter(v => typeof v === "string"))
        } else {
            setListLeft([])
        }
        if (Array.isArray(vr)) {
            setListRight(vr.filter(v => typeof v === "string"))
        } else {
            setListRight([])
        }

        nt.storage.local.changed(["novelCustomHeaderLeft", "novelCustomHeaderRight"], (changes) => {
            if (changes.novelCustomHeaderLeft) {
                const s = changes.novelCustomHeaderLeft.newValue
                if (Array.isArray(s)) {
                    setListLeft(s.filter(v => typeof v === "string"))
                }
            }
            if (changes.novelCustomHeaderRight) {
                const s = changes.novelCustomHeaderRight.newValue
                if (Array.isArray(s)) {
                    setListRight(s.filter(v => typeof v === "string"))
                }
            }
        })
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const data = getData(event);
        if (data && listLeft && listRight) {
            const { from, to } = data;
            if (from.position === to.position) {
                return
            }

            var newListLeft: Array<nt.header.iconId> = []
            var newListRight: Array<nt.header.iconId> = []

            if (from.position === "left") {
                newListLeft = listLeft.toSpliced(from.index, 1)
            }
            else if (from.position === "right") {
                newListRight = listRight.toSpliced(from.index, 1)
            }

            if (to.position === "left") {
                newListLeft = listLeft.toSpliced(to.index, 0, from.icon)
            }
            else if (to.position === "right") {
                newListRight = listRight.toSpliced(to.index, 0, from.icon)
            }

            setListLeft(newListLeft)
            setListRight(newListRight)
            nt.storage.local.set({
                novelCustomHeaderLeft: newListLeft,
                novelCustomHeaderRight: newListRight
            })
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const data = getData(event);
        if (data && listLeft && listRight) {
            const { from, to } = data;

            if (from.position === "left") {
                var newList = arrayMove(listLeft, from.index, to.index)
                setListLeft(newList)
                nt.storage.local.set({
                    novelCustomHeaderLeft: newList
                })
            }
            else if (from.position === "right") {
                var newList = arrayMove(listRight, from.index, to.index)
                setListRight(newList)
                nt.storage.local.set({
                    novelCustomHeaderRight: newList
                })
            }
        }
    }

    const handleEditClose = () => {
        if (listRight && listLeft) {
            let add = dialogEditChecked.filter(v => !(listRight.includes(v) || listLeft.includes(v)))
            if (dialogEdit === "left") {
                nt.storage.local.set({
                    novelCustomHeaderLeft: [...listLeft.filter(v => dialogEditChecked.includes(v)), ...add]
                })
            } else if (dialogEdit === "right") {
                nt.storage.local.set({
                    novelCustomHeaderRight: [...listRight.filter(v => dialogEditChecked.includes(v)), ...add]
                })
            }
        }
        setDialogEdit(undefined)
        setdialogEditChecked([])
    }

    function IconElement(props: { icon: nt.header.iconId, index: number, position: "left" | "right" }) {
        const iconId = props.icon
        const icon = getIconData(iconId)
        const { index, position } = props
        const { active, attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: iconId, data: { index, position, icon: iconId, type: "sortable" } });

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
                                {
                                    /*
                                    <IconButton
                                        edge="start"
                                        aria-label={position === "right" ? "左へ移動" : "右へ移動"}
                                        onClick={() => {
                                            if (listLeft && listRight) {
                                                if (position === "right") {
                                                    nt.storage.local.set({
                                                        novelCustomHeaderLeft: listLeft.toSpliced(index, 0, iconId),
                                                        novelCustomHeaderRight: listRight.toSpliced(index, 1),
                                                    })
                                                } else {
                                                    nt.storage.local.set({
                                                        novelCustomHeaderLeft: listLeft.toSpliced(index, 1),
                                                        novelCustomHeaderRight: listRight.toSpliced(index, 0, iconId),
                                                    })
                                                }
                                            }
                                        }}
                                        sx={{ color: "text.secondary" }}
                                    >
                                        {
                                            position === "right" ? <FontAwseomeIcon icon={{ icon: "angles-left", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                                                : <FontAwseomeIcon icon={{ icon: "angles-right", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                                        }
                                    </IconButton>
                                    */
                                }
                                <IconButton
                                    edge="end"
                                    aria-label="削除"
                                    onClick={() => {
                                        if (listLeft && listRight) {
                                            if (position === "right") {
                                                nt.storage.local.set({
                                                    novelCustomHeaderRight: listRight.toSpliced(index, 1)
                                                })
                                            } else {
                                                nt.storage.local.set({
                                                    novelCustomHeaderLeft: listLeft.toSpliced(index, 1)
                                                })
                                            }
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

    function Container(props: { list: Array<nt.header.iconId>, id: string, position: "left" | "right" }) {
        const { setNodeRef } = useDroppable({ id: props.id, data: { position: props.position, type: "droppable", id: props.id } });

        return (
            <SortableContext
                id={props.id}
                items={props.list}
                strategy={verticalListSortingStrategy}
            >
                <List
                    ref={setNodeRef}
                    sx={{
                        width: 1 / 2,
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
                        <Stack direction="row" sx={{ justifyContent: "flex-end", py: 1 }}>
                            <IconButton
                                aria-label="追加"
                                onClick={() => {
                                    if (props.position === "right" && listRight) {
                                        setdialogEditChecked(listRight)
                                        setDialogEdit("right")
                                    } else if (props.position === "left" && listLeft) {
                                        setdialogEditChecked(listLeft)
                                        setDialogEdit("left")
                                    }
                                }}
                            >
                                <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                            </IconButton>
                        </Stack>
                    </ListSubheader>
                    {
                        props.list.map((v, i) => <IconElement icon={v} index={i} position={props.position} />)
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
                    onDragOver={handleDragOver}
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
                            (storage !== undefined && listLeft !== undefined && listRight !== undefined) ?
                                <>
                                    <Container list={listLeft} id={listLeftContainerId} position="left" />
                                    <Container list={listRight} id={listRightContainerId} position="right" />
                                </>
                                :
                                <>
                                    <Skeleton variant="rounded" width="100%">
                                        <Box sx={{ width: 1 / 2, borderRadius: 1, height: boxHeight }} />
                                    </Skeleton>
                                    <Skeleton variant="rounded" width="100%">
                                        <Box sx={{ width: 1 / 2, borderRadius: 1, height: boxHeight }} />
                                    </Skeleton>
                                </>
                        }
                    </Stack>
                    <DragOverlay>
                        {typeof activeId === "string" ? <IconOverlay icon={activeId} /> : null}
                    </DragOverlay>
                </DndContext>
            </Stack>

            <Dialog
                fullWidth
                open={dialogEdit !== undefined}
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
                                    <Stack direction="row" sx={{ justifyContent: "flex-end", py: 1 }}>
                                        <IconButton
                                            aria-label={dialogEditHideAdded ? "既に追加されている項目を表示" : "既に追加されている項目を非表示"}
                                            onClick={() => {
                                                setDialogEditHideAdded(!dialogEditHideAdded)
                                            }}
                                        >
                                            {
                                                dialogEditHideAdded ? <FontAwseomeIcon icon={{ icon: "eye-slash", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                                    : <FontAwseomeIcon icon={{ icon: "eye", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                            }

                                        </IconButton>
                                    </Stack>
                                </ListSubheader>
                                {
                                    Array.from(Object.entries(nt.header.novelIconList)).map((entry, i) => {
                                        const id = entry[0]
                                        const icon = entry[1]
                                        const labelId = `nt-novel-custom-header-sortable--add-checkbox-${i}`
                                        const checked = dialogEditChecked.includes(id)
                                        const added = (dialogEdit === "left" && listLeft?.includes(id)) || (dialogEdit === "right" && listRight?.includes(id))

                                        let disabled = false
                                        if ((dialogEdit === "left" && listRight?.includes(id)) || (dialogEdit === "right" && listLeft?.includes(id))) {
                                            disabled = true
                                        }

                                        if (dialogEditHideAdded && (disabled || (added && checked))) {
                                            return null
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
                                {`追加するアイテム：${(listRight && listLeft) ? dialogEditChecked.filter(v => !(listRight.includes(v) || listLeft.includes(v))).length : 0}`}
                            </Typography>
                            <Typography sx={{ color: "text.primary", fontSize: "90%" }}>
                                {`削除するアイテム：${(listRight && listLeft) ?
                                    dialogEdit === "right" ? listRight.filter(v => !dialogEditChecked.includes(v)).length
                                        : listLeft.filter(v => !dialogEditChecked.includes(v)).length
                                    : 0}`}
                            </Typography>
                        </Stack>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}


function getIconData(iconId: nt.header.iconId): nt.header.iconItem | void {
    if (iconId in nt.header.novelIconList) {
        return nt.header.novelIconList[iconId]
    }
}

function getFromData(active: Active): { id: UniqueIdentifier, index: number, position: "left" | "right", icon: string } | void {
    const id = active.id
    if (typeof id === "string") {
        const position = active.data.current?.position
        const index = active.data.current?.index
        const icon = active.data.current?.icon

        if (!isFinite(index) || typeof icon !== "string" || (position !== "left" && position !== "right")) {
            return
        }

        return {
            id: id,
            index: index,
            position: position,
            icon: icon
        }
    }
};

function getToData(over: Over): { id: UniqueIdentifier, index: number, position: "left" | "right", icon: string } | void {
    const id = over.id
    if (typeof id === "string") {
        const position = over.data.current?.position
        const index = over.data.current?.index
        const icon = over.data.current?.icon
        const type = over.data.current?.type

        if (type === "sortable") {
            if (!isFinite(index) || typeof icon !== "string" || (position !== "left" && position !== "right")) {
                return
            }

            return {
                id: id,
                index: index,
                position: position,
                icon: icon
            }
        } else if (type === "droppable") {
            if (position !== "left" && position !== "right") {
                return
            }

            return {
                id: id,
                index: -1,
                position: position,
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