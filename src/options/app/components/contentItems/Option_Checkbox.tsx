import * as React from 'react';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { OptionID, OptionUI_Item_Switch, OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../utils/narou-tweaker';

export default function Option_Checkbox(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<boolean | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiLabelPlacement = option.ui?.labelPlacement
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
                    typeof optionValue === "boolean" || uiShowForce ?
                        <FormControl component="fieldset" variant={uiVariant}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
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
                                    labelPlacement={uiLabelPlacement}
                                />
                            </FormGroup>
                            <FormHelperText>{uiDescription}</FormHelperText>
                        </FormControl>
                        :
                        <Skeleton variant="rounded">
                            <FormControl component="fieldset" variant={uiVariant}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label={uiLabel}
                                        labelPlacement={uiLabelPlacement}
                                    />
                                </FormGroup>
                                <FormHelperText>{uiDescription}</FormHelperText>
                            </FormControl>
                        </Skeleton>
                }
            </Stack>
        </OptionItemBase >
    )
}