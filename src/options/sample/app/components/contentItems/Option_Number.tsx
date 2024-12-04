import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ContentItem_Head from './module/Head';

import { OptionID, OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';
import { FontAwseomeIcon } from '../common/Icon';

export default function Option_Number(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<number | undefined>();
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

    const formatChange = (n: number) => {
        const step = uiData?.step ?? 1
        if (isFinite(n)) {
            if (uiData?.forceStep) {
                const d = n % step
                if (d !== 0) {
                    n -= d
                }
            }
            if (uiData?.max !== undefined && uiData?.max < n) {
                n = uiData.max
            }
            if (uiData?.min !== undefined && uiData?.min > n) {
                n = uiData?.min
            }
        }
        if (optionValue !== n) {
            setOptionValue(n)
            nt.storage.local.set(id, n)
        }
    };

    

    const getAdornment = (elm: any, position: "start"|"end") => {
        if(elm===undefined){
            return
        }else if(typeof elm === "string"){
            return <InputAdornment position={position}>{elm}</InputAdornment>
        }else{
            return <InputAdornment position={position}><FontAwseomeIcon icon={elm}/></InputAdornment>
        }
    }

    if(storage!==undefined && typeof optionValue !== "number"){
        const value = storage[id]
        if (typeof value === "number") {
            setOptionValue(value)
        }

        nt.storage.local.changed(id, (changes) => {
            if (changes[id]) {
                const s = changes[id].newValue
                if (typeof s === "number") {
                    setOptionValue(s)
                }
            }
        })
    }

    if (uiData?.layout === "default" || uiData?.layout === undefined) {
        return (
            <>
                <Stack direction={"row"} sx={{ justifyContent: "space-between" }} data-id={id}>
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
                            typeof optionValue === "number" || uiShowForce ?
                                <TextField
                                    label={uiLabel}
                                    value={optionValue}
                                    defaultValue={optionValue}
                                    variant={uiVariant}
                                    placeholder={uiPlaceholder}
                                    helperText={uiDescription}
                                    type="number"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        formatChange(Number(event.target.value))
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: getAdornment(uiData?.prefix, "start"),
                                            endAdornment: getAdornment(uiData?.prefix, "end"),
                                        },
                                    }}
                                />
                                : <Skeleton variant="rounded">
                                    <TextField
                                        label={uiLabel}
                                        placeholder={uiPlaceholder}
                                        helperText={uiDescription}
                                        type="number"
                                    />
                                </Skeleton>
                        }
                    </Stack>
                </Stack>
                <Divider sx={{ "&:last-child": { display: "none" } }} />
            </>
        )
    } else if (uiData?.layout === "wide") {
        return (
            <>
                <Stack direction={"column"} sx={{ justifyContent: "space-between", gap: 2 }} data-id={id}>
                    <ContentItem_Head {...props} />
                    {
                        typeof optionValue === "number" || uiShowForce ?
                            <TextField
                                label={uiLabel}
                                value={optionValue}
                                defaultValue={optionValue}
                                variant={uiVariant}
                                placeholder={uiPlaceholder}
                                helperText={uiDescription}
                                type='number'
                                onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    formatChange(Number(event.target.value))
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
                <Divider sx={{ "&:last-child": { display: "none" } }} />
            </>
        )
    }
}