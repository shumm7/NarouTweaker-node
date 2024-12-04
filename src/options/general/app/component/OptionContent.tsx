import React from "react";
import { OptionUI_Item } from "../../../utils/optionUI_type";
import Link from "./common/Link";
import OptionContentItem_Head from "./OptionContent_Head";
import OptionContentItem_Body from "./OptionContent_Body";


export default function OptionContent(props: { option: OptionUI_Item }) {
    const option = props.option

    const page = option.location?.page
    const category = option.location?.category
    const id = option.id
    const title = option.title
    const style = option.style
    const elmClass = option.class
    const description = option.description
    const uiType = option.ui?.type
    const uiName = option.ui?.name
    const uiData = option.ui?.data
    const uiClass = option.ui?.class
    const uiPrefix = option.ui?.prefix ?? ""
    const uiSuffix = option.ui?.suffix ?? ""
    const buttons = option.value?.buttons
    const requirement = option.value?.requirement
    const isExperimental = option.value?.isExperimental
    const isAdvanced = option.value?.isAdvanced
    const isDebug = option.value?.isDebug
    const parent = option.location?.parent

    if (!(option.location?.hide)) {
        return (
            <OptionContentItem>
                <OptionContentItem_Head option={option} />
                <OptionContentItem_Body option={option}/>
            </OptionContentItem>
        )
    }
    return null

    function OptionContentItem(props: React.ComponentPropsWithoutRef<"div">) {
        const page = option.location?.page
        const id = option.id
        const parent = option.location?.parent

        if (parent && page !== "search") {
            return (
                <div className="contents-option option-outer" data-name={id ?? ""} />
            )
        } else {
            return (
                <div className={"contents-wide option-outer" + (page === "search" ? " search-result-box search-result--option" : "")} data-name={id ?? ""}>
                    <div className="contents-option" {...props} />
                </div>
            )
        }
    }
}

