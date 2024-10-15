import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin'

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
  action: {
    default_popup: "options/popup/index.html"
  },
  permissions: [
    "storage",
    "downloads",
    "tabs",
    "cookies",
    "notifications"
  ]
});

export default defineConfig((opt) => {
  return {
    root: resolve(__dirname, "src"),
    plugins: [
      crx({ manifest: manifest })
    ],
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          background: resolve(__dirname, 'src/background/background.ts'),
          "options/favorite/main": resolve(__dirname, 'src/options/favorite/index.html'),
          "options/general/main": resolve(__dirname, 'src/options/general/index.html'),
          "options/kasasagi/main": resolve(__dirname, 'src/options/kasasagi/index.html'),
          "options/mitemin/main": resolve(__dirname, 'src/options/mitemin/index.html'),
          "options/mypage/main": resolve(__dirname, 'src/options/mypage/index.html'),
          "options/narou/main": resolve(__dirname, 'src/options/narou/index.html'),
          "options/novel/main": resolve(__dirname, 'src/options/novel/index.html'),
          "options/popup/main": resolve(__dirname, 'src/options/popup/index.html'),
          "options/search/main": resolve(__dirname, 'src/options/search/index.html'),
          "options/workspace/main": resolve(__dirname, 'src/options/workspace/index.html'),
          "options/youmou/main": resolve(__dirname, 'src/options/yomou/index.html'),
        },
        output: {
          entryFileNames: '[name].js',
          inlineDynamicImports: false
        }
      },
    },
  };
});