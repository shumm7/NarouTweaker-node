import { _rank, _rankTop } from "./_rank";

import jQuery from "jquery";
Object.assign(window, { $: jQuery, jQuery });

import "../../common.css"
import "./local.css"

_rank()
_rankTop()