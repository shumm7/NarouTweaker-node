import * as React from 'react';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import ContentItem_Head from './module/Head';

import { OptionID, OptionUI_ItemProps, OptionUI_Item_Switch } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';

export default function Option_Switch(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<boolean | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiVariant = option.ui?.variant
    const uiShowForce = option.ui?.showForce
    var uiData: Record<string, any> | undefined = option.ui?.data

    if (storage !== undefined && typeof optionValue !== "boolean") {
        const value = storage[id]
        if (typeof value === "boolean") {
            setOptionValue(value)
        }

        nt.storage.local.changed(id, (changes) => {
            if (changes[id]) {
                const s = changes[id].newValue
                if (typeof s === "boolean") {
                    setOptionValue(s)
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
                        minWidth: "70px",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 2,
                    }}
                    direction={"row"}
                >
                    {
                        typeof optionValue === "boolean" || uiShowForce ?
                            <FormControl component="fieldset" variant={uiVariant}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                name={`option-items--switch--${id}`}
                                                checked={optionValue}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                                    if (checked !== optionValue) {
                                                        nt.storage.local.set(id, checked).then(() => {
                                                            setOptionValue(checked)
                                                        })
                                                    }
                                                }}
                                            />
                                        }
                                        label={uiLabel}
                                    />
                                </FormGroup>
                                <FormHelperText>{uiDescription}</FormHelperText>
                            </FormControl>
                            :
                            <Skeleton variant="rounded">
                                <FormControl variant="standard">
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Switch name={`option-items--switch--${id}`} />
                                            }
                                            label={uiLabel}
                                        />
                                    </FormGroup>
                                    <FormHelperText>{uiDescription}</FormHelperText>
                                </FormControl>
                            </Skeleton>
                    }
                </Stack>
            </Stack>
            <Divider sx={{ "&:last-child": { display: "none" } }} />
        </>
    )
}