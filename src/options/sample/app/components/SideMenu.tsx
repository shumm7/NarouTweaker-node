import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import { OptionUI_Page } from '../lib/type';
import Search from './Search';
import ColorModeIconDropdown from './common/theme/ColorModeIconDropdown';

export const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export function SideMenu(props: { page?: OptionUI_Page }) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
                    height: "64px"
                }}
            >
                <Search width={{ xs: '100%', md: '100%' }} />
            </Box>
            <Divider />
            <MenuContent page={props.page} />
        </Drawer>
    );
}

export function SideMenuMobile(props: { open: boolean | undefined, toggleDrawer: (newOpen: boolean) => () => void, page?: OptionUI_Page }) {
    return (
        <Drawer
            anchor="left"
            open={props.open}
            onClose={props.toggleDrawer(false)}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                [`& .${drawerClasses.paper}`]: {
                    backgroundImage: 'none',
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Stack
                sx={{
                    maxWidth: '70dvw',
                    height: '100%',
                }}
            >
                <Stack direction="row" sx={{ p: 2, gap: 1 }}>
                    <Search />
                </Stack>
                <Divider />
                <Stack sx={{ flexGrow: 1 }}>
                    <MenuContent page={props.page} />
                    <Divider />
                </Stack>
            </Stack>
        </Drawer>
    );
}