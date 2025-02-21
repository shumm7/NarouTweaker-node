import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import ListItemIcon from '@mui/material/ListItemIcon';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { OptionID, OptionUI_Item, OptionUI_ItemProps } from "../../../lib/type"
import { appendFavoriteOption, removeFavoriteOption, getOptionChildrenFromID, moveFavoriteOption, getOptionFromID } from '../../../lib/utils';
import { FontAwseomeIcon } from '../../common/Icon';

import { nt } from '../../../../../utils/narou-tweaker';
import { ModalSelection } from '../../common/Modal';
import { PushSnackbar } from '../../common/Snackbar';
import OptionInfo from './OptionInfo';

export default function Buttons(props: OptionUI_ItemProps & { variant?: "dropdown" | "bottom" }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isDebug, setIsDebug] = React.useState<boolean | undefined>();
    const [isFavorite, setIsFavorite] = React.useState<boolean | undefined>();
    const [isInfoOpen, setIsInfoOpen] = React.useState<boolean>(false);
    const [isResetOpen, setIsResetOpen] = React.useState<boolean>(false);
    const storage = props.storage
    const option = props.option
    const childDepth = props.child ?? 0
    const type = props.type
    const variant = props.variant
    const id = option.id
    const uiType = option.ui?.type

    /* Menu Open */
    const isOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    let hideButtons = option.ui?.hideButtons ?? []
    if (hideButtons === "all") {
        hideButtons = ["favorite", "info", "reset"]
    }

    /* Target Options */
    let relatedOptions: Array<OptionID> = []
    const related = option.value?.related
    if (related === "children") {
        relatedOptions = getOptionChildrenFromID(id).map((child) => { return child.id })
    } else if (related === undefined) {
        if (uiType === "parent") {
            relatedOptions = getOptionChildrenFromID(id).map((child) => { return child.id })
        } else {
            relatedOptions = [id]
        }
    } else {
        relatedOptions = related
    }

    /* Storage */
    if (storage !== undefined && (isDebug === undefined || isFavorite === undefined)) {
        setIsDebug(storage.extDebug)
        setIsFavorite(storage.extFavoriteOptions.includes(id))

        nt.storage.local.changed(["extDebug", "extFavoriteOptions"], (changes) => {
            if (changes.extDebug) {
                const v1 = changes.extDebug.newValue
                if (typeof v1 === "boolean") {
                    setIsDebug(v1)
                }
            }
            if (changes.extFavoriteOptions) {
                const v2 = changes.extFavoriteOptions.newValue
                if (Array.isArray(v2)) {
                    setIsFavorite(v2.includes(id))
                }
            }
        })
    }

    if (storage !== undefined) {
        const showFavorite = !hideButtons.includes("favorite")
        const showReset = !hideButtons.includes("reset")
        const showInfo = !hideButtons.includes("info")

        if (variant === "dropdown" || variant === undefined) {
            return (
                <Box>
                    <IconButton
                        aria-label="more"
                        id="menu-button"
                        data-id={option.id}
                        aria-controls={isOpen ? 'long-menu' : undefined}
                        aria-expanded={isOpen ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{
                            color: 'text.secondary'
                        }}
                        size="small"
                    >
                        <FontAwseomeIcon icon={{ icon: "angle-down", prefix: "solid" }} style={{ fontSize: "14px" }} />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={isOpen}
                        onClose={handleClose}
                    >
                        {
                            type === "favorite" && childDepth === 0 &&
                            <>
                                <MenuItem
                                    key={"favorite-move-up"}
                                    onClick={() => {
                                        if (isFavorite) {
                                            moveFavoriteOption(option.id, -1)
                                        }
                                        handleClose()
                                    }}
                                >
                                    <ListItemIcon>
                                        <FontAwseomeIcon icon={{ icon: "arrow-up", prefix: "solid" }} />
                                    </ListItemIcon>
                                    上へ移動
                                </MenuItem>
                                <MenuItem
                                    key={"favorite-move-down"}
                                    onClick={() => {
                                        if (isFavorite) {
                                            moveFavoriteOption(option.id, 1)
                                        }
                                        handleClose()
                                    }}
                                >
                                    <ListItemIcon>
                                        <FontAwseomeIcon icon={{ icon: "arrow-down", prefix: "solid" }} />
                                    </ListItemIcon>
                                    下へ移動
                                </MenuItem>
                                <Divider />
                            </>
                        }
                        {
                            showFavorite &&
                            <MenuItem
                                key={"favorite"}
                                onClick={() => {
                                    if (isFavorite) {
                                        removeFavoriteOption(option.id)
                                    } else {
                                        appendFavoriteOption(option.id)
                                    }
                                    handleClose()
                                }}
                            >
                                <ListItemIcon>
                                    {
                                        isFavorite ?
                                            <FontAwseomeIcon icon={{ icon: "heart", prefix: "solid" }} />
                                            :
                                            <FontAwseomeIcon icon={{ icon: "heart", prefix: "regular" }} />
                                    }
                                </ListItemIcon>
                                {isFavorite ? "お気に入り解除" : "お気に入り"}
                            </MenuItem>
                        }
                        {
                            showReset &&
                            <MenuItem key={"reset"} onClick={() => {
                                handleClose()
                                setIsResetOpen(true)
                            }}>
                                <ListItemIcon>
                                    <FontAwseomeIcon icon={{ icon: "arrow-rotate-left", prefix: "solid" }} />
                                </ListItemIcon>
                                リセット
                            </MenuItem>
                        }

                        {(showInfo && (showFavorite || showReset)) && <Divider />}
                        {
                            showInfo &&
                            <MenuItem key={"info"} onClick={() => {
                                handleClose()
                                setIsInfoOpen(true)
                            }}>
                                <ListItemIcon>
                                    <FontAwseomeIcon icon={{ icon: "circle-info", prefix: "solid" }} />
                                </ListItemIcon>
                                情報
                            </MenuItem>
                        }
                    </Menu>

                    <Button_Info option={option} storage={storage} open={isInfoOpen} setOpen={setIsInfoOpen} />
                    <Button_Reset open={isResetOpen} setOpen={setIsResetOpen} option={option} />
                </Box>
            )

        } else if (variant === "bottom") {
            return (
                <Stack direction={"row"} spacing={1} marginTop={1}>
                    {
                        type === "favorite" && childDepth === 0 &&
                        <>
                            <IconButton
                                aria-label="上へ移動"
                                data-id={option.id}
                                key={"favorite-move-up"}
                                onClick={() => {
                                    if (isFavorite) {
                                        moveFavoriteOption(option.id, -1)
                                    }
                                }}
                                sx={{
                                    color: 'text.secondary'
                                }}
                                size="small"
                            >
                                <FontAwseomeIcon icon={{ icon: "arrow-up", prefix: "solid" }} style={{ fontSize: "12px" }} />
                            </IconButton>
                            <IconButton
                                aria-label="上へ移動"
                                data-id={option.id}
                                key={"favorite-move-down"}
                                onClick={() => {
                                    if (isFavorite) {
                                        moveFavoriteOption(option.id, 1)
                                    }
                                }}
                                sx={{
                                    color: 'text.secondary'
                                }}
                                size="small"
                            >
                                <FontAwseomeIcon icon={{ icon: "arrow-down", prefix: "solid" }} style={{ fontSize: "12px" }} />
                            </IconButton>
                            <Divider orientation='vertical' variant="middle" />
                        </>
                    }
                    {
                        showFavorite &&
                        <IconButton
                            aria-label="お気に入り"
                            data-id={option.id}
                            key={"favorite"}
                            onClick={() => {
                                if (isFavorite) {
                                    removeFavoriteOption(option.id)
                                } else {
                                    appendFavoriteOption(option.id)
                                }
                            }}
                            sx={{
                                color: 'text.secondary'
                            }}
                            size="small"
                        >
                            {
                                isFavorite ?
                                    <FontAwseomeIcon icon={{ icon: "heart", prefix: "solid" }} style={{ fontSize: "12px" }} />
                                    :
                                    <FontAwseomeIcon icon={{ icon: "heart", prefix: "regular" }} style={{ fontSize: "12px" }} />
                            }
                        </IconButton>
                    }
                    {
                        showReset &&
                        <IconButton
                            aria-label="リセット"
                            data-id={option.id}
                            key={"reset"}
                            onClick={() => {
                                setIsResetOpen(true)
                            }}
                            sx={{
                                color: 'text.secondary'
                            }}
                            size="small"
                        >
                            <FontAwseomeIcon icon={{ icon: "arrow-rotate-left", prefix: "solid" }} style={{ fontSize: "12px" }} />
                        </IconButton>
                    }
                    {(showInfo && (showFavorite || showReset)) && <Divider orientation='vertical' variant="middle" />}
                    {
                        showInfo &&
                        <IconButton
                            aria-label="情報"
                            data-id={option.id}
                            key={"info"}
                            onClick={() => {
                                setIsInfoOpen(true)
                            }}
                            sx={{
                                color: 'text.secondary'
                            }}
                            size="small"
                        >
                            <FontAwseomeIcon icon={{ icon: "circle-info", prefix: "solid" }} style={{ fontSize: "12px" }} />
                        </IconButton>
                    }
                    <Button_Info option={option} open={isInfoOpen} setOpen={setIsInfoOpen} storage={storage} />
                    <Button_Reset open={isResetOpen} setOpen={setIsResetOpen} option={option} />
                </Stack>
            )
        }
    }

}

