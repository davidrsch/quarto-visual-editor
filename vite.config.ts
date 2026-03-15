import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    base: '/visual-editor/',
    build: {
        target: 'esnext',
        sourcemap: true,
    },
    plugins: [
        react(),
        wasm()
    ],
    resolve: {
        alias: {
            'editor-ui': path.resolve(__dirname, 'packages/editor-ui/src'),
            'editor': path.resolve(__dirname, 'packages/editor/src'),
            'editor-types': path.resolve(__dirname, 'packages/editor-types/src'),
            'editor-core': path.resolve(__dirname, 'packages/editor-core/src'),
            'editor-codemirror': path.resolve(__dirname, 'packages/editor-codemirror/src'),
            'core': path.resolve(__dirname, 'packages/core/src'),
            'core-browser': path.resolve(__dirname, 'packages/core-browser/src'),
            'ui-widgets': path.resolve(__dirname, 'packages/ui-widgets/src'),
            'mapped-string': path.resolve(__dirname, 'packages/mapped-string/src'),
            'annotated-json': path.resolve(__dirname, 'packages/annotated-json/src'),
            '@quarto/editor-ui': path.resolve(__dirname, 'packages/editor-ui/src'),
            '@quarto/editor': path.resolve(__dirname, 'packages/editor/src'),
            '@quarto/editor-types': path.resolve(__dirname, 'packages/editor-types/src'),
            '@quarto/editor-core': path.resolve(__dirname, 'packages/editor-core/src'),
            '@quarto/core': path.resolve(__dirname, 'packages/core/src'),
            '@quarto/core-browser': path.resolve(__dirname, 'packages/core-browser/src'),
            '@quarto/ui-widgets': path.resolve(__dirname, 'packages/ui-widgets/src'),
            '@quarto/mapped-string': path.resolve(__dirname, 'packages/mapped-string/src'),
            '@quarto/tidyverse-errors': path.resolve(__dirname, 'packages/tidyverse-errors/src'),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false
            }
        }
    },
    define: {
        'process.env': {}
    }
})
