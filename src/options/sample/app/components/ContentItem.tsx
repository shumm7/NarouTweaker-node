import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { OptionID, OptionUI_Item, OptionUI_ItemProps, OptionUI_Value_RequirementCompareMethods } from '../lib/type';
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

    if(storage===undefined || !CheckShowElement(storage, option)){
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

export function CheckRequirementCondition(storageValue: any, requirementValue: any, compare: OptionUI_Value_RequirementCompareMethods = "="){
    switch(compare){
        case "=":
            return storageValue===requirementValue
        case "!=":
            return storageValue!==requirementValue
        case ">":
            if(typeof storageValue === "number" && typeof requirementValue === "number"){
                return storageValue>requirementValue
            }
        case "<":
            if(typeof storageValue === "number" && typeof requirementValue === "number"){
                return storageValue<requirementValue
            }
        case ">=":
            if(typeof storageValue === "number" && typeof requirementValue === "number"){
                return storageValue>=requirementValue
            }
        case "<=":
            if(typeof storageValue === "number" && typeof requirementValue === "number"){
                return storageValue<=requirementValue
            }
        case "in":
            if(typeof requirementValue === "string" && typeof storageValue === "object"){
                return requirementValue in storageValue
            }
        case "of":
            if(Array.isArray(requirementValue)){
                return requirementValue.includes(storageValue)
            }else if(typeof storageValue==="string" && typeof requirementValue==="string"){
                return requirementValue.includes(storageValue)
            }
        case "include":
            if(Array.isArray(storageValue)){
                return storageValue.includes(requirementValue)
            }else if(typeof storageValue==="string" && typeof requirementValue==="string"){
                return storageValue.includes(requirementValue)
            }
        default:
            return false
    }
}

export function CheckShowElement(localOption: nt.storage.local.options, option: OptionUI_Item){

    if(option.ui?.showForce){
        return true
    }

    /* Flags */
    if(option.value?.isAdvanced && !localOption.extAdvancedSettings){
        return false
    }
    if(option.value?.isDebug && !localOption.extDebug){
        return false
    }
    if(option.value?.isExperimental && !localOption.extExperimentalFeatures){
        return false
    }

    /* Requirement */
    const p = option.value?.requirement?.requirementParams
    const c = option.value?.requirement?.condition ?? "and"

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

            conditions.push(CheckRequirementCondition(storageValue, requirementValue, compare))
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