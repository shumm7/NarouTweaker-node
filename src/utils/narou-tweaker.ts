import browser from "webextension-polyfill"

import { __nt_storage__ } from "./nt-lib/storage";
import { __nt_time__, __nt_text__, __nt_math__, __nt_array__, __nt_url__ } from "./nt-lib/utils";
import { __nt_api__ } from "./nt-lib/api";
import { __nt_skin__, __nt_font__ } from "./nt-lib/skin";
import { __nt_download__, __nt_runtime__, __nt_cookie__, __nt_extension__ } from "./nt-lib/process";
import { __nt_workspace__ } from "./nt-lib/workspace";
import { __nt_header__ } from "./nt-lib/header";

export namespace nt {
    export class extension extends __nt_extension__ {}

    export import array = __nt_array__
    export import math = __nt_math__
    export import text = __nt_text__
    export import time = __nt_time__
    export import storage = __nt_storage__
    export import api = __nt_api__
    export import runtime = __nt_runtime__
    export import download = __nt_download__
    export import cookie = __nt_cookie__
    export import skin = __nt_skin__
    export import font = __nt_font__
    export import workspace = __nt_workspace__
    export import header = __nt_header__
    export import url = __nt_url__
}
