import * as React from 'react';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@mui/material/styles';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import CodeEditor from '../common/CodeEditor';
import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';

import { OptionID, OptionUI_Item_Code, OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';

export default function Option_Code(props: OptionUI_ItemProps) {
    const [optionValue, setOptionValue] = useState<string | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    const uiLabel = option.ui?.label
    const uiDescription = option.ui?.description
    const uiPlaceholder = option.ui?.placeholder
    var uiData: Record<string, any> | undefined = option.ui?.data
    const uiShowForce = option.ui?.showForce

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

    //const v = (containerEl.current?.querySelector("textarea") as HTMLTextAreaElement)?.value
    if (uiData?.layout === "wide") {
        return (
            <OptionItemBase {...props}>
                <Stack sx={{ width: "100%" }} direction="column">
                    <ContentItem_Head {...props} />
                    <Stack
                        sx={{
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                        }}
                    >
                        {
                            typeof optionValue === "string" || uiShowForce ?
                                <CodeEditor
                                    language={uiData?.language}
                                    height={uiData?.height}
                                    width={uiData?.width}
                                    maxHeight={uiData?.maxHeight}
                                    maxWidth={uiData?.maxWidth}
                                    placeholder={uiPlaceholder}
                                    onChange={(code) => {
                                        setOptionValue(code)
                                    }}
                                    value={optionValue}
                                />
                                :
                                <Skeleton variant="rounded">
                                    <CodeEditor
                                        language={uiData?.language}
                                        height={uiData?.height}
                                        width={uiData?.width}
                                        maxHeight={uiData?.maxHeight}
                                        maxWidth={uiData?.maxWidth}
                                        placeholder={uiPlaceholder}
                                        onChange={(code) => { }}
                                        value={optionValue}
                                    />
                                </Skeleton>
                        }
                    </Stack>
                </Stack>
            </OptionItemBase>
        )
    } else if (uiData?.layout === "default" || uiData?.layout === undefined) {
        return (
            <OptionItemBase {...props}>
                <ContentItem_Head {...props} />
                <Stack
                    sx={{
                        minWidth: 220,
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 2,
                    }}
                >
                    {
                        typeof optionValue === "string" || uiShowForce ?
                            <CodeEditor
                                language={uiData?.language}
                                height={uiData?.maxHeight}
                                width={uiData?.maxWidth}
                                placeholder={uiPlaceholder}
                                onChange={(code) => {
                                    setOptionValue(code)
                                }}
                                value={optionValue}
                            />
                            :
                            <Skeleton variant="rounded">
                                <CodeEditor
                                    language={uiData?.language}
                                    placeholder={uiPlaceholder}
                                    onChange={(code) => { }}
                                    value={optionValue}
                                />
                            </Skeleton>
                    }
                </Stack>
            </OptionItemBase>
        )
    }
}