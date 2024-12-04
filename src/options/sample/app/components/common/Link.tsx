import React from "react";
import { Link as MuiLink, useLocation } from "react-router-dom";

interface NTLinkProps extends React.ComponentPropsWithoutRef<typeof MuiLink> {
    page: string
    category: string
    id: string
    search?: string
    focus?: boolean|number|string
}

export default function Link(props: Partial<NTLinkProps>){
    const location = useLocation()
    const search = () => {
        var s = new URLSearchParams(location.search)
        const setParams = (key: string, value: string|undefined)=>{
            if(typeof value==="string"){
                if(value.length===0){
                    s.delete(key)
                }else{
                    s.set(key, value)
                }
            }
        }

        setParams("page", props.page)
        setParams("category", props.category)
        setParams("id", props.id)
        setParams("q", props.search)

        if(typeof props.focus==="string"){
            setParams("focus", props.focus)
        }else if(props.focus!==undefined){
            setParams("focus", props.focus ? "1" : "0")
        }else{
            setParams("focus", "")
        }

        return {pathname: location.pathname, search: s.toString()}
    }
    const to = search()

    return (
        <MuiLink to={to} {...props}/>
    )
}