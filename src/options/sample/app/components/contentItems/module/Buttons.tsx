import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { OptionID, OptionUI_Item, OptionUI_ItemProps } from "../../../lib/type"
import { appendFavoriteOption, removeFavoriteOption, getOptionChildsFromID, moveFavoriteOption, getOptionFromID } from '../../../lib/utils';
import { FontAwseomeIcon } from '../../common/Icon';

import { nt } from '../../../../../../utils/narou-tweaker';
import { ModalSelection } from '../../common/Modal';
import { PushSnackbar } from '../../common/Snackbar';

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
    const hideButtons = option.ui?.hideButtons ?? []

    /* Target Options */
    let relatedOptions: Array<OptionID> = []
    const related = option.value?.related
    if (related === "childs") {
        relatedOptions = getOptionChildsFromID(id).map((child) => { return child.id })
    } else if (related === undefined) {
        if (uiType === "parent") {
            relatedOptions = getOptionChildsFromID(id).map((child) => { return child.id })
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

                    <Button_Info option={option} debug={isDebug} open={isInfoOpen} setOpen={setIsInfoOpen} storage={storage} />
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
                    <Button_Info option={option} debug={isDebug} open={isInfoOpen} setOpen={setIsInfoOpen} storage={storage} />
                    <Button_Reset open={isResetOpen} setOpen={setIsResetOpen} option={option} />
                </Stack>
            )
        }
    }

}

function Button_Info(props: {
    option: OptionUI_Item,
    debug?: boolean,
    storage: nt.storage.local.options
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [optionValue, setOptionValue] = React.useState<Record<string, any> | undefined>();
    const storage = props.storage
    const option = props.option
    const id = option.id
    const isDebug = props.debug
    const handleClose = () => {
        props.setOpen(false);
    };

    if (storage !== undefined && (optionValue === undefined)) {
        setOptionValue(storage.get(id))
        nt.storage.local.changed(id, (changes) => {
            if (changes[id]) {
                var dict: Record<string, any> = {}
                dict[id] = changes[id].newValue
                setOptionValue(dict)
            }
        })
    }

    function ListElement(props: { key?: string, label: string, value?: string, copy?: boolean }) {
        return (
            <ListItem
                key={props.key}
                secondaryAction={
                    props.copy && typeof props.value === "string" &&
                    <IconButton
                        edge="end"
                        aria-label="copy"
                        onClick={() => {
                            if (typeof props.value === "string") {
                                navigator.clipboard.writeText(props.value)
                            }
                        }}
                        size='small'
                        sx={{
                            color: 'text.secondary'
                        }}
                    >
                        <FontAwseomeIcon icon={{ icon: "copy", prefix: "solid" }} style={{ fontSize: "inherit", color: "inherit" }} />
                    </IconButton>
                }
            >
                <ListItemText
                    primary={props.label}
                    secondary={props.value}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 2,
                        "& .MuiListItemText-primary": {
                            width: "100px",
                        },
                        "& .MuiListItemText-secondary": {
                            wordBreak: "break-all",
                        }
                    }}
                />

            </ListItem>
        )
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            fullWidth
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
                <List
                    sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 300,
                        '& ul': { padding: 0 },
                        borderRadius: "12px",
                        "& .MuiListSubheader-root": {
                            fontWeight: "bold",
                            borderBottom: "1px solid",
                            borderTop: "1px solid",
                            borderColor: "divider",
                        }
                    }}
                    subheader={<li />}
                >

                    <li key={"section-root"}>
                        <ul>
                            <ListSubheader>基本</ListSubheader>
                            <ListElement key="option-title" label="タイトル" value={option.title} copy />
                            <ListElement key="option-id" label="ID" value={option.id} copy />
                            <ListElement key="option-description-text" label="説明" value={option.description?.text} />
                            {isDebug && option.description?.small && <ListElement key="option-description-small" label="説明（small）" value={option.description?.small} />}
                            {isDebug && option.description?.attention && <ListElement key="option-description-attention" label="説明（attention）" value={option.description?.attention} />}
                            {isDebug && option.description?.hidden && <ListElement key="option-description-hidden" label="説明（hidden）" value={option.description?.hidden} />}
                            {isDebug && option.description?.keywords && <ListElement key="option-description-keywords" label="キーワード" value={option.description?.keywords?.join(", ")} />}
                        </ul>
                    </li>
                    <li key={"section-value"}>
                        <ul>
                            <ListSubheader>データ</ListSubheader>
                            <ListElement key="option-location-page" label="ページ" value={option.location.page} copy />
                            <ListElement key="option-location-category" label="カテゴリ" value={option.location.category} copy />
                            {option.location.parent && <ListElement key="option-location-parent" label="親設定項目" value={option.location.parent} copy />}
                            <ListElement key="option-ui-type" label="UI種類" value={option.ui?.type} />
                            {optionValue && optionValue[option.id] !== undefined && <ListElement key="storage" label="値" value={String(optionValue[option.id])} copy />}
                        </ul>
                    </li>
                    <li key={"section-misc"}>
                        <ul>
                            <ListSubheader>その他</ListSubheader>
                            <ListElement key="option-location-noindex" label="検索に表示" value={option.location.noindex ? "はい" : "いいえ"} />
                            <ListElement key="option-value-is-advanced" label="高度な設定" value={option.value?.isAdvanced ? "はい" : "いいえ"} />
                            <ListElement key="option-value-is-experimental" label="実験中の機能" value={option.value?.isExperimental ? "はい" : "いいえ"} />
                            <ListElement key="option-value-is-debug" label="デバッグ機能" value={option.value?.isDebug ? "はい" : "いいえ"} />
                        </ul>
                    </li>
                </List>
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
        if(related === "childs" || (option.ui?.type === "parent" && related === undefined)){
            return "子項目もすべてリセットされます。"
        }else{
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
        } else if (related === "childs" || (option.ui?.type === "parent" && related === undefined)) {
            var childs = getOptionChildsFromID(option.id)
            for (let i = 0; i < childs.length; i++) {
                ret = reset(childs[i], ret)
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