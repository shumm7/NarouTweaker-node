import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { nt } from '../../../../../../utils/narou-tweaker';
import { ModalSelection, ModalLoading } from '../../common/Modal';
import { PushSnackbar } from '../../common/Snackbar';
import { OptionUI_ItemProps } from '../../../lib/type';

export default function ResetOption(props: OptionUI_ItemProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loadingOpen, setLoadingOpen] = useState<boolean>(false);

    const handleAccept = () => {
        setLoadingOpen(true)
        nt.storage.local.get("extNotifications").then((data) => {
            nt.storage.local.clear().then(() => {
                console.log("Reset all options.")
                nt.storage.local.set(new nt.storage.local.options().get())
                console.log("Set all options.")

                /* notify */
                if (data.extNotifications) {
                    chrome.notifications.create("", {
                        iconUrl: "/assets/icons/icon_48.png",
                        type: "basic",
                        title: "Narou Tweakerがリセットされました",
                        message: ``
                    })
                }
            })
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
                    リセット
                </Button>
            </Stack>
            <ModalSelection
                open={modalOpen}
                setOpen={setModalOpen}
                title="設定データをリセットします"
                description='スキンを含む、保存されているデータが全てリセットされます。'
                warning='この操作は元に戻せません。'
                onSubmit={handleAccept}
            />
            <ModalLoading
                open={loadingOpen}
                setOpen={setLoadingOpen}
                time={1000}
                onClose={() => {
                    PushSnackbar("設定データをリセットしました", "success")
                }}
            />
        </>
    )
}