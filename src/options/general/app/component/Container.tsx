import Sidebar from "./Sidebar"
import ContentsFooter from "./ContentsFooter"
import ContentsHeader from "./ContentsHeader"
import ContentsMain from "./ContentsMain"

import { getOptionPageFromID } from "../../../utils/optionUI_utils";
import { useSearchParams } from "react-router-dom";


export default function Container(props: {}){
    
    const [searchParams, setSearchParams] = useSearchParams();
    const page = getOptionPageFromID(searchParams.get("page") ?? "general")

    return (
        <div id="container">
			<Sidebar page={page}/>
            <div id="contents">
                <ContentsHeader page={page}/>
                <ContentsMain page={page}/>
                <ContentsFooter/>
            </div>
        </div>
    )
}