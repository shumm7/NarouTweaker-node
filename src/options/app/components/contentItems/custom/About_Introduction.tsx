import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { nt } from '../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type';

export default function Introduction(props: OptionUI_ItemProps) {
    return (
        <Stack spacing={2} sx={{width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Stack
                sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    pb: 1
                }}
            >
                <img
                    src="../../../../../../assets/image/wide.png"
                    style={{
                        maxWidth: "100%",
                        width: 700,
                        height: "auto"
                    }}
                />
                <Typography variant='h4' sx={{ fontWeight: "bold" }}>Narou Tweaker</Typography>
                <Typography variant='body2' sx={{ color: "text.secondary" }}>{nt.extension.version}</Typography>
            </Stack>
            <Divider sx={{width: "100%"}}/>
            <Stack sx={{ alignItems: "center", gap: 1 }}>
                <Typography
                    variant='body2'
                    sx={{
                        color: "text.secondary",
                        fontWeight: "bold"
                    }}
                >
                    Narou Tweakerとは
                </Typography>
                <Typography variant='body2' sx={{ whiteSpace: "pre-wrap" }}>
                    {"Narou Tweakerは「小説家になろう」のユーザー体験を向上させることを目的に開発された、ブラウザ拡張機能です。\n幅広い拡張性と高いユーザビリティで、より快適に小説を楽しむことが出来ます。"}
                </Typography>
            </Stack>
        </Stack>
    )
}