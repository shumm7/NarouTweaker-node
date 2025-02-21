import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';

import { FontAwseomeIcon } from '../../common/Icon';
import Buttons from './Buttons';
import ContentItem_Breadcrumbs from './Breadcrumbs';

import { OptionUI_Descriptions, OptionUI_Item, OptionUI_ItemProps } from '../../../lib/type'
import Link from '../../common/Link';


function ContentItem_HeadDescription(props: { description?: OptionUI_Descriptions }) {
    const description = props.description
    const text = description?.text
    const small = description?.small
    const attention = description?.attention
    if (text || small || attention) {
        return (
            <Stack>
                {text && (<Typography variant={"caption"} sx={{ color: 'text.secondary', whiteSpace: "pre-wrap" }}>{text}</Typography>)}
                {small && (<Typography variant={"caption"} sx={{ color: 'text.secondary', fontSize: "70%", whiteSpace: "pre-wrap" }}>{small}</Typography>)}
                {attention && (<Typography variant={"caption"} sx={{ color: 'text.warning', fontSize: "70%", whiteSpace: "pre-wrap" }}>{attention}</Typography>)}
            </Stack>
        )
    }
    return null
}

function ContentItem_HeadTitle(props: OptionUI_ItemProps) {
    const option = props.option
    const type = props.type

    if (type === "favorite" || type === "search") {
        return (
            <Link
                page={option.location.page}
                category={option.location.category}
                id={option.id}
                focus
            >
                {option.title}
            </Link>
        )
    } else {
        return (
            <>
                {option.title}
            </>
        )
    }
}


export default function ContentItem_Head(props: OptionUI_ItemProps) {
    const option = props.option
    const description = option.description

    return (
        <Stack>
            <ContentItem_Breadcrumbs {...props} />
            <Stack direction={"row"} sx={{ gap: "0.3rem" }}>
                <Stack direction={"row"}>
                    {option.value?.isExperimental && <ContentItem_HeadExperimental />}
                    {option.value?.isAdvanced && <ContentItem_HeadAdvanced />}
                    {option.value?.isDebug && <ContentItem_HeadDebug />}
                    <Typography
                        sx={{
                            color: 'text.primary',
                            ml: (option.value?.isExperimental || option.value?.isAdvanced || option.value?.isDebug) ? 1 : 0,
                            "& > a": {
                                color: "text.primary"
                            }
                        }}>
                        <ContentItem_HeadTitle {...props} />
                    </Typography>
                </Stack>
                <Buttons {...props} />
            </Stack>
            <ContentItem_HeadDescription description={description} />
        </Stack>
    )
}

function ContentItem_HeadExperimental(props: {}) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                size="small"
                aria-label="実験的な要素"
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <FontAwseomeIcon icon={{ icon: "flask", prefix: "solid" }} style={{ fontSize: "14px" }} />
            </IconButton>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>実験的な要素</Typography>
            </Popover>
        </>

    )
}

function ContentItem_HeadAdvanced(props: {}) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                size="small"
                aria-label="高度な設定"
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <FontAwseomeIcon icon={{ icon: "feather", prefix: "solid" }} style={{ fontSize: "14px" }} />
            </IconButton>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>高度な設定</Typography>
            </Popover>
        </>

    )
}

function ContentItem_HeadDebug(props: {}) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                size="small"
                aria-label="デバッグ項目"
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <FontAwseomeIcon icon={{ icon: "bug", prefix: "solid" }} style={{ fontSize: "14px" }} />
            </IconButton>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>デバッグ項目</Typography>
            </Popover>
        </>

    )
}