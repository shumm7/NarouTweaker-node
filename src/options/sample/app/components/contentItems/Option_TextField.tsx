import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { OptionID, OptionUI_Item_Switch, OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';

export default function Option_TextField(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<string | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiPlaceholder = option.ui?.placeholder
    const uiVariant = option.ui?.variant
    const uiShowForce = option.ui?.showForce
    var uiData: Record<string, any> | undefined = option.ui?.data

    if (storage !== undefined && typeof optionValue !== "string") {
        const value = storage[id]
        if (typeof value === "string") {
            setOptionValue(value)
        }

        nt.storage.local.changed(id, (changes) => {
            if (changes[id]) {
                const s = changes[id].newValue
                if (typeof s === "string") {
                    setOptionValue(s)
                }
            }
        })
    }


    if (uiData?.layout === "default" || uiData?.layout === undefined) {
        return (
            <OptionItemBase {...props}>
                <ContentItem_Head {...props} />
                <Stack
                    sx={{
                        height: "inherit",
                        minWidth: "70px",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 2,
                    }}
                >

                    {
                        typeof optionValue === "string" || uiShowForce ?
                            <TextField
                                label={uiLabel}
                                value={optionValue}
                                defaultValue={optionValue}
                                variant={uiVariant}
                                placeholder={uiPlaceholder}
                                helperText={uiDescription}
                                onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    const s = event.target.value
                                    if (optionValue !== s) {
                                        nt.storage.local.set(id, s).then(() => {
                                            setOptionValue(s)
                                        })
                                    }
                                }}
                            />
                            : <Skeleton variant="rounded">
                                <TextField
                                    label={uiLabel}
                                    placeholder={uiPlaceholder}
                                    helperText={uiDescription}
                                />
                            </Skeleton>
                    }
                </Stack>
            </OptionItemBase>
        )
    } else if (uiData?.layout === "wide") {
        return (
            <OptionItemBase {...props}>
                <Stack sx={{ width: "100%" }} direction="column">
                    <ContentItem_Head {...props} />
                    {
                        typeof optionValue === "string" || uiShowForce ?
                            <TextField
                                label={uiLabel}
                                value={optionValue}
                                defaultValue={optionValue}
                                variant={uiVariant}
                                placeholder={uiPlaceholder}
                                helperText={uiDescription}
                                onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    const s = event.target.value
                                    if (optionValue !== s) {
                                        nt.storage.local.set(id, s).then(() => {
                                            setOptionValue(s)
                                        })
                                    }
                                }}
                                sx={{
                                    width: "100%"
                                }}
                            />
                            : <Skeleton variant="rounded">
                                <TextField
                                    label={uiLabel}
                                    placeholder={uiPlaceholder}
                                    helperText={uiDescription}
                                    sx={{
                                        width: "100%"
                                    }}
                                />
                            </Skeleton>
                    }
                </Stack>
            </OptionItemBase>
        )
    }
}