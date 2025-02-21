import * as React from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../utils/narou-tweaker';

export default function Option_Unknown(props: OptionUI_ItemProps) {
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child

    return (
        <OptionItemBase {...props} >
            <ContentItem_Head {...props} />
        </OptionItemBase>
    )
}