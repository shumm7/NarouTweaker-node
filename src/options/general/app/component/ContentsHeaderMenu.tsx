import { useEffect, useRef, useState, WheelEvent, RefObject, createRef } from "react";
import { OptionUI_Page, OptionUI_PageID } from "../../../utils/optionUI_type";
import { useLocation, useSearchParams } from "react-router-dom";
import { nt } from "../../../../utils/narou-tweaker";
import { getOptionPageFromID } from "../../../utils/optionUI_utils";
import Link from "./common/Link";

export default function ContentsHeaderMenu(props: { page: OptionUI_Page | undefined }) {
    const page = props.page
    const defaultCategory = page?.defaultCategory
    const [searchParams, setSearchParams] = useSearchParams();
    const headerMenuRef = useRef<HTMLUListElement>(null);
    const ref = useRef<RefObject<HTMLLIElement>[]>([])
    page?.categories.forEach((_, index) => {
        ref.current[index] = createRef<HTMLLIElement>()
    })

    return (
        <div id="header-menu" className={(!page?.tabs && page?.tabs !== undefined) ? "header-menu-hidden" : ""}>
            <div className="header-menu-left">
                <ul
                    id="header-menu-left-items"
                    ref={headerMenuRef}
                    onWheel={
                        (e: WheelEvent) => {
                            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
                            if (headerMenuRef.current !== null) {
                                headerMenuRef.current.scrollLeft += e.deltaY;
                            }
                        }
                    }
                >
                    {
                        page?.categories.map((tab, i) => {
                            return (
                                <li
                                    className={"header-menu-item" + ((searchParams.get("category") ?? defaultCategory) === tab.id ? " selected" : "")}
                                    data-name={tab.id}
                                    ref={ref.current[i]}
                                    onClick={() => {
                                        searchParams.set("category", tab.id)
                                        setSearchParams(searchParams)

                                        if (headerMenuRef.current !== null && ref.current[i].current !== null) {
                                            const scrollWidth = headerMenuRef.current.scrollWidth
                                            const width = headerMenuRef.current.clientWidth
                                            const buttonSize = ref.current[i].current.clientWidth
                                            if (width < scrollWidth) {
                                                const scrollLeft = headerMenuRef.current.scrollLeft //スクロール量
                                                const absoluteLeft = ref.current[i].current.offsetLeft - headerMenuRef.current.offsetLeft //オブジェクトの通常位置
                                                const currentLeft = absoluteLeft - scrollLeft //オブジェクトの現在の位置

                                                const centerLeft = width / 2 - buttonSize / 2 //目標とする位置
                                                const target = centerLeft - currentLeft // 必要なスクロール量
                                                const canMove = scrollLeft - target >= 0 ? scrollLeft - target : 0 //現在のスクロール量からどれだけスクロールさせればいいか
                                                headerMenuRef.current.scrollLeft = canMove
                                            }
                                        }
                                    }}
                                >
                                    <span className="header-menu-item--title">
                                        {tab.title}
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}