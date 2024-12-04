import Sidebar from "./Sidebar"
import ContentsFooter from "./ContentsFooter"
import ContentsHeader from "./ContentsHeader"
import ContentsMain from "./ContentsMain"
import DrawerHeader from "./common/DrawerHeader";

import { getOptionPageFromID } from "../../../utils/optionUI_utils";
import { useSearchParams } from "react-router-dom";
import { List, IconButton, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Box, CssBaseline, Toolbar, Typography, styled, Theme, CSSObject, useTheme } from "@mui/material";
import { useState } from "react";
import FAIcon from "./common/FAIcon";
import Drawer from "./common/Drawer";
import AppBar from "./common/AppBar";

export default function Container(props: {}) {
    const theme = useTheme();

    const [searchParams, setSearchParams] = useSearchParams();
    const page = getOptionPageFromID(searchParams.get("page") ?? "general")

    const [sidebarIsOpen, sidebarOpenState] = useState(true)

    const sidebarOpen = () => {
        sidebarOpenState(true)
    }
    const sidebarClose = () => {
        sidebarOpenState(false)
    }



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={sidebarIsOpen} elevation={0}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="サイドバーを開く"
                        onClick={sidebarOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            sidebarIsOpen && { display: 'none' },
                        ]}
                    >
                        {theme.direction === 'rtl' ? <FAIcon prefix="solid" icon="angles-left"/> : <FAIcon prefix="solid" icon="angles-right"/>}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {page?.title ? page.title : ""}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={sidebarIsOpen}>
                <DrawerHeader>
                    <IconButton onClick={sidebarClose}>
                    {theme.direction === 'rtl' ? <FAIcon prefix="solid" icon="angles-right"/> : <FAIcon prefix="solid" icon="angles-left"/>}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    sidebarIsOpen
                                        ? {
                                            justifyContent: 'initial',
                                        }
                                        : {
                                            justifyContent: 'center',
                                        },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                        },
                                        sidebarIsOpen
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: 'auto',
                                            },
                                    ]}
                                >
                                    T
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    sx={[
                                        sidebarIsOpen
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    sidebarIsOpen
                                        ? {
                                            justifyContent: 'initial',
                                        }
                                        : {
                                            justifyContent: 'center',
                                        },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                        },
                                        sidebarIsOpen
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: 'auto',
                                            },
                                    ]}
                                >
                                    T
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    sx={[
                                        sidebarIsOpen
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography sx={{ marginBottom: 2 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                    enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                    imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                    Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                    Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                    adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                    nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                    leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                    feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                    consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                    sapien faucibus et molestie ac.
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                    eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                    neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                    tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                    sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                    tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                    gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                    et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                    tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                    eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                    posuere sollicitudin aliquam ultrices sagittis orci a.
                </Typography>
            </Box>
        </Box>
    );

    return (
        <div id="container">
            <Sidebar page={page} />
            <div id="contents">
                <ContentsHeader page={page} />
                <ContentsMain page={page} />
                <ContentsFooter />
            </div>
        </div>
    )
}