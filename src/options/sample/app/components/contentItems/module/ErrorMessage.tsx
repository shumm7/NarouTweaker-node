import { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FontAwseomeIcon } from '../../common/Icon';
import { OptionUI_FontAwesomeIcon } from '../../../lib/type';

export default function ErrorMessage(props: { icon?: OptionUI_FontAwesomeIcon, iconProps?: ReactNode, title?: string, description?: string, children?: ReactNode }) {
    return (
        <Stack sx={{ height: "min(300px, 100vh)", width: "100%", alignItems: "center", justifyContent: "center" }} spacing={1}>
            <Stack direction={"column"} sx={{ color: "text.secondary", gap: 2, alignItems: "center", justifyContent: "center" }}>
                {props.iconProps ? props.iconProps : (props.icon && <FontAwseomeIcon icon={props.icon} style={{ fontSize: "30px" }} />)}
                {props.title && <Typography variant="h6" sx={{ fontWeight: "bold" }}>{props.title}</Typography>}
                {props.description && <Typography variant="body2" sx={{ fontWeight: "bold", color: "text.waderning" }}>{props.description}</Typography>}
                {props.children}
            </Stack>
        </Stack>
    )
}