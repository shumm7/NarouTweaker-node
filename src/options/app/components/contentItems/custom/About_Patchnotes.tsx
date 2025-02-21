import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

import { nt } from '../../../../../utils/narou-tweaker';
import { FontAwseomeIcon } from '../../common/Icon';
import { getOptionPageFromID } from '../../../lib/utils';
import ErrorMessage from '../module/ErrorMessage';
import { OptionUI_ItemProps } from '../../../lib/type';

export default function Patchnotes(props: OptionUI_ItemProps) {
    const [Element, setElement] = useState<JSX.Element | null | undefined>()

    const fetchPatchnote = fetch('https://raw.githubusercontent.com/shumm7/Narou-Tweaker/main/patchnote.json')
        .then(response => response.json())
        .then(res => {
            if (Array.isArray(res.data)) {
                const lang = "ja"

                return (
                    <Stack
                        direction={"column"}
                        spacing={1}
                        sx={{
                            gap: 1,
                            width: "100%",
                            "& ul li": {
                                listStyleType: "'-'",
                                listStylePosition: "inside",
                            },
                            "& ul li::marker": {
                                color: "text.secondary",
                            },
                        }}
                    >
                        {
                            res.data.map((data: any): JSX.Element | null => {
                                const currentVersion = nt.extension.version
                                const version = nt.text.escapeHtml(data?.version)
                                const date = nt.text.escapeHtml(data?.date ?? "")
                                const url = nt.text.escapeHtml(data?.url ?? `https://github.com/shumm7/Narou-Tweaker/releases/tag/${version}`)
                                const release = data?.release
                                const patchnote = data?.patchnote[lang]
                                const headerList = {
                                    ja: {
                                        narou: "小説家になろう",
                                        novel: "小説ページ",
                                        workspace: "ユーザホーム",
                                        mypage: "ユーザページ",
                                        yomou: "小説を読もう！",
                                        mitemin: "みてみん",
                                        kasasagi: "KASASAGI",
                                        general: "全般"
                                    }
                                }

                                return (
                                    <>
                                        <Stack direction={"row"} sx={{ alignItems: "flex-start", gap: 2 }} data-version={version}>
                                            <Stack direction={"column"} sx={{ gap: 1 }}>
                                                <Stack direction={"row"}>
                                                    <a href={url}>
                                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>{version}</Typography>
                                                    </a>
                                                    {currentVersion === version && <Chip label="使用中" sx={{ backgroundColor: "primary" }} />}
                                                </Stack>
                                                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "90%", textWrap: "nowrap" }}>{date}</Typography>
                                                <Stack direction={"row"} sx={{ alignItems: "center", gap: 0.5 }}>
                                                    {release?.chrome && <FontAwseomeIcon icon={{ icon: "chrome", prefix: "brands" }} style={{ color: "text.secondary", fontSize: "90%" }} />}
                                                    {release?.gecko && <FontAwseomeIcon icon={{ icon: "firefox-browser", prefix: "brands" }} style={{ color: "text.secondary", fontSize: "90%" }} />}
                                                </Stack>
                                            </Stack>
                                            <Stack direction={"column"} sx={{ gap: 2 }}>
                                                {
                                                    Object.entries(headerList[lang]).map((k) => {
                                                        const key = k[0]
                                                        const header = k[1]
                                                        if (patchnote[key] != undefined) {
                                                            const icon = getOptionPageFromID(key)?.icon
                                                            return (
                                                                <Stack sx={{ gap: 1 }}>
                                                                    <Stack direction={"row"} sx={{ alignItems: "center", gap: 0.5 }}>
                                                                        {icon && <FontAwseomeIcon icon={icon} />}
                                                                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "bold" }}>{header}</Typography>
                                                                    </Stack>
                                                                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
                                                                        {
                                                                            patchnote[key].map((text: string) => {
                                                                                return (
                                                                                    <li>
                                                                                        <Typography variant="body2" sx={{ color: "text.secondary", display: "inline", ml: 1 }}>{text}</Typography>
                                                                                    </li>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ul>
                                                                </Stack>
                                                            )
                                                        } else {
                                                            return null
                                                        }
                                                    })
                                                }
                                            </Stack>
                                        </Stack>
                                        <Divider sx={{ "&:last-child": { display: "none" } }} />
                                    </>
                                )
                            })
                        }
                    </Stack>
                )
            }
        }).catch(error => {
            return (
                <ErrorMessage
                    icon={{ icon: "triangle-exclamation", prefix: "solid" }}
                    title="取得に失敗しました"
                    description={String(error)}
                />
            )
        });


    if (Element === undefined) {
        fetchPatchnote.then((data) => {
            setElement(data)
        })
    }

    function T() {
        if (Element) {
            return Element
        } else {
            return (
                <ErrorMessage
                    iconProps={<CircularProgress size={30} />}
                    title="データを取得中"
                />
            )
        }
    }

    return <T />
}