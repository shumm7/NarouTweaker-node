import React, { ReactHTMLElement, useRef } from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, MemoryRouter as Router, useSearchParams } from 'react-router-dom';

import { alpha, useColorScheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { HeaderMobile, Header } from './app/components/Header';
import MainGrid from './app/components/MainGrid';
import { drawerWidth, SideMenu } from './app/components/SideMenu';
import AppTheme from './app/components/common/theme/AppTheme';
import { Toc, tocWidth } from './app/components/Toc';
import { getOptionPageFromID } from './app/lib/utils';
import { OptionUI_Anchors } from './app/lib/type';
import { Bounce, ToastContainer } from 'material-react-toastify';

export interface Anchor {
    items: OptionUI_Anchors
    activeId: string
}


function Dashboard(props: { disableCustomTheme?: boolean }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [anchors, setAnchors] = useState<OptionUI_Anchors>([])
    const { mode, systemMode, setMode } = useColorScheme();
    const resolveMode = mode === "system" ? systemMode : mode

    const page = getOptionPageFromID(searchParams.get("page") ?? "general")
    let tocWidthCurrent = page?.hideToc==="hide" ? 0 : tocWidth

    return (
        <>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu page={page} />
                <HeaderMobile page={page} anchors={anchors} />
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: `rgba(${theme.palette.background.default} / 1)`,
                        overflow: 'visible',
                    })}
                >
                    <Header />
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            minHeight: "100vh",
                            maxWidth: { xs: `100vw`, md: `calc(100vw - ${drawerWidth + tocWidthCurrent}px)` },
                            pb: 5,
                            pt: { xs: 17, md: 11 },
                            pr: 3,
                            pl: 3,
                            mr: { xs: 0, md: `${tocWidthCurrent}px` }
                        }}
                    >
                        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, height: "100%" }}>
                            <MainGrid page={page} setAnchors={setAnchors} anchors={anchors}/>
                        </Box>
                    </Stack>
                    <Toc page={page} anchors={anchors} hide={page?.hideToc}/>
                </Box>
            </Box>
            <ToastContainer
                autoClose={3000}
                position="bottom-right"
                theme={resolveMode ?? "dark"}
                transition={Bounce}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                hideProgressBar={false}
            />
        </>
    )
}

export default function App(props: {}) {
    return (
        <React.StrictMode>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppTheme {...props}>
                    <Dashboard />
                </AppTheme>
            </BrowserRouter>
        </React.StrictMode>
    )
}