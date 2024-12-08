import React from "react";
import { Location, Link as MuiLink, useLocation } from "react-router-dom";

interface NTLinkProps extends React.ComponentPropsWithoutRef<typeof MuiLink> {
    page: string
    category: string
    id: string
    search?: string
    focus?: boolean|number|string
}

export const GetLocation = (
    location: Location,
    page: string,
    category: string,
    id: string,
    search?: string,
    focus?: boolean|number|string
) => {
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

    setParams("page", page)
    setParams("category", category)
    setParams("id", id)
    if(typeof search === "string"){
        setParams("q", search)
    }else{
        const current = s.get("q")
        if(typeof current === "string" && current.length > 0){
            setParams("q", current)
        }
    }

    if(typeof focus==="string"){
        setParams("focus", focus)
    }else if(focus!==undefined){
        setParams("focus", focus ? "1" : "0")
    }else{
        setParams("focus", "")
    }

    return {pathname: location.pathname, search: s.toString()}
}

export default function Link(props: Partial<NTLinkProps>){
    const location = useLocation()
    
    const to = GetLocation(
        location,
        props.page ?? "",
        props.category ?? "",
        props.id ?? "",
        props.search,
        props.focus
    )

    return (
        <MuiLink to={to} {...props}/>
    )
}