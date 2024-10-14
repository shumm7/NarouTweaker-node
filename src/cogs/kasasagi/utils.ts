export function getNcode(){
    try{
        return (location.pathname.match('/access/.*/ncode/(.*)/') ?? "")[1];
    }catch(e){
        return ""
    }
}