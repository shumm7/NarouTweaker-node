import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import { closestCenter, DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

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
import { nt } from '../../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type';

const fontFamilyCode = "'BizinGothicDiscord', 'Menlo', 'Consolas', 'Droid Sans Mono', 'monospace'";

export default function Novel_CorrectionReplacePatterns(props: OptionUI_ItemProps) {
    const storage = props.storage
    const listRef = useRef<HTMLUListElement>(null)
    const [collapse, setCollapse] = useState<boolean>(false)
    const [patterns, setPatterns] = useState<nt.storage.local.ReplacePatterns>()
    const [target, setTarget] = useState<{ id: number, data: nt.storage.local.ReplacePattern } | undefined>()
    const [deleteTarget, setDeleteTarget] = useState<{ id: number, data: nt.storage.local.ReplacePattern, backToModal?: boolean } | undefined>()
    const patternData = patterns !== undefined ? patterns.map((pattern, id) => { return { id: id, data: pattern } }) : undefined
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: { distance: 5 },
    });
    const sensors = useSensors(mouseSensor);
    const boxHeight = 500

    const error = regexError(target?.data.regex, target?.data.pattern)
    const handleClose = () => {
        setTarget(undefined);
    }
    const handleDeleteClose = () => {
        setDeleteTarget(undefined);
        if (deleteTarget?.backToModal) {
            setTarget(deleteTarget)
        }
    }
    const handleDeleteSubmit = () => {
        setDeleteTarget(undefined);
    }

    if (storage !== undefined && patterns === undefined) {
        const value = storage.correctionReplacePatterns ?? []
        if (Array.isArray(value)) {
            setPatterns(value)
        }

        nt.storage.local.changed("correctionReplacePatterns", (changes) => {
            if (changes.correctionReplacePatterns) {
                const s = changes.correctionReplacePatterns.newValue
                if (Array.isArray(s)) {
                    setPatterns(s)
                }
            }
        })
    }

    function setStorage(id: number | undefined, data: Partial<nt.storage.local.ReplacePattern>) {
        if (typeof id === "number" && patterns?.at(id) !== undefined) {
            let list = patterns.concat()
            if (data.active !== undefined) {
                list[id].active = data.active
            }
            if (data.replacement !== undefined) {
                list[id].replacement = data.replacement
            }
            if (data.regex !== undefined) {
                list[id].regex = data.regex
            }
            if (data.pattern !== undefined) {
                list[id].pattern = data.pattern
            }

            nt.storage.local.set("correctionReplacePatterns", list).then(() => {
                setPatterns(list)
            })
        }
    }

    function addItem() {
        if (storage !== undefined) {
            const data = {
                active: true,
                replacement: "",
                pattern: "",
                regex: false,
            }
            const list = storage.correctionReplacePatterns
            list.push(data)
            nt.storage.local.set("correctionReplacePatterns", list).then(() => {
                setTarget({ id: list.length - 1, data: data })
                if (listRef.current) {
                    listRef.current.scrollTo({ top: listRef.current.scrollHeight })
                }
            })
        }
    }

    function regexError(isRegex?: boolean, pattern?: string) {
        if (isRegex && pattern) {
            const s = nt.text.checkRegexWithError(pattern)
            if (s) {
                return `不正な正規表現です (${s})`
            } else {
                return undefined
            }
        }
    }

    function ActiveButton() {
        if (patterns) {
            const activeType = () => {
                const count = patterns.filter((pattern) => { return pattern.active }).length
                if (count === 0) {
                    return -1
                } else if (count < patterns.length) {
                    return 0
                } else if (count === patterns.length) {
                    return 1
                } else {
                    return -1
                }
            }

            return (
                <IconButton
                    size="small"
                    aria-label={
                        activeType() <= 0 ? "すべて有効" : "すべて無効"
                    }
                    sx={{
                        color: activeType() < 0 ? "text.secondary" : "primary.main",
                    }}
                    onClick={() => {
                        if (patterns) {
                            const active = activeType()
                            if (active <= 0) {
                                var list = patterns.map((pattern) => {
                                    pattern.active = true
                                    return pattern
                                })
                                nt.storage.local.set("correctionReplacePatterns", list)
                            }
                            else if (active > 0) {
                                var list = patterns.map((pattern) => {
                                    pattern.active = false
                                    return pattern
                                })
                                nt.storage.local.set("correctionReplacePatterns", list)
                            }
                        }
                    }}
                >
                    {
                        activeType() <= 0 ?
                            <FontAwseomeIcon icon={{ icon: "circle", prefix: "regular" }} style={{ fontSize: "14px", color: "inherit" }} />
                            :
                            <FontAwseomeIcon icon={{ icon: "circle", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                    }
                </IconButton>
            )
        }
    }

    function PatternItems(props: { pattern: { data: nt.storage.local.ReplacePattern, id: number } }) {
        const item = props.pattern
        const pattern = item.data
        const id = item.id
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable(item);

        if (pattern) {
            return (
                <ListItem
                    ref={setNodeRef}
                    sx={{
                        transform: CSS.Transform.toString(transform),
                        //transition: transition,
                        cursor: isDragging ? "grabbing" : "grab",
                        "&:hover": {
                            backgroundColor: "action.hover"
                        }
                    }}
                    secondaryAction={
                        <Stack direction="row">
                            <IconButton
                                edge="start"
                                aria-label="削除"
                                onClick={() => { setDeleteTarget(item) }}
                                sx={{ color: "text.secondary" }}
                            >
                                <FontAwseomeIcon icon={{ icon: "trash", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="編集"
                                onClick={() => { setTarget(item) }}
                                sx={{ color: "text.secondary" }}
                            >
                                <FontAwseomeIcon icon={{ icon: "pen", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                            </IconButton>
                        </Stack>
                    }

                    {...attributes}
                    {...listeners}
                >
                    <ListItemIcon sx={{ alignItems: "center" }}>
                        <Typography
                            variant='body2'
                            sx={{
                                color: "text.secondary",
                                fontSize: 12,
                                mr: 1,
                                minWidth: "1.3em"
                            }}
                        >
                            {id + 1}
                        </Typography>
                        <IconButton
                            size="small"
                            aria-label={pattern?.active ? "有効" : "無効"}
                            sx={{ color: pattern?.active ? "primary.main" : "text.secondary" }}
                            onClick={() => {
                                if (storage !== undefined) {
                                    const list = storage.correctionReplacePatterns
                                    if (list.at(id) !== undefined) {
                                        list[id].active = !pattern.active
                                        nt.storage.local.set("correctionReplacePatterns", list)
                                    }
                                }
                            }}
                        >
                            {
                                pattern?.active ?
                                    <FontAwseomeIcon icon={{ icon: "circle", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                                    :
                                    <FontAwseomeIcon icon={{ icon: "circle", prefix: "regular" }} style={{ fontSize: "14px", color: "inherit" }} />
                            }
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            pattern.pattern.length === 0 ? "[ 空欄 ]" : (pattern.regex ? `/ ${pattern.pattern} /` : pattern.pattern)
                        }
                        secondary={
                            !collapse && (pattern.replacement.length === 0 ? "[ 空欄 ]" : pattern.replacement)
                        }
                        primaryTypographyProps={{
                            sx: {
                                fontFamily: pattern.regex ? fontFamilyCode : "inherit",
                                fontStyle: (pattern.regex || pattern.pattern.length === 0) ? "italic" : "inherit",
                                color: pattern.pattern.length === 0 ? "text.secondary" : "text.primary"
                            }
                        }}
                        secondaryTypographyProps={{
                            sx: {
                                fontStyle: pattern.replacement.length === 0 ? "italic" : "inherit",
                            }
                        }}
                    />
                </ListItem>
            )
        }
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
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
                    onDragEnd={(event) => {
                        const { active, over } = event;
                        if (over == null || active.id === over.id || patternData === undefined) {
                            return
                        }
                        const oldIndex = patternData.findIndex((item) => item.id === active.id)
                        const newIndex = patternData.findIndex((item) => item.id === over.id)
                        const newPatternData = arrayMove(patternData, oldIndex, newIndex).map((item) => { return item.data })
                        nt.storage.local.set("correctionReplacePatterns", newPatternData).then(() => {
                            setPatterns(newPatternData)
                        })
                    }}
                    sensors={sensors}
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
                    >
                        {
                            (storage !== undefined && patternData !== undefined) ?
                                <List
                                    ref={listRef}
                                    sx={{
                                        width: "100%",
                                        maxHeight: boxHeight,
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
                                            <Stack direction="row">
                                                <Typography
                                                    variant='body2'
                                                    sx={{
                                                        color: "text.secondary",
                                                        fontSize: 12,
                                                        mr: 1,
                                                        minWidth: "1.3em"
                                                    }}
                                                >
                                                </Typography>
                                                <ActiveButton />
                                            </Stack>
                                            <Stack direction="row">
                                                <IconButton
                                                    aria-label="一番上へスクロール"
                                                    onClick={() => {
                                                        if (listRef.current) {
                                                            listRef.current?.scrollTo({ top: 0 })
                                                        }
                                                    }}
                                                >
                                                    <FontAwseomeIcon icon={{ icon: "angles-up", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="一番下へスクロール"
                                                    onClick={() => {
                                                        if (listRef.current) {
                                                            listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
                                                        }
                                                    }}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <FontAwseomeIcon icon={{ icon: "angles-down", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                                </IconButton>
                                                <IconButton
                                                    aria-label={collapse ? "広げる" : "隠す"}
                                                    onClick={() => { setCollapse(!collapse) }}
                                                >
                                                    {
                                                        collapse ?
                                                            <FontAwseomeIcon icon={{ icon: "square-plus", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                                            :
                                                            <FontAwseomeIcon icon={{ icon: "square-minus", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                                    }
                                                </IconButton>
                                                <IconButton
                                                    aria-label="追加"
                                                    onClick={() => { addItem() }}
                                                >
                                                    <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ fontSize: "12px", color: "inherit" }} />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    </ListSubheader>
                                    <SortableContext items={patternData} strategy={verticalListSortingStrategy}>
                                        {
                                            patternData.map((pattern) => {
                                                return <PatternItems pattern={pattern} />
                                            })
                                        }
                                    </SortableContext>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            sx={{
                                                py: 3,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                            onClick={() => { addItem() }}
                                        >
                                            <ListItemIcon sx={{ color: "text.secondary", minWidth: "auto" }}>
                                                <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ color: "inherit" }} />
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                                :
                                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, height: boxHeight }} />
                        }
                    </Stack>
                </DndContext>
            </Stack>

            <Dialog
                onClose={handleClose}
                aria-labelledby="replace-pattern-dialog-title"
                open={target !== undefined}
                fullWidth
                PaperProps={{
                    elevation: 1
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="replace-pattern-dialog-title">置換パターンの設定</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                    <Stack spacing={1} direction="column">
                        <Stack direction="column" gap={2}>
                            <Stack direction="column" mb={1}>
                                <TextField
                                    label="パターン"
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            sx: {
                                                fontFamily: target?.data.regex ? fontFamilyCode : "inherit",
                                            },
                                        },
                                    }}
                                    autoFocus
                                    error={error !== undefined}
                                    helperText={error}
                                    defaultValue={target?.data.pattern}
                                    onChange={(event) => {
                                        setStorage(target?.id, { pattern: event.target.value })
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={target?.data.regex}
                                            onChange={(event, checked) => {
                                                setStorage(target?.id, { regex: checked })
                                            }}
                                        />
                                    }
                                    sx={{
                                        width: "fit-content",
                                    }}
                                    label="正規表現"
                                />
                            </Stack>
                            <TextField
                                label="置換後のテキスト"
                                variant="outlined"
                                defaultValue={target?.data.replacement}
                                onChange={(event) => {
                                    setStorage(target?.id, { replacement: event.target.value })
                                }}
                            />
                            <Stack direction="row" gap={1}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            defaultChecked={target?.data.active}
                                            onChange={(event, checked) => {
                                                setStorage(target?.id, { active: checked })
                                            }}
                                        />
                                    }
                                    sx={{
                                        width: "fit-content",
                                        ml: "auto",
                                    }}
                                    label="有効にする"
                                />
                                <IconButton
                                    edge="end"
                                    aria-label="削除"
                                    onClick={() => {
                                        handleClose()
                                        if (target !== undefined) {
                                            setDeleteTarget({ id: target.id, data: target.data, backToModal: true })
                                        }
                                    }}
                                >
                                    <FontAwseomeIcon icon={{ icon: "trash", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog >

            <Dialog
                fullScreen={false}
                fullWidth
                open={deleteTarget !== undefined}
                onClose={handleDeleteClose}
                PaperProps={{
                    elevation: 1,
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const id = deleteTarget?.id
                        if (storage !== undefined && id !== undefined) {
                            const list = storage.correctionReplacePatterns
                            list.splice(id, 1)
                            nt.storage.local.set("correctionReplacePatterns", list).then(() => { })
                        }
                        handleDeleteSubmit();
                    },
                }}
            >
                <DialogTitle>置換パターンを削除</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Stack spacing={1} sx={{ gap: 1 }}>
                            <Typography sx={{ color: "text.primary", fontSize: "90%" }}>以下のパターンを削除します。</Typography>
                            <TextField
                                label={deleteTarget?.data.regex ? "パターン（正規表現）" : "パターン（プレーンテキスト）"}
                                variant="outlined"
                                value={deleteTarget?.data.pattern}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        sx: {
                                            fontFamily: deleteTarget?.data.regex ? fontFamilyCode : "inherit",
                                            fontStyle: "italic",
                                            color: "text.secondary"
                                        }
                                    },
                                    inputLabel: {
                                        shrink: true
                                    },
                                }}
                                aria-readonly
                            />
                            <TextField
                                label="置換後のテキスト"
                                variant="outlined"
                                value={deleteTarget?.data.replacement}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        sx: {
                                            fontStyle: "italic",
                                            color: "text.secondary"
                                        }
                                    },
                                    inputLabel: {
                                        shrink: true
                                    },
                                }}
                                aria-readonly
                            />
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={handleDeleteClose}
                    >
                        キャンセル
                    </Button>
                    <Button variant="contained" type="submit" sx={{ boxShadow: 0 }}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}