import browser from "webextension-polyfill"

import { __nt_array__ } from "./array";
import { __nt_math__ } from "./math";
import { __nt_storage__ } from "./storage";
import { __nt_text__ } from "./text";
import { __nt_time__ } from "./time";
import { __nt_api__ } from "./api";
import { __nt_download__, __nt_runtime__, __nt_cookie__ } from "./process";

export namespace nt {
    export class extension {
        /**
         * 拡張機能のmanifest.json
         * @returns Manifest
        */
        static get manifest(): browser.Manifest.WebExtensionManifest{
            return browser.runtime.getManifest()
        }
        /**
         * 拡張機能のバージョンを取得
         * @returns バージョン
        */
        static get version(): string{
            return browser.runtime.getManifest().version
        }
        /**
         * 拡張機能の作者名を取得
         * @returns 作者名
        */
        static get author(): string{
            return browser.i18n.getMessage("extAuthor")
        }
    }

    export import array = __nt_array__
    export import math = __nt_math__
    export import text = __nt_text__
    export import time = __nt_time__
    export import storage = __nt_storage__
    export import api = __nt_api__
    export import runtime = __nt_runtime__
    export import download = __nt_download__
    export import cookie = __nt_cookie__
    
}
