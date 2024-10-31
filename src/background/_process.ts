import { nt } from "../utils/narou-tweaker"
import browser from "webextension-polyfill"

/* Message */
export function messageListener(){
    browser.runtime.onMessage.addListener(function (_message, sender, sendResponse) {

        const message = new nt.runtime.SentMessage(_message)
        if (message.action == "fetch"){
            if(message.format == "json" || message.format==undefined){
                fetch(message.data.url, message.data.options)
                .then(response => response.json())
                .then(data => {
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        format: message.format,
                        success: true, 
                        result: data,
                    })
                })
                .catch((e) => {
                    console.warn(e)
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        format: message.format,
                        success: false,
                        result: e,
                    })
                })
                return true
            }else if(message.format == "text"){
                fetch(message.data.url, message.data.options)
                .then(response => response.text())
                .then(data => {
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        format: message.format,
                        success: true,
                        result: data,
                    })
                })
                .catch((e) => {
                    console.warn(e)
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        format: message.format,
                        success: false,
                        result: e,
                    })
                })
            }
            return true
        }else if(message.action == "downloads"){
            browser.downloads.download({
                url: message.data.url,
                filename: message.data.filename,
                body: message.data.body,
                saveAs: message.data.saveAs,
                headers: message.data.headers,
                method: message.data.method,
                conflictAction: message.data.conflictAction
            }).then(function(downloadId){
                sendResponse({
                    action: message.action,
                    id: message.id,
                    data: message.data,
                    format: message.format,
                    success: true,
                    result: downloadId,
                });
            }).catch((e) => {
                console.warn(e)
                sendResponse({
                    action: message.action,
                    id: message.id,
                    data: message.data,
                    format: message.format,
                    success: false,
                    result: e,
                });
            })
            return true
        }else if(message.action == "cookies"){
            if(message.format == "set"){
                browser.cookies.set(message.data).then(function(cookie){
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        format: message.format,
                        result: cookie,
                        success: true
                    });
                }).catch((e) => {
                    console.warn(e)
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        message: message.data,
                        success: false,
                        result: e,
                    });
                })
                return true
            }else if(message.format == "get"){
                browser.cookies.get(message.data).then(function(cookie){
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        format: message.format,
                        result: cookie,
                        success: true
                    });
                }).catch((e) => {
                    console.warn(e)
                    sendResponse({
                        action: message.action,
                        id: message.id,
                        data: message.data,
                        message: message.data,
                        success: false,
                        result: e,
                    });
                })
                return true
            }
        }else{
            sendResponse({action: message.action, result: "invalid parameters", format: message.format, success: false, id: message.id, data: message.data})
            return true
        }
    })
}