interface FAIconProps extends React.ComponentPropsWithoutRef<"i"> {
    icon: string
    prefix?: string
    variant?: string
}

export default function FAIcon(props: FAIconProps){
    let icon = props.icon
    let prefix = props.prefix ?? "regular"
    let variant = props.variant
    let className = props.className

    if(!icon.startsWith("fa-")){
        icon = "fa-" + icon
    }
    if(!prefix.startsWith("fa-")){
        prefix = "fa-" + prefix
    }
    if(variant && !variant.startsWith("fa-")){
        variant = "fa-" + variant
    }

    var classNameP = `${prefix} ${icon}`
        + (variant ? ` ${variant}` : "")
        + (className ? ` ${className}` : "")

    var p: Partial<FAIconProps> = props
    p.icon = undefined
    p.prefix = undefined
    p.variant = undefined
    p.className = classNameP

    return (
        <i {...p}></i>
    )
}