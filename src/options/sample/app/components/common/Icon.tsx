import { OptionUI_FontAwesomeIcon } from "../../lib/type"

interface FAIconProps extends React.ComponentPropsWithoutRef<"i"> {
    icon: OptionUI_FontAwesomeIcon | string
}

export function FontAwseomeIcon(props: FAIconProps) {
    if (typeof props.icon === "string") {
        let icon = props.icon
        let className = props.className

        var classNameP = icon + (className ? ` ${className}` : "")

        var p: Partial<FAIconProps> = props
        p.icon = undefined
        p.className = classNameP

        return (
            <i {...p} />
        )
    } else {
        let icon = props.icon.icon
        let prefix = props.icon.prefix ?? "regular"
        let variant = props.icon.variant
        let className = props.className

        if (icon && prefix) {
            if (!icon.startsWith("fa-")) {
                icon = "fa-" + icon
            }
            if (!prefix.startsWith("fa-")) {
                prefix = "fa-" + prefix
            }
            if (variant && !variant.startsWith("fa-")) {
                variant = "fa-" + variant
            }

            var classNameP = `${prefix} ${icon}`
                + (variant ? ` ${variant}` : "")
                + (className ? ` ${className}` : "")

            var p: Partial<FAIconProps> = props
            p.icon = undefined
            p.className = classNameP

            return (
                <i {...p} />
            )
        }
    }
    return null
}