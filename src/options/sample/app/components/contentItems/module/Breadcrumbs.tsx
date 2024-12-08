
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '../../common/Link';
import { OptionUI_Item, OptionUI_ItemProps } from '../../../lib/type'
import { getOptionPageFromID, getOptionCategoryFromID, getOptionParentTree } from '../../../lib/utils';

export default function ContentItem_Breadcrumbs(props: OptionUI_ItemProps) {
    const option = props.option
    const type = props.type
    const childDepth = props.child ?? 0
    
    if ((type === "favorite" && childDepth===0) || type === "search") {
        const page = getOptionPageFromID(option.location.page)
        const category = getOptionCategoryFromID(option.location.page, option.location.category)
        const tree = getOptionParentTree(option)

        if (page && category) {
            return (
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        fontSize: "10px",
                        "& .nt-item-breadcrumbs": {
                            color: "inherit",
                            fontSize: "inherit"
                        },
                        "& .nt-item-breadcrumbs--root": {
                            color: "text.primary"
                        }
                    }}
                >
                    <Link page={page.id} category='' id='' className="nt-item-breadcrumbs">{page.title}</Link>
                    <Link page={page.id} category={category.id} id='' className="nt-item-breadcrumbs">{category.title}</Link>
                    {
                        tree.map((opt, i) => {
                            if (i === tree.length - 1) {
                                //return <Link page={page.id} category={category.id} id={opt.id} className="nt-item-breadcrumbs nt-item-breadcrumbs--root">{opt.title}</Link>
                                return null
                            } else {
                                return <Link page={page.id} category={category.id} id={opt.id} focus className="nt-item-breadcrumbs">{opt.title}</Link>
                            }
                        })
                    }
                </Breadcrumbs>
            )
        }
    }

}