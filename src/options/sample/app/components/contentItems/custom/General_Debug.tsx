import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import ContentItem_Head from '../module/Head';
import OptionItemBase from '../module/OptionItemBase';

import { OptionUI_ItemProps } from '../../../lib/type';
import Link from '../../common/Link';
import { FontAwseomeIcon } from '../../common/Icon';

export default function DebugPage(props: OptionUI_ItemProps) {
    const [show, setShow] = useState<boolean | undefined | void>()
    const storage = props.storage
    const option = props.option
    const id = option.id

    if (storage !== undefined && show === undefined) {
        setShow(storage.extDebug);
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.key === "o") {
            if (storage !== undefined && show !== undefined) {
                e.preventDefault()
                setShow(true);
            }
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    if (show) {
        return (
            <>
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
                        direction={"row"}
                    >
                        <Link page="debug" category='' id="">
                            <IconButton
                                color="inherit"
                                aria-label="デバッグページへ移動"
                                edge="start"
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 40,
                                        width: 40,
                                        fontSize: "16px",
                                        color: "text.secondary"
                                    }}
                                >
                                    <FontAwseomeIcon icon={{ icon: "arrow-up-right-from-square", prefix: "solid" }} style={{ fontSize: "inherit", color: "inherit" }} />
                                </Box>
                            </IconButton>
                        </Link>
                    </Stack>
                </OptionItemBase>
                <Divider sx={{ pt: 1 }} className="nt-option-item--divider--showforce" />
            </>
        )
    }
}