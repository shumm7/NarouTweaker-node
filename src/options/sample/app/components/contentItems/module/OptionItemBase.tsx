import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { FontAwseomeIcon } from '../../common/Icon';
import { OptionUI_Item, OptionUI_ItemProps } from '../../../lib/type';

export default function OptionItemBase(props: { children: React.ReactNode } & OptionUI_ItemProps) {
    const option = props.option
    const id = option.id
    const childDepth = props.child ?? 0
    const type = props.type

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable(option);
    const isSortable = childDepth === 0 && type === "favorite"

    return (
        <Stack
            data-id={id}
            data-title={props.option.title}
            direction={"column"}
            ref={isSortable ? setNodeRef : undefined}
            className="nt-option-item"
            sx={{
                transform: isSortable ? CSS.Transform.toString(transform) : undefined,
                //transition: transition,
                "&:last-child .nt-option-item--divider": {
                    display: "none"
                }
            }}
        >
            <Stack direction={"row"}>
                {
                    isSortable &&
                    <Stack
                        spacing={1}
                        sx={{
                            cursor: isDragging ? "grabbing" : "grab",
                            color: "text.secondary",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingRight: 2,
                            flexShrink: 0
                        }}
                        {...attributes}
                        {...listeners}
                    >
                        <FontAwseomeIcon icon={{ icon: "grip-vertical", prefix: "solid" }} />
                    </Stack>
                }

                <Stack
                    direction={"row"}
                    sx={{
                        flex: 1,
                    }}
                >
                    <Stack direction={"row"} sx={{ justifyContent: "space-between", flex: 1 }}>
                        {props.children}
                    </Stack>
                </Stack>
            </Stack>
            {!option.ui?.hideDivider && <Divider sx={{pt: 1}} className="nt-option-item--divider"/>}
        </Stack>
    )
}