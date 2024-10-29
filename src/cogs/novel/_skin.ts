import { nt } from "../../utils/narou-tweaker";
import { makeSkinCSS, SkinV1 } from "../../utils/v1_skin";
import $ from 'jquery';

/* Skin */
export function removeDefaultSkinClass(){
    const classList = [
        "customlayout1",
        "customlayout2",
        "customlayout3",
        "customlayout4",
        "customlayout5",
        "customlayout6",
        "customlayout7",
    ]

    $.each(classList, function(_, c){
        $("."+c).each(function(){
            $(this).removeClass(c);
        });
    });

}

/* Author Skin */
export function _authorSkin(){
    changeAuthorSkin()
    nt.storage.local.changed(["novelAuthorCustomSkin", "novelAuthorCustomSkinWarning"], function(changes){
        changeAuthorSkin()
    })

    function changeAuthorSkin(){
        nt.storage.local.get("novelAuthorCustomSkin").then((data)=>{
            if(data.novelAuthorCustomSkin){
                var banner = $(".novelrankingtag a:has(img[alt='Narou Tweaker 作者スキン'])")
                if(banner.length){
                    var span = banner.find("span")
                    if(span.length){
                        try{
                            // Escape HTML Tags
                            var p = $("<p>")
                            const node = (span.get(0)?.firstChild as HTMLElement).nodeValue
                            if(node!==null){
                                p.text(node)
                                var text = p.text()
                                
                                // Parse to Tags
                                var skinData = new SkinV1(JSON.parse(text))
                                nt.storage.local.get(["novelCustomStyle", "novelAuthorCustomSkinWarning"]).then((data)=>{
                                    const style = makeSkinCSS(skinData, data.novelCustomStyle)
                                    $("#narou-tweaker-style--author-css").text(style)
                                    if(data.novelAuthorCustomSkinWarning){
                                        userSkinActive(true)
                                    }else{
                                        userSkinActive(false)
                                    }
                                })
                            }
                            

                        }catch(e){
                            console.warn(e)
                            $("#narou-tweaker-style--author-css").text("")
                            userSkinActive(false)
                        }
                    }
                }
            }else{
                $("#narou-tweaker-style--author-css").text("")
                userSkinActive(false)
            }
            
        })
    }

    function userSkinActive(active?: boolean){
        $("#author-skin-warning").remove()
        if(active){
            $("body").prepend(`
                <div id="author-skin-warning">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    作者スキン有効（小説の作者によってスキンが強制されています）<br>
                    <span style="font-size: 80%;">
                        Narou Tweakerの設定 → [小説ページ] → [スキン] → [作者スキン] から無効化できます。
                    </span>
                </div>
            `)
        }
    }
}