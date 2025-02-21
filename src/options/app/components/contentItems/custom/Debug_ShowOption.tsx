import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CodeEditor from '../../common/CodeEditor';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

import FilterAltRounded from '@mui/icons-material/FilterAltRounded';
import FilterAltOffRounded from '@mui/icons-material/FilterAltOffRounded';

import { PushSnackbar } from '../../common/Snackbar';
import { nt } from '../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type';
import ContentItem_Head from '../module/Head';

const fontFamilyCode = "'BizinGothicDiscord', 'Menlo', 'Consolas', 'Droid Sans Mono', 'monospace'";

export default function Debug_ShowOption(props: OptionUI_ItemProps) {
    const [value, setValue] = useState("local");
    const [code, setCode] = useState<string>();
    const [listBL, setListBL] = useState<string>("correctionReplacePatterns skins fontFontFamilyList novelCustomCSS yomouRankTop_CustomCSS yomouRank_CustomCSS");
    const [listWL, setListWL] = useState<string>("");
    const [listBY, setListBY] = useState<string>("");
    const [listWY, setListWY] = useState<string>("");
    const [listBS, setListBS] = useState<string>("");
    const [listWS, setListWS] = useState<string>("");
    const [isWhitelist, setIsWhitelist] = useState<boolean>(false);

    function GetStorage(s: string, whitelist?: boolean, filter?: string) {
        if (s === "local") {
            console.log(s, whitelist, filter)
            nt.storage.local.get(null).then((data) => {
                setCode(JSON.stringify(FilteredList(data.get(), whitelist, filter), null, 3))
            }).catch((e) => {
                console.warn(e)
                setCode("")
            })
        } else if (s === "sync") {
            nt.storage.sync.get(null).then((data) => {
                setCode(JSON.stringify(FilteredList(data.get(), whitelist, filter), null, 3))
            }).catch((e) => {
                console.warn(e)
                setCode("")
            })
        } else if (s === "session") {
            nt.storage.session.get(null).then((data) => {
                setCode(JSON.stringify(FilteredList(data.get(), whitelist, filter), null, 3))
            }).catch((e) => {
                console.warn(e)
                setCode("")
            })
        }
    }

    function FilteredList(list: Record<string, any>, whitelist?: boolean, filter?: string): Record<string, any> {
        if (whitelist === undefined) {
            whitelist = isWhitelist
        }

        let listValue = filter ?? ListValue(undefined, whitelist)
        if (typeof listValue==="string") {
            let l = listValue.split(/\s/)
            if (whitelist) {
                var ret: Record<string, any> = {}
                for (let i = 0; i < l.length; i++) {
                    if (l[i] in list) {
                        ret[l[i]] = list[l[i]]
                    }
                }
                return ret
            } else {
                for (let i = 0; i < l.length; i++) {
                    if (l[i] in list) {
                        delete list[l[i]]
                    }
                }
                return list
            }
        }
        return {}
    }

    function ListValue(storage?: string, whitelist?: boolean) {
        if (storage === undefined) {
            storage = value
        }
        if (whitelist === undefined) {
            whitelist = isWhitelist
        }

        if (storage === "local") {
            return whitelist ? listWL : listBL
        } else if (storage === "sync") {
            return whitelist ? listWY : listBY
        } else if (storage === "session") {
            return whitelist ? listWS : listBS
        }
        return undefined
    }

    function ChangeList(s: string) {
        if (value === "local") {
            isWhitelist ? setListWL(s) : setListBL(s)
        } else if (value === "sync") {
            return isWhitelist ? setListWY(s) : setListBY(s)
        } else if (value === "session") {
            return isWhitelist ? setListWS(s) : setListBS(s)
        }

    }

    if (code === undefined) {
        GetStorage(value)

        nt.storage.local.changed((changes) => {
            if (value === "local") {
                GetStorage("local")
            }
        })
        nt.storage.sync.changed((changes) => {
            if (value === "sync") {
                GetStorage("sync")
            }
        })
        nt.storage.session.changed((changes) => {
            if (value === "session") {
                GetStorage("session")
            }
        })
    }

    return (
        <Stack
            direction="column"
            sx={{
                width: "100%",
                justifyContent: "space-between"
            }}
        >
            <ContentItem_Head {...props} />
            <Stack spacing={1} gap={1}>
                <Tabs
                    value={value}
                    onChange={(event: React.SyntheticEvent, newValue: string) => {
                        setValue(newValue);
                        GetStorage(newValue, undefined, ListValue(newValue))
                    }}
                    aria-label="ストレージ"
                >
                    <Tab label="local" value="local" />
                    <Tab label="sync" value="sync" />
                    <Tab label="session" value="session" />
                </Tabs>
                <Box>
                    <CodeEditor
                        language='json'
                        value={code}
                        onChange={(value: string) => { }}
                        height={300}
                        readonly
                    />
                </Box>

                <Stack direction="row" width={"100%"} gap={1} sx={{ alignItems: "center" }}>
                    <TextField
                        fullWidth
                        label={isWhitelist ? "ホワイトリスト" : "ブラックリスト"}
                        placeholder="キー名をスペース区切りで入力"
                        variant="outlined"
                        value={ListValue()}
                        onChange={(event) => {
                            ChangeList(event.target.value)
                            GetStorage(value, undefined, event.target.value)
                        }}
                        slotProps={{
                            input: {
                                spellCheck: false,
                                sx: {
                                    fontFamily: fontFamilyCode,
                                }
                            }
                        }}
                    />
                    <Checkbox
                        sx={{ height: "fit-content", cursor: "pointer" }}
                        inputProps={{ 'aria-label': 'フィルター設定' }}
                        checked={isWhitelist}
                        onChange={(event, checked) => {
                            setIsWhitelist(checked)
                            GetStorage(value, checked)
                        }}
                        icon={<FilterAltOffRounded />}
                        checkedIcon={<FilterAltRounded />}
                    />
                </Stack>
            </Stack>
        </Stack>
    )
}