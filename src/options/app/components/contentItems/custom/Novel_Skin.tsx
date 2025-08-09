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

            </Stack>
        </>
    )
}