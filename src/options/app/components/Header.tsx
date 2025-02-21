import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import MuiToolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import { tabsClasses } from '@mui/material/Tabs';
import MenuButton from './MenuButton';
import Typography from '@mui/material/Typography';
import ColorModeIconDropdown from './common/theme/ColorModeIconDropdown';
import BrandIcon from './common/BrandIcon';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import Search from './Search';
import { SideMenuMobile } from './SideMenu';
import { TocMobile } from './Toc';
import { drawerWidth } from './SideMenu';
import { OptionUI_Anchors, OptionUI_Page } from '../lib/type';

const Toolbar = styled(MuiToolbar)({
    width: '100%',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '12px',
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: '8px',
        p: '8px',
        pb: 0,
    },
});

export function CustomIcon() {
    return (
        <Box
            sx={{
                width: '1.5rem',
                height: '1.5rem',
                bgcolor: 'black',
                borderRadius: '999px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)',
            }}
        >
            <BrandIcon width={25} />
        </Box>
    );
}

export function Header() {

    return (
        <AppBar
            sx={{
                position: 'fixed',
                left: drawerWidth,
                right: 0,
                width: `calc(100vw - ${drawerWidth}px)`,
                display: { xs: 'none', md: 'flex' },
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 'var(--template-frame-height, 0px)',
            }}
            id="nt-option--header"
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ justifyContent: 'center', mr: 'auto' }}
                    >
                        <CustomIcon />
                        <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
                            Narou Tweaker
                        </Typography>
                    </Stack>
                    <ColorModeIconDropdown />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export function HeaderMobile(props: {page?: OptionUI_Page, anchors: OptionUI_Anchors}) {
    const [open, setOpen] = useState(false);
    const page = props.page

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                display: { xs: 'auto', md: 'none' },
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 'var(--template-frame-height, 0px)',
                textWrap: "nowrap",
                whiteSpace: "nowrap"
            }}
            id="nt-option--header-mobile"
        >
            <Toolbar variant="regular">
                <SideMenuMobile open={open} toggleDrawer={toggleDrawer} page={page}/>
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <MenuButton aria-label="menu" onClick={toggleDrawer(true)} sx={{mr: 1}}>
                        <MenuRoundedIcon />
                    </MenuButton>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'center', mr: 'auto' }}
                    >
                        <CustomIcon />
                        <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
                            Narou Tweaker
                        </Typography>
                    </Stack>
                    <ColorModeIconDropdown />
                </Stack>
            </Toolbar>
            <TocMobile page={page} anchors={props.anchors} hide={page?.hideToc}/>
        </AppBar>
    );
}