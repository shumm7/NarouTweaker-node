import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';

import ContentItem_Head from './module/Head';

import { OptionID, OptionUI_ItemProps, OptionUI_Item_TextArea } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';

export default function Option_TextArea(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<string | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiPlaceholder = option.ui?.placeholder
    var uiData: Record<string, any> | undefined = option.ui?.data
    var uiVariant = option.ui?.variant

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

    if (uiData?.layout === "wide") {
        return (
            <>
                <Stack sx={{ justifyContent: "space-between" }} data-id={id}>
                    <ContentItem_Head {...props} />
                    <Stack
                        sx={{
                            height: "inherit",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <FormControl component="fieldset" variant="standard" sx={{ width: "100%" }}>
                            <FormGroup>
                                <TextField
                                    label={uiLabel}
                                    value={optionValue}
                                    defaultValue={optionValue}
                                    variant={uiVariant}
                                    multiline
                                    rows={uiData?.rows}
                                    maxRows={uiData?.maxRows}
                                    minRows={uiData?.minRows}
                                    placeholder={uiPlaceholder}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        const s = event.target.value
                                        if (optionValue !== s) {
                                            nt.storage.local.set(id, s).then(() => {
                                                setOptionValue(s)
                                            })
                                        }
                                    }}
                                />
                            </FormGroup>
                            <FormHelperText>{uiDescription}</FormHelperText>
                        </FormControl>
                    </Stack>
                </Stack>
                <Divider sx={{ "&:last-child": { display: "none" } }} />
            </>
        )
    } else if (uiData?.layout === "default" || uiData?.layout === undefined) {
        return (
            <>
                <Stack direction={"row"} sx={{ justifyContent: "space-between" }} data-id={id}>
                    <ContentItem_Head {...props} />
                    <Stack
                        sx={{
                            height: "inherit",
                            minWidth: `${200 * (uiData?.width ?? 1)}px`,
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 2,
                        }}
                    >
                        <FormControl component="fieldset" variant="standard" sx={{ width: "100%" }}>
                            <FormGroup>
                                <TextField
                                    label={uiLabel}
                                    value={optionValue}
                                    defaultValue={optionValue}
                                    variant={uiVariant}
                                    multiline
                                    rows={uiData?.rows}
                                    maxRows={uiData?.maxRows}
                                    minRows={uiData?.minRows}
                                    placeholder={uiPlaceholder}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        const s = event.target.value
                                        if (optionValue !== s) {
                                            nt.storage.local.set(id, s).then(() => {
                                                setOptionValue(s)
                                            })
                                        }
                                    }}
                                />
                            </FormGroup>
                            <FormHelperText>{uiDescription}</FormHelperText>
                        </FormControl>
                    </Stack>
                </Stack>
                <Divider sx={{ "&:last-child": { display: "none" } }} />
            </>
        )
    }
}