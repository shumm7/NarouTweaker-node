import { resolve } from 'node:path';
import { defineConfig } from 'vite';
 
export default defineConfig((opt) => {
  return {
    root: 'src',
    build: {
      outDir: '../_dist',
      rollupOptions: {
        input: {
          content_scripts: resolve(__dirname, 'src/content_scripts.ts'),
          "loader/kasasagi": resolve(__dirname, 'src/loader/kasasagi.ts'),
          "cogs/kasasagi/main": resolve(__dirname, 'src/cogs/kasasagi/main.ts'),
          popup: resolve(__dirname, 'src/hello.html')
        },
        output: {
          entryFileNames: '[name].js',
        },
      },
    },
  };
});