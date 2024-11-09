import { nt } from "../utils/narou-tweaker"
import { fixOption } from "../options/utils/optionUI_utils"
import { messageListener } from "./_process"
import { skinListener } from "./_skin"
import { yomouCssListener } from "./_yomou"

/* Installed */
chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason === "update"){ // updated
        console.log("Updated: fixing option...")
        fixOption(true, true)

        const version = nt.extension.version
        if(details.previousVersion !== version){
            const id = `narou-tweaker--updated-version-${details.previousVersion}-to-${version}`
            nt.storage.local.get("extNotifications").then((data) => {
                if(data.extNotifications){
                    chrome.notifications.create(id, {
                        iconUrl: "/assets/icons/icon_48.png",
                        type: "basic",
                        title: "Narou Tweakerがアップデートされました",
                        message: `${details.previousVersion} -> ${version}`,
                        buttons: [{
                            title: "パッチノート",
                        }]
                    })
                    chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex){
                        console.log(details)
                        if(notificationId === id && buttonIndex===0){
                            chrome.tabs.create({url: "/options/general/index.html?category=version"});
                        }
                    })
                }
            })
        }
    }else if(details.reason === "install"){ // installed
        console.log("Updated: fixing option...")
        fixOption(true, true)
    }
})

/* Count */
nt.storage.sync.get("extLaunchCount").then((data)=>{
    var count = data.extLaunchCount + 1

    nt.storage.sync.set({
        extLaunchCount: count,
        extLastLaunchTime: new Date().toUTCString()
    })
})

/* CSS */
nt.storage.session.setAccessLevel({accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"})
skinListener()
yomouCssListener()

/* Message */
messageListener()

/* Sidepanel */
//sidepanelListener()