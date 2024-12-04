import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { OptionID, OptionUI_Item, OptionUI_ItemProps } from '../lib/type';
import { nt } from '../../../../utils/narou-tweaker';
import Option_Select from './contentItems/Option_Select';
import Option_Switch from './contentItems/Option_Switch';
import Option_Checkbox from './contentItems/Option_Checkbox';
import Option_Radio from './contentItems/Option_Radio';
import Option_Slider from './contentItems/Option_Slider';
import Option_TextArea from './contentItems/Option_TextArea';
import Option_Code from './contentItems/Option_Code';
import Option_Color from './contentItems/Option_Color';
import Option_Parent from './contentItems/Option_Parent';
import Option_Header from './contentItems/Option_Header';
import Option_TextField from './contentItems/Option_TextField';
import Option_Number from './contentItems/Option_Number';
import Option_Custom from './contentItems/Option_Custom';

export default function ContentItem(props: OptionUI_ItemProps) {
    const storage = props.storage
    const option = props.option
    const uiType = option.ui?.type
    const requirement = option.value?.requirement

    const [isAdvanced, setAdvanced] = useState<boolean | undefined>();
    const [isExperimental, setExperimental] = useState<boolean | undefined>();
    const [isDebug, setDebug] = useState<boolean | undefined>();
    const [isShow, setShow] = useState<boolean | undefined>();

    if(storage!==undefined && (isShow===undefined || isAdvanced===undefined || isExperimental===undefined)){
        setAdvanced(storage.extAdvancedSettings)
        setExperimental(storage.extExperimentalFeatures)
        setDebug(storage.extDebug)
        setShow(checkConditions(storage, requirement))

        nt.storage.local.changed(null, (changes) => {
            if (changes.extAdvancedSettings!==undefined) {
                var s = changes.extAdvancedSettings.newValue
                if (typeof s === "boolean") {
                    setAdvanced(s)
                }
            }
            if (changes.extExperimentalFeatures!==undefined) {
                var s = changes.extExperimentalFeatures.newValue
                if (typeof s === "boolean") {
                    setExperimental(s)
                }
            }
            if (changes.extDebug!==undefined) {
                var s = changes.extDebug.newValue
                if (typeof s === "boolean") {
                    setDebug(s)
                }
            }
        })

        const p = requirement?.requirementParams
        if(Array.isArray(p)){
            nt.storage.local.changed(null, (changes) => {
                for(let i=0; i<p.length; i++){
                    if(changes[p[i].id]!==undefined){
                        nt.storage.local.get().then((data)=>{
                            setShow(checkConditions(data, requirement))
                        })
                    }
                }
            })
        }
    }

    if(
        !isShow ||
        (!isAdvanced && option.value?.isAdvanced) ||
        (!isExperimental && option.value?.isExperimental) ||
        (!isDebug && option.value?.isDebug)
    ){
        return null
    }

    if (uiType === "switch") {
        return <Option_Switch {...props}/>
    } else if (uiType === "checkbox") {
        return <Option_Checkbox {...props}/>
    } else if (uiType === "select") {
        return <Option_Select {...props}/>
    } else if (uiType === "radio") {
        return <Option_Radio {...props}/>
    } else if (uiType === "slider") {
        return <Option_Slider {...props}/>
    } else if (uiType === "textfield") {
        return <Option_TextField {...props}/>
    } else if (uiType === "number") {
        return <Option_Number {...props}/>
    } else if (uiType === "textarea") {
        return <Option_TextArea {...props}/>
    } else if (uiType === "code") {
        return <Option_Code {...props}/>
    } else if (uiType === "color") {
        return <Option_Color {...props}/>
    } else if (uiType === "parent") {
        return <Option_Parent {...props}/>
    } else if (uiType === "custom") {
        return <Option_Custom {...props}/>
    } else {
        return <Option_Header {...props}/>
    }
}

interface requirement {
    condition?: "and"|"or"|"nor"|"nand"
    requirementParams?: Array<{
        id: OptionID,
        value: any,
        compare?: "="|"!="|">"|"<"|">="|"<="|"in"|"of"|"include"
    }>
}

function checkConditions(localOption: nt.storage.local.options, requirement?: requirement){
    const p = requirement?.requirementParams
    const c = requirement?.condition ?? "and"

    if(Array.isArray(p) && [undefined, "and", "or", "nor", "nand"].includes(c)){
        var conditions: Array<boolean> = []
        var lastCondition: boolean = false

        for(let i=0; i<p.length; i++){
            const compare = p[i]?.compare ?? "="
            if(typeof p[i]?.id!=="string" || !["=","!=",">","<",">=","<=","in","of","include"].includes(compare)){
                continue
            }

            const storageValue = localOption[p[i].id]
            const requirementValue = p[i].value

            if(compare === "="){
                conditions.push(storageValue===requirementValue)
            }else if(compare === "!="){
                conditions.push(storageValue!==requirementValue)
            }else if(compare === ">"){
                if(typeof storageValue === "number" && typeof requirementValue === "number"){
                    conditions.push(storageValue>requirementValue)
                }else{
                    conditions.push(false)
                }
            }else if(compare === "<"){
                if(typeof storageValue === "number" && typeof requirementValue === "number"){
                    conditions.push(storageValue<requirementValue)
                }else{
                    conditions.push(false)
                }
            }else if(compare === ">="){
                if(typeof storageValue === "number" && typeof requirementValue === "number"){
                    conditions.push(storageValue>=requirementValue)
                }else{
                    conditions.push(false)
                }
            }else if(compare === "<="){
                if(typeof storageValue === "number" && typeof requirementValue === "number"){
                    conditions.push(storageValue<=requirementValue)
                }else{
                    conditions.push(false)
                }
            }else if(compare === "in"){
                if(typeof requirementValue === "string" && typeof storageValue === "object"){
                    conditions.push(requirementValue in storageValue)
                }else{
                    conditions.push(false)
                }
            }else if(compare === "of"){
                if(Array.isArray(storageValue)){
                    conditions.push(storageValue.includes(requirementValue))
                }else if(typeof storageValue==="string" && typeof requirementValue==="string"){
                    conditions.push(storageValue.includes(requirementValue))
                }else{
                    conditions.push(false)
                }
            }else if(compare ==="include"){
                if(Array.isArray(requirementValue)){
                    conditions.push(requirementValue.includes(storageValue))
                }else if(typeof storageValue==="string" && typeof requirementValue==="string"){
                    conditions.push(requirementValue.includes(storageValue))
                }else{
                    conditions.push(false)
                }
            }
        }

        if(conditions.length >= 1){
            if(c==="and" || c==="nand"){
                lastCondition = true
            }
            for(let i=0; i<conditions.length; i++){
                if(c==="and" || c==="nand"){
                    lastCondition = lastCondition && conditions[i]
                }else if(c==="or" || c==="nor"){
                    lastCondition = lastCondition || conditions[i]
                }
            }
            if(c==="nor" || c==="nand"){
                return !lastCondition
            }else{
                return lastCondition
            }
        }
    }

    if(c==="nor" || c==="nand"){
        return false
    }else{
        return true
    }
}