import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MuiListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { OptionUI_Anchors, OptionUI_Page } from '../lib/type';
import { nt } from '../../../../utils/narou-tweaker';

export const tocWidth = 240;


const ListItemStyled = styled(MuiListItem)(({ theme }) => ({
    display: "block",
    flexDirection: "row",
    borderLeft: "2px solid",
    cursor: "pointer",
    borderColor: theme.palette.action.disabled,
    "&.selected": {
        borderColor: theme.palette.action.active
    },
    "& .MuiTypography-root": {
        color: theme.palette.action.disabled
    },
    "&:hover .MuiTypography-root": {
        color: theme.palette.action.focus
    },
    "&.selected .MuiTypography-root": {
        color: theme.palette.action.active
    },
}));

const TabOuter = styled(Box)(({ theme }) => ({
    "& .MuiTabScrollButton-root": {
        color: theme.palette.text.primary
    }
}));

function ListItem(props: React.ComponentPropsWithoutRef<typeof ListItemStyled> & { selected?: boolean }) {
    var p: Partial<typeof props> = props
    if (props.selected) {
        p.selected = undefined
        p.className = p.className ? p.className + " selected" : "selected"
        return <ListItemStyled {...p} />
    } else {
        p.selected = undefined
        return <ListItemStyled {...p} />
    }
}

export function Toc(props: { page?: OptionUI_Page, anchors: OptionUI_Anchors, hide?: boolean }) {
    const page = props.page
    const categories = page?.categories ?? []
    const [anchor, setAnchor] = useState<number>(0);
    const [isDebug, setDebug] = useState<boolean | undefined>();

    const [prevItems, setPrevItems] = useState(props.page?.id);
    if (props.page?.id !== prevItems) {
        setPrevItems(props.page?.id);
        setAnchor(0)
        window.scrollTo({ top: 0 })
        scrollToAnchor(0)
    }

    function scrollToAnchor(windowScroll?: number) {
        let windowOffset = 0
        const header = document.querySelector(`#nt-option--header`)
        if (header) {
            windowOffset = (header as HTMLElement).offsetHeight
        }

        const headings = document.querySelectorAll('*[data-anchor][data-anchor-level="1"]');
        const scrollPosition = typeof windowScroll === "number" ? windowScroll : window.scrollY;
        const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        for (let i = headings.length - 1; i >= 0; i--) {
            const heading = headings[i] as HTMLElement;
            if (heading.offsetTop <= scrollPosition + windowOffset + 10) {
                const id = heading.getAttribute("data-anchor-id")
                if (id) {
                    const tab = document.querySelector(`.anchor-tab[data-anchor-id="${id}"]`);
                    if (tab) {
                        const tabIndex = Number(tab.getAttribute("data-index"))
                        if (isFinite(tabIndex) && !(windowScroll === undefined && scrollPosition >= scrollMaxY)) {
                            setAnchor(tabIndex)
                        }
                    }
                }
                break
            }
        }
    }

    const handleScroll = () => {
        scrollToAnchor()
    };

    const handleChange = (event: React.MouseEvent<HTMLLIElement, MouseEvent> | undefined, index: number) => {
        let windowOffset = 0
        const header = document.querySelector(`#nt-option--header`)
        if (header) {
            windowOffset = (header as HTMLElement).offsetHeight
        }
        const tab = document.querySelector(`.anchor-tab[data-index="${index}"]`) as HTMLElement
        const id = tab.getAttribute("data-anchor-id")
        if (id) {
            const item = document.querySelector(`article *[data-anchor-id="${id}"]`)
            if (item) {
                const scroll = (item as HTMLElement).offsetTop - windowOffset
                window.scrollTo({ top: scroll })
                scrollToAnchor(scroll)
            }
        }
    };

    useEffect(() => {
        const localOption = async () => {
            const data = await nt.storage.local.get()

            setDebug(data.extDebug)
        };
        if (isDebug === undefined) {
            localOption();
        }

        nt.storage.local.changed(null, (changes) => {
            if (changes.extDebug !== undefined) {
                var s = changes.extDebug.newValue
                if (typeof s === "boolean") {
                    setDebug(s)
                }
            }
        })

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Stack
            spacing={2}
            sx={{
                display: { xs: 'none', md: 'flex' },
                position: "fixed",
                boxSizing: "border-box",
                top: 0,
                right: 0,
                alignItems: 'center',
                height: "100vh",
                width: tocWidth,
                mt: 8,
                overflowY: "auto"
            }}
        >
            <Stack
                sx={{
                    flexGrow: 1,
                    justifyContent:
                        'space-between',
                    height: "100%",
                    width: "100%"
                }}
            >
                <List dense sx={{ pt: 3 }}>
                    {
                        props.anchors.map((anchorItem, index) => {
                            if (anchorItem.level === 1) {
                                return (
                                    <ListItem
                                        disablePadding
                                        sx={{ px: 1.5, py: 0.2 }}
                                        selected={index === anchor}
                                        className="anchor-tab"
                                        data-index={index}
                                        data-anchor-id={anchorItem.id}
                                        onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => { handleChange(e, index) }}
                                    >
                                        <ListItemText
                                            disableTypography
                                            primary={<Typography variant="body2">{anchorItem.label}</Typography>}
                                        />
                                    </ListItem>
                                )
                            }
                        })
                    }
                </List>
            </Stack>
        </Stack>
    );
}


