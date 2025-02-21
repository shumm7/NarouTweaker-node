import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    console.log(mode)
    return {
        root: "src",
        plugins: [
            tsconfigPaths(),
            react(),
            crx({ manifest: manifest }),
        ],
        experimental: {
            renderBuiltUrl(filename, { hostType }) {
                if (hostType === "css") {
                    return `chrome-extension://__MSG_@@extension_id__/${filename}`;
                }
            },
        },
        build: {
            outDir: '../dist/src/',
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    "options/main": resolve(__dirname, 'src/options/index.html'),
                    "options/popup": resolve(__dirname, 'src/options/popup/index.html'),
                },
                output: {
                    entryFileNames: '[name].js',
                    inlineDynamicImports: false
                }
            },
        },
        server: {
            port: 5173,
            strictPort: true,
            hmr: {
                port: 5173,
            },
        },
    };
});

const manifest = defineManifest({
    manifest_version: 3,
    name: "__MSG_extName__",
    short_name: "__MSG_extShortName__",
    description: "__MSG_extDescription__",
    author: "__MSG_extAuthor__",
    default_locale: "ja",
    version: "0.5.0",
    icons: {
        "16": "assets/icons/icon_16.png",
        "32": "assets/icons/icon_32.png",
        "48": "assets/icons/icon_48.png",
        "128": "assets/icons/icon_128.png"
    },
    background: {
        service_worker: "background/background.ts",
        type: "module"
    },
    options_page: "options/index.html",
    options_ui: "options/index.html",
    action: {
        default_icon: {
            "16": "assets/icons/icon_16.png",
            "24": "assets/icons/icon_24.png",
            "32": "assets/icons/icon_32.png"
        },
        default_title: "設定画面を開く",
        default_popup: "options/popup/index.html",
    },
    permissions: [
        "storage",
        "downloads",
        "tabs",
        "cookies",
        "notifications",
        "unlimitedStorage"
    ],
    host_permissions: [
        "*://*.syosetu.com/*",
        "*://*.eparet.net/*",
        "*://*.mitemin.net/*"
    ],
    content_scripts: [
        /* css loader */
        { // novel
            js: [
                "cogs/css-novel/main.ts"
            ],
            matches: [
                "*://ncode.syosetu.com/*",
                "*://novel18.syosetu.com/*",
                "*://novelcom.syosetu.com/*",
                "*://novelcom18.syosetu.com/*"
            ],
            run_at: "document_start"
        },
        { // yomou
            js: [
                "cogs/css-yomou/main.ts"
            ],
            matches: [
                "*://yomou.syosetu.com/*"
            ],
            run_at: "document_start"
        }, // workspace
        {
            js: [
                "cogs/css-workspace/main.ts"
            ],
            matches: [
                "*://syosetu.com/*"
            ],
            run_at: "document_start"
        },


        /* novel */
        {
            js: [
                "cogs/novel/main.ts"
            ],
            matches: [
                "*://ncode.syosetu.com/*",
                "*://novel18.syosetu.com/*",
                "*://novelcom.syosetu.com/*",
                "*://novelcom18.syosetu.com/*"
            ],
            run_at: "document_end"
        },

        /* narou */
        {
            js: [
                "cogs/narou/main.ts"
            ],
            matches: [
                "*://*.syosetu.com/*",
                "*://*.eparet.net/*"
            ],
            run_at: "document_end"
        },

        /* mypage */
        {
            js: [
                "cogs/mypage/main.ts"
            ],
            matches: [
                "*://mypage.syosetu.com/*",
                "*://xmypage.syosetu.com/*"
            ],
            run_at: "document_end"
        },

        /* mitemin */
        {
            js: [
                "cogs/mitemin/main.ts"
            ],
            matches: [
                "*://*.mitemin.net/*",
                "*://*.eparet.net/*"
            ],
            run_at: "document_end"
        },

        /* yomou */
        {
            js: [
                "cogs/yomou/main.ts"
            ],
            matches: [
                "*://yomou.syosetu.com/*"
            ],
            run_at: "document_end"
        },

        /* kasasagi */
        {
            js: [
                "cogs/kasasagi/main.ts",
            ],
            matches: [
                "*://kasasagi.hinaproject.com/*"
            ],
            run_at: "document_end"
        },

        /* workspace */
        {
            js: [
                "cogs/workspace/main.ts"
            ],
            matches: [
                "*://syosetu.com/*"
            ],
            run_at: "document_end"
        },
    ],

});