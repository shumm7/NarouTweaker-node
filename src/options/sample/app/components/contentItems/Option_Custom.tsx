import * as React from 'react';
import { useEffect, useState } from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import ContentItem_Head from './module/Head';
import OptionItemBase from './module/OptionItemBase';
import Option_Header from './Option_Header';

import { OptionUI_ItemProps } from "../../lib/type"
import { nt } from '../../../../../utils/narou-tweaker';
import { FontAwseomeIcon } from '../common/Icon';

import Patchnotes from './custom/About_Patchnotes';
import Introduction from './custom/About_Introduction';
import ExportOption from './custom/General_ExportOption';
import ImportOption from './custom/General_ImportOption';
import FixOption from './custom/General_FixOption';
import ResetOption from './custom/General_ResetOption';
import Favorite from './custom/Favorite';
import { Search, SearchResult } from './custom/Search';


function CustomElement(props: OptionUI_ItemProps & { id: string }) {
    switch (props.id) {
        /* About */
        case "extIntroduction":
            return <Introduction {...props} />
        case "extPatchnotes":
            return <Patchnotes {...props} />

        /* Favorite */
        case "extFavoriteOptions":
            return <Favorite {...props} />

        /* Search */
        case "extSearch":
            return <Search {...props} />
        case "extSearchResult":
            return <SearchResult {...props} />

        /* General */
        case "extImportOption":
            return <ImportOption {...props} />
        case "extExportOption":
            return <ExportOption {...props} />
        case "extFixOption":
            return <FixOption {...props} />
        case "extResetOption":
            return <ResetOption {...props} />

        /* Any */
        default:
            return undefined
    }
}

export default function Option_Custom(props: OptionUI_ItemProps) {
    const storage = props.storage
    const option = props.option
    const id = option.id
    const childDepth = props.child
    var uiData: Record<string, any> | undefined = option.ui?.data
    const elementId = uiData?.id

    const [open, setOpen] = useState(false);
    var element = CustomElement({ ...props, id: elementId })

    if (element) {
        if (uiData?.layout === "default" || uiData?.layout === undefined) {
            return (
                <OptionItemBase {...props} >
                    <ContentItem_Head {...props} />
                    <Stack
                        sx={{
                            height: "inherit",
                            minWidth: "70px",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 2,
                            flexShrink: 0,
                        }}
                    >
                        {element}
                    </Stack>
                </OptionItemBase>
            )
        } else if (uiData?.layout === "wide") {
            return (
                <OptionItemBase {...props} >
                    <Stack sx={{ width: "100%" }} direction="column">
                        {element}
                    </Stack>
                </OptionItemBase>
            )
        } else if (uiData?.layout === "popup") {
            return (
                <OptionItemBase {...props} >
                    <ContentItem_Head {...props} />
                    <Stack
                        sx={{
                            height: "inherit",
                            width: `${40}px`,
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onClick={
                                () => {
                                    setOpen(true)
                                }
                            }
                        >
                            <IconButton
                                size="small"
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                sx={{ width: "100%", height: "100%" }}
                            >
                                <FontAwseomeIcon icon={{ icon: "pen-to-square", prefix: "solid" }} style={{ fontSize: "14px" }} />
                            </IconButton>
                        </Box>
                    </Stack>
                    <Modal
                        open={open}
                        onClose={() => { setOpen(false) }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: `min(500px, 100vw)`,
                            height: `min(500px, 100vh)`,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            {element}
                        </Box>
                    </Modal>
                </OptionItemBase>
            )
        }
    }
}