function Button_Info(props: {
    option: OptionUI_Item,
    storage: nt.storage.local.options
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const storage = props.storage
    const option = props.option
    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            fullWidth
            PaperProps={{
                elevation: 1
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                設定項目の情報
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: "text.secondary",
                })}
            >
                <FontAwseomeIcon icon={{ icon: "xmark", prefix: "solid" }} style={{ color: "inherit" }} />
            </IconButton>
            <DialogContent dividers>
                <OptionInfo storage={storage} option={option}/>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog >
    )
}

function Button_Reset(props: {
    option: OptionUI_Item
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const option = props.option

    const warningMsg = () => {
        var related = option.value?.related
        if (related === "children" || (option.ui?.type === "parent" && related === undefined)) {
            return "子項目もすべてリセットされます。"
        } else {
            return
        }
    }

    const reset = (option: OptionUI_Item, ret: Record<string, any>) => {
        var related = option.value?.related
        if (Array.isArray(related) || (option.ui?.type !== "parent" && related === undefined)) {
            if (related === undefined) {
                related = [option.id]
            }

            const defaultOption = new nt.storage.local.options().get()
            for (let i = 0; i < related.length; i++) {
                const key = related[i]
                if (key in defaultOption) {
                    ret[key] = defaultOption[key]
                }
            }
        } else if (related === "children" || (option.ui?.type === "parent" && related === undefined)) {
            var children = getOptionChildrenFromID(option.id)
            for (let i = 0; i < children.length; i++) {
                ret = reset(children[i], ret)
            }
        }
        return ret
    }

    return (
        <ModalSelection
            open={props.open}
            setOpen={props.setOpen}
            title="設定項目をリセット"
            description={`「${option.title}」をリセットします。`}
            warning={warningMsg()}
            onSubmit={() => {
                var ret: Record<string, any> = {}
                ret = reset(option, ret)
                if (Object.keys(ret).length > 0) {
                    nt.storage.local.set(ret).then(() => {
                        PushSnackbar("設定項目をリセットしました", "success")
                    }).catch(() => {
                        PushSnackbar("設定項目のリセットに失敗しました", "error")
                    })
                } else {
                    PushSnackbar("設定項目は変更されませんでした", "warn")
                }
            }}
        />
    )
}