import { getLocalOptions, getSyncOptions, setSyncOptions } from "../utils/option"
import { fixOption } from "../options/_utils/optionUI_utils"
import { actionListener } from "./_action"
import { messageListener } from "./_process"
import { skinListener } from "./_skin"
import { yomouCssListener } from "./_yomou"

/* Installed */
chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason === "update"){ // updated
        console.log("Updated: fixing option...")
        fixOption(true, true)

        if(details.previousVersion !== chrome.runtime.getManifest().version){
            const id = `narou-tweaker--updated-version-${details.previousVersion}-to-${chrome.runtime.getManifest().version}`
            getLocalOptions("extNotifications", function(data){
                if(data.extNotifications){
                    chrome.notifications.create(id, {
                        iconUrl: "/assets/icons/icon_48.png",
                        type: "basic",
                        title: "Narou Tweakerがアップデートされました",
                        message: `${details.previousVersion} -> ${chrome.runtime.getManifest().version}`,
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
getSyncOptions(null, function(data){
    var count = data.extLaunchCount
    if(typeof count === "number"){
        count += 1
    }else{
        count = 1
    }

    setSyncOptions({
        extLaunchCount: count,
        extLastLaunchTime: new Date().toUTCString()
    })
})


/* Action */
actionListener()

/* CSS */
chrome.storage.session.setAccessLevel({accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"})
skinListener()
yomouCssListener()

/* Message */
messageListener()

/* Sidepanel */
//sidepanelListener()