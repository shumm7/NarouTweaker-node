import { useSearchParams } from "react-router-dom";
import { OptionUI_Category, OptionUI_Page } from "../../../utils/optionUI_type";
import { getOptionCategory, getOptionCategoryFromID } from "../../../utils/optionUI_utils";
import { OptionUI_Items } from "../../../utils/optionUI_items";
import ContentsWide from "./ContentsWide";
import OptionContent from "./OptionContent";

export default function ContentsMain(props: { page: OptionUI_Page | undefined }) {
    const page = props.page
    const defaultCategory = page?.defaultCategory
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category") ?? defaultCategory

    return (
        <div id="main">
            <div className="contents-container" data-name={category ?? ""}>
                <CategoryDescription page={page} category={category} />
            </div>
            <OptionContents page={page} category={getOptionCategory(page, category)} />
        </div>
    )
}

function CategoryDescription(props: { page: OptionUI_Page | undefined, category: string | undefined }) {
    const page = props.page
    const category = props.category
    if (page && category) {
        const tab = getOptionCategoryFromID(page.id, category)

        if (tab) {
            const text = tab.description?.text
            const small = tab.description?.small
            const attention = tab.description?.attention
            if (text || small || attention) {
                return (
                    <ContentsWide>
                        <p>
                            {text && (<span>{text}</span>)}
                            {text && <br />}
                            {small && (<span style={{ color: "#999", fontSize: "80%" }}>{small}</span>)}
                            {small && <br />}
                            {attention && (<span style={{ color: "red", fontSize: "90%", fontWeight: "bold" }}>{attention}</span>)}
                            {attention && <br />}
                        </p>
                    </ContentsWide>
                )

            }
        }
    }
    return null
}

function OptionContents(props: { page: OptionUI_Page | undefined, category: OptionUI_Category | undefined }) {
    return OptionUI_Items.map((option, i)=>{
        if (option.location && option.location.page === props.page?.id && option.location.category === props.category?.id) {
            return <OptionContent option={option}/>
        }else{
            return null
        }
    })
}