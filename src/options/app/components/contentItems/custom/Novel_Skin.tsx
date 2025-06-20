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

export default function Novel_Skin(props: OptionUI_ItemProps) {
    const storage = props.storage
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
    const sensors = useSensors(mouseSensor);

    /*
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
        </>
    )
        */
       return <></>
}