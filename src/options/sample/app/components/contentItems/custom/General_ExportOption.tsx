import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { PushSnackbar } from '../../common/Snackbar';
import { nt } from '../../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type';

export default function ExportOption(props: OptionUI_ItemProps) {
    return (
        <Stack sx={{ ml: 1 }}>
            <Button
                variant="outlined"
                onClick={() => {
                    nt.storage.local.get(null).then(function (data) {
                        var date = nt.time.getDatetimeStringForFilename()
                        if (data) {
                            nt.download.json(data.get(), `nt-option-${date}.json`).then(() => {
                                PushSnackbar("設定データをエクスポートしました", "info")
                            })
                        }
                    });
                }}
                sx={{
                    textWrap: "nowrap"
                }}
            >
                エクスポート
            </Button>
        </Stack>
    )
}