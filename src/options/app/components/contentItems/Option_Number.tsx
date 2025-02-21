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
import OptionItemBase from './module/OptionItemBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { OptionID, OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../utils/narou-tweaker';
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

    const getAdornment = (elm: any, position: "start" | "end") => {
        if (elm === undefined) {
            return
        } else if (typeof elm === "string") {
            return <InputAdornment position={position}>{elm}</InputAdornment>
        } else {
            return <InputAdornment position={position}><FontAwseomeIcon icon={elm} /></InputAdornment>
        }
    }

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

    if (uiData?.layout === "default" || uiData?.layout === undefined) {
        return (
            <OptionItemBase {...props} >
                <Stack
                    sx={{
                        width: "100%",
                        justifyContent: "space-between"
                    }}
                    direction={{ xs: "column", md: "row" }}
                >
                    <ContentItem_Head {...props} />
                    <Stack
                        sx={{
                            height: "inherit",
                            minWidth: "70px",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: { xs: "auto", md: 2 },
                        }}
                    >

                        {
                            typeof optionValue === "number" || uiShowForce ?
                                <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                                    {
                                        uiData?.button &&
                                        <Typography variant='body2'>
                                            <IconButton
                                                size="small"
                                                aria-label="減少"
                                                onClick={() => {
                                                    const step = uiData?.step ?? 1
                                                    if (typeof optionValue === "number" && typeof step === "number") {
                                                        formatChange(optionValue - step)
                                                    }
                                                }}
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                <FontAwseomeIcon icon={{ icon: "minus", prefix: "solid" }} style={{ color: "inherit", fontSize: "inherit" }} />
                                            </IconButton>
                                        </Typography>
                                    }
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
                                                startAdornment: uiData?.prefix && getAdornment(uiData?.prefix, "start"),
                                                endAdornment: uiData?.suffix && getAdornment(uiData?.suffix, "end")
                                            },
                                        }}
                                    />
                                    {
                                        uiData?.button &&
                                        <Typography variant='body2'>
                                            <IconButton
                                                size="small"
                                                aria-label="増加"
                                                onClick={() => {
                                                    const step = uiData?.step ?? 1
                                                    if (typeof optionValue === "number" && typeof step === "number") {
                                                        formatChange(optionValue + step)
                                                    }
                                                }}
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ color: "inherit", fontSize: "inherit" }} />
                                            </IconButton>
                                        </Typography>
                                    }
                                </Stack>
                                : <Skeleton variant="rounded" sx={{ gap: 1, alignItems: "center" }}>
                                    <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                                        {
                                            uiData?.button &&
                                            <Typography variant='body2'>
                                                <IconButton size="small">
                                                    <FontAwseomeIcon icon={{ icon: "minus", prefix: "solid" }} style={{ fontSize: "inherit" }} />
                                                </IconButton>
                                            </Typography>
                                        }
                                        <TextField
                                            label={uiLabel}
                                            placeholder={uiPlaceholder}
                                            helperText={uiDescription}
                                            type="number"
                                        />
                                        {
                                            uiData?.button &&
                                            <Typography variant='body2'>
                                                <IconButton size="small">
                                                    <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ fontSize: "inherit" }} />
                                                </IconButton>
                                            </Typography>
                                        }
                                    </Stack>
                                </Skeleton>
                        }
                    </Stack>
                </Stack>
            </OptionItemBase >
        )

    } else if (uiData?.layout === "wide") {
        return (
            <OptionItemBase {...props} >
                <Stack
                    direction="column"
                    sx={{
                        width: "100%",
                        justifyContent: "space-between"
                    }}
                >
                    <ContentItem_Head {...props} />
                    {
                        typeof optionValue === "number" || uiShowForce ?
                            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                                {
                                    uiData?.button &&
                                    <Typography variant='body2'>
                                        <IconButton
                                            size="small"
                                            aria-label="減少"
                                            onClick={() => {
                                                const step = uiData?.step ?? 1
                                                if (typeof optionValue === "number" && typeof step === "number") {
                                                    formatChange(optionValue - step)
                                                }
                                            }}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <FontAwseomeIcon icon={{ icon: "minus", prefix: "solid" }} style={{ color: "inherit", fontSize: "inherit" }} />
                                        </IconButton>
                                    </Typography>
                                }
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
                                    slotProps={{
                                        input: {
                                            startAdornment: uiData?.prefix && getAdornment(uiData?.prefix, "start"),
                                            endAdornment: uiData?.suffix && getAdornment(uiData?.suffix, "end")
                                        },
                                    }}
                                />
                                {
                                    uiData?.button &&
                                    <Typography variant='body2'>
                                        <IconButton
                                            size="small"
                                            aria-label="増加"
                                            onClick={() => {
                                                const step = uiData?.step ?? 1
                                                if (typeof optionValue === "number" && typeof step === "number") {
                                                    formatChange(optionValue + step)
                                                }
                                            }}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ color: "inherit", fontSize: "inherit" }} />
                                        </IconButton>
                                    </Typography>
                                }
                            </Stack>
                            : <Skeleton variant="rounded">
                                <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                                    {
                                        uiData?.button &&
                                        <Typography variant='body2'>
                                            <IconButton size="small">
                                                <FontAwseomeIcon icon={{ icon: "minus", prefix: "solid" }} style={{ fontSize: "inherit" }} />
                                            </IconButton>
                                        </Typography>
                                    }
                                    <TextField
                                        label={uiLabel}
                                        placeholder={uiPlaceholder}
                                        helperText={uiDescription}
                                        sx={{
                                            width: "100%"
                                        }}
                                    />
                                    {
                                        uiData?.button &&
                                        <Typography variant='body2'>
                                            <IconButton size="small">
                                                <FontAwseomeIcon icon={{ icon: "plus", prefix: "solid" }} style={{ fontSize: "inherit" }} />
                                            </IconButton>
                                        </Typography>
                                    }
                                </Stack>
                            </Skeleton>
                    }
                </Stack>
            </OptionItemBase>
        )
    }
}