import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MuiPaper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { OptionUI_Anchors, OptionUI_Category, OptionUI_Descriptions, OptionUI_Item, OptionUI_Page } from "../lib/type";
import { OptionUI_Items } from '../lib/items';
import { nt } from '../../../utils/narou-tweaker';
import ContentItem from './ContentItem';
import ErrorMessage from './contentItems/module/ErrorMessage';

function CategoryDescription(props: { description?: OptionUI_Descriptions }) {
    const text = props.description?.text
    const small = props.description?.small
    const attention = props.description?.attention
    if (text || small || attention) {
        return (
            <Stack sx={{ mb: 1 }}>
                {text && (<Typography variant={"caption"} sx={{ color: 'text.secondary' }}>{text}</Typography>)}
                {small && (<Typography variant={"caption"} sx={{ color: 'text.secondary', fontSize: "70%" }}>{small}</Typography>)}
                {attention && (<Typography variant={"caption"} sx={{ color: 'text.warning', fontSize: "70%" }}>{attention}</Typography>)}
            </Stack>
        )
    }
    return null
}

function Loading(props: { storage?: nt.storage.local.options }) {
    return (
        <Modal open={props.storage === undefined} onClose={() => { }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: "100vw",
                    maxHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress size={30} autoFocus={false} />
            </Box>
        </Modal>
    )
}

export function ScrollWithSearchParams(
    params: {
        page?: string | null
        category?: string | null
        id?: string | null
        focus?: boolean | null
    },
    isMobile?: boolean
) {
    if (params.page) {
        if (params.category) {
            let windowOffset = 0
            if (isMobile) {
                const header = document.querySelector(`#nt-option--header-mobile`)
                if (header) {
                    windowOffset = (header as HTMLElement).offsetHeight
                }
            } else {
                const header = document.querySelector(`#nt-option--header`)
                if (header) {
                    windowOffset = (header as HTMLElement).offsetHeight
                }
            }

            if (params.id) {
                const item = document.querySelector(`.nt-option-item[data-id="${params.id}"]`)
                if (item) {
                    const scroll = (item as HTMLElement).offsetTop - windowOffset
                    document.querySelector("main")?.setAttribute("data-value", `${scroll}`)
                    window.scrollTo({ top: scroll })
                    return scroll
                }
            } else {
                const item = document.querySelector(`.nt-option-category[data-category="${params.category}"] > *[data-anchor]`)
                if (item) {
                    const scroll = (item as HTMLElement).offsetTop - windowOffset
                    document.querySelector("main")?.setAttribute("data-value", `${scroll}`)
                    window.scrollTo({ top: scroll })
                    return scroll
                }
            }
        } else {
            document.querySelector("main")?.setAttribute("data-value", "0")
            window.scrollTo({ top: 0 })
            return 0
        }
    }
}

export default function ContentMain(props: {
    page?: OptionUI_Page,
    anchors: OptionUI_Anchors,
    setAnchors: React.Dispatch<React.SetStateAction<OptionUI_Anchors>>
}) {
    const page = props.page
    const categories = page?.categories ?? []
    const theme = useTheme()
    const [isDebug, setDebug] = useState<boolean | undefined>();
    const [moved, setMoved] = useState<boolean>(false);
    const [storage, setStorage] = useState<nt.storage.local.options | undefined>();

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const localOption = async (move: boolean) => {
            const data = await nt.storage.local.get()

            setMoved(move)
            setStorage(data)
            setDebug(data.extDebug)
        };
        if (storage === undefined) {
            localOption(false);
        }

        nt.storage.local.changed(null, (changes) => {
            localOption(true)
        })
    }, []);

    useEffect(() => {
        scrollTo()
    }, [searchParams]);

    useEffect(() => {
        if (!moved) {
            scrollTo()
            setMoved(true)
        }
    }, [storage]);

    function scrollTo() {
        const page = searchParams.get("page")
        const category = searchParams.get("category")
        const id = searchParams.get("id")
        const focus = searchParams.get("focus") === "1" ? true : false
        return ScrollWithSearchParams(
            { page: page, category: category, id: id, focus: focus },
            theme.breakpoints.values.md > document.documentElement.clientWidth
        )
    }

    const array = categories.map(
        (category, i) => {
            return {
                id: `category:${category.id}`,
                level: 1,
                label: category.title,
                target: {
                    page: page?.id ?? "",
                    category: category.id,
                    id: ""
                }
            }
        }
    )

    if (props.anchors.length !== array.length || !array.every((element, index) => element.id === props.anchors[index].id)) {
        props.setAnchors(array)
    }

    return (
        <>
            <Stack spacing={1} sx={{ py: 1 }} data-page={props.page?.id}>
                {categories.map((category, i) => {
                    return (
                        <Stack
                            sx={{
                                mb: 0.5,
                                "&:first-child > h6": {
                                    mt: 0
                                }
                            }}
                            className='nt-option-category'
                            data-page={page?.id ?? ""}
                            data-category={category.id}
                        >
                            {
                                !category.hideTitle ?
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        sx={{
                                            color: 'text.primary',
                                            mt: 3
                                        }}
                                        data-anchor
                                        data-anchor-level={1}
                                        data-anchor-id={`category:${category.id}`}
                                    >
                                        {category.title}
                                    </Typography>
                                    :
                                    <Typography
                                        data-anchor
                                        data-anchor-level={1}
                                        data-anchor-id={`category:${category.id}`}
                                    />
                            }
                            {(!category.hideDescription && !category.hideTitle) && <CategoryDescription description={category.description} />}
                            <Card sx={{ minWidth: 275, mt: 0.5, px: 1 }}>
                                <CardContent sx={{ py: 2, "&:last-child": { paddingBottom: 2 } }}>
                                    <Stack sx={{ gap: 0.5 }} spacing={1}>
                                        {
                                            OptionUI_Items.map((option, i) => {
                                                if (option.location.page === props.page?.id && option.location.category === category.id && option.location.parent === undefined && !option.location.hide) {
                                                    return <ContentItem option={option} storage={storage} type="default" />
                                                } else {
                                                    return null
                                                }
                                            })
                                        }
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    )
                })}
            </Stack>
            <Loading storage={storage} />
        </>
    )
}