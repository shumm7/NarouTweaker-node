import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { OptionID, OptionUI_ItemProps, OptionUI_Item_Slider } from "../../lib/type"
import { nt } from '../../../../utils/narou-tweaker';

export default function Option_Slider(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<number>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiShowForce = option.ui?.showForce
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    var uiData: Record<string, any> | undefined = option.ui?.data

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        let n = newValue as number
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOptionValue(Number(event.target.value))
    };

    const handleInputBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let n = Number(optionValue)
        const step = uiData?.step === undefined ? 1 : uiData.step
        if (isFinite(n)) {
            if (uiData?.forceStep && typeof step === "number") {
                const d = n % step
                if (d !== 0) {
                    n -= d
                }
            }
            if (uiData?.max !== undefined && uiData?.max < n) {
                n = uiData?.max
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

    if (storage !== undefined && typeof optionValue !== "number") {
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
                    (typeof optionValue === "number" || uiShowForce) ?
                        <Stack direction="row">
                            <Slider
                                defaultValue={optionValue}
                                value={optionValue}
                                max={uiData?.max}
                                min={uiData?.min}
                                marks={uiData?.marks}
                                step={uiData?.step}
                                onChange={handleSliderChange}
                                valueLabelDisplay={uiData?.showLabel ?? "auto"}
                                aria-labelledby="input-slider"
                                sx={{
                                    minWidth: uiData?.showField ? `${100 * (uiData?.width ?? 1)}px` : `${150 * (uiData?.width ?? 1)}px`
                                }}
                                size={uiData?.size}
                            />
                            {
                                uiData?.showField &&
                                <Input
                                    defaultValue={optionValue}
                                    value={optionValue}
                                    size="small"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    inputProps={{
                                        step: uiData?.step ?? 1,
                                        max: uiData?.max,
                                        min: uiData?.min,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                    sx={{
                                        minWidth: "50px",
                                        ml: 2
                                    }}
                                />
                            }
                        </Stack>
                        : <Skeleton variant="rounded">
                            <Stack direction="row">
                                <Slider
                                    valueLabelDisplay={uiData?.showLabel ?? "auto"}
                                    sx={{
                                        minWidth: uiData?.showField ? `${100 * (uiData?.width ?? 1)}px` : `${150 * (uiData?.width ?? 1)}px`
                                    }}
                                    size={uiData?.size}
                                />
                                {
                                    uiData?.showField &&
                                    <Input
                                        size="small"
                                        sx={{
                                            minWidth: "50px",
                                            ml: 2
                                        }}
                                    />
                                }
                            </Stack>
                        </Skeleton>
                }
            </Stack>
        </OptionItemBase>
    )
}