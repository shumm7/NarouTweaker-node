import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material"
import { OptionUI_Item, OptionUI_Item_UI_Select, OptionUI_Item_UI_Text } from "../../../utils/optionUI_type"
import ToggleSwitch from "./common/Switch"

function dropdownMenuItem(data: any): OptionUI_Item_UI_Select {
    let ret = new OptionUI_Item_UI_Select
    const value = data?.value
    const label = data?.label
    const description = data?.description
    if (typeof label === "string") {
        ret.label = label
    }
    if (typeof description === "string") {
        ret.description = description
    }
    var type: undefined | "number" | "string" = undefined

    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const v = value[i]
            if (typeof v?.title === "string") {
                if (typeof v?.value === "string") {
                    if (type === undefined || type === "string") {
                        ret.value.push({ value: v.value, title: v.title })
                    }
                    if (!type) { type = "string" }
                } else if (typeof v?.value === "number") {
                    if (type === undefined || type === "number") {
                        ret.value.push({ value: v.value, title: v.title })
                    }
                    if (!type) { type = "number" }
                }
            }
        }
    }

    return ret
}

function textfieldItem(data: any): OptionUI_Item_UI_Text {
    let ret: OptionUI_Item_UI_Text = {}
    const type = data?.type
    const label = data?.label
    const description = data?.description

    if (type === "string" || type === "number") {
        ret.type = type
    }
    if (typeof label === "string") {
        ret.label = label
    }
    if (typeof description === "string") {
        ret.description = description
    }

    return ret
}


export default function OptionContentItem_Body(props: React.ComponentPropsWithoutRef<"div"> & { option: OptionUI_Item }) {
    const option = props.option
    const title = option.title
    const id = option.id
    const uiType = option.ui?.type
    const uiName = option.ui?.name
    const uiData = option.ui?.data
    const uiClass = option.ui?.class
    const uiPrefix = option.ui?.prefix
    const uiSuffix = option.ui?.suffix

    const p: Partial<typeof props> = props
    delete p.option

    if (uiType == "parent") {
        return (
            <div className="contents-wide-column" {...p}>

            </div>
        )
    } else {
        return (
            <div className="contents-option-content" {...p}>
                <OptionContentItem_BodyItem />
            </div>
        )
    }


    function OptionContentItem_BodyItem(props: React.ComponentPropsWithoutRef<"div">) {
        if (uiType === "toggle") {
            return <OptionContentItem_BodyItem_Toggle />
        } else if (uiType === "select") {
            return <OptionContentItem_BodyItem_Dropdown />
        } else if (uiType === "input") {

        } else if (uiType === "textarea") {

        } else if (uiType === "custom") {

        }
        return null
    }

    function OptionContentItem_BodyItem_Toggle(props: {}) {
        if (uiName === "default" || uiName === "toggle" || uiName === undefined) {
            return (
                <Stack className={uiClass !== undefined ? uiClass.join(" ") : undefined} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {uiPrefix && <span>{uiPrefix}</span>}
                    <ToggleSwitch id={id} />
                    {uiSuffix && <span>{uiSuffix}</span>}
                </Stack>
            )
        } else if (uiName === "checkbox") {
            return (
                <Stack className={uiClass !== undefined ? uiClass.join(" ") : undefined} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {uiPrefix && <span>{uiPrefix}</span>}
                    <Checkbox id={id} />
                    {uiSuffix && <span>{uiSuffix}</span>}
                </Stack>
            )
        }
        return null
    }

    function OptionContentItem_BodyItem_Dropdown(props: {}) {
        if (uiName === "default" || uiName === "dropdown" || uiName === undefined) {
            const d = dropdownMenuItem(uiData)
            return (
                <Stack className={uiClass !== undefined ? uiClass.join(" ") : undefined} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {uiPrefix && <span>{uiPrefix}</span>}
                        <TextField select id={id} label={d.label} variant="standard" helperText={d.description} sx={{ m: 1, minWidth: '25ch' }}>
                            {
                                d.value.map((v, i) => {
                                    return (
                                        <MenuItem value={v.value}>{v.title}</MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    {uiSuffix && <span>{uiSuffix}</span>}
                </Stack>
            )
        } else if (uiName === "radio") {
            const d = dropdownMenuItem(uiData)
            return (
                <Stack className={uiClass !== undefined ? uiClass.join(" ") : undefined} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {uiPrefix && <span>{uiPrefix}</span>}
                    <FormControl id={id}>
                        {d.label && <FormLabel id={id + "--label"}>{d.label}</FormLabel>}
                        <RadioGroup aria-labelledby={d.label ? (id + "--label") : undefined}>
                            {
                                d.value.map((v, i) => {
                                    return (
                                        <FormControlLabel value={v.value} control={<Radio />} label={v.title} />
                                    )
                                })
                            }
                        </RadioGroup>
                    </FormControl>
                    {uiSuffix && <span>{uiSuffix}</span>}
                </Stack>
            )
        }
        return null
    }

    function OptionContentItem_BodyItem_Text(props: {}) {
        if (uiName === "default" || uiName === "textfield" || uiName === undefined) {
            return (
                <TextField id={id} label="Outlined" variant="outlined" type={"te"} />
            )
        } else if (uiName === "textarea") {

        } else if (uiName === "combo") {

        }
    }
}