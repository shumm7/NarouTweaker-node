import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ContentItem_Head from './module/Head';

import { OptionID, OptionUI_ItemProps, OptionUI_Item_Select } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';

export default function Option_Select(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<string | number | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiShowForce = option.ui?.showForce
    const uiPlaceholder = option.ui?.placeholder
    var uiData: OptionUI_Item_Select | undefined
    var uiVariant = option.ui?.variant

    var uiDataTemp: Record<string, any> | undefined = option.ui?.data
    if (uiDataTemp !== undefined) {
        uiData = {}
        if (uiDataTemp.dataType === "string" || uiDataTemp.dataType === "number") {
            uiData.dataType = uiDataTemp.dataType
        }

        var array = uiDataTemp.values
        if (Array.isArray(array) && array.every((item) => {
            const v = item?.value
            const l = item?.label
            if (typeof l !== "string") {
                return false
            }

            if (uiData?.dataType === undefined) {
                if (typeof v !== "string" && typeof v !== "number") {
                    return false
                }
            } else {
                if (typeof v !== uiData?.dataType) {
                    return false
                }
            }
            return true
        })) {
            uiData.values = array
        }
    }

    if(storage!==undefined && (typeof optionValue !== "string" && typeof optionValue!=="number")){
        const value = storage[id]
        if (typeof value === "string" || typeof value === "number") {
            if (uiData?.dataType === "string") {
                setOptionValue(String(value))
            } else if (uiData?.dataType === "number") {
                setOptionValue(Number(value))
            } else {
                setOptionValue(value)
            }
        }

        nt.storage.local.changed(id, (changes) => {
            if (changes[id]) {
                const s = changes[id].newValue
                if (typeof s === "string" || typeof s === "number") {
                    if (uiData?.dataType === "string") {
                        setOptionValue(String(s))
                    } else if (uiData?.dataType === "number") {
                        setOptionValue(Number(s))
                    } else {
                        setOptionValue(s)
                    }
                }
            }
        })
    }

    return (
        <>
            <Stack direction={"row"} sx={{ justifyContent: "space-between" }} data-id={id}>
                <ContentItem_Head {...props} />
                <Stack
                    sx={{
                        height: "inherit",
                        minWidth: "200px",
                        width: "fit-content",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 2,
                    }}
                >
                    {
                        (((typeof optionValue === "string" || typeof optionValue === "number") && Array.isArray(uiData?.values)) || uiShowForce) ?
                            <TextField
                                select
                                label={uiLabel}
                                variant={uiVariant}
                                helperText={uiDescription}
                                defaultValue={typeof optionValue === "number" ? Number(optionValue) : String(optionValue)}
                                value={typeof optionValue === "number" ? Number(optionValue) : String(optionValue)}
                                placeholder={uiPlaceholder}
                                sx={{ m: 1, width: '100%' }}
                                name={`option-items--select--${id}`} 
                                onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    if (uiData?.dataType === "number") {
                                        var vn = Number(event.target.value)
                                        if (vn !== optionValue) {
                                            nt.storage.local.set(id, vn).then(() => {
                                                setOptionValue(vn)
                                            })
                                        }
                                    } else {
                                        var vs = event.target.value
                                        if (vs !== optionValue) {
                                            nt.storage.local.set(id, vs).then(() => {
                                                setOptionValue(vs)
                                            })
                                        }
                                    }
                                }}
                            >
                                {
                                    uiData?.values?.map((item: { value: string | number, label: string }) => {
                                        if (uiData?.dataType === typeof item.value || (uiData?.dataType === undefined && (typeof item.value === "string" || typeof item.value === "number"))) {
                                            return (
                                                <MenuItem value={item.value}>{item.label}</MenuItem>
                                            )
                                        }
                                    })
                                }
                            </TextField>
                            : <Skeleton variant="rounded">
                                <TextField
                                    select
                                    label={uiLabel}
                                    variant={uiVariant}
                                    helperText={uiDescription}
                                    name={`option-items--select--${id}`} 
                                    sx={{ m: 1, minWidth: '25ch' }}
                                >
                                    {
                                        uiData?.values?.map((item: { value: string | number, label: string }) => {
                                            if (uiData?.dataType === typeof item.value || (uiData?.dataType === undefined && (typeof item.value === "string" || typeof item.value === "number"))) {
                                                return (
                                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                                )
                                            }
                                        })
                                    }
                                </TextField>
                            </Skeleton>
                    }
                </Stack>
            </Stack>
            <Divider sx={{ "&:last-child": { display: "none" } }} />
        </>
    )
}