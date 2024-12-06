import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { OptionID, OptionUI_Item_Parent, OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';
import { getOptionChildrenFromID } from '../../lib/utils';
import ContentItem from '../ContentItem';

export default function Option_Parent(props: OptionUI_ItemProps) {
    const storage = props.storage
    const option = props.option
    const type = props.type
    const id = option.id
    const childDepth = props.child ?? 0
    var uiData: Record<string, any> | undefined = option.ui?.data

    if (childDepth >= 0) {
        return (
            <OptionItemBase {...props} >
                <Stack sx={{width: "100%"}}>
                    <ContentItem_Head {...props} />
                    <Stack sx={{ gap: 0.5, ml: 4, mt: 2, mb: 0.5 }} spacing={1}>
                        {
                            getOptionChildrenFromID(option.id).map((childOption) => {
                                if (type === "favorite") {
                                    if (storage?.extFavoriteOptions.includes(childOption.id)) {
                                        return <ContentItem type={type} option={childOption} child={childDepth + 1} storage={storage} />
                                    }
                                } else {
                                    return <ContentItem type={type} option={childOption} child={childDepth + 1} storage={storage} />
                                }
                            })
                        }
                    </Stack>
                </Stack>
            </OptionItemBase>
        )
    }
}