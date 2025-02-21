import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { OptionID, OptionUI_ItemProps, OptionUI_Item_Radio } from "../../lib/type"
import { nt } from '../../../../utils/narou-tweaker';

export default function Option_Radio(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<string | number | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiLabelPlacement = option.ui?.labelPlacement
    const uiShowForce = option.ui?.showForce
    var uiData: OptionUI_Item_Radio | undefined
    const uiVariant = option.ui?.variant

    var uiDataTemp: Record<string, any> | undefined = option.ui?.data
    if (uiDataTemp !== undefined) {
        uiData = {}
        if (uiDataTemp.dataType === "string" || uiDataTemp.dataType === "number") {
            uiData.dataType = uiDataTemp.dataType
        }

        if (uiDataTemp.layout === "default" || uiDataTemp.layout === "wide") {
            uiData.layout = uiDataTemp.layout
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

    if (storage !== undefined && (typeof optionValue !== "string" && typeof optionValue !== "number")) {
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

    if (uiData?.layout === "default" || uiData?.layout === undefined) {
        return (
            <OptionItemBase {...props} >
                <ContentItem_Head {...props} />
                <Stack
                    sx={{
                        height: "inherit",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 2,
                    }}
                >
                    {
                        (((typeof optionValue === "string" || typeof optionValue === "number") && Array.isArray(uiData?.values)) || uiShowForce) ?
                            <FormControl variant={uiVariant}>
                                <FormLabel id={`option-items--radio--${id}`}>{uiLabel}</FormLabel>
                                <RadioGroup
                                    aria-labelledby={`option-items--radio--${id}`}
                                    name={`option-items--radio--${id}`}
                                    defaultValue={typeof optionValue === "number" ? Number(optionValue) : String(optionValue)}
                                    value={typeof optionValue === "number" ? Number(optionValue) : String(optionValue)}
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
                                                    <FormControlLabel value={item.value} control={<Radio />} label={item.label} labelPlacement={uiLabelPlacement ?? "start"} />
                                                )
                                            }
                                        })
                                    }
                                </RadioGroup>
                                <FormHelperText>{uiDescription}</FormHelperText>
                            </FormControl>
                            : <Skeleton variant="rounded">
                                <FormControl>
                                    <FormLabel>{uiLabel}</FormLabel>
                                    <RadioGroup name={`option-items--radio--${id}`} >
                                        {
                                            uiData?.values?.map((item: { value: string | number, label: string }) => {
                                                if (uiData?.dataType === typeof item.value || (uiData?.dataType === undefined && (typeof item.value === "string" || typeof item.value === "number"))) {
                                                    return (
                                                        <FormControlLabel value={item.value} control={<Radio />} label={item.label} labelPlacement={uiLabelPlacement ?? "start"} />
                                                    )
                                                }
                                            })
                                        }
                                    </RadioGroup>
                                    <FormHelperText>{uiDescription}</FormHelperText>
                                </FormControl>
                            </Skeleton>
                    }
                </Stack>
            </OptionItemBase>
        )
    } else if (uiData.layout === "wide") {
        return (
            <OptionItemBase {...props} >
                <ContentItem_Head {...props} />
                {
                    (((typeof optionValue === "string" || typeof optionValue === "number") && Array.isArray(uiData?.values)) || uiShowForce) ?
                        <FormControl variant={uiVariant}>
                            <FormLabel id={`option-items--radio--${id}`}>{uiLabel}</FormLabel>
                            <RadioGroup
                                aria-labelledby={`option-items--radio--${id}`}
                                name={`option-items--radio--${id}`}
                                defaultValue={typeof optionValue === "number" ? Number(optionValue) : String(optionValue)}
                                value={typeof optionValue === "number" ? Number(optionValue) : String(optionValue)}
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
                                                <FormControlLabel value={item.value} control={<Radio />} label={item.label} labelPlacement={uiLabelPlacement ?? "end"} />
                                            )
                                        }
                                    })
                                }
                            </RadioGroup>
                            <FormHelperText>{uiDescription}</FormHelperText>
                        </FormControl>
                        : <Skeleton variant="rounded">
                            <FormControl>
                                <FormLabel>{uiLabel}</FormLabel>
                                <RadioGroup name={`option-items--radio--${id}`}>
                                    {
                                        uiData?.values?.map((item: { value: string | number, label: string }) => {
                                            if (uiData?.dataType === typeof item.value || (uiData?.dataType === undefined && (typeof item.value === "string" || typeof item.value === "number"))) {
                                                return (
                                                    <FormControlLabel value={item.value} control={<Radio />} label={item.label} labelPlacement={uiLabelPlacement ?? "end"} />
                                                )
                                            }
                                        })
                                    }
                                </RadioGroup>
                                <FormHelperText>{uiDescription}</FormHelperText>
                            </FormControl>
                        </Skeleton>
                }
            </OptionItemBase>
        )
    }
}