export function TocMobile(props: { page?: OptionUI_Page, anchors: OptionUI_Anchors, hide?: boolean }) {
    const page = props.page
    const categories = page?.categories ?? []
    const [anchor, setAnchor] = useState<number>(0);
    const [isDebug, setDebug] = useState<boolean | undefined>();

    const [prevItems, setPrevItems] = useState(props.page?.id);
    if (props.page?.id !== prevItems) {
        setPrevItems(props.page?.id);
        setAnchor(0)
        window.scrollTo({ top: 0 })
        scrollToAnchor(0)
    }

    function scrollToAnchor(windowScroll?: number) {
        let windowOffset = 0
        const header = document.querySelector(`#nt-option--header-mobile`)
        if (header) {
            windowOffset = (header as HTMLElement).offsetHeight
        }

        const headings = document.querySelectorAll('*[data-anchor]');
        const scrollPosition = typeof windowScroll === "number" ? windowScroll : window.scrollY;
        const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        for (let i = headings.length - 1; i >= 0; i--) {
            const heading = headings[i] as HTMLElement;
            if (heading.offsetTop <= scrollPosition + windowOffset + 10) {
                const id = heading.getAttribute("data-anchor-id")
                if (id) {
                    const tab = document.querySelector(`.anchor-tab--mobile[data-anchor-id="${id}"]`);
                    if (tab) {
                        const tabIndex = Number(tab.getAttribute("data-index"))
                        if (isFinite(tabIndex) && !(windowScroll === undefined && scrollPosition >= scrollMaxY)) {
                            setAnchor(tabIndex)
                        }
                    }
                }
                break
            }
        }
    }

    const handleScroll = () => {
        scrollToAnchor()
    };

    const handleChange = (event: React.SyntheticEvent, index: number) => {
        let windowOffset = 0
        const header = document.querySelector(`#nt-option--header-mobile`)
        if (header) {
            windowOffset = (header as HTMLElement).offsetHeight
        }
        const tab = document.querySelector(`.anchor-tab--mobile[data-index="${index}"]`) as HTMLElement
        const id = tab.getAttribute("data-anchor-id")
        if (id) {
            const item = document.querySelector(`article *[data-anchor-id="${id}"]`)
            if (item) {
                const scroll = (item as HTMLElement).offsetTop - windowOffset
                window.scrollTo({ top: scroll })
                scrollToAnchor(scroll)
            }
        }
    };

    useEffect(() => {
        const localOption = async () => {
            const data = await nt.storage.local.get()

            setDebug(data.extDebug)
        };
        if (isDebug === undefined) {
            localOption();
        }

        nt.storage.local.changed(null, (changes) => {
            if (changes.extDebug !== undefined) {
                var s = changes.extDebug.newValue
                if (typeof s === "boolean") {
                    setDebug(s)
                }
            }
        })

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!props.hide) {
        return (
            <TabOuter
                sx={{
                    display: { xs: 'auto', md: 'none' },
                    bgcolor: 'background.paper',
                    height: "48px",
                    width: "100vw",
                    borderTop: "1px solid",
                    borderColor: "divider"
                }}
            >
                <Tabs
                    value={anchor}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        height: "100%",
                        width: "100%",
                        textWrap: 'nowrap',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {
                        props.anchors.map((anchorItem, index) => {
                            if (anchorItem.level === 1) {
                                return (
                                    <Tab
                                        label={anchorItem.label}
                                        className="anchor-tab--mobile"
                                        data-index={index}
                                        data-anchor-id={anchorItem.id}
                                        data-anchor-level={anchorItem.level}
                                    />
                                )
                            }
                        })
                    }
                </Tabs>
            </TabOuter>
        );

    }
}