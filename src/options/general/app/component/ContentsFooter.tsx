import { nt } from "../../../../utils/narou-tweaker";
import BrandIcon from "./BrandIcon";

export default function ContentsFooter(props: {}) {
    return (
        <div id="footer">
            <div id="footer-contents">
                <div className="footer-contents--image">
                    <a href="https://github.com/shumm7/Narou-Tweaker">
                        <BrandIcon/>
                    </a>
                </div>
                <div className="footer-contents--text">
                    {"Narou Tweaker v" + nt.extension.version}
                </div>
            </div>
        </div>
    )
}