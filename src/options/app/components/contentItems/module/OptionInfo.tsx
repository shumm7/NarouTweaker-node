import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { FontAwseomeIcon } from '../../common/Icon';
import { OptionUI_Item, OptionUI_Value_RequirementCompareMethods } from '../../../lib/type';

import { nt } from '../../../../../utils/narou-tweaker';
import { CheckRequirementCondition, CheckShowElement } from '../../ContentItem';

export default function OptionInfo(props: {
    option: OptionUI_Item,
    storage: nt.storage.local.options
}) {
    const storage = props.storage
    const option = props.option
    const id = option.id
    const isDebug = storage.extDebug
    const value = storage[id]
    const defaultStorage = new nt.storage.local.options()

    return (
        <List
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 },
                borderRadius: "12px",
                "& .MuiListSubheader-root": {
                    fontWeight: "bold",
                    borderBottom: "1px solid",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }
            }}
            subheader={<li />}
        >

            <li key={"section-root"}>
                <ul>
                    <ListSubheader>基本</ListSubheader>
                    <ListElement key="option-title" label="タイトル" value={option.title} copy />
                    <ListElement key="option-id" label="ID" value={option.id} copy />
                    <ListElement key="option-description-text" label="説明" value={option.description?.text} />
                    {isDebug && option.description?.small && <ListElement key="option-description-small" label="説明（small）" value={option.description?.small} />}
                    {isDebug && option.description?.attention && <ListElement key="option-description-attention" label="説明（attention）" value={option.description?.attention} />}
                    {isDebug && option.description?.hidden && <ListElement key="option-description-hidden" label="説明（hidden）" value={option.description?.hidden} />}
                    {isDebug && option.description?.keywords && <ListElement key="option-description-keywords" label="キーワード" value={option.description?.keywords?.join(", ")} />}
                </ul>
            </li>
            <li key={"section-value"}>
                <ul>
                    <ListSubheader>データ</ListSubheader>
                    <ListElement key="option-location-page" label="ページ" value={option.location.page} copy />
                    <ListElement key="option-location-category" label="カテゴリ" value={option.location.category} copy />
                    {option.location.parent && <ListElement key="option-location-parent" label="親設定項目" value={option.location.parent} copy />}
                    <ListElement key="option-ui-type" label="UI種類" value={option.ui?.type} />
                    {defaultStorage[id]!==undefined && <ListElement key="option-value-storage" label="値" value={getString(value)} copy />}
                    {defaultStorage[id]!==undefined && <ListElement key="option-value-storage-default" label="初期値" value={getString(defaultStorage[id])} copy />}
                </ul>
            </li>
            <li key={"section-requirement"}>
                <ul>
                    <ListSubheader>表示条件</ListSubheader>
                    <ListElement key="option-value-isshow" label="表示" value={CheckShowElement(storage, option) ? "はい" : "いいえ"} />
                    <ListItem key="option-value-requirement">
                        <ListItemText
                            primary="フラグ条件"
                            secondary={
                                <List>
                                    {
                                        option.value?.isAdvanced &&
                                        <ListRequirementElement
                                            key={`option-value-requirement-is-advanced`}
                                            targetId={"extAdvancedSettings"}
                                            targetValue={true}
                                            value={storage.extAdvancedSettings}
                                            compare={"="}
                                            condition={storage.extAdvancedSettings}
                                        />
                                    }
                                    {
                                        option.value?.isExperimental &&
                                        <ListRequirementElement
                                            key={`option-value-requirement-is-experimental`}
                                            targetId={"extExperimentalFeatures"}
                                            targetValue={true}
                                            value={storage.extExperimentalFeatures}
                                            compare={"="}
                                            condition={storage.extExperimentalFeatures}
                                        />
                                    }
                                    {
                                        option.value?.isDebug &&
                                        <ListRequirementElement
                                            key={`option-value-requirement-is-debug`}
                                            targetId={"extDebug"}
                                            targetValue={true}
                                            value={storage.extDebug}
                                            compare={"="}
                                            condition={storage.extDebug}
                                        />
                                    }
                                </List>
                            }
                        />
                    </ListItem>
                    {
                        Array.isArray(option.value?.requirement?.requirementParams) &&
                        <ListItem key="option-value-requirement-requirement-params">
                            <ListItemText
                                primary={
                                    <Stack direction="column">
                                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                            その他の条件
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: "90%" }}>
                                            {getRequirementText(option.value?.requirement?.condition)}
                                        </Typography>
                                    </Stack>
                                }
                                secondary={
                                    <List>
                                        {
                                            option.value?.requirement?.requirementParams.map((requirement, i) =>
                                                <ListRequirementElement
                                                    key={`option-value-requirement-requirement-param-${i}`}
                                                    targetId={requirement.id}
                                                    targetValue={requirement.value}
                                                    value={storage[requirement.id]}
                                                    compare={requirement.compare}
                                                    condition={CheckRequirementCondition(storage[requirement.id], requirement.value, requirement.compare)}
                                                />
                                            )
                                        }
                                    </List>
                                }
                            />
                        </ListItem>
                    }
                </ul>
            </li>
            <li key={"section-misc"}>
                <ul>
                    <ListSubheader>その他</ListSubheader>
                    <ListElement key="option-is-favorite" label="お気に入り" value={storage.extFavoriteOptions.includes(id) ? "はい" : "いいえ"} />
                    <ListElement key="option-location-noindex" label="検索に表示" value={option.location.noindex ? "はい" : "いいえ"} />
                    <ListElement key="option-value-is-advanced" label="高度な設定" value={option.value?.isAdvanced ? "はい" : "いいえ"} />
                    <ListElement key="option-value-is-experimental" label="実験中の機能" value={option.value?.isExperimental ? "はい" : "いいえ"} />
                    <ListElement key="option-value-is-debug" label="デバッグ機能" value={option.value?.isDebug ? "はい" : "いいえ"} />
                </ul>
            </li>
        </List>
    )
}

