import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';

import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { ColorPicker, useColor, ColorService, IColor } from "react-color-palette";
import "react-color-palette/css";
import { OptionID, OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../utils/narou-tweaker';

export default function Option_Color(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<string | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiVariant = option.ui?.variant
    const uiShowForce = option.ui?.showForce
    var uiData: Record<string, any> | undefined = option.ui?.data

    const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    if (storage !== undefined && typeof optionValue !== "string") {
        const value = storage[id]
        if (typeof value === "string") {
            try {
                var col = ColorService.convert("hex", ColorService.toHex(value))
                setOptionValue(col.hex)
            } catch (e) {
                var col = ColorService.convert("hex", "rgb(0,0,0)")
                setOptionValue(col.hex)
            }
        }

        nt.storage.local.changed(id, (changes) => {
            if (changes[id]) {
                const s = changes[id].newValue
                if (typeof s === "string" && s !== optionValue) {
                    try {
                        var col = ColorService.convert("hex", ColorService.toHex(s))
                        setOptionValue(col.hex)
                    } catch (e) {
                        var col = ColorService.convert("hex", "rgb(0,0,0)")
                        setOptionValue(col.hex)
                    }
                }
            }
        })
    }

    return (
        <OptionItemBase {...props}>
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
                        typeof optionValue === "string" || uiShowForce ?
                            <>
                                <TextField
                                    label={uiLabel}
                                    variant={uiVariant ?? "outlined"}
                                    helperText={uiDescription}
                                    aria-readonly
                                    autoComplete="off"
                                    onClick={handleClick}
                                    sx={{m: 1}}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            endAdornment: !uiData?.hidePreview && (
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 20,
                                                        borderRadius: 4,
                                                        backgroundColor: optionValue,
                                                        margin: 1,
                                                    }}
                                                />
                                            )
                                        },
                                    }}
                                    value={optionValue}
                                />
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    sx={{
                                        "& .rcp-root": {
                                            backgroundColor: "background.paper",
                                            color: "text.secondary"
                                        },
                                        "& .rcp-field-input": {
                                            color: "text.primary",
                                            borderColor: "divider",
                                            borderWidth: 1
                                        }
                                    }}
                                >
                                    <div style={{ width: "min(350px, 100vw)" }}>
                                        <ColorPicker
                                            color={ColorService.convert("hex", ColorService.toHex(optionValue ?? ""))}
                                            onChange={(color: IColor) => {
                                                setOptionValue(color.hex)
                                            }}
                                            onChangeComplete={(color: IColor) => {
                                                nt.storage.local.set(id, color.hex).then(() => {
                                                    setOptionValue(color.hex)
                                                })
                                            }}
                                        />
                                    </div>
                                </Popover>
                            </>
                            :
                            <Skeleton variant="rounded">
                                <TextField
                                    label={uiLabel}
                                    variant={uiVariant ?? "outlined"}
                                    helperText={uiDescription}
                                    autoComplete="off"
                                    sx={{m: 1}}
                                    slotProps={{
                                        input: {
                                            endAdornment: !uiData?.hidePreview && (
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 20,
                                                        borderRadius: 4,
                                                        backgroundColor: optionValue,
                                                        margin: 1,
                                                    }}
                                                />
                                            )
                                        },
                                    }}
                                />
                            </Skeleton>
                    }
                </Stack>
            </Stack>
        </OptionItemBase>
    )
}