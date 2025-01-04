import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CodeEditor from '../../common/CodeEditor';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import FilterAltRounded from '@mui/icons-material/FilterAltRounded';
import FilterAltOffRounded from '@mui/icons-material/FilterAltOffRounded';

import { PushSnackbar } from '../../common/Snackbar';
import { nt } from '../../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type';
import ContentItem_Head from '../module/Head';

const fontFamilyCode = "'BizinGothicDiscord', 'Menlo', 'Consolas', 'Droid Sans Mono', 'monospace'";

export default function Debug_InsertOption(props: OptionUI_ItemProps) {
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [target, setTarget] = useState("local");

    return (
        <Stack
            direction="column"
            sx={{
                width: "100%",
                justifyContent: "space-between"
            }}
        >
            <ContentItem_Head {...props} />
            <Stack spacing={1} mt={2}>
                <Stack direction="row" gap={1}>
                    <TextField
                        select
                        label="ストレージ"
                        variant="outlined"
                        value={target}
                        onChange={(event) => {
                            setTarget(event.target.value)
                        }}
                        sx={{ minWidth: 100 }}
                    >
                        <MenuItem value="local">local</MenuItem>
                        <MenuItem value="sync">sync</MenuItem>
                        <MenuItem value="session">session</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="キー"
                        placeholder="キー名をスペース区切りで入力"
                        variant="outlined"
                        value={key}
                        onChange={(event) => { setKey(event.target.value) }}
                        slotProps={{
                            input: {
                                spellCheck: false,
                                sx: {
                                    fontFamily: fontFamilyCode,
                                }
                            }
                        }}
                    />
                </Stack>

                <Box sx={{display: key.length>0 ? "none" : undefined}}>
                    <CodeEditor
                        language='json'
                        placeholder='設定する値（JSON形式）'
                        value={value}
                        onChange={(value: string) => { setValue(value) }}
                        height={300}
                    />
                </Box>
            </Stack>
        </Stack>
    )
}