function ListElement(props: { key?: string, label: string, value?: string, copy?: boolean }) {
    return (
        <ListItem
            key={props.key}
            secondaryAction={
                props.copy && typeof props.value === "string" &&
                <IconButton
                    edge="end"
                    aria-label="copy"
                    onClick={() => {
                        if (typeof props.value === "string") {
                            navigator.clipboard.writeText(props.value)
                        }
                    }}
                    size='small'
                    sx={{
                        color: 'text.secondary'
                    }}
                >
                    <FontAwseomeIcon icon={{ icon: "copy", prefix: "solid" }} style={{ fontSize: "inherit", color: "inherit" }} />
                </IconButton>
            }
        >
            <ListItemText
                primary={props.label}
                secondary={props.value}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 2,
                    "& .MuiListItemText-primary": {
                        width: "100px",
                    },
                    "& .MuiListItemText-secondary": {
                        wordBreak: "break-all",
                        whiteSpace: "pre-wrap",
                    }
                }}
            />

        </ListItem>
    )
}

function ListRequirementElement(props: { key: string, targetId: string, targetValue: any, value: any, compare?: OptionUI_Value_RequirementCompareMethods, condition?: boolean }) {
    return (
        <ListItem key={props.key}>
            <Stack direction="row" spacing={1} sx={{ flex: 1, justifyContent: "flex-end", gap: 2 }}>
                <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end" }}>
                    <Stack direction="column">
                        <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: "pre-wrap" }}>
                            {props.targetId}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: "pre-wrap", fontSize: "90%" }}>
                            {getString(props.value)}
                        </Typography>
                    </Stack>
                    <Stack direction="column" sx={{ justifyContent: "center" }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: "pre-wrap", fontSize: "90%" }}>
                            が
                        </Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: "pre-wrap" }}>
                            {getString(props.targetValue)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: "pre-wrap", fontSize: "90%" }}>
                            {getRequirementConditionText(props.compare)}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" sx={{ gap: 2 }}>
                    <div>
                        <Divider orientation="vertical" />
                    </div>
                    <Stack direction="column">
                        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: "pre-wrap" }}>
                            {props.condition ? "はい" : "いいえ"}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </ListItem>
    )
}

function getRequirementConditionText(compare: OptionUI_Value_RequirementCompareMethods = "=") {
    switch (compare) {
        case "=":
            return `と等しい`
        case "!=":
            return `と異なる`
        case ">":
            return `よりも大きい`
        case "<":
            return `よりも小さい`
        case ">=":
            return `以上`
        case "<=":
            return `以下`
        case "in":
            return `のキーが含まれる`
        case "of":
            return `に含まれる`
        case "include":
            return `を含む`
        default:
            return ""
    }
}

function getRequirementText(condition: "and" | "or" | "nor" | "nand" = "and") {
    switch (condition) {
        case "and":
            return "すべてを満たす（AND）"
        case "or":
            return "いずれかを満たす（OR）"
        case "nand":
            return "すべて満たさない（NAND）"
        case "nor":
            return "いずれかを満たさない（NOR）"
    }
}

function getString(value: any) {
    let s: string
    try {
        s = JSON.stringify(value)
    } catch (e) {
        console.log(e)
        s = String(value)
    }
    return s
}