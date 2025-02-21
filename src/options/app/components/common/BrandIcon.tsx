export default function BrandIcon(props: React.ComponentPropsWithoutRef<"img">) {
    props.width = props.width ?? "30"
    props.height = props.height ?? props.width
    return <img src="/assets/icons/icon.png" {...props}/>
}