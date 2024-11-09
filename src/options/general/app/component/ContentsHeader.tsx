import ContentsHeaderMenu from "./ContentsHeaderMenu";
import { OptionUI_Page, OptionUI_PageID } from "../../../utils/optionUI_type";


export default function ContentsHeader(props: { page: OptionUI_Page | undefined }) {
    const page = props.page

    return (
        <div id="header">
            <div id="header-title">
                <div id="header-title--heading">
                    <HeaderTitle page={page} />
                </div>
                <div id="header-title--description">
                    <HeaderDescription page={page} />
                </div>
            </div>
            <ContentsHeaderMenu page={page} />
        </div>
    )
}

function HeaderTitle(props: { page: OptionUI_Page | undefined }) {
    const page = props.page
    if (page) {
        return (
            <div id="header-title--heading">
                {page.icon && <i className={page.icon}></i>}
                <span className="title">{page?.title ?? ""}</span>
            </div>
        )
    }

    return null
}

function HeaderDescription(props: { page: OptionUI_Page | undefined }) {
    const page = props.page
    if (page) {
        return (
            <div id="header-title--description">
                <p className="header-title--description-text">
                    {page.description}{page.targetUrl && <br />}
                    {page.targetUrl && (<span style={{ fontSize: "80%" }}>{"対象ページ：" + page.targetUrl?.join(" / ")}</span>)}
                </p>
                <div className="header-title--icons">
                    <div className="header-title--icons--icon header-title--icons--icon-general">
                        <a href="/options/general/index.html" target="_self"><i className="fa-solid fa-gear"></i></a>
                    </div>
                    <div className="header-title--icons--icon header-title--icons--icon-search">
                        <a href="/options/search/index.html" target="_self"><i className="fa-solid fa-magnifying-glass"></i></a>
                    </div>
                    <div className="header-title--icons--icon header-title--icons--icon-favorite">
                        <a href="/options/favorite/index.html" target="_self"><i className="fa-solid fa-heart"></i></a>
                    </div>
                </div>
            </div>
        )
    }
    return null
}