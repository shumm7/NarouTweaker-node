import { nt } from "../../utils/narou-tweaker"

import $ from 'jquery';

export function _novelcom() {
    _readImpression().catch(e => {
        console.warn(e)
    })
}

async function _readImpression() {
    if (location.pathname.match(/^\/impressionres\/confirm\/ncode\/\d+.*\/kanrino\/\d+\/*/)) {
        const m = location.pathname.match(/^\/impressionres\/confirm\/ncode\/(\d+).*\/kanrino\/(\d+)\/*/)
        if (m !== null) {
            const ncode = new nt.api.ncode(m[1]).ncode()
            const kanrino: string | undefined = m[2]

            if (ncode !== undefined && kanrino !== undefined) {
                const data = await nt.storage.local.get(null)
                if (data.workspaceImpressionMarkAsReadWhenReply && data.workspaceImpressionMarkedButton) {
                    if ($("form #rescomment").length) {

                        $(document).on('submit', 'form:has(#rescomment)', function () {
                            nt.workspace.impression.pushReadList(ncode, kanrino)
                            if (data.workspaceImpressionHideButton && data.workspaceImpressionHideWhenMarked) {
                                nt.workspace.impression.pushHiddenList(ncode, kanrino)
                            }
                        })
                    }
                }
            }
        }
    }
}