import { OptionUI_Item } from "../../../utils/optionUI_type";
import { getOptionCategory, getOptionFromID, getOptionPageFromID } from "../../../utils/optionUI_utils";
import Link from "./Link";

export default function OptionContentItem_Head(props: React.ComponentPropsWithoutRef<"div"> & { option: OptionUI_Item }) {
    const option = props.option
    const page = option.location?.page
    const title = option.title
    const description = option.description
    const category = option.location?.category
    const id = option.id
    const parent = option.location?.parent

    return (
        <div className="contents-option-head" {...props}>
            <OptionContentItem_HeadTitle />
            <OptionContentItem_HeadDescription />
        </div>
    )


    function OptionContentItem_HeadTitle(props: React.ComponentPropsWithoutRef<"div">) {
        if (page === "favorite") {
            return (
                <div className="contents-item--heading" {...props}>
                    <Link page={page} category={category} id={id} focus={true}>
                        {title}
                    </Link>
                </div>
            )
        } else if (page === "search") {

            return (
                <div className="contents-item--heading" {...props}>
                    <OptionContentItem_HeadCrumbs />
                    <div className="search-result--items-title">
                        <Link page={page} category={category} id={id} focus={true}>
                            {title}
                        </Link>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="contents-item--heading" {...props}>
                    {title}
                </div>
            )
        }
    }

    function OptionContentItem_HeadCrumbs(props: React.ComponentPropsWithoutRef<"div">) {
        if (title && page) {
            const pageData = getOptionPageFromID(page)
            const categoryData = getOptionCategory(pageData, category)

            if (pageData && categoryData) {
                if (parent) {
                    const parentData = getOptionFromID(parent)
                    if (parentData) {
                        return (
                            <div className="search-result--items-crumbs" {...props}>
                                <span className="search-result--items-crumbs-item">
                                    <Link page={pageData.id} category="" id="">
                                        {pageData.title}
                                    </Link>
                                </span>
                                <span className="search-result--items-crumbs-item">
                                    <Link page={pageData.id} category={categoryData.id} id="">
                                        {categoryData.title}
                                    </Link>
                                </span>
                                <span className="search-result--items-crumbs-item">
                                    <Link page={pageData.id} category={categoryData.id} id={parentData.id}>
                                        {parentData.title}
                                    </Link>
                                </span>
                                <OptionContentItem_HeadTag />
                            </div>
                        )
                    } else {
                        return (
                            <div className="search-result--items-crumbs" {...props}>
                                <span className="search-result--items-crumbs-item">
                                    <Link page={pageData.id} category="" id="">
                                        {pageData.title}
                                    </Link>
                                </span>
                                <span className="search-result--items-crumbs-item">
                                    <Link page={pageData.id} category={categoryData.id} id="">
                                        {categoryData.title}
                                    </Link>
                                </span>
                                <OptionContentItem_HeadTag />
                            </div>
                        )
                    }
                } else {
                    return (
                        <div className="search-result--items-crumbs" {...props}>
                            <span className="search-result--items-crumbs-item">
                                <Link page={pageData.id} category="" id="">
                                    {pageData.title}
                                </Link>
                            </span>
                            <span className="search-result--items-crumbs-item">
                                <Link page={pageData.id} category={categoryData.id} id="">
                                    {categoryData.title}
                                </Link>
                            </span>
                            <OptionContentItem_HeadTag />
                        </div>
                    )
                }
            }
        }
        return null
    }

    function OptionContentItem_HeadTag(props: React.ComponentPropsWithoutRef<"div">) {
        return (
            <span className="search-result--items-crumbs-item search-result--items-id" {...props}>
                <Link className="search-result--items-id-tag" page={page} category={category} id={id} focus={true}>
                    {id}
                </Link>
            </span>
        )
    }


    function OptionContentItem_HeadDescription() {
        const text = description?.text
        const small = description?.small
        const attention = description?.attention
        if (text || small || attention) {
            return (
                <div className="contents-item--description">
                    {text && (<div className="contents-item--description-item">{text}</div>)}
                    {small && (<div className="contents-item--description-item description-small">{small}</div>)}
                    {attention && (<div className="contents-item--description-item description-attention">{attention}</div>)}
                </div>
            )
        }
        return null
    }
}