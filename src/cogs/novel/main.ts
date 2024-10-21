import { _header } from "./_header";
import { _authorSkin } from "./_skin";
import { _novel } from "./_novel";
import { _optionModal } from "./_modal";
import { _novelcom } from "./_novelcom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/fonts/icomoon/style.css";
import "../../common.css"
import "./novel.css"
import "./novelCom.css"
import "./novelHeader.css"
import "./novelMisc.css"
import "./novelModal.css"
import "./novelPage.css"
import "./novelTop.css"
import "./novelVertical.css"

/* Header */
_header()

/* Option Menu */
_optionModal();


/* Novel Page */
_novel()

/* Novelcom */
_novelcom()

/* Author Skin */
_authorSkin()