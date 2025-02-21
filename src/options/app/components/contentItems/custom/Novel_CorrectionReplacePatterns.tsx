import * as React from 'react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import { closestCenter, DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Skeleton from '@mui/material/Skeleton';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

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

const fontFamilyCode = "'BizinGothicDiscord', 'Menlo', 'Consolas', 'Droid Sans Mono', 'monospace'";

function checkListValue(v: any): boolean {
    if(
        typeof v?.active === "boolean" &&
        typeof v?.regex === "boolean" &&
        typeof v?.pattern === "string" &&
        typeof v?.replacement === "string"
    ){
        return true
    }else{
        return false
    }
}


export default function Novel_CorrectionReplacePatterns(props: OptionUI_ItemProps) {
    const storage = props.storage
    const listRef = useRef<HTMLUListElement>(null)
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
    const sensors = useSensors(mouseSensor);
    const boxHeight = 500

    const [collapse, setCollapse] = useState<boolean>(false)
    const [patterns, setPatterns] = useState<nt.storage.local.ReplacePatterns>()
    const [dialogEdit, setDialogEdit] = useState<{ id: number, data: nt.storage.local.ReplacePattern } | undefined>()
    const [dialogDelete, setDialogDelete] = useState<{ id: number, data: nt.storage.local.ReplacePattern, backToModal?: boolean } | undefined>()
    const [testField, setTestField] = useState<string>("")
    const [editTestField, setEditTestField] = useState<string>("")
    const patternData = useMemo(() => patterns !== undefined ? patterns.map((pattern, id) => { return { id: id, data: pattern } }) : undefined, [patterns])
    const error = useMemo(() => regexError(dialogEdit?.data.regex, dialogEdit?.data.pattern), [dialogEdit])

    const handleEditClose = () => {
        setDialogEdit(undefined);
    }
    const handleDeleteClose = () => {
        setDialogDelete(undefined);
        if (dialogDelete?.backToModal) {
            setDialogEdit(dialogDelete)
        }
    }

    if (storage !== undefined && patterns === undefined) {
        const value = storage.correctionReplacePatterns
        if (Array.isArray(value)) {
            setPatterns(value.filter(v=>checkListValue(v)))
        }else{
            setPatterns([])
        }

        nt.storage.local.changed("correctionReplacePatterns", (changes) => {
            if (changes.correctionReplacePatterns) {
                const s = changes.correctionReplacePatterns.newValue
                if (Array.isArray(s)) {
                    setPatterns(s.filter(v=>checkListValue(v)))
                }
            }
        })
    }

    function setStorage(id: number | undefined, data: Partial<nt.storage.local.ReplacePattern>) {
        if (typeof id === "number" && patterns?.at(id) !== undefined) {
            let list = patterns.concat()
            if (typeof data.active === "boolean") {
                list[id].active = data.active
            }
            if (typeof data.replacement === "string") {
                list[id].replacement = data.replacement
            }
            if (typeof data.regex === "boolean") {
                list[id].regex = data.regex
            }
            if (typeof data.pattern === "string") {
                list[id].pattern = data.pattern
            }

            nt.storage.local.set("correctionReplacePatterns", list)
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
                setDialogEdit({ id: list.length - 1, data: data })
                if (listRef.current) {
                    listRef.current.scrollTo({ top: listRef.current.scrollHeight })
                }
            })
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
                                onClick={() => { setDialogDelete(item) }}
                                sx={{ color: "text.secondary" }}
                            >
                                <FontAwseomeIcon icon={{ icon: "trash", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="編集"
                                onClick={() => { setDialogEdit(item) }}
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
                        slotProps={{
                            primary: {
                                sx: {
                                    fontFamily: pattern.regex ? fontFamilyCode : "inherit",
                                    fontStyle: (pattern.regex || pattern.pattern.length === 0) ? "italic" : "inherit",
                                    color: pattern.pattern.length === 0 ? "text.secondary" : "text.primary"
                                }
                            },
                            secondary: {
                                sx: {
                                    fontStyle: pattern.replacement.length === 0 ? "italic" : "inherit",
                                }
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
                        nt.storage.local.set("correctionReplacePatterns", newPatternData)
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
                                                />
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
                                <Skeleton variant="rounded">
                                    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, height: boxHeight }} />
                                </Skeleton>
                        }
                    </Stack>
                </DndContext>
                <div>
                    <Accordion elevation={0}>
                        <AccordionSummary
                            expandIcon={<FontAwseomeIcon icon={{ icon: "chevron-down", prefix: "solid" }}></FontAwseomeIcon>}
                        >
                            <Typography>置換パターンをテスト</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1} gap={1} direction="row">
                                <Stack gap={2} direction="column" width={1 / 2}>
                                    <TextField
                                        label="対象の文字列"
                                        variant="outlined"
                                        rows={8}
                                        multiline
                                        defaultValue={testField}
                                        onChange={(event) => {
                                            setTestField(event.target.value.replace(/\r\n|\r/g, '\n'))
                                        }}
                                    />
                                </Stack>
                                <Stack direction="column" width={1 / 2}>
                                    <TextField
                                        label="置換後の文字列"
                                        variant="outlined"
                                        rows={8}
                                        multiline
                                        value={
                                            testField.split("\n").map((line) => {
                                                if (Array.isArray(patterns)) {
                                                    for (let i = 0; i < patterns?.length; i++) {
                                                        const pattern = patterns[i]
                                                        if (pattern.active) {
                                                            if (pattern.regex) {
                                                                line = line.replaceAll(new RegExp(pattern.pattern, "g"), pattern.replacement)
                                                            } else {
                                                                line = line.replaceAll(pattern.pattern, pattern.replacement)
                                                            }
                                                        }
                                                    }
                                                }
                                                return line
                                            }).join("\n")
                                        }
                                        aria-readonly
                                        onChange={(event) => {
                                            setTestField(event.target.value.replace(/\r\n|\r/g, '\n'))
                                        }}
                                        slotProps={{
                                            input: {
                                                readOnly: true
                                            }
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </Stack>

            <Dialog
                onClose={handleEditClose}
                aria-labelledby="replace-pattern-dialog-title"
                open={dialogEdit !== undefined}
                fullWidth
                PaperProps={{
                    elevation: 1
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="replace-pattern-dialog-title">置換パターンの設定</DialogTitle>
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
                    <Stack spacing={1} direction="column">
                        <Stack direction="column" gap={2}>
                            <Stack direction="column" mb={1}>
                                <TextField
                                    label="パターン"
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            sx: {
                                                fontFamily: dialogEdit?.data.regex ? fontFamilyCode : "inherit",
                                            },
                                        },
                                    }}
                                    autoFocus
                                    error={error !== undefined}
                                    helperText={error}
                                    defaultValue={dialogEdit?.data.pattern}
                                    onChange={(event) => {
                                        setStorage(dialogEdit?.id, { pattern: event.target.value })
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={dialogEdit?.data.regex}
                                            onChange={(event, checked) => {
                                                setStorage(dialogEdit?.id, { regex: checked })
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
                                defaultValue={dialogEdit?.data.replacement}
                                onChange={(event) => {
                                    setStorage(dialogEdit?.id, { replacement: event.target.value })
                                }}
                            />
                            <Stack direction="row" gap={1}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            defaultChecked={dialogEdit?.data.active}
                                            onChange={(event, checked) => {
                                                setStorage(dialogEdit?.id, { active: checked })
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
                                        handleEditClose()
                                        if (dialogEdit !== undefined) {
                                            setDialogDelete({ id: dialogEdit.id, data: dialogEdit.data, backToModal: true })
                                        }
                                    }}
                                >
                                    <FontAwseomeIcon icon={{ icon: "trash", prefix: "solid" }} style={{ fontSize: "14px", color: "inherit" }} />
                                </IconButton>
                            </Stack>

                            <div>
                                <Accordion elevation={0}>
                                    <AccordionSummary
                                        expandIcon={<FontAwseomeIcon icon={{ icon: "chevron-down", prefix: "solid" }}></FontAwseomeIcon>}
                                    >
                                        <Typography>置換パターンをテスト</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1} gap={1} direction="row">
                                            <Stack gap={2} direction="column" width={1 / 2}>
                                                <TextField
                                                    label="対象の文字列"
                                                    variant="outlined"
                                                    multiline
                                                    minRows={1}
                                                    maxRows={3}
                                                    defaultValue={editTestField}
                                                    onChange={(event) => {
                                                        setEditTestField(event.target.value.replace(/\r\n|\r/g, '\n'))
                                                    }}
                                                />
                                            </Stack>
                                            <Stack direction="column" width={1 / 2}>
                                                <TextField
                                                    label="置換後の文字列"
                                                    variant="outlined"
                                                    multiline
                                                    minRows={1}
                                                    maxRows={3}
                                                    aria-readonly
                                                    value={
                                                        editTestField.split("\n").map((line) => {
                                                            if (dialogEdit) {
                                                                if (dialogEdit.data.regex) {
                                                                    line = line.replaceAll(new RegExp(dialogEdit.data.pattern, "g"), dialogEdit.data.replacement)
                                                                } else {
                                                                    line = line.replaceAll(dialogEdit.data.pattern, dialogEdit.data.replacement)
                                                                }
                                                            }
                                                            return line
                                                        }).join("\n")
                                                    }
                                                    onChange={(event) => {
                                                        setEditTestField(event.target.value.replace(/\r\n|\r/g, '\n'))
                                                    }}
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true
                                                        }
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog >

            <Dialog
                fullWidth
                open={dialogDelete !== undefined}
                onClose={handleDeleteClose}
                PaperProps={{
                    elevation: 1,
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const id = dialogDelete?.id
                        if (storage !== undefined && id !== undefined) {
                            const list = storage.correctionReplacePatterns
                            list.splice(id, 1)
                            nt.storage.local.set("correctionReplacePatterns", list)
                        }
                        setDialogDelete(undefined)
                    },
                }}
            >
                <DialogTitle>置換パターンを削除</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Stack spacing={1} sx={{ gap: 1 }}>
                            <Typography sx={{ color: "text.primary", fontSize: "90%" }}>以下のパターンを削除します。</Typography>
                            <TextField
                                label={dialogDelete?.data.regex ? "パターン（正規表現）" : "パターン（プレーンテキスト）"}
                                variant="outlined"
                                value={dialogDelete?.data.pattern}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        sx: {
                                            fontFamily: dialogDelete?.data.regex ? fontFamilyCode : "inherit",
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
                                value={dialogDelete?.data.replacement}
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