import { _header, changeHeaderScrollMode } from "./_header";
import { _authorSkin } from "./_skin";
import { _novel } from "./_novel";
import { _optionModal } from "./_modal";
import { _novelcom } from "./_novelcom";

import jQuery from "jquery";
Object.assign(window, { $: jQuery, jQuery });

import "../../common.css"
import "./main.css"
import "./novelTop.css"
import "./novelVertical.css"

/* Header */
_header()
changeHeaderScrollMode($("#novel_header_right"));
changeHeaderScrollMode($("#novel_header"));

/* Option Menu */
_optionModal();


/* Novel Page */
_novel()

/* Novelcom */
_novelcom()

/* Author Skin */
_authorSkin()