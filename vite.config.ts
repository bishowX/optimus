import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import vueDevTools from "vite-plugin-vue-devtools"
import VueRouter from "unplugin-vue-router/vite"
import Layouts from "vite-plugin-vue-layouts"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        vue(),
        vueJsx(),
        vueDevTools(),
        Layouts({
            defaultLayout: "default",
            layoutsDirs: "src/layouts",
            pagesDirs: "src/pages"
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
})
