import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MuiListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { OptionUI_Anchors, OptionUI_Page } from '../lib/type';
import { nt } from '../../../utils/narou-tweaker';
import Link, { GetLocation } from './common/Link';
import { ScrollWithSearchParams } from './ContentMain';

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

function SetSelectedAnchor(setAnchor: React.Dispatch<React.SetStateAction<number>>, isMobile?: boolean) {
    setAnchor(0)
    let headerOffset = 0
    const header = document.querySelector(isMobile ? `#nt-option--header-mobile` : `#nt-option--header`)
    if (header) {
        headerOffset = (header as HTMLElement).offsetHeight
    }

    let scrollPosition = document.documentElement.scrollTop;
    const maxScrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

    const valueScrollRaw = document.querySelector("main")?.getAttribute("data-value")
    if (typeof valueScrollRaw === "string") {
        const valueScroll = Number(valueScrollRaw)
        if (isFinite(valueScroll) && maxScrollHeight <= valueScroll) {
            scrollPosition = Number(valueScroll)
            document.querySelector("main")?.removeAttribute("data-value")
        }
    }

    const headings = document.querySelectorAll('*[data-anchor]');
    for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i] as HTMLElement;
        if (Math.max(heading.offsetTop, (headings[0] as HTMLElement).offsetTop) <= scrollPosition + headerOffset + 10) {
            const id = heading.getAttribute("data-anchor-id")
            if (id) {
                setAnchor(i)
                break
            }
        }
    }
}

export function Toc(props: {
    page?: OptionUI_Page,
    anchors: OptionUI_Anchors,
    hide?: "hide" | "empty" | "show"
}) {
    const page = props.page
    const hide = props.hide
    const categories = page?.categories ?? []
    const [anchor, setAnchor] = useState<number>(0);
    const [isDebug, setDebug] = useState<boolean | undefined>();
    const [isScrollEvent, setIsScrollEvent] = useState<boolean>(true);
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()

    const handleScroll = () => {
        if (theme.breakpoints.values.md <= document.documentElement.clientWidth) {
            SetSelectedAnchor(setAnchor)
        }
    };

    useEffect(() => {
        SetSelectedAnchor(setAnchor)
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

    if (hide !== "hide") {
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
                                if (anchorItem.level === 1 && hide !== "empty") {
                                    return (
                                        <ListItem
                                            disablePadding
                                            sx={{ px: 1.5, py: 0.2 }}
                                            selected={index === anchor}
                                            className="anchor-tab"
                                            data-index={index}
                                            data-anchor-id={anchorItem.id}
                                        >
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <a onClick={() => {
                                                        navigate(
                                                            GetLocation(
                                                                location,
                                                                anchorItem.target.page,
                                                                anchorItem.target.category,
                                                                anchorItem.target.id
                                                            )
                                                        )

                                                        ScrollWithSearchParams({
                                                            page: anchorItem.target.page,
                                                            category: anchorItem.target.category,
                                                            id: anchorItem.target.id,
                                                            focus: false
                                                        }, false)
                                                        setAnchor(index)
                                                    }}>
                                                        <Typography variant="body2">{anchorItem.label}</Typography>
                                                    </a>
                                                }
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
}


export function TocMobile(props: { page?: OptionUI_Page, anchors: OptionUI_Anchors, hide?: "hide" | "empty" | "show" }) {
    const page = props.page
    const hide = props.hide
    const categories = page?.categories ?? []
    const [anchor, setAnchor] = useState<number>(0);
    const [isDebug, setDebug] = useState<boolean | undefined>();
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()

    const handleScroll = () => {
        if (theme.breakpoints.values.md > document.documentElement.clientWidth) {
            SetSelectedAnchor(setAnchor, true)
        }
    };

    const handleChange = (event: React.SyntheticEvent, index: number) => {
        const anchorItem = props.anchors.at(index)
        if (anchorItem) {
            navigate(
                GetLocation(
                    location,
                    anchorItem.target.page,
                    anchorItem.target.category,
                    anchorItem.target.id
                )
            )
            ScrollWithSearchParams({
                page: anchorItem.target.page,
                category: anchorItem.target.category,
                id: anchorItem.target.id,
                focus: false
            }, true)
            setAnchor(index)
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

    if (hide !== "empty" && hide !== "hide") {
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
                                        tabIndex={index}
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