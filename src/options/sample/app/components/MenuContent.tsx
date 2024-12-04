import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import Divider from '@mui/material/Divider';
import LinkPage from './common/Link';
import { OptionUI_Pages } from '../lib/pages';
import { OptionUI_Page, OptionUI_Page_Position } from '../lib/type';
import { FontAwseomeIcon } from './common/Icon';
import { Typography } from '@mui/material';

export default function MenuContent(props: { page?: OptionUI_Page }) {
    const pageid = props.page?.id ?? "general"

    function MunuContentItems(props: { position: OptionUI_Page_Position }) {
        const position = props.position ?? "top"
    
        return OptionUI_Pages.map((optionPage, index) => {
            if ((optionPage.position ?? "top") === position) {
                if (optionPage.type === "divider") {
                    return <Divider />

                } else if (optionPage.type === "page" || optionPage.type === undefined) {
                    return (
                        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                            <LinkPage page={optionPage.id} category="" id="" search="">
                                <ListItemButton data-name={optionPage.id} selected={pageid !== undefined && pageid === optionPage.id}>
                                    <Stack direction="row" sx={{py: 0.5}}>
                                        {optionPage.icon && (<ListItemIcon sx={{alignItems: 'center'}}><Typography variant='h6' sx={{color: "text.primary"}}><FontAwseomeIcon icon={optionPage.icon} /></Typography></ListItemIcon>)}
                                        <ListItemText primary={<Typography variant='body2' sx={{color: "text.primary"}}>{optionPage.title}</Typography>} disableTypography/>
                                    </Stack>
                                </ListItemButton>
                            </LinkPage>
                        </ListItem>
                    )
                    
                } else if (optionPage.type === "header") {
                    return (
                        <ListSubheader sx={{lineHeight: "36px"}}>
                            {optionPage.title}
                        </ListSubheader>
                    )
                }
            }
        })
    }

    return (
        <Stack sx={{ flexGrow: 1, justifyContent: 'space-between', height: "100%", width: "100%" }}>
            <List dense>
                <MunuContentItems position="top"/>
            </List>

            <List dense>
                <MunuContentItems position="bottom"/>
            </List>
        </Stack>
    );
}