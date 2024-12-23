import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography, { TypographyTypeMap } from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { OptionUI_Page } from '../lib/type';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { getOptionPageFromID } from '../lib/utils';
import Link from './common/Link';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: theme.palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

export default function NavbarBreadcrumbs(props: { page?: OptionUI_Page }) {
    var pageList: Array<React.JSX.Element> = []

    function addPageList(page?: OptionUI_Page, isCurrent?: boolean) {
        if(page){
            if (page?.title) {
                if (isCurrent) {
                    pageList.splice(0, 0,
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            {page?.title}
                        </Typography>
                    )
                } else {
                    pageList.splice(0, 0,
                        <Typography variant="body1">
                            <Link page={page.id} category="" id="" style={{color: "inherit"}}>
                                {page?.title}
                            </Link>
                        </Typography>
                    )
                }
            }
            
            if(page.parent){
                addPageList(getOptionPageFromID(page.parent))
            }
        }
    }
    addPageList(props.page, true)

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            <Typography variant="body1">環境設定</Typography>
            {pageList}
        </StyledBreadcrumbs>
    );
}