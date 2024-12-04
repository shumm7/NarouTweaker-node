import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import ContentItem from '../../ContentItem';
import ErrorMessage from '../module/ErrorMessage';

import { nt } from '../../../../../../utils/narou-tweaker';
import { OptionUI_Items } from '../../../lib/items';
import { OptionUI_Item, OptionUI_ItemProps } from '../../../lib/type';
import { getOptionFromID } from '../../../lib/utils';

export default function Favorite(props: OptionUI_ItemProps) {
    const storage = props.storage
    const [favoriteOptions, setFavoriteOptions] = useState<Array<OptionUI_Item> | undefined>();

    if (storage !== undefined && favoriteOptions === undefined) {
        setFavoriteOptions(
            storage.extFavoriteOptions.map((optionId, i) => {
                return getOptionFromID(optionId)
            }).filter((option) => {
                return option !== undefined
            })
        )

        nt.storage.local.changed("extFavoriteOptions", (changes) => {
            if (Array.isArray(changes?.extFavoriteOptions?.newValue)) {
                setFavoriteOptions(
                    changes.extFavoriteOptions.newValue.map((optionId, i) => {
                        return getOptionFromID(optionId)
                    }).filter((option) => {
                        return option !== undefined
                    })
                )
            }
        })
    }

    if (Array.isArray(favoriteOptions) && favoriteOptions.length > 0) {
        return (
            <Stack direction="column" sx={{ gap: 0.5, width: "100%" }} spacing={1}>
                {
                    favoriteOptions.map((option) => {
                        if (option.location.parent === undefined && !option.location.hide) {
                            return <ContentItem option={option} storage={storage} type="favorite" />
                        }
                    })
                }
            </Stack>
        )
    } else if (Array.isArray(favoriteOptions) && favoriteOptions.length === 0) {
        return (
            <Stack direction="column" sx={{ width: "100%", justifyContent: "center", alignItems: "center" }} spacing={1}>
                <ErrorMessage
                    icon={{ icon: "heart", prefix: "solid" }}
                    title="お気に入り項目がありません"
                />
            </Stack>
        )
    } else {
        return (
            <Stack direction="column" sx={{ width: "100%", justifyContent: "center", alignItems: "center" }} spacing={1}>
                <ErrorMessage
                    iconProps={<CircularProgress size={30} />}
                    title="データを取得中"
                />
            </Stack>
        )
    }
}