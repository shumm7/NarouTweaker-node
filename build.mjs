import * as fs from "node:fs"
import {replaceInFile} from 'replace-in-file'

const root = "./dist"

/* replace files */
const data = JSON.parse(fs.readFileSync(`${root}/src/manifest.json`, 'utf8'));
if("content_scripts" in data){
    for(const content of data.content_scripts){
        if("css" in content){
            var css_list = content.css
            const files = []
            for(const css of css_list){
                files.push(`${root}/src/${css}`)
            }
            replaceInFile({files: files, from: /url\(\/assets\//g, to: "url(chrome-extension://__MSG_@@extension_id__/assets/"})
        }
    }
}

/* edit manifest.json */
if("web_accessible_resources" in data){
    for(const i in data.web_accessible_resources){
        if("use_dynamic_url" in data.web_accessible_resources[i]){
            if(data.web_accessible_resources[i].use_dynamic_url===true){
                delete data.web_accessible_resources[i].use_dynamic_url
            }
        }
    }
}
fs.writeFileSync(`${root}/src/manifest.json`, JSON.stringify(data, undefined, 4));