import * as React from 'react';
import Stack from '@mui/material/Stack';
import { OptionUI_Anchors, OptionUI_Page } from '../lib/type';

import NavbarBreadcrumbs from './Breadcrumbs';
import ContentMain from './ContentMain';

export default function MainGrid(props: {
    page?: OptionUI_Page,
    anchors: OptionUI_Anchors,
    setAnchors: React.Dispatch<React.SetStateAction<OptionUI_Anchors>>
}) {
    return (
        <Stack>
            <Stack spacing={2} sx={{ pb: 1 }}>
                <NavbarBreadcrumbs page={props.page} />
            </Stack>
            <Stack spacing={2} sx={{ py: 1 }} component={"article"}>
                <ContentMain page={props.page} setAnchors={props.setAnchors} anchors={props.anchors}/>
            </Stack>
        </Stack>
    );
}