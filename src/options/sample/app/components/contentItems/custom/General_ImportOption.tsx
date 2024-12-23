import * as React from 'react';
import { useState } from 'react';
import { useTheme, alpha, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { ModalSelection, ModalLoading } from '../../common/Modal';
import { PushSnackbar } from '../../common/Snackbar';
import CodeEditor from '../../common/CodeEditor';
import { FontAwseomeIcon } from '../../common/Icon';

import { nt } from '../../../../../../utils/narou-tweaker';
import { OptionUI_ItemProps } from '../../../lib/type';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface fileErrorProps {
    message: string,
    description?: string,
}

export default function ImportOption(props: OptionUI_ItemProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalCheckOpen, setModalCheckOpen] = useState<boolean>(false);
    const [loadingOpen, setLoadingOpen] = useState<boolean>(false);
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [code, setCode] = useState("");
    const [option, setOption] = useState<Record<string, any> | undefined | void>();
    const [fileError, setFileError] = useState<fileErrorProps | undefined | void>();

    const getValidOptions = (json: any) => {
        var ret: Record<string, any> = {}

        for (const [key, value] of Object.entries(json)) {
            var s = nt.storage.local.options.check(key, value)
            if (s !== undefined) {
                ret[key] = s
            }
        }

        if (Object.keys(ret).length > 0) {
            return ret
        } else {
            return
        }
    }

    const handleClose = () => {
        setModalOpen(false);
    };

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setLoadingOpen(true)
        setFileError()
        var f = e.target.files;
        if (f !== null) {
            fileHandle(f[0])
        }
    }

    async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        setLoadingOpen(true)
        setFileError()
        var f = e.dataTransfer.files[0];
        fileHandle(f)
    }

    function fileHandle(f: File) {

        if (f.size <= 256000) {
            var reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === "string") {
                    setCode(e.target?.result)
                } else {
                    setFileError({
                        message: "ファイルの読み込みに失敗しました",
                        description: `${f.name} (${f.size} Bytes)`
                    })
                }
            }
            reader.onerror = (e) => {
                setFileError({
                    message: "ファイルの読み込みに失敗しました",
                    description: `${f.name} (${f.size} Bytes)`
                })
                setLoadingOpen(false)
            }
            reader.onloadend = (e) => {
                setLoadingOpen(false)
            }
            reader.onabort = (e) => {
                setLoadingOpen(false)
            }
            reader.readAsText(f);
        } else {
            setFileError({
                message: "ファイルサイズが大きすぎます（256KBまで）",
                description: `${f.name} (${f.size} Bytes)`,
            })
            setLoadingOpen(false)
        }
    }

    const handleAccept = () => {
        setLoadingOpen(true)
        nt.storage.local.get("extNotifications").then((data) => {
            if (option) {
                nt.storage.local.set(option).then(() => {
                    setCode("")
                    setOption()

                    /* notify */
                    if (data.extNotifications) {
                        chrome.notifications.create("", {
                            iconUrl: "/assets/icons/icon_48.png",
                            type: "basic",
                            title: "Narou Tweakerがアップデートされました",
                            message: `ユーザによるデータインポート`
                        })
                    }
                    setCode("")
                    setOption()
                    setTimeout(() => {
                        setLoadingOpen(false)
                        PushSnackbar("設定データをインポートしました", "success")
                    }, 1000)
                }).catch((e) => {
                    setLoadingOpen(false)
                    PushSnackbar("設定データのインポートに失敗しました", "warn")
                })
            } else {
                throw Error
            }
        }).catch((e) => {
            setLoadingOpen(false)
            PushSnackbar("設定データのインポートに失敗しました", "warn")
        })
    }

    return (
        <>
            <Stack sx={{ ml: 1 }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setFileError()
                        setOption()
                        setModalOpen(true)
                    }}
                    sx={{
                        textWrap: "nowrap"
                    }}
                >
                    インポート
                </Button>

                <Dialog
                    fullScreen={false}
                    open={modalOpen}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 1,
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            try {
                                const option = getValidOptions(JSON.parse(code))
                                if (option === undefined) {
                                    setFileError({
                                        message: "有効な設定データではありません",
                                    })
                                    return
                                }
                                setOption(option)

                                handleClose();
                                setLoadingOpen(true)
                                setTimeout(() => {
                                    setLoadingOpen(false)
                                    setModalCheckOpen(true)
                                }, 500)
                            } catch (e) {
                                setFileError({
                                    message: "不正なJSONです",
                                    description: String(e)
                                })
                            }
                        },
                    }}
                >
                    <DialogTitle sx={{ textAlign: { xs: 'center', md: "left" } }}>
                        設定データをインポート
                    </DialogTitle>
                    <DialogContent dividers sx={{ maxWidth: 512 }}>
                        <Stack sx={{ gap: 1 }}>
                            <Typography sx={{ color: "text.primary" }}>外部からJSON形式の設定データを読み込みます。</Typography>
                            <Typography sx={{ color: "text.warning", fontSize: "90%" }}>スキンを含む、既存のデータが全て上書きされます。この操作は元に戻せません。</Typography>
                        </Stack>

                        <Stack sx={{ width: "100%", alignItems: "flex-end" }}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="outlined"
                                tabIndex={-1}
                                startIcon={<FontAwseomeIcon icon={{ icon: "folder-open", prefix: "solid" }} />}
                            >
                                ファイルを読み込む
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleChange(e).catch((e) => {
                                            setFileError({
                                                message: "ファイルの読み込みに失敗しました",
                                                description: String(e)
                                            })
                                            setLoadingOpen(false)
                                        })
                                    }}
                                    multiple
                                />
                            </Button>
                        </Stack>
                        <Stack
                            sx={{
                                height: 200,
                                width: "100%",
                            }}
                            marginTop={1}
                        >
                            <div
                                style={{
                                    height: "inherit",
                                    width: "100%",
                                }}
                                onDragEnter={(e) => {
                                    setIsDrag(true)
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                                onDragLeave={(e) => {
                                    setIsDrag(false)
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                                onDrop={(e) => {
                                    setIsDrag(false)
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDrop(e).catch((e) => {
                                        setFileError({
                                            message: "ファイルの読み込みに失敗しました",
                                            description: String(e)
                                        })
                                        setLoadingOpen(false)
                                    })
                                }}
                            >
                                <Stack
                                    sx={{
                                        height: "100%",
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: 'text.secondary',
                                        borderRadius: "12px",
                                        backgroundColor: (isDrag ? alpha(theme.palette.text.secondary, 0.2) : undefined),
                                    }}
                                >
                                    <Stack
                                        direction="column"
                                        sx={{
                                            gap: 4,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "100%",
                                            width: "100%",
                                            display: code.length > 0 ? "none" : "flex"
                                        }}
                                    >
                                        <Typography variant='body2' color='inherit'>設定ファイル（JSON）をドロップ</Typography>
                                        <FontAwseomeIcon icon={{ icon: "file-import", prefix: "solid" }} style={{ fontSize: 30, color: 'inherit' }} />
                                    </Stack>
                                </Stack>
                                <Box
                                    sx={{
                                        mt: "-200px",
                                        zIndex: 2,
                                        position: "relative"
                                    }}
                                >
                                    <CodeEditor
                                        language='json'
                                        value={code}
                                        height={200}
                                        onChange={(value: string) => { setCode(value) }}
                                        autoFocus
                                    />
                                </Box>
                            </div>
                        </Stack>
                        {fileError !== undefined &&
                            <Alert
                                sx={{
                                    mt: 1,
                                    wordWrap: "break-word",
                                    overflow: "hidden"
                                }}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setFileError()
                                        }}
                                    >
                                        <FontAwseomeIcon icon={{ icon: "xmark", prefix: "solid" }} />
                                    </IconButton>
                                }
                                severity="warning"
                                icon={<FontAwseomeIcon icon={{ icon: "triangle-exclamation", prefix: "solid" }} />}
                            >
                                <AlertTitle>{fileError.message}</AlertTitle>
                                {fileError.description}
                            </Alert>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleClose}>キャンセル</Button>
                        <Button variant="contained" type="submit" sx={{ boxShadow: 0 }} disabled={code.length <= 0}>インポート</Button>
                    </DialogActions>
                </Dialog>

                <ModalSelection
                    open={modalCheckOpen}
                    setOpen={setModalCheckOpen}
                    title="設定データをインポートします"
                    description='スキンを含む、保存されているデータが全てリセットされます。'
                    warning='以下の項目が変更されます。この操作は元に戻せません。'
                    onSubmit={handleAccept}
                >
                    <Stack
                        sx={{
                            height: 200,
                            width: "100%",
                        }}
                        marginTop={1}
                    >
                        <CodeEditor
                            language='json'
                            value={JSON.stringify(option, null, 3)}
                            height={200}
                            readonly
                            onChange={(value: string) => { setCode(value) }}
                            autoFocus
                        />
                    </Stack>
                </ModalSelection>

                <ModalLoading
                    open={loadingOpen}
                    setOpen={setLoadingOpen}
                />
            </Stack>
        </>
    )
}
