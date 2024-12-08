import React from "react";
import { OptionUI_Item } from "../../../utils/optionUI_type";
import OptionContentItem_Head from "./OptionContent_Head";
import OptionContentItem_Body from "./OptionContent_Body";


export default function OptionContent(props: { option: OptionUI_Item }) {
    const option = props.option

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

