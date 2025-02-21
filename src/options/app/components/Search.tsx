import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { GetLocation } from './common/Link';
import { FontAwseomeIcon } from './common/Icon';

export default function Search(props: {
    width?: { xs: number | string, md: number | string },
    clear?: boolean
}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [value, setValue] = useState<string>(searchParams.get("q") ?? "")
    const [focus, setFocus] = useState<boolean>(false)

    useEffect(() => {
        if (!focus) {
            setValue(searchParams.get("q") ?? "")
        }
    }, [searchParams]);

    return (
        <FormControl
            sx={{ width: props.width ?? { xs: '100%', md: '25ch' } }}
            variant="outlined"
        >
            <OutlinedInput
                size="small"
                id="search"
                placeholder="検索"
                value={value}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                    var q = searchParams
                    const s = event.target.value
                    setValue(s)
                    if (s.length > 0) {
                        q.set("q", s)
                        setSearchParams(q)
                    } else {
                        q.delete("q")
                        setSearchParams(q)
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        navigate(
                            GetLocation(
                                location,
                                "search",
                                "general",
                                "",
                                searchParams.get("q") ?? undefined
                            )
                        )
                        e.preventDefault();
                    }
                }}
                onFocus={() => {
                    setFocus(true)
                }}
                onBlur={() => {
                    setFocus(false)
                }}
                sx={{ flexGrow: 1 }}
                startAdornment={
                    <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                        <FontAwseomeIcon icon={{ icon: "magnifying-glass", prefix: "solid" }} style={{ color: "inherit" }} />
                    </InputAdornment>
                }
                endAdornment={
                    props.clear &&
                    <InputAdornment position="end" sx={{ color: 'text.secondary' }}>
                        <IconButton
                            size="small"
                            aria-label="クリア"
                            onClick={() => {
                                var q = searchParams
                                setValue("")
                                q.delete("q")
                                setSearchParams(q)
                            }}
                            sx={{ color: 'text.secondary' }}
                        >
                            <FontAwseomeIcon icon={{ icon: "xmark", prefix: "solid" }} style={{ color: "inherit", fontSize: "inherit" }} />
                        </IconButton>
                    </InputAdornment>
                }
                inputProps={{
                    'aria-label': 'search',
                }}
            />
        </FormControl>
    );
}