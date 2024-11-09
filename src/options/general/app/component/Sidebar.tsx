import { OptionUI_ItemID, OptionUI_Page, OptionUI_PageID } from "../../../utils/optionUI_type";
import { OptionUI_Items, OptionUI_Pages } from "../../../utils/optionUI_items";
import { nt } from "../../../../utils/narou-tweaker";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Link from "./Link";
import BrandIcon from "./BrandIcon";

export default function Sidebar(props: {page: OptionUI_Page|undefined}) {
    try {
        const [searchParams, setSearchParams] = useSearchParams();
        const [sidebarIsOpen, sidebarOpenState] = useState(true)

        const sidebarOpen = () => {
            sidebarOpenState(true)
        }
        const sidebarClose = () => {
            sidebarOpenState(false)
        }

        return (
            <div id="sidebar" className={sidebarIsOpen ? "" : "hide"}>
                <div id="sidebar-inner">
                    <div id="sidebar-header">
                        <Link page="general">
                            <BrandIcon className="brand-icon"/>
                        </Link>
                        <div className="sidebar-icon" id="sidebar-icon--help">
                        </div>
                    </div>
                    <div id="sidebar-middle">
                        <div id="sidebar-search">
                            <input type="text" id="sidebar-search-box" placeholder="検索" />
                        </div>
                        <div id="sidebar-items">
                            <SidebarItems pageid={props.page?.id}/>
                        </div>
                    </div>
                    <div id="sidebar-bottom">
                        <div id="sidebar-toolbox">
                            <div id="sidebar-version">build. {nt.extension.version}</div>
                            <div className="sidebar-icon sidebar-icon--hide" id="sidebar-close" onClick={sidebarClose}>
                                <i className="fa-solid fa-angles-left"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sidebar-open" onClick={sidebarOpen}>
                    <div className="sidebar-icon" id="sidebar-icon--show">
                        <i className="fa-solid fa-angles-right"></i>
                    </div>
                </div>
            </div>
        )
    } catch (e) {
        console.warn(e)
        return
    }
}


function SidebarItems(props: {pageid?: string}) {
    const pageid = props.pageid ?? "general"
    return OptionUI_Pages.map((optionPage, index) => {
        if (optionPage.sidebar || optionPage.sidebar === undefined) {
            if (optionPage.separator) {
                return <div className={"sidebar-separator" + (optionPage.popup?.hide ? " sidebar-item--hide-on-popup" : "")} data-name={optionPage.id}></div>
            } else {
                return (
                    <div className={"sidebar-item" + (optionPage.popup?.hide ? " sidebar-item--hide-on-popup" : "") + (pageid===optionPage.id ? " selected" : "")} data-name={optionPage.id}>
                        <Link page={optionPage.id} category="" id="" search="">
                            {optionPage.icon && <i className={optionPage.icon}></i>}
                            <span className="sidebar-item--title">{optionPage.title}</span>
                        </Link>
                    </div>
                )
            }
        }
    })
}