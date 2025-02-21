import * as React from 'react';
import { ReactNode, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Typography from '@mui/material/Typography';
import MuiModal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export function ModalSelection(props: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    title?: string
    description?: string
    warning?: string
    messageYes?: string
    messageNo?: string
    onClose?: () => void | undefined
    onSubmit?: () => void | undefined
    children?: ReactNode
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        if (props.onClose !== undefined) {
            props.onClose()
        }
        props.setOpen(false);
    };

    return (
        <Dialog
            fullScreen={false}
            fullWidth
            open={props.open}
            onClose={handleClose}
            PaperProps={{
                elevation: 1,
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (props.onSubmit !== undefined) {
                        props.onSubmit()
                    }
                    handleClose();
                },
            }}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {
                        (props.description || props.warning) &&
                        <Stack sx={{ gap: 1 }}>
                            {props.description && <Typography sx={{ color: "text.primary" }}>{props.description}</Typography>}
                            {props.warning && <Typography sx={{ color: "text.warning", fontSize: "90%" }}>{props.warning}</Typography>}
                        </Stack>
                    }
                </DialogContentText>
                {props.children}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>{props.messageNo ?? "キャンセル"}</Button>
                <Button variant="contained" type="submit" sx={{ boxShadow: 0 }}>{props.messageYes ?? "OK"}</Button>
            </DialogActions>
        </Dialog>
    )
}

export function ModalLoading(props: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    time?: number
    size?: number
    onClose?: () => void | undefined
    onOpen?: () => void | undefined
}) {
    const [state, setState] = useState<boolean>(false);

    if (props.open && !state) {
        setState(true)

        if (props.time !== undefined) {
            setTimeout(() => {
                props.setOpen(false)
                if (props.onClose !== undefined) {
                    props.onClose()
                }
                setState(false)
            }, props.time);
        }

        if (props.onOpen !== undefined) {
            props.onOpen()
        }
    }

    if (!props.open && state) {
        if (props.onClose !== undefined) {
            props.onClose()
        }
        setState(false)
    }

    return (
        <MuiModal open={props.open} onClose={() => { }}>
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
                <CircularProgress size={props.size ?? 30} autoFocus={false} />
            </Box>
        </MuiModal>
    )
}