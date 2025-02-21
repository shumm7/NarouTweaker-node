import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ModalSelection, ModalLoading } from '../../common/Modal';
import { PushSnackbar } from '../../common/Snackbar';

import { nt } from '../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type'

export default function FixOption(props: OptionUI_ItemProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loadingOpen, setLoadingOpen] = useState<boolean>(false);

    const handleAccept = () => {
        setLoadingOpen(true)
        nt.storage.local.get("extNotifications").then((data) => {
            nt.storage.fixOption(true, true)

            /* notify */
            if (data.extNotifications) {
                chrome.notifications.create("", {
                    iconUrl: "/assets/icons/icon_48.png",
                    type: "basic",
                    title: "Narou Tweakerが修復されました",
                    message: `保存されたデータはそのままです。`
                })
            }
        })
    }

    return (
        <>
            <Stack sx={{ ml: 1 }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setModalOpen(true)
                    }}
                    sx={{
                        textWrap: "nowrap"
                    }}
                >
                    修復
                </Button>
            </Stack>
            <ModalSelection
                open={modalOpen}
                setOpen={setModalOpen}
                title="設定データを修復します"
                description='保存されたデータは削除されません。'
                warning='この操作を行うと、異なるバージョンのNarou Tweakerを利用している他のブラウザで不具合が発生する可能性があります。最新版に更新した上で実行してください。'
                onSubmit={handleAccept}
            />
            <ModalLoading
                open={loadingOpen}
                setOpen={setLoadingOpen}
                time={1000}
                onClose={() => {
                    PushSnackbar("設定データを修復しました", "success")
                }}
            />
        </>
    )
}