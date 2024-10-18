import { ageauth } from "./_ageauth.js";
import { syuppan } from "./_syuppan.js";

import jQuery from "jquery";
Object.assign(window, { $: jQuery, jQuery });

import "../../common.css"
import "./local.css"

syuppan()
ageauth()