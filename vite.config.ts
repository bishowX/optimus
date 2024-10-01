import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { visualizer } from "rollup-plugin-visualizer"
import VueRouter from "unplugin-vue-router/vite"
import { defineConfig } from "vite"
import vueDevTools from "vite-plugin-vue-devtools"
import Layouts from "vite-plugin-vue-layouts"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        vue(),
        vueJsx(),
        vueDevTools(),
        visualizer(),
        Layouts({
            defaultLayout: "default",
            layoutsDirs: "src/layouts",
            pagesDirs: "src/pages",
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,
            },
        },
    },